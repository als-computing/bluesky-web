from ophyd.sim import SynAxis, SynGauss

sim_motor = SynAxis(name="sim_motor")

sim_diode = SynGauss(
    "sim_diode",
    sim_motor,
    "sim_motor",
    center=0,
    Imax=10,
    sigma=1,
)