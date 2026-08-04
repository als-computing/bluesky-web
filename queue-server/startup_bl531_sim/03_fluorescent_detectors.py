import time
import numpy as np
import threading

from epics import caget, caput

from ophyd import Device, EpicsSignal, EpicsSignalRO, Component as Cpt, Signal
from ophyd.status import DeviceStatus

# ============================================================================
# Fluorescent Detector for XAS 
# ============================================================================
class SiliconDriftDetector(Device):
   """
   Ophyd device for an Amptek Silicon Drift Detector via an EPICS MCA record.


   The full spectrum is stored internally and retrievable via spectrum().
   Only the integrated count within the configured ROI (roi_sum) is sent
   to the bluesky run-engine and the tiled data server.


   Parameters
   ----------
   prefix : str
       EPICS PV prefix for the MCA record, e.g. 'mcaTest:mca1'.
       Note: the EraseStart PV must live at {prefix}EraseStart (no dot).
   roi_low : int, optional
       First channel of the ROI, inclusive. Default 1800.
   roi_high : int, optional
       Last channel of the ROI, exclusive. Default 2750.
   name : str
       Ophyd device name (required keyword argument).


   Examples
   --------
   >>> sdd = SiliconDriftDetector('mcaTest:mca1', name='sdd',
   ...                            roi_low=1800, roi_high=2750)
   >>> sdd.set_exposure(0.1)
   >>> sdd.set_roi(1800, 2750)
   >>> sdd.get()           # triggers acquisition, returns ROI sum as float
   42315.0
   >>> sdd.spectrum()      # numpy array of the last acquired spectrum
   """


   # ------------------------------------------------------------------
   # EPICS PV components
   # 'mcaTest:mca1' + '.PRTM' → 'mcaTest:mca1.PRTM'
   # 'mcaTest:mca1' + 'EraseStart' → 'mcaTest:mca1EraseStart'  (no dot!)
   # ------------------------------------------------------------------
   exposure_time = Cpt(EpicsSignal,   '.PRTM',      kind='config',
                       doc='Preset real time (exposure) in seconds.')
   acquiring     = Cpt(EpicsSignalRO, '.ACQG',      kind='omitted',
                       doc='1 while acquiring, 0 when idle.')
   _spectrum_pv  = Cpt(EpicsSignalRO, '.VAL',       kind='omitted',
                       doc='Raw MCA spectrum array.')
   _erase_start  = Cpt(EpicsSignal,   'EraseStart', kind='omitted',
                       doc='Write 1 to erase memory and begin acquisition.')


   # ------------------------------------------------------------------
   # Soft (Python-side) configuration signals — no EPICS PV backing
   # ------------------------------------------------------------------
   roi_low  = Cpt(Signal, value=1800, kind='config',
                  doc='First channel of ROI, inclusive.')
   roi_high = Cpt(Signal, value=2750, kind='config',
                  doc='Last channel of ROI, exclusive.')


   # ------------------------------------------------------------------
   # Primary readable — the only field tiled / bluesky will record
   # ------------------------------------------------------------------
   roi_sum = Cpt(Signal, value=0.0, kind='hinted',
                 doc='Integrated photon counts within [roi_low, roi_high).')


   # ------------------------------------------------------------------


   def __init__(self, *args, roi_low=1800, roi_high=2750, **kwargs):
       super().__init__(*args, **kwargs)
       self._latest_spectrum = None          # populated on first acquisition
       self.roi_low.put(roi_low)
       self.roi_high.put(roi_high)


   # ══════════════════════════════════════════════════════════════════
   # Bluesky / tiled interface
   # ══════════════════════════════════════════════════════════════════


   def trigger(self):
       """
       Erase detector, acquire for exposure_time seconds, update roi_sum.


       The bluesky run-engine calls trigger() automatically before read().
       Returns a DeviceStatus that resolves when acquisition is complete.
       """
       status = DeviceStatus(self)


       def _acquire():
           try:
               # Erase memory and start acquisition
               self._erase_start.put(1, wait=True)
               time.sleep(0.05)                        # let ACQG assert


               # Poll until the detector goes idle
               while self.acquiring.get() == 1:
                   time.sleep(0.05)


               # Grab the spectrum and compute the ROI integral
               spec = np.asarray(self._spectrum_pv.get())
               self._latest_spectrum = spec


               lo = int(self.roi_low.get())
               hi = int(self.roi_high.get())
               self.roi_sum.put(float(np.sum(spec[lo:hi])))


               status._finished()                      # signal completion
           except Exception:
               status._finished(success=False)


       threading.Thread(target=_acquire, daemon=True).start()
       return status


   # read() and describe() are inherited from Device and work automatically:
   #   sdd.read()   → {'sdd_roi_sum': {'value': ..., 'timestamp': ...}}
   #   sdd.hints    → {'fields': ['sdd_roi_sum']}


   # ══════════════════════════════════════════════════════════════════
   # User-facing convenience API
   # ══════════════════════════════════════════════════════════════════


   def get(self):
       """
       Trigger a fresh acquisition and return the ROI sum as a single float.
       Blocks until acquisition is complete.


       Returns
       -------
       float
           Sum of photon counts in [roi_low, roi_high).
       """
       self.trigger().wait()
       return float(self.roi_sum.get())


   def spectrum(self):
       """
       Return the most recently acquired spectrum as a numpy array.


       If trigger() / get() has never been called, reads the hardware
       buffer directly without starting a new acquisition.


       Returns
       -------
       numpy.ndarray, shape (n_channels,)
       """
       if self._latest_spectrum is None:
           self._latest_spectrum = np.asarray(self._spectrum_pv.get())
       return self._latest_spectrum


   def set_roi(self, low: int, high: int):
       """
       Configure the integration window.


       Parameters
       ----------
       low : int   First channel, inclusive.
       high : int  First channel to exclude.
       """
       self.roi_low.put(low)
       self.roi_high.put(high)
       print(f"ROI set → channels [{low}, {high})  ({high - low} channels)")


   def set_exposure(self, seconds: float):
       """
       Set the detector preset real-time (exposure duration).


       Parameters
       ----------
       seconds : float
       """
       self.exposure_time.put(float(seconds), wait=True)
       print(f"Exposure time → {seconds} s")


   def __repr__(self):
       try:
           return (
               f"SiliconDriftDetector(prefix={self.prefix!r}, "
               f"name={self.name!r})\n"
               f"  exposure : {self.exposure_time.get():.3f} s\n"
               f"  roi      : [{int(self.roi_low.get())}, "
               f"{int(self.roi_high.get())})\n"
               f"  roi_sum  : {self.roi_sum.get():.0f} counts"
           )
       except Exception:
           return f"SiliconDriftDetector(prefix={self.prefix!r}, name={self.name!r})"






