"""Simulated EPICS motor record.

``ophyd.EpicsMotor`` connects to ~19 fields of a single record. This serves all
of them, with a simple constant-velocity motion model driving ``.RBV`` toward
``.VAL``.

The PV name *is* the group prefix, so ``SimMotorRecord('bl531_xps1:es_height_mm')``
serves ``bl531_xps1:es_height_mm.RBV``, ``...VAL``, ``...DMOV`` and so on.
"""

from caproto import ChannelType
from caproto.server import PVGroup, pvproperty

# How often the motion loop steps .RBV, in seconds.
UPDATE_PERIOD = 0.05


class SimMotorRecord(PVGroup):
    """A single simulated motor record.

    Parameters
    ----------
    start : float
        Initial position, in user units.
    limits : (float, float)
        ``(.LLM, .HLM)`` travel limits. Also published as the control limits on
        ``.VAL``, which ``EpicsMotor.user_setpoint`` reads (it is declared with
        ``limits=True``).
    velocity : float
        ``.VELO``, in user units per second.
    egu : str
        ``.EGU``, engineering units.
    """

    # --- position -----------------------------------------------------------
    val = pvproperty(value=0.0, name='.VAL', precision=4,
                     doc='Desired position (user units)')
    rbv = pvproperty(value=0.0, name='.RBV', precision=4, read_only=True,
                     doc='Readback position (user units)')

    # --- offset / direction / calibration ------------------------------------
    off = pvproperty(value=0.0, name='.OFF', precision=4, doc='User offset')
    dir_ = pvproperty(value=0, name='.DIR', doc='User direction (0=Pos, 1=Neg)')
    foff = pvproperty(value=0, name='.FOFF', doc='Offset freeze switch')
    set_ = pvproperty(value=0, name='.SET', doc='Set/Use switch')

    # --- motion parameters ---------------------------------------------------
    velo = pvproperty(value=1.0, name='.VELO', precision=4, doc='Velocity (EGU/s)')
    accl = pvproperty(value=0.2, name='.ACCL', precision=4,
                      doc='Seconds to velocity')
    # DBR_STRING, not the char waveform caproto defaults to for str values --
    # pyepics returns a numpy char array for the latter, and ophyd's
    # motor_egu then compares unequal to any plain string.
    egu = pvproperty(value='mm', name='.EGU', dtype=ChannelType.STRING,
                     doc='Engineering units')

    # --- status --------------------------------------------------------------
    movn = pvproperty(value=0, name='.MOVN', read_only=True, doc='Motor is moving')
    dmov = pvproperty(value=1, name='.DMOV', read_only=True, doc='Done moving')
    tdir = pvproperty(value=0, name='.TDIR', read_only=True,
                      doc='Direction of travel (0=Neg, 1=Pos)')

    # --- limits --------------------------------------------------------------
    hlm = pvproperty(value=100.0, name='.HLM', precision=4, doc='High limit')
    llm = pvproperty(value=-100.0, name='.LLM', precision=4, doc='Low limit')
    hls = pvproperty(value=0, name='.HLS', read_only=True, doc='At high limit switch')
    lls = pvproperty(value=0, name='.LLS', read_only=True, doc='At low limit switch')

    # --- commands ------------------------------------------------------------
    stop_ = pvproperty(value=0, name='.STOP', doc='Stop motion')
    homf = pvproperty(value=0, name='.HOMF', doc='Home forward')
    homr = pvproperty(value=0, name='.HOMR', doc='Home reverse')

    def __init__(self, *args, start=0.0, limits=(-100.0, 100.0), velocity=5.0,
                 egu='mm', **kwargs):
        super().__init__(*args, **kwargs)
        self._start = start
        self._low, self._high = limits
        self._velocity = velocity
        self._egu = egu
        # Where the motion loop is driving .RBV. Kept separate from .VAL so a
        # .STOP leaves .VAL alone, the way a real motor record does.
        self._target = start

    @val.startup
    async def val(self, instance, async_lib):
        """Apply the per-instance configuration once the server is up."""
        self.async_lib = async_lib
        # EpicsMotor.user_setpoint is declared with limits=True, so it reads the
        # control limits off the .VAL channel.
        await self.val.write_metadata(
            upper_ctrl_limit=self._high, lower_ctrl_limit=self._low,
        )
        await self.val.write(self._start)
        await self.rbv.write(self._start)
        await self.hlm.write(self._high)
        await self.llm.write(self._low)
        await self.velo.write(self._velocity)
        await self.egu.write(self._egu)

    @val.putter
    async def val(self, instance, value):
        """Begin a move to ``value``, clamped to the travel limits."""
        target = max(self._low, min(self._high, float(value)))
        self._target = target
        # Always toggle .DMOV, even for a zero-length move. A real motor record
        # does, and ophyd's MoveStatus needs to see not-done before done -- a
        # scan that revisits a position would otherwise hang forever.
        await self.tdir.write(1 if target > self.rbv.value else 0)
        await self.movn.write(1)
        await self.dmov.write(0)
        return target

    @stop_.putter
    async def stop_(self, instance, value):
        """Halt where we are. The motor record self-clears .STOP back to 0."""
        if value:
            self._target = self.rbv.value
            await self._finish_move()
        return 0

    @homf.putter
    async def homf(self, instance, value):
        if value:
            await self.val.write(0.0)
        return 0

    @homr.putter
    async def homr(self, instance, value):
        if value:
            await self.val.write(0.0)
        return 0

    @rbv.scan(period=UPDATE_PERIOD, use_scan_field=False)
    async def rbv(self, instance, async_lib):
        """Step the readback toward the target at .VELO."""
        if self.dmov.value == 1:
            return

        position = self.rbv.value
        remaining = self._target - position
        step = max(self.velo.value, 1e-6) * UPDATE_PERIOD

        if abs(remaining) <= step:
            await self.rbv.write(self._target)
            await self._finish_move()
            return

        await self.rbv.write(position + (step if remaining > 0 else -step))

    async def _finish_move(self):
        """Drop out of motion and refresh the limit switches."""
        await self.movn.write(0)
        await self.hls.write(1 if self.rbv.value >= self._high else 0)
        await self.lls.write(1 if self.rbv.value <= self._low else 0)
        # .DMOV last: it is what ophyd's move status waits on, so everything
        # else must already be settled when it flips.
        await self.dmov.write(1)
