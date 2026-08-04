"""Simulated area detector, in the shape ADSimDetector presents over Channel Access.

Serves what ophyd-websocket's ``camera-socket`` router connects to -- the eight
``cam1:`` geometry settings plus ``image1:ArrayData`` -- along with enough
acquisition control (Acquire, AcquireTime, ImageMode, ...) to start, stop and
pace it. It is deliberately *not* the full CamBase/NDPluginBase surface, so
ophyd's ``AreaDetector`` class cannot connect to it; see README.md.

Frames come from ``beam.scattering_frame``, so the image responds to the mono
energy and the beamstop motors like the rest of the simulated beamline.
"""

import time

import numpy as np
from caproto import ChannelType
from caproto.server import PVGroup, pvproperty

import beam

# ---------------------------------------------------------------------------
# Change this one line to rename the detector. Nothing else hardcodes it.
SIM_DETECTOR_PREFIX = '13SIM1:'
# ---------------------------------------------------------------------------

# How often the acquisition loop wakes. caproto fixes a scan period at class
# definition time, so the loop ticks fast and emits a frame only once
# AcquirePeriod has elapsed.
FRAME_TICK = 0.05

DEFAULT_SIZE = 512

# caproto also fixes an array's max_length at class definition time, so the
# channel is sized for the largest frame we allow: 1024x1024 in RGB.
MAX_DIM = 1024
MAX_ARRAY_ELEMENTS = MAX_DIM * MAX_DIM * 3

COLOR_MODES = ('Mono', 'RGB1', 'RGB2', 'RGB3')
DATA_TYPES = ('Int8', 'UInt8', 'Int16', 'UInt16', 'Int32', 'UInt32',
              'Int64', 'UInt64', 'Float32', 'Float64')
IMAGE_MODES = ('Single', 'Multiple', 'Continuous')


def enum_index(channel):
    """Index of an enum channel's current value.

    caproto stores whatever was written -- an int from ``caput 1`` or a string
    from ``caput Mono`` -- so both have to be handled.
    """
    value = channel.value
    if isinstance(value, bytes):
        value = value.decode()
    if isinstance(value, str):
        return list(channel.enum_strings).index(value)
    return int(value)


