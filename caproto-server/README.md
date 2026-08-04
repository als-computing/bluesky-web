# caproto-server — simulated BL 5.3.1 EPICS IOC

A pure-Python [caproto](https://caproto.github.io/caproto/) IOC that serves the
**exact** PV names `queue-server/startup_bl531` connects to, so the whole
bluesky stack — queue server, ophyd-websocket, Tiled, the frontend — can run
end to end without the real beamline.

104 PVs, no compiled EPICS base, no QEMU. It builds and runs natively on Apple
Silicon.

## What is simulated

| Device (startup name) | PVs |
|---|---|
| `mono_angle_deg`, `mono_energy.mono_angle` | `bl531_xps1:mono_angle_deg` — full motor record |
| `sampleJack` | `bl531_xps1:es_height_mm` — full motor record |
| `diode_x_mm` | `bl531_xps2:beamstop_x_mm` — full motor record |
| `diode_y_mm` | `bl531_xps2:beamstop_y_mm` — full motor record |
| `hexapod_motor_{Tx,Ty,Tz,Rx,Ry,Rz}`, `gi_angle` | `SYM:HEX01:*` — 14 PVs |
| `diode` | `bl201-beamstop:current` |
| `shutter_status` | `bl531:LJT4:1:AO0` |
| `amptek_fluo` | `mcaTest:mca1.{PRTM,ACQG,VAL}` + `mcaTest:mca1EraseStart` |
| `mercury` | `dxpMercury:{PresetMode,EraseAll,StartAll,Acquiring}` + `dxpMercury:mca1.{PRTM,VAL,NUSE}` |
| area detector (Finch Camera) | `13SIM1:cam1:*` + `13SIM1:image1:*` — see below |

`python bl531_ioc.py --list-pvs` prints the authoritative list.

### Motor records

Every field `ophyd.EpicsMotor` connects to is served:

```
.VAL .RBV .OFF .DIR .FOFF .SET .VELO .ACCL .EGU
.MOVN .DMOV .TDIR .HLM .LLM .HLS .LLS .STOP .HOMF .HOMR
```

plus the **bare record name** with no field at all. EPICS resolves a fieldless
PV to `.VAL`, so `caput bl531_xps2:beamstop_x_mm 5` moves a real motor record;
caproto serves only what is in the pvdb, so the bare name is an explicit channel
kept in step with `.VAL` in both directions. Writing either one starts the same
move, and both publish the travel limits. This is the name a UI will typically
use to set a position.

Motion is constant-velocity at `.VELO` (no acceleration ramp — `.ACCL` is served
but not honoured), stepped at 20 Hz. `.RBV` moves toward `.VAL`; `.DMOV` goes
0 → 1 on every put, **including a zero-length move**, because ophyd's
`MoveStatus` must observe not-done before done or a scan that revisits a
position hangs. `.STOP` halts in place. `.VAL` publishes control limits, which
is what `EpicsMotor.user_setpoint` (declared `limits=True`) reads.

An out-of-limits write is **rejected**, not clamped — the put fails with
`CannotExceedLimits` and the motor does not move, matching a real record.

The mono angle limits are `[15, 63]` degrees, chosen to span the 2400–12000 eV
range `MonoEnergy` allows for Si(111). Narrower limits make `energy_scan` fail a
limits check before it ever moves.

Its `.VELO` is derived rather than hardcoded, from `MONO_EV_PER_SECOND` in
`bl531_ioc.py` — currently **1000 eV in 5 s** near the Cu K edge (0.287 deg/s).
Change that constant to retune; the IOC logs the resulting velocity at startup.

Because the angle-to-energy relation is nonlinear, a constant `.VELO` only pins
the *energy* rate at one point. 1000 eV spans 1.4 degrees at 9 keV but 16.7 at
3 keV, so the same 1000 eV step takes about 42 s down there. That is how a real
mono behaves. If you would rather have a constant eV/s across the whole range,
the motor would need to vary `.VELO` with position — say the word.

### Hexapod

The startup file drives the hexapod through `ophyd.PVPositioner`, not a motor
record: six independent setpoint/readback pairs sharing one "GO" button
(`MOVE_PTP`) and one done flag (`s_hexa:InPosition_RBV`). A put of 1 to
`MOVE_PTP` drops the done flag to 0 *before* acknowledging the put, ramps all
six readbacks, then sets it back to 1.

Writing a `MOVE_PTP:<axis>` setpoint alone does **not** move anything — you
must then press GO by writing 1 to `MOVE_PTP`. That is how the real controller
works and how `PVPositioner` drives it.

`MOVE_PTP` latches at the written value instead of self-clearing to 0. caproto
runs the put handler on every write whether or not the value changed, so a
repeat press still moves; latching additionally keeps clients that verify the
readback after writing working. `ophyd.EpicsSignal.set()` is one such client —
it waits for readback == setpoint, so a self-clearing actuate would report
failure on every move even though the move ran.

### Fluorescent detectors

Both MCAs share one acquisition model: write the start PV → busy flag asserts
synchronously → after the preset time, a spectrum appears and the flag clears.

The busy flag *must* be set inside the start PV's put handler.
`SiliconDriftDetector.trigger()` sleeps only 50 ms after writing `EraseStart`
before it starts polling `.ACQG`, and if it reads 0 there it silently returns
the previous spectrum.

Preset times are capped at 0.3 s (`MAX_SIM_ACQUIRE_S` in `detectors.py`) so a
100-point energy scan does not take two minutes.

### Area detector (`area_detector.py`)

Feeds Finch's Camera component, which renders frames served by ophyd-websocket's
[`camera-socket`](https://github.com/bluesky/ophyd-websocket/blob/main/src/ophyd_websocket/routers/camera_socket.py)
router. Shaped like ADSimDetector, at the prefix that router defaults to.

**To rename the detector, change one line** at the top of `area_detector.py`:

```python
SIM_DETECTOR_PREFIX = '13SIM1:'
```

Nothing else hardcodes the name. The socket derives the `cam1:` PVs from
whatever array PV it is given (`image_array_pv.split(":")[0]`), so a client
pointed at `MYDET:image1:ArrayData` picks up `MYDET:cam1:*` automatically.

| PV | Type | Default |
|---|---|---|
| `cam1:MinX` `cam1:MinY` | int | 0 |
| `cam1:SizeX` `cam1:SizeY` | int | 512 |
| `cam1:ColorMode` | enum `Mono, RGB1, RGB2, RGB3` | `Mono` |
| `cam1:DataType` | enum `Int8 … Float64` | `UInt8` |
| `cam1:BinX` `cam1:BinY` | int | 1 |
| `cam1:Acquire` | enum `Done, Acquire` | `Acquire` |
| `cam1:AcquireTime` `cam1:AcquirePeriod` | float | 0.1 / 0.2 s |
| `cam1:ImageMode` | enum `Single, Multiple, Continuous` | `Continuous` |
| `cam1:NumImages` `cam1:ArrayCounter` | int | 1 / 0 |
| `cam1:*_RBV`, `ArraySize{X,Y,}_RBV`, `DetectorState_RBV`, `NumImagesCounter_RBV` | ro | — |
| `image1:ArrayData` | UInt8 waveform | the image |
| `image1:{ArrayCounter,NDimensions,ArraySize0,ArraySize1,ArraySize2}_RBV`, `image1:EnableCallbacks` | — | — |

It **free-runs on startup** (Continuous, 5 fps) so a viewer shows frames with no
setup. Stop and control it with:

```bash
caput 13SIM1:cam1:Acquire 0            # stop
caput 13SIM1:cam1:AcquirePeriod 0.05   # 20 fps
caput 13SIM1:cam1:ImageMode Single     # one frame per Acquire=1
caput 13SIM1:cam1:AcquireTime 0.5      # longer exposure: brighter, less noise
```

The image is a SAXS-like pattern from `beam.scattering_frame()`, wired to the
same beamline model as the diode and the MCAs, so it reacts to motion:

- **Debye–Scherrer rings** whose radius tracks the wavelength — raising the mono
  energy pulls them inward. Measured against the running IOC: rings at 90/153/216 px
  at 9 keV move to 66/114/162 px at 12 keV, a 0.75 ratio matching 9/12 keV to
  within 3%.
- **A beamstop shadow** that follows `diode_x_mm` / `diode_y_mm`; move it aside and
  the saturated direct beam appears.
- Poisson noise scaled by `AcquireTime`.

Three deliberate limitations, all forced by the consumer or by caproto:

- **`MinX`/`MinY` shrink the frame** rather than acting as an ROI origin. The
  router computes its dimensions as `size - start`, so real AreaDetector semantics
  (emit `SizeX` columns regardless of `MinX`) would desync the array from the width
  it expects and its `reshape` would throw. The sim emits exactly
  `(SizeX-MinX) × (SizeY-MinY)` elements so the two always agree.
- **`DataType` changes interpretation, not the wire type.** caproto fixes a
  channel's dtype at class-definition time, so `ArrayData` is always UInt8. The
  consumer casts, values survive, the image still renders.
- **`BinX`/`BinY` are inert.** The router reads them but its dimension maths divides
  by a hardcoded `1`, so applying binning would desync the array length.

`MAX_DIM = 1024` caps the frame size (the channel is preallocated for
1024×1024 RGB); larger requests are clamped.

### Beamline model

`beam.py` is a toy physics model whose only job is to make scans produce
non-flat data:

- Photon energy from mono angle via Bragg's law on Si(111), using the same
  constants and calibration offset as `01_motors.py`.
- A Cu K edge at 8979 eV with a damped EXAFS wiggle above it.
- Fluorescence spectra with a Cu Kα line (8047 eV) whose area tracks the
  absorption, plus an elastic peak at the incident energy. The MCA is
  calibrated at 4.0 eV/channel so Cu Kα lands at channel ~2012, inside the
  1800–2750 ROI the startup file configures.
- Diode current that falls across the edge and drops off as the beamstop
  motors move away from zero.

None of it is quantitatively meaningful.

## What is **not** simulated

**The beamline's own area detectors.** `BL531acA5427:` (Basler), `13PIL1:` and
`pilatus300k:` (Pilatus) are out of scope — a faithful simulation of those also
has to write real TIFFs to a shared volume or ophyd's `FileStore` staging fails.
The sim startup directory `queue-server/startup_bl531_sim` therefore omits
`02_area_detectors.py`. The `13SIM1:` detector above is a *different* thing: it
feeds the Camera component over Channel Access and writes no files.

**The `13SIM1:` detector as a bluesky device.** Its PV set is deliberately not
the full CamBase/NDPluginBase surface, so ophyd's `AreaDetector` class cannot
connect to it and it is not usable as a detector in a plan. It is for the Camera
component's live view only.

## Running it

### In compose (normal use)

```bash
docker compose -f docker-compose.sim.yml up --build
```

Published ports:

| Service | Host port |
|---|---|
| frontend (Vite dev server) | 5173 |
| tiled | 8000 |
| ophyd-api (ophyd-websocket) | 8001 |
| frontend-api | 8002 |
| qserver-api (bluesky-httpserver) | 60610 |
| redis | 6379 |
| **caproto** | **none** |

If something on the host already listens on one of these — a native Tiled on
8000 is the likely one — stop it first, or `curl localhost:8000` reaches the
host process and the container looks broken.

Open the run engine environment before queueing anything:

```bash
curl -X POST -H "Authorization: ApiKey test" \
    http://localhost:60610/api/environment/open
```

The IOC is **not** port-mapped, by design. Clients reach it over the compose
network by service name:

```yaml
EPICS_CA_ADDR_LIST: caproto
EPICS_CA_AUTO_ADDR_LIST: "NO"
```

`AUTO_ADDR_LIST=NO` is required: CA name resolution is a broadcast, and
broadcasts do not cross a Docker bridge on macOS. The unicast search to the
service name does.

### Standalone, for development

The `bluesky` conda env already has caproto, ophyd and pyepics:

```bash
conda run -n bluesky python bl531_ioc.py
```

If the host already runs an IOC on the default CA port (check with
`lsof -i :5064`), use a private port for both server and clients:

```bash
# server
EPICS_CA_SERVER_PORT=5075 EPICS_CA_REPEATER_PORT=5076 \
    python bl531_ioc.py --interfaces 127.0.0.1

# client
export EPICS_CA_SERVER_PORT=5075 EPICS_CA_REPEATER_PORT=5076
export EPICS_CA_AUTO_ADDR_LIST=NO EPICS_CA_ADDR_LIST=127.0.0.1
caget bl531_xps1:mono_angle_deg.RBV
caput bl531_xps1:mono_angle_deg.VAL 25
```

Without the port override, clients on the host will find the *real* beamline
instead of the simulator.

## Adding a PV

Each device is a `caproto.server.PVGroup` whose prefix is the real PV prefix.
Add a `pvproperty` with the field as its `name=` (`'.RBV'`, `'EraseStart'`,
`'MOVE_PTP:Tx'` — the prefix and name are simply concatenated, so a leading dot
is significant), then register the group in `build_pvdb()` in `bl531_ioc.py`.
Duplicate PV names across groups raise at startup rather than silently
shadowing.

Devices that need to react to the machine state (the diode, the MCAs) receive a
`Beamline` object rather than reaching into each other's groups.

## Known bugs in ophyd-websocket (not this IOC)

Both make a *successful* operation look like a failure from the UI:

- `PUT /api/v1/devices` with a `timeout` returns
  `'OphydDeviceInstruction' object has no attribute 'value'`. The device really
  did move — `core_api.py` builds the success response from `instruction.value`,
  but the model field is `set_value`. Omit `timeout` and it returns success.
- `PUT /api/v1/pvs` calls `pv.set(...).wait(timeout=1)`. If that raises — an
  out-of-limits value, or a move longer than one second — the `EpicsSignal` is
  left with an in-flight set, and every later write to that PV fails with
  `Another set() call is still in progress`. Restarting the ophyd-api container
  clears it.

## Known gap in the frontend

`frontend/src/app/pages/ControlPage.tsx` hardcodes
`ws://localhost:8000/ophydSocket`, and `QSpaceContainer.jsx` / `useQSpace.js`
hardcode `http://127.0.0.1:8000/qvector`. Neither matches this stack:
ophyd-websocket serves `/api/v1/device-socket` on **8001**, and frontend-api
serves on **8002**. These URLs predate the sim stack and are not fixed here.
