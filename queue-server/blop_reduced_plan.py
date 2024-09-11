#RE(agent.learn(A, B,C))

from blop import Agent
from blop import Objective
from blop import DOF
#import Shadow
from databroker import Broker
import numpy as np

db = Broker.named("temp")

# the toroid() function can calculate the corresponding beam size for a given (x_rot, y_rot) pair. Shadow is used for beamline simulation.
def toroid(X_ROT,Y_ROT):
    beam = False
    oe0 = False
    oe1 = False
    oe2 = False

    oe1.X_ROT = X_ROT
    oe1.Y_ROT = Y_ROT

    

    oe0.FDISTR = 3
    oe0.F_PHOT = 0
    oe0.HDIV1 = 0.0
    oe0.HDIV2 = 0.0
    oe0.IDO_VX = 0
    oe0.IDO_VZ = 0
    oe0.IDO_X_S = 0
    oe0.IDO_Y_S = 0
    oe0.IDO_Z_S = 0
    oe0.ISTAR1 = 5676561
    oe0.PH1 = 1000.0
    oe0.SIGDIX = 5e-05
    oe0.SIGDIZ = 5e-05
    oe0.SIGMAX = 1e-05
    oe0.SIGMAZ = 1e-05
    oe0.VDIV1 = 0.0
    oe0.VDIV2 = 0.0
    oe1.DUMMY = 100.0
    oe1.FMIRR = 3
    oe1.FWRITE = 1
    oe1.F_EXT = 1
    oe1.F_MOVE = 1
    oe1.R_MAJ = 305.3065
    oe1.R_MIN = 0.655
    oe1.T_IMAGE = 0.0

    oe2.ALPHA = 90.0
    oe2.DUMMY = 100.0
    oe2.FCYL = 1
    oe2.FMIRR = 2
    oe2.FWRITE = 1
    oe2.F_DEFAULT = 0
    oe2.SIMAG = 5.0
    oe2.SSOUR = 1000000.0
    oe2.THETA = 88.0
    oe2.T_IMAGE = 5.0
    oe2.T_SOURCE = 5.0

    beam.genSource(oe0)

    beam.traceOE(oe1,1)

    beam.traceOE(oe2,2)

    x_fhwm_m = beam.histo1(1)['fwhm']
    y_fwhm_m = beam.histo1(3)['fwhm']

    a=x_fhwm_m*1e6
    b=y_fwhm_m*1e6
    size_um=np.sqrt(a**2+b**2)
   
    return size_um

dofs = [
    DOF(name="x_rot", search_bounds=(-0.2, 0.2)),
    DOF(name="y_rot", search_bounds=(-0.2, 0.2)),
]

objectives = [Objective(name="beamsize", description="toroid's function", target="min")]

def digestion(db, uid):
    products = db[uid].table()

    for index, entry in products.iterrows():
        products.loc[index, "beamsize"] = toroid(entry.x_rot, entry.y_rot)
       

    return products

agent = Agent(
    dofs=dofs,
    objectives=objectives,
    digestion=digestion,
    db=db,
)

def call_agent(type="qei", n=4, iterations=8):

    yield from agent.learn(type, n, iterations)



    