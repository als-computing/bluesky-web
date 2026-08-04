"""Simulated Symetrie hexapod (``SYM:HEX01:``).

The startup files drive this through ``ophyd.PVPositioner`` subclasses rather
than a motor record: each axis has its own setpoint and readback, but all six
share one "GO" button (``MOVE_PTP``) and one done flag
(``s_hexa:InPosition_RBV``).
"""

from caproto.server import PVGroup, pvproperty

UPDATE_PERIOD = 0.05

# Attribute stems, pairing sp_<stem> with rb_<stem>.
AXES = ['tx', 'ty', 'tz', 'rx', 'ry', 'rz']


class SimHexapod(PVGroup):
    """Six-axis hexapod with a shared actuate PV and a shared in-position flag."""

    # Setpoints, written by PVPositioner before it presses GO.
    sp_tx = pvproperty(value=0.0, name='MOVE_PTP:Tx', precision=4)
    sp_ty = pvproperty(value=0.0, name='MOVE_PTP:Ty', precision=4)
    sp_tz = pvproperty(value=0.0, name='MOVE_PTP:Tz', precision=4)
    sp_rx = pvproperty(value=0.0, name='MOVE_PTP:Rx', precision=4)
    sp_ry = pvproperty(value=0.0, name='MOVE_PTP:Ry', precision=4)
    sp_rz = pvproperty(value=0.0, name='MOVE_PTP:Rz', precision=4)

    # Readbacks.
    rb_tx = pvproperty(value=0.0, name='s_uto_tx_RBV', precision=4, read_only=True)
    rb_ty = pvproperty(value=0.0, name='s_uto_ty_RBV', precision=4, read_only=True)
    rb_tz = pvproperty(value=0.0, name='s_uto_tz_RBV', precision=4, read_only=True)
    rb_rx = pvproperty(value=0.0, name='s_uto_rx_RBV', precision=4, read_only=True)
    rb_ry = pvproperty(value=0.0, name='s_uto_ry_RBV', precision=4, read_only=True)
    rb_rz = pvproperty(value=0.0, name='s_uto_rz_RBV', precision=4, read_only=True)

    # The "GO" button. PVPositioner writes actuate_value = 1 here.
    actuate = pvproperty(value=0, name='MOVE_PTP', doc='Execute point-to-point move')

    # Shared done flag. Starts at 1 (in position); a move must drive it 0 then
    # back to 1, because that transition is what PVPositioner waits on.
    in_position = pvproperty(value=1, name='s_hexa:InPosition_RBV', read_only=True,
                             doc='1 when all axes have reached their setpoints')

    def __init__(self, *args, speed=2.0, **kwargs):
        super().__init__(*args, **kwargs)
        # Units per second, shared across axes. Translations are mm, rotations
        # are degrees; one speed for both is plenty for a simulator.
        self._speed = speed

    def _pairs(self):
        for stem in AXES:
            yield getattr(self, f'sp_{stem}'), getattr(self, f'rb_{stem}')

    @actuate.putter
    async def actuate(self, instance, value):
        """Start moving every axis toward its setpoint.

        The written value latches rather than self-clearing to 0. caproto runs
        this putter on every write regardless of whether the value changed, so
        motion still triggers on a repeat press -- and latching keeps clients
        that verify the readback after writing happy. `ophyd.EpicsSignal.set()`
        is one: it waits for readback == setpoint, so a self-clearing actuate
        reports failure on every move even though the move ran. PVPositioner
        uses `.put()` and does not care either way.
        """
        if not value:
            return value
        # Drop the done flag unconditionally -- even for a zero-length move, and
        # before this put is acknowledged. PVPositioner has to observe not-done
        # before done, or the move status either fires instantly or never.
        await self.in_position.write(0)
        return value

    @in_position.scan(period=UPDATE_PERIOD, use_scan_field=False)
    async def in_position(self, instance, async_lib):
        """Step every readback toward its setpoint; flag done when all arrive."""
        if self.in_position.value == 1:
            return

        step = self._speed * UPDATE_PERIOD
        arrived = True
        for setpoint, readback in self._pairs():
            remaining = setpoint.value - readback.value
            if abs(remaining) <= step:
                if remaining:
                    await readback.write(setpoint.value)
            else:
                arrived = False
                await readback.write(
                    readback.value + (step if remaining > 0 else -step)
                )

        if arrived:
            await self.in_position.write(1)