# ============================================================================
# Mercury Detector for XANES with channel threshold
# ============================================================================


class MercuryDetector:
    """Simple Bluesky-compatible Mercury detector for XANES with channel threshold."""
    
    def __init__(self, prefix='dxpMercury:', name='mercury', threshold_channel=500, upper_channel=800):
        self.prefix = prefix
        self.mca_prefix = prefix + 'mca1'
        self.name = name
        self.parent = None
        self._last_spectrum = None
        self.threshold_channel = threshold_channel
        self.upper_channel = upper_channel
        
        # Set to Live Time mode once
        caput(self.prefix + 'PresetMode', 1, wait=True)
    
    def set_threshold(self, channel, upper_channel=None):
        """Set the channel threshold for integration."""
        self.threshold_channel = channel
        self.upper_channel = min(channel + 300, 2048)  # Example: set upper channel 300 above threshold, max 2048
    
    def set_acquisition_time(self, time_seconds):
        """Set the acquisition time."""
        caput(self.mca_prefix + '.PRTM', time_seconds, wait=True)
    
    def trigger(self):
        """Start acquisition (Bluesky interface)."""
        status = DeviceStatus(self)
        
        caput(self.prefix + 'EraseAll', 1, wait=True)
        caput(self.prefix + 'StartAll', 1, wait=True)
        
        def check_done():
            while caget(self.prefix + 'Acquiring') == 1:
                time.sleep(0.1)
            status.set_finished()
    
        threading.Thread(target=check_done, daemon=True).start()
        return status
    
    def read(self):
        """Read data - integrates from threshold_channel to end."""
        spectrum = caget(self.mca_prefix + '.VAL')
        num_channels = int(caget(self.mca_prefix + '.NUSE'))
        self._last_spectrum = spectrum[:num_channels]
        
        # Integrate from threshold_channel to the end
        integrated_counts = float(np.sum(self._last_spectrum[self.threshold_channel:]))
        total_counts = float(np.sum(self._last_spectrum))
        
        timestamp = time.time()
        
        return {
            f'{self.name}_counts': {
                'value': integrated_counts,
                'timestamp': timestamp
            },
            f'{self.name}_total_counts': {
                'value': total_counts,
                'timestamp': timestamp
            }
        }
    
    def describe(self):
        """Describe data format."""
        return {
            f'{self.name}_counts': {
                'source': f'PV:{self.mca_prefix}',
                'dtype': 'number',
                'shape': [],
                'units': 'counts'
            },
            f'{self.name}_total_counts': {
                'source': f'PV:{self.mca_prefix}',
                'dtype': 'number',
                'shape': [],
                'units': 'counts'
            }
        }
    
    def read_configuration(self):
        """Read configuration."""
        return {
            f'{self.name}_threshold_channel': {
                'value': self.threshold_channel,
                'timestamp': time.time()
            }
        }
    
    def describe_configuration(self):
        """Describe configuration."""
        return {
            f'{self.name}_threshold_channel': {
                'source': 'internal',
                'dtype': 'number',
                'shape': [],
                'units': 'channel'
            }
        }
    
    def get_spectrum(self):
        """Get the last acquired spectrum."""
        return self._last_spectrum
    


# ============================================================================
# Device Instantiation
# ============================================================================

# amptek_fluo
amptek_fluo = SiliconDriftDetector('mcaTest:mca1', name='amptek_fluo', roi_low=1800, roi_high=2750)


amptek_fluo.set_exposure(1)       # 1s
amptek_fluo.set_roi(1800, 2750)     # copper Kα window


value = amptek_fluo.get()           # triggers acquisition → returns float
print(value)                # e.g. 42315.0


spec = amptek_fluo.spectrum()       # numpy array, same acquisition
print(spec.shape)           # (4096,)
# plt.plot(spec)
# plt.xlabel('Channel')
# plt.ylabel('Counts')
# plt.title('Amptek SDD Spectrum')
# plt.show()
# Inspect what bluesky/tiled will record
print(amptek_fluo.read())
# {'sdd_roi_sum': {'value': 42315.0, 'timestamp': 1713271234.5}}


print(amptek_fluo.hints)
# {'fields': ['sdd_roi_sum']}



# Fluorescent detector (Mercury with channel threshold)
mercury = MercuryDetector('dxpMercury:', name='mercury', threshold_channel=500, upper_channel=800)
