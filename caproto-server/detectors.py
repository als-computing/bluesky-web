"""Simulated fluorescent detectors: the Amptek SDD and the Mercury DXP.

Both are MCA records. The startup files talk to them very differently -- the
Amptek through an ``ophyd.Device`` (``SiliconDriftDetector``), the Mercury
through raw ``caget``/``caput`` -- but the acquisition model is the same:
write the start PV, poll the busy flag, then read the spectrum array.
"""

import time

from caproto.server import PVGroup, pvproperty

import beam

POLL_PERIOD = 0.02

# Real preset times at a beamline are seconds; keep sim acquisitions snappy so
# an energy scan of 100 points does not take two minutes.
MAX_SIM_ACQUIRE_S = 0.3


class _MCABase(PVGroup):
    """Shared acquisition state machine for an MCA record."""

    def __init__(self, *args, beamline, **kwargs):
        super().__init__(*args, **kwargs)
        # Provides the current mono angle, so the spectrum reflects the beam.
        self._beamline = beamline
        self._acquire_until = None

    async def _begin_acquisition(self, busy, preset_time):
        """Assert the busy flag and schedule the acquisition to finish.

        The busy flag has to be set *before* the start PV's put is
        acknowledged: ``SiliconDriftDetector.trigger()`` sleeps only 50 ms
        after writing EraseStart before it starts polling ``.ACQG``, and if it
        reads 0 there it returns the previous spectrum.
        """
        await busy.write(1)
        self._acquire_until = time.monotonic() + min(preset_time, MAX_SIM_ACQUIRE_S)

    def _acquisition_done(self):
        return self._acquire_until is not None and time.monotonic() >= self._acquire_until

    async def _publish_spectrum(self, live_time):
        """Generate a spectrum and publish it on both .VAL and the bare name.

        EPICS resolves a fieldless PV name to .VAL, so a real MCA record answers
        to `mcaTest:mca1` as well as `mcaTest:mca1.VAL`. caproto serves only what
        is in the pvdb, so both channels are explicit here.
        """
        data = beam.mca_spectrum(self._beamline.mono_angle_deg, live_time)
        await self.spectrum.write(data)
        await self.spectrum_bare.write(data)


class SimAmptekMCA(_MCABase):
    """Amptek silicon drift detector, PV prefix ``mcaTest:mca1``.

    Note ``EraseStart`` has no leading dot -- the full PV is
    ``mcaTest:mca1EraseStart`` -- which is why it is spelled out here.
    """

    prtm = pvproperty(value=1.0, name='.PRTM', precision=3,
                      doc='Preset real time (s)')
    acqg = pvproperty(value=0, name='.ACQG', read_only=True, doc='Acquiring')
    spectrum = pvproperty(value=[0] * beam.MCA_CHANNELS, name='.VAL',
                          max_length=beam.MCA_CHANNELS, read_only=True,
                          doc='MCA spectrum')
    spectrum_bare = pvproperty(value=[0] * beam.MCA_CHANNELS, name='',
                               max_length=beam.MCA_CHANNELS, read_only=True,
                               doc='MCA spectrum -- alias for .VAL')
    erase_start = pvproperty(value=0, name='EraseStart',
                             doc='Write 1 to erase and start acquiring')

    @erase_start.putter
    async def erase_start(self, instance, value):
        if value:
            await self._begin_acquisition(self.acqg, self.prtm.value)
        return 0

    @acqg.scan(period=POLL_PERIOD, use_scan_field=False)
    async def acqg(self, instance, async_lib):
        if self.acqg.value == 0 or not self._acquisition_done():
            return
        await self._publish_spectrum(self.prtm.value)
        self._acquire_until = None
        await self.acqg.write(0)


class SimMercuryDXP(_MCABase):
    """Mercury DXP, PV prefix ``dxpMercury:``.

    ``03_fluorescent_detectors.py`` drives this with pyepics directly rather
    than ophyd, using PresetMode / EraseAll / StartAll / Acquiring plus the
    ``mca1`` sub-record.
    """

    preset_mode = pvproperty(value=1, name='PresetMode',
                             doc='0=No preset, 1=Real time, 2=Live time')
    erase_all = pvproperty(value=0, name='EraseAll', doc='Erase all MCAs')
    start_all = pvproperty(value=0, name='StartAll', doc='Start all MCAs')
    acquiring = pvproperty(value=0, name='Acquiring', read_only=True)

    prtm = pvproperty(value=1.0, name='mca1.PRTM', precision=3,
                      doc='Preset real time (s)')
    spectrum = pvproperty(value=[0] * beam.MCA_CHANNELS, name='mca1.VAL',
                          max_length=beam.MCA_CHANNELS, read_only=True,
                          doc='MCA spectrum')
    spectrum_bare = pvproperty(value=[0] * beam.MCA_CHANNELS, name='mca1',
                               max_length=beam.MCA_CHANNELS, read_only=True,
                               doc='MCA spectrum -- alias for mca1.VAL')
    nuse = pvproperty(value=beam.MCA_CHANNELS, name='mca1.NUSE',
                      doc='Number of channels in use')

    @erase_all.putter
    async def erase_all(self, instance, value):
        if value:
            await self.spectrum.write([0] * beam.MCA_CHANNELS)
            await self.spectrum_bare.write([0] * beam.MCA_CHANNELS)
        return 0

    @start_all.putter
    async def start_all(self, instance, value):
        if value:
            await self._begin_acquisition(self.acquiring, self.prtm.value)
        return 0

    @acquiring.scan(period=POLL_PERIOD, use_scan_field=False)
    async def acquiring(self, instance, async_lib):
        if self.acquiring.value == 0 or not self._acquisition_done():
            return
        await self._publish_spectrum(self.prtm.value)
        self._acquire_until = None
        await self.acquiring.write(0)
