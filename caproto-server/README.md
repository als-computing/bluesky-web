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

`python bl531_ioc.py --list-pvs` prints the authoritative list.

### Motor records

Every field `ophyd.EpicsMotor` connects to is served:

```
.VAL .RBV .OFF .DIR .FOFF .SET .VELO .ACCL .EGU
.MOVN .DMOV .TDIR .HLM .LLM .HLS .LLS .STOP .HOMF .HOMR
```

Motion is constant-velocity at `.VELO` (no acceleration ramp — `.ACCL` is served
but not honoured), stepped at 20 Hz. `.RBV` moves toward `.VAL`; `.DMOV` goes
0 → 1 on every put to `.VAL`, **including a zero-length move**, because ophyd's
`MoveStatus` must observe not-done before done or a scan that revisits a
position hangs. `.STOP` halts in place. `.VAL` publishes control limits, which
is what `EpicsMotor.user_setpoint` (declared `limits=True`) reads.

The mono angle limits are `[15, 63]` degrees, chosen to span the 2400–12000 eV
range `MonoEnergy` allows for Si(111). Narrower limits make `energy_scan` fail a
limits check before it ever moves.

### Hexapod

The startup file drives the hexapod through `ophyd.PVPositioner`, not a motor
record: six independent setpoint/readback pairs sharing one "GO" button
(`MOVE_PTP`) and one done flag (`s_hexa:InPosition_RBV`). A put of 1 to
`MOVE_PTP` drops the done flag to 0 *before* acknowledging the put, ramps all
six readbacks, then sets it back to 1.

### Fluorescent detectors

Both MCAs share one acquisition model: write the start PV → busy flag asserts
synchronously → after the preset time, a spectrum appears and the flag clears.

The busy flag *must* be set inside the start PV's put handler.
`SiliconDriftDetector.trigger()` sleeps only 50 ms after writing `EraseStart`
before it starts polling `.ACQG`, and if it reads 0 there it silently returns
the previous spectrum.

Preset times are capped at 0.3 s (`MAX_SIM_ACQUIRE_S` in `detectors.py`) so a
100-point energy scan does not take two minutes.

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

Area detectors. `BL531acA5427:` (Basler), `13PIL1:` and `pilatus300k:` (Pilatus)
are out of scope — a faithful AreaDetector simulation also has to write real
TIFFs to a shared volume or ophyd's `FileStore` staging fails. The sim startup
directory `queue-server/startup_bl531_sim` therefore omits
`02_area_detectors.py`.

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

## Known gap in the frontend

`frontend/src/app/pages/ControlPage.tsx` hardcodes
`ws://localhost:8000/ophydSocket`, and `QSpaceContainer.jsx` / `useQSpace.js`
hardcode `http://127.0.0.1:8000/qvector`. Neither matches this stack:
ophyd-websocket serves `/api/v1/device-socket` on **8001**, and frontend-api
serves on **8002**. These URLs predate the sim stack and are not fixed here.