class SimAreaDetector(PVGroup):
    """One group serving both the ``cam1:`` and ``image1:`` PVs.

    Instantiated with the detector prefix (``13SIM1:``); the pvproperty names
    carry the rest, exactly as the hexapod group does.
    """

    # --- geometry: what camera_socket.py reads -------------------------------
    min_x = pvproperty(value=0, name='cam1:MinX', doc='ROI start column')
    min_y = pvproperty(value=0, name='cam1:MinY', doc='ROI start row')
    size_x = pvproperty(value=DEFAULT_SIZE, name='cam1:SizeX', doc='ROI width')
    size_y = pvproperty(value=DEFAULT_SIZE, name='cam1:SizeY', doc='ROI height')
    color_mode = pvproperty(value='Mono', name='cam1:ColorMode',
                            dtype=ChannelType.ENUM, enum_strings=COLOR_MODES)
    data_type = pvproperty(value='UInt8', name='cam1:DataType',
                           dtype=ChannelType.ENUM, enum_strings=DATA_TYPES)
    # Read by camera_socket.py but never applied -- its dimension maths divides
    # by a hardcoded 1. Binning here would desync the array length from the
    # dimensions it computes, so these stay inert.
    bin_x = pvproperty(value=1, name='cam1:BinX', doc='Binning (not applied)')
    bin_y = pvproperty(value=1, name='cam1:BinY', doc='Binning (not applied)')

    # --- acquisition control --------------------------------------------------
    acquire = pvproperty(value='Acquire', name='cam1:Acquire',
                         dtype=ChannelType.ENUM, enum_strings=('Done', 'Acquire'),
                         doc='Free-runs on startup so a viewer sees frames at once')
    acquire_time = pvproperty(value=0.1, name='cam1:AcquireTime', precision=4,
                              doc='Exposure (s) -- scales counts and noise')
    acquire_period = pvproperty(value=0.2, name='cam1:AcquirePeriod', precision=4,
                                doc='Seconds between frames')
    image_mode = pvproperty(value='Continuous', name='cam1:ImageMode',
                            dtype=ChannelType.ENUM, enum_strings=IMAGE_MODES)
    num_images = pvproperty(value=1, name='cam1:NumImages',
                            doc='Frames to take in Multiple mode')
    array_counter = pvproperty(value=0, name='cam1:ArrayCounter',
                               doc='Total frames produced')

    # --- readbacks ------------------------------------------------------------
    min_x_rbv = pvproperty(value=0, name='cam1:MinX_RBV', read_only=True)
    min_y_rbv = pvproperty(value=0, name='cam1:MinY_RBV', read_only=True)
    size_x_rbv = pvproperty(value=DEFAULT_SIZE, name='cam1:SizeX_RBV', read_only=True)
    size_y_rbv = pvproperty(value=DEFAULT_SIZE, name='cam1:SizeY_RBV', read_only=True)
    color_mode_rbv = pvproperty(value='Mono', name='cam1:ColorMode_RBV',
                                dtype=ChannelType.ENUM, enum_strings=COLOR_MODES,
                                read_only=True)
    data_type_rbv = pvproperty(value='UInt8', name='cam1:DataType_RBV',
                               dtype=ChannelType.ENUM, enum_strings=DATA_TYPES,
                               read_only=True)
    bin_x_rbv = pvproperty(value=1, name='cam1:BinX_RBV', read_only=True)
    bin_y_rbv = pvproperty(value=1, name='cam1:BinY_RBV', read_only=True)
    acquire_time_rbv = pvproperty(value=0.1, name='cam1:AcquireTime_RBV',
                                  precision=4, read_only=True)
    acquire_period_rbv = pvproperty(value=0.2, name='cam1:AcquirePeriod_RBV',
                                    precision=4, read_only=True)
    image_mode_rbv = pvproperty(value='Continuous', name='cam1:ImageMode_RBV',
                                dtype=ChannelType.ENUM, enum_strings=IMAGE_MODES,
                                read_only=True)
    num_images_rbv = pvproperty(value=1, name='cam1:NumImages_RBV', read_only=True)
    array_counter_rbv = pvproperty(value=0, name='cam1:ArrayCounter_RBV',
                                   read_only=True)
    num_images_counter_rbv = pvproperty(value=0, name='cam1:NumImagesCounter_RBV',
                                        read_only=True)
    array_size_x_rbv = pvproperty(value=DEFAULT_SIZE, name='cam1:ArraySizeX_RBV',
                                  read_only=True)
    array_size_y_rbv = pvproperty(value=DEFAULT_SIZE, name='cam1:ArraySizeY_RBV',
                                  read_only=True)
    array_size_rbv = pvproperty(value=DEFAULT_SIZE ** 2, name='cam1:ArraySize_RBV',
                                read_only=True)
    detector_state_rbv = pvproperty(
        value='Idle', name='cam1:DetectorState_RBV', dtype=ChannelType.ENUM,
        enum_strings=('Idle', 'Acquire', 'Readout', 'Error'), read_only=True)

    # --- image plugin ---------------------------------------------------------
    # The channel camera_socket.py subscribes to. Frames reach the browser only
    # because this is written -- a static array shows one frame and then stops.
    array_data = pvproperty(value=np.zeros(MAX_ARRAY_ELEMENTS, dtype=np.uint8),
                            name='image1:ArrayData', max_length=MAX_ARRAY_ELEMENTS,
                            dtype=ChannelType.CHAR, read_only=True,
                            doc='Flattened image data')
    nd_array_counter_rbv = pvproperty(value=0, name='image1:ArrayCounter_RBV',
                                      read_only=True)
    nd_dimensions_rbv = pvproperty(value=2, name='image1:NDimensions_RBV',
                                   read_only=True)
    array_size0_rbv = pvproperty(value=DEFAULT_SIZE, name='image1:ArraySize0_RBV',
                                 read_only=True)
    array_size1_rbv = pvproperty(value=DEFAULT_SIZE, name='image1:ArraySize1_RBV',
                                 read_only=True)
    array_size2_rbv = pvproperty(value=0, name='image1:ArraySize2_RBV',
                                 read_only=True)
    enable_callbacks = pvproperty(value='Enable', name='image1:EnableCallbacks',
                                  dtype=ChannelType.ENUM,
                                  enum_strings=('Disable', 'Enable'))

    def __init__(self, *args, beamline, **kwargs):
        super().__init__(*args, **kwargs)
        # Supplies the mono angle and beamstop position the pattern reacts to.
        self._beamline = beamline
        self._last_frame = 0.0

    @acquire.putter
    async def acquire(self, instance, value):
        """Starting an acquisition resets the frame counter and emits promptly."""
        starting = value in (1, 'Acquire')
        if starting:
            await self.num_images_counter_rbv.write(0)
            self._last_frame = 0.0     # do not wait out AcquirePeriod first
        await self.detector_state_rbv.write('Acquire' if starting else 'Idle')
        return value

    # ------------------------------------------------------------------ geometry
    def _frame_shape(self):
        """Width and height of the next frame.

        camera_socket.py computes its dimensions as ``size - start``, not
        ``size``. Real AreaDetector treats MinX as an ROI origin and still emits
        SizeX columns, so honouring real-AD semantics would desync the array from
        the width the socket expects and its reshape would throw. Matching the
        consumer keeps the image renderable at any MinX/MinY.
        """
        width = int(self.size_x.value) - int(self.min_x.value)
        height = int(self.size_y.value) - int(self.min_y.value)
        width = max(1, min(width, MAX_DIM))
        height = max(1, min(height, MAX_DIM))
        return width, height

    def _pack(self, mono, color_mode):
        """Lay a mono uint8 frame out the way camera_socket.reshape_array expects.

        Mirrors that function exactly -- a mismatch here corrupts the picture
        silently rather than raising.
        """
        if color_mode == 'Mono':
            return mono.ravel()

        # Warm false colour, so the RGB modes are visibly not greyscale.
        height, width = mono.shape
        red = mono
        green = (mono * 0.7).astype(np.uint8)
        blue = (mono * 0.4).astype(np.uint8)

        if color_mode == 'RGB1':                      # interleaved (h, w, 3)
            return np.stack((red, green, blue), axis=-1).ravel()
        if color_mode == 'RGB2':                      # (h, w*3), planar per row
            return np.concatenate((red, green, blue), axis=1).ravel()
        if color_mode == 'RGB3':                      # three full planes
            return np.concatenate((red.ravel(), green.ravel(), blue.ravel()))
        raise ValueError(f'unsupported color mode: {color_mode}')

    # ------------------------------------------------------- acquisition loop
    @array_data.scan(period=FRAME_TICK, use_scan_field=False)
    async def array_data(self, instance, async_lib):
        await self._sync_readbacks()

        if enum_index(self.acquire) == 0:
            return

        now = time.monotonic()
        if now - self._last_frame < max(self.acquire_period.value, 0.01):
            return
        self._last_frame = now

        await self._emit_frame()

        # Stop once the requested number of frames is in.
        mode = IMAGE_MODES[enum_index(self.image_mode)]
        taken = self.num_images_counter_rbv.value
        if mode == 'Single' and taken >= 1:
            await self.acquire.write('Done')
        elif mode == 'Multiple' and taken >= max(int(self.num_images.value), 1):
            await self.acquire.write('Done')

    async def _emit_frame(self):
        width, height = self._frame_shape()
        color_mode = COLOR_MODES[enum_index(self.color_mode)]

        counts = beam.scattering_frame(
            width, height,
            self._beamline.mono_angle_deg,
            self._beamline.beamstop_x_mm,
            self._beamline.beamstop_y_mm,
            self.acquire_time.value,
        )
        # The channel is 8-bit, so bright pixels saturate the way a real
        # detector's would. camera_socket.py log-normalises before display, so
        # dim frames still come out legible.
        mono = np.clip(counts, 0, 255).astype(np.uint8)

        payload = self._pack(mono, color_mode)
        if payload.size > MAX_ARRAY_ELEMENTS:
            payload = payload[:MAX_ARRAY_ELEMENTS]

        await self.array_data.write(payload)

        count = self.array_counter.value + 1
        await self.array_counter.write(count)
        await self.array_counter_rbv.write(count)
        await self.nd_array_counter_rbv.write(count)
        await self.num_images_counter_rbv.write(self.num_images_counter_rbv.value + 1)

        await self._write_if_changed(self.array_size_x_rbv, width)
        await self._write_if_changed(self.array_size_y_rbv, height)
        await self._write_if_changed(self.array_size_rbv, int(payload.size))

        # NDArray dimension order: mono is (width, height); RGB1 puts the three
        # colour values fastest, so colour leads.
        if color_mode == 'Mono':
            dims = (width, height, 0)
        elif color_mode == 'RGB1':
            dims = (3, width, height)
        else:
            dims = (width, 3, height)
        await self._write_if_changed(self.nd_dimensions_rbv,
                                     2 if color_mode == 'Mono' else 3)
        for channel, value in zip(
            (self.array_size0_rbv, self.array_size1_rbv, self.array_size2_rbv), dims
        ):
            await self._write_if_changed(channel, value)

    async def _sync_readbacks(self):
        """Mirror each setting onto its _RBV, AreaDetector style.

        Done from the loop rather than from a putter on every setting: at 20 Hz
        it is effectively immediate, and it keeps twelve near-identical putters
        out of the file.
        """
        for source, readback in (
            (self.min_x, self.min_x_rbv),
            (self.min_y, self.min_y_rbv),
            (self.size_x, self.size_x_rbv),
            (self.size_y, self.size_y_rbv),
            (self.color_mode, self.color_mode_rbv),
            (self.data_type, self.data_type_rbv),
            (self.bin_x, self.bin_x_rbv),
            (self.bin_y, self.bin_y_rbv),
            (self.acquire_time, self.acquire_time_rbv),
            (self.acquire_period, self.acquire_period_rbv),
            (self.image_mode, self.image_mode_rbv),
            (self.num_images, self.num_images_rbv),
        ):
            await self._write_if_changed(readback, source.value)

    @staticmethod
    async def _write_if_changed(channel, value):
        """Avoid pushing a monitor update 20 times a second for a static value."""
        if channel.value != value:
            await channel.write(value)
