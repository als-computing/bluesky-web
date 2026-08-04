#!/usr/bin/env python3
"""Simulated EPICS IOC for ALS beamline 5.3.1.

Serves the exact PV names that ``queue-server/startup_bl531`` connects to, so
the whole bluesky stack can run without the real beamline. Area detectors are
deliberately not simulated -- see README.md.

Run standalone::

    python bl531_ioc.py

or in Docker via ``docker-compose.sim.yml``.
"""

import argparse
import logging

from caproto.server import run

import beam
from detectors import SimAmptekMCA, SimMercuryDXP
from hexapod import SimHexapod
from misc import SimDiode, SimShutter
from motor_record import SimMotorRecord

log = logging.getLogger('bl531_ioc')

# Motor records, keyed by the PV name the startup files use.
#
# The mono angle limits have to span the energy range MonoEnergy allows
# (2400-12000 eV, Si(111)), which works out to roughly 15.9-61.9 degrees, or
# every energy_scan will fail a limits check before it moves.
MOTORS = {
    'bl531_xps1:mono_angle_deg': dict(
        start=19.157569,  # Cu K edge, matching DEFAULT_MONO_OFFSET_DEG
        limits=(15.0, 63.0), velocity=8.0, egu='deg',
    ),
    'bl531_xps1:es_height_mm': dict(
        start=0.0, limits=(-50.0, 50.0), velocity=5.0, egu='mm',
    ),
    'bl531_xps2:beamstop_x_mm': dict(
        start=0.0, limits=(-50.0, 50.0), velocity=5.0, egu='mm',
    ),
    'bl531_xps2:beamstop_y_mm': dict(
        start=0.0, limits=(-50.0, 50.0), velocity=5.0, egu='mm',
    ),
}


class Beamline:
    """Read-only view of the machine state, shared by the passive devices.

    The diode and the MCAs need to know where the mono and beamstop are so
    their readings respond to motion. Rather than have them reach into each
    other's PVGroups, they get this.
    """

    def __init__(self, motors):
        self._motors = motors

    def _rbv(self, pv):
        return self._motors[pv].rbv.value

    @property
    def mono_angle_deg(self):
        return self._rbv('bl531_xps1:mono_angle_deg')

    @property
    def beamstop_x_mm(self):
        return self._rbv('bl531_xps2:beamstop_x_mm')

    @property
    def beamstop_y_mm(self):
        return self._rbv('bl531_xps2:beamstop_y_mm')


def build_pvdb():
    """Instantiate every device group and merge them into one pvdb."""
    motors = {
        pv: SimMotorRecord(prefix=pv, **config) for pv, config in MOTORS.items()
    }
    beamline = Beamline(motors)

    groups = list(motors.values()) + [
        SimHexapod(prefix='SYM:HEX01:'),
        SimDiode(prefix='bl201-beamstop:', beamline=beamline),
        SimShutter(prefix='bl531:LJT4:1:'),
        SimAmptekMCA(prefix='mcaTest:mca1', beamline=beamline),
        SimMercuryDXP(prefix='dxpMercury:', beamline=beamline),
    ]

    pvdb = {}
    for group in groups:
        overlap = set(pvdb) & set(group.pvdb)
        if overlap:
            raise RuntimeError(f'duplicate PV names across groups: {sorted(overlap)}')
        pvdb.update(group.pvdb)
    return pvdb


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--interfaces', nargs='+', default=['0.0.0.0'],
                        help='Interfaces to bind (default: 0.0.0.0)')
    parser.add_argument('--list-pvs', action='store_true',
                        help='Print the served PV names and exit')
    parser.add_argument('-v', '--verbose', action='store_true')
    args = parser.parse_args()

    logging.basicConfig(
        level=logging.DEBUG if args.verbose else logging.INFO,
        format='%(asctime)s %(levelname)s %(name)s: %(message)s',
    )

    pvdb = build_pvdb()

    if args.list_pvs:
        for name in sorted(pvdb):
            print(name)
        return

    log.info('BL 5.3.1 simulator serving %d PVs:', len(pvdb))
    for name in sorted(pvdb):
        log.info('  %s', name)
    log.info('MCA calibration: %d channels at %.2f eV/channel',
             beam.MCA_CHANNELS, beam.MCA_EV_PER_CHANNEL)

    run(pvdb, interfaces=args.interfaces, log_pv_names=False)


if __name__ == '__main__':
    main()
