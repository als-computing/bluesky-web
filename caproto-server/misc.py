"""Standalone PVs that are not part of a larger record: the beamstop diode and
the shutter's LabJack analog output."""

from caproto.server import PVGroup, pvproperty

import beam

# How often the diode re-reads the beamline state.
UPDATE_PERIOD = 0.2


class SimDiode(PVGroup):
    """Beamstop photodiode current, PV ``bl201-beamstop:current``.

    The startup file connects to this with a plain ``EpicsSignal``, so it is a
    single scalar with no fields. Instantiate with ``prefix='bl201-beamstop:'``.
    """

    current = pvproperty(value=0.0, name='current', precision=6,
                         doc='Diode current (A)')

    def __init__(self, *args, beamline, **kwargs):
        super().__init__(*args, **kwargs)
        self._beamline = beamline

    @current.scan(period=UPDATE_PERIOD, use_scan_field=False)
    async def current(self, instance, async_lib):
        """Track the mono angle and the beamstop position."""
        await self.current.write(
            beam.diode_current(
                self._beamline.mono_angle_deg,
                self._beamline.beamstop_x_mm,
                self._beamline.beamstop_y_mm,
            )
        )


class SimShutter(PVGroup):
    """LabJack analog out driving the shutter, PV ``bl531:LJT4:1:AO0``.

    ``Shutter._control`` writes 0 to open and 5 to close; there is no hardware
    readback, so this is just a writable scalar that remembers its value.
    """

    ao0 = pvproperty(value=5.0, name='AO0', precision=3,
                     doc='Shutter control voltage (0=open, 5=closed)')
