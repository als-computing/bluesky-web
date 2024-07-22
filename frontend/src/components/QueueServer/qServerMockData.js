const mockDevicesAllowedResponse = {
    "success": true,
    "msg": "",
    "devices_allowed": {
        "noisy_det": {
            "is_readable": true,
            "is_movable": false,
            "is_flyable": false,
            "classname": "SynGauss",
            "module": "ophyd.sim",
            "components": {
                "val": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "SynSignal",
                    "module": "ophyd.sim"
                },
                "Imax": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "Signal",
                    "module": "ophyd.signal"
                },
                "center": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "Signal",
                    "module": "ophyd.signal"
                },
                "sigma": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "Signal",
                    "module": "ophyd.signal"
                },
                "noise": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "EnumSignal",
                    "module": "ophyd.sim"
                },
                "noise_multiplier": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "Signal",
                    "module": "ophyd.signal"
                }
            }
        },
        "motor_no_hints1": {
            "is_readable": true,
            "is_movable": true,
            "is_flyable": false,
            "classname": "SynAxisNoHints",
            "module": "ophyd.sim",
            "components": {
                "readback": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "_ReadbackSignal",
                    "module": "ophyd.sim"
                },
                "setpoint": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "_SetpointSignal",
                    "module": "ophyd.sim"
                },
                "velocity": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "Signal",
                    "module": "ophyd.signal"
                },
                "acceleration": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "Signal",
                    "module": "ophyd.signal"
                },
                "unused": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "Signal",
                    "module": "ophyd.signal"
                }
            }
        },
        "motor1": {
            "is_readable": true,
            "is_movable": true,
            "is_flyable": false,
            "classname": "SynAxis",
            "module": "ophyd.sim",
            "components": {
                "readback": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "_ReadbackSignal",
                    "module": "ophyd.sim"
                },
                "setpoint": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "_SetpointSignal",
                    "module": "ophyd.sim"
                },
                "velocity": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "Signal",
                    "module": "ophyd.signal"
                },
                "acceleration": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "Signal",
                    "module": "ophyd.signal"
                },
                "unused": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "Signal",
                    "module": "ophyd.signal"
                }
            }
        },
        "jittery_motor2": {
            "is_readable": true,
            "is_movable": true,
            "is_flyable": false,
            "classname": "SynAxis",
            "module": "ophyd.sim",
            "components": {
                "readback": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "_ReadbackSignal",
                    "module": "ophyd.sim"
                },
                "setpoint": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "_SetpointSignal",
                    "module": "ophyd.sim"
                },
                "velocity": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "Signal",
                    "module": "ophyd.signal"
                },
                "acceleration": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "Signal",
                    "module": "ophyd.signal"
                },
                "unused": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "Signal",
                    "module": "ophyd.signal"
                }
            }
        },
        "det1": {
            "is_readable": true,
            "is_movable": false,
            "is_flyable": false,
            "classname": "SynGauss",
            "module": "ophyd.sim",
            "components": {
                "val": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "SynSignal",
                    "module": "ophyd.sim"
                },
                "Imax": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "Signal",
                    "module": "ophyd.signal"
                },
                "center": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "Signal",
                    "module": "ophyd.signal"
                },
                "sigma": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "Signal",
                    "module": "ophyd.signal"
                },
                "noise": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "EnumSignal",
                    "module": "ophyd.sim"
                },
                "noise_multiplier": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "Signal",
                    "module": "ophyd.signal"
                }
            }
        },
        "invariant2": {
            "is_readable": true,
            "is_movable": true,
            "is_flyable": false,
            "classname": "InvariantSignal",
            "module": "ophyd.sim"
        },
        "motor_empty_hints2": {
            "is_readable": true,
            "is_movable": true,
            "is_flyable": false,
            "classname": "SynAxisEmptyHints",
            "module": "ophyd.sim",
            "components": {
                "readback": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "_ReadbackSignal",
                    "module": "ophyd.sim"
                },
                "setpoint": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "_SetpointSignal",
                    "module": "ophyd.sim"
                },
                "velocity": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "Signal",
                    "module": "ophyd.signal"
                },
                "acceleration": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "Signal",
                    "module": "ophyd.signal"
                },
                "unused": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "Signal",
                    "module": "ophyd.signal"
                }
            }
        },
        "img": {
            "is_readable": true,
            "is_movable": true,
            "is_flyable": false,
            "classname": "SynSignalWithRegistry",
            "module": "ophyd.sim"
        },
        "identical_det": {
            "is_readable": true,
            "is_movable": false,
            "is_flyable": false,
            "classname": "SynGauss",
            "module": "ophyd.sim",
            "components": {
                "val": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "SynSignal",
                    "module": "ophyd.sim"
                },
                "Imax": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "Signal",
                    "module": "ophyd.signal"
                },
                "center": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "Signal",
                    "module": "ophyd.signal"
                },
                "sigma": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "Signal",
                    "module": "ophyd.signal"
                },
                "noise": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "EnumSignal",
                    "module": "ophyd.sim"
                },
                "noise_multiplier": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "Signal",
                    "module": "ophyd.signal"
                }
            }
        },
        "sim_bundle_A": {
            "is_readable": true,
            "is_movable": false,
            "is_flyable": false,
            "classname": "SimBundle",
            "module": "__main__",
            "components": {
                "mtrs": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "SimStage",
                    "module": "__main__",
                    "components": {
                        "x": {
                            "is_readable": true,
                            "is_movable": true,
                            "is_flyable": false,
                            "classname": "SynAxis",
                            "module": "ophyd.sim",
                            "components": {
                                "readback": {
                                    "is_readable": true,
                                    "is_movable": true,
                                    "is_flyable": false,
                                    "classname": "_ReadbackSignal",
                                    "module": "ophyd.sim"
                                },
                                "setpoint": {
                                    "is_readable": true,
                                    "is_movable": true,
                                    "is_flyable": false,
                                    "classname": "_SetpointSignal",
                                    "module": "ophyd.sim"
                                },
                                "velocity": {
                                    "is_readable": true,
                                    "is_movable": true,
                                    "is_flyable": false,
                                    "classname": "Signal",
                                    "module": "ophyd.signal"
                                },
                                "acceleration": {
                                    "is_readable": true,
                                    "is_movable": true,
                                    "is_flyable": false,
                                    "classname": "Signal",
                                    "module": "ophyd.signal"
                                },
                                "unused": {
                                    "is_readable": true,
                                    "is_movable": true,
                                    "is_flyable": false,
                                    "classname": "Signal",
                                    "module": "ophyd.signal"
                                }
                            }
                        },
                        "y": {
                            "is_readable": true,
                            "is_movable": true,
                            "is_flyable": false,
                            "classname": "SynAxis",
                            "module": "ophyd.sim",
                            "components": {
                                "readback": {
                                    "is_readable": true,
                                    "is_movable": true,
                                    "is_flyable": false,
                                    "classname": "_ReadbackSignal",
                                    "module": "ophyd.sim"
                                },
                                "setpoint": {
                                    "is_readable": true,
                                    "is_movable": true,
                                    "is_flyable": false,
                                    "classname": "_SetpointSignal",
                                    "module": "ophyd.sim"
                                },
                                "velocity": {
                                    "is_readable": true,
                                    "is_movable": true,
                                    "is_flyable": false,
                                    "classname": "Signal",
                                    "module": "ophyd.signal"
                                },
                                "acceleration": {
                                    "is_readable": true,
                                    "is_movable": true,
                                    "is_flyable": false,
                                    "classname": "Signal",
                                    "module": "ophyd.signal"
                                },
                                "unused": {
                                    "is_readable": true,
                                    "is_movable": true,
                                    "is_flyable": false,
                                    "classname": "Signal",
                                    "module": "ophyd.signal"
                                }
                            }
                        },
                        "z": {
                            "is_readable": true,
                            "is_movable": true,
                            "is_flyable": false,
                            "classname": "SynAxis",
                            "module": "ophyd.sim",
                            "components": {
                                "readback": {
                                    "is_readable": true,
                                    "is_movable": true,
                                    "is_flyable": false,
                                    "classname": "_ReadbackSignal",
                                    "module": "ophyd.sim"
                                },
                                "setpoint": {
                                    "is_readable": true,
                                    "is_movable": true,
                                    "is_flyable": false,
                                    "classname": "_SetpointSignal",
                                    "module": "ophyd.sim"
                                },
                                "velocity": {
                                    "is_readable": true,
                                    "is_movable": true,
                                    "is_flyable": false,
                                    "classname": "Signal",
                                    "module": "ophyd.signal"
                                },
                                "acceleration": {
                                    "is_readable": true,
                                    "is_movable": true,
                                    "is_flyable": false,
                                    "classname": "Signal",
                                    "module": "ophyd.signal"
                                },
                                "unused": {
                                    "is_readable": true,
                                    "is_movable": true,
                                    "is_flyable": false,
                                    "classname": "Signal",
                                    "module": "ophyd.signal"
                                }
                            }
                        }
                    }
                },
                "dets": {
                    "is_readable": true,
                    "is_movable": false,
                    "is_flyable": false,
                    "classname": "SimDetectors",
                    "module": "__main__",
                    "components": {
                        "det_A": {
                            "is_readable": true,
                            "is_movable": false,
                            "is_flyable": false,
                            "classname": "SynGauss",
                            "module": "ophyd.sim",
                            "components": {
                                "val": {
                                    "is_readable": true,
                                    "is_movable": true,
                                    "is_flyable": false,
                                    "classname": "SynSignal",
                                    "module": "ophyd.sim"
                                },
                                "Imax": {
                                    "is_readable": true,
                                    "is_movable": true,
                                    "is_flyable": false,
                                    "classname": "Signal",
                                    "module": "ophyd.signal"
                                },
                                "center": {
                                    "is_readable": true,
                                    "is_movable": true,
                                    "is_flyable": false,
                                    "classname": "Signal",
                                    "module": "ophyd.signal"
                                },
                                "sigma": {
                                    "is_readable": true,
                                    "is_movable": true,
                                    "is_flyable": false,
                                    "classname": "Signal",
                                    "module": "ophyd.signal"
                                },
                                "noise": {
                                    "is_readable": true,
                                    "is_movable": true,
                                    "is_flyable": false,
                                    "classname": "EnumSignal",
                                    "module": "ophyd.sim"
                                },
                                "noise_multiplier": {
                                    "is_readable": true,
                                    "is_movable": true,
                                    "is_flyable": false,
                                    "classname": "Signal",
                                    "module": "ophyd.signal"
                                }
                            }
                        },
                        "det_B": {
                            "is_readable": true,
                            "is_movable": false,
                            "is_flyable": false,
                            "classname": "SynGauss",
                            "module": "ophyd.sim",
                            "components": {
                                "val": {
                                    "is_readable": true,
                                    "is_movable": true,
                                    "is_flyable": false,
                                    "classname": "SynSignal",
                                    "module": "ophyd.sim"
                                },
                                "Imax": {
                                    "is_readable": true,
                                    "is_movable": true,
                                    "is_flyable": false,
                                    "classname": "Signal",
                                    "module": "ophyd.signal"
                                },
                                "center": {
                                    "is_readable": true,
                                    "is_movable": true,
                                    "is_flyable": false,
                                    "classname": "Signal",
                                    "module": "ophyd.signal"
                                },
                                "sigma": {
                                    "is_readable": true,
                                    "is_movable": true,
                                    "is_flyable": false,
                                    "classname": "Signal",
                                    "module": "ophyd.signal"
                                },
                                "noise": {
                                    "is_readable": true,
                                    "is_movable": true,
                                    "is_flyable": false,
                                    "classname": "EnumSignal",
                                    "module": "ophyd.sim"
                                },
                                "noise_multiplier": {
                                    "is_readable": true,
                                    "is_movable": true,
                                    "is_flyable": false,
                                    "classname": "Signal",
                                    "module": "ophyd.signal"
                                }
                            }
                        }
                    }
                }
            }
        },
        "det": {
            "is_readable": true,
            "is_movable": false,
            "is_flyable": false,
            "classname": "SynGauss",
            "module": "ophyd.sim",
            "components": {
                "val": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "SynSignal",
                    "module": "ophyd.sim"
                },
                "Imax": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "Signal",
                    "module": "ophyd.signal"
                },
                "center": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "Signal",
                    "module": "ophyd.signal"
                },
                "sigma": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "Signal",
                    "module": "ophyd.signal"
                },
                "noise": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "EnumSignal",
                    "module": "ophyd.sim"
                },
                "noise_multiplier": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "Signal",
                    "module": "ophyd.signal"
                }
            }
        },
        "trivial_flyer": {
            "is_readable": false,
            "is_movable": false,
            "is_flyable": true,
            "classname": "TrivialFlyer",
            "module": "ophyd.sim"
        },
        "rand2": {
            "is_readable": true,
            "is_movable": true,
            "is_flyable": false,
            "classname": "SynPeriodicSignal",
            "module": "ophyd.sim"
        },
        "invariant1": {
            "is_readable": true,
            "is_movable": true,
            "is_flyable": false,
            "classname": "InvariantSignal",
            "module": "ophyd.sim"
        },
        "direct_img_list": {
            "is_readable": true,
            "is_movable": false,
            "is_flyable": false,
            "classname": "DirectImage",
            "module": "ophyd.sim",
            "components": {
                "img": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "SynSignal",
                    "module": "ophyd.sim"
                }
            }
        },
        "sig": {
            "is_readable": true,
            "is_movable": true,
            "is_flyable": false,
            "classname": "Signal",
            "module": "ophyd.signal"
        },
        "sim_m1": {
            "is_readable": true,
            "is_movable": true,
            "is_flyable": false,
            "classname": "EpicsSignal",
            "module": "ophyd.signal"
        },
        "det5": {
            "is_readable": true,
            "is_movable": false,
            "is_flyable": false,
            "classname": "Syn2DGauss",
            "module": "ophyd.sim",
            "components": {
                "val": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "SynSignal",
                    "module": "ophyd.sim"
                },
                "Imax": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "Signal",
                    "module": "ophyd.signal"
                },
                "center": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "Signal",
                    "module": "ophyd.signal"
                },
                "sigma": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "Signal",
                    "module": "ophyd.signal"
                },
                "noise": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "EnumSignal",
                    "module": "ophyd.sim"
                },
                "noise_multiplier": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "Signal",
                    "module": "ophyd.signal"
                }
            }
        },
        "sim_m2": {
            "is_readable": true,
            "is_movable": true,
            "is_flyable": false,
            "classname": "EpicsSignal",
            "module": "ophyd.signal"
        },
        "custom_test_signal": {
            "is_readable": true,
            "is_movable": true,
            "is_flyable": false,
            "classname": "Signal",
            "module": "ophyd.signal"
        },
        "pseudo1x3": {
            "is_readable": true,
            "is_movable": true,
            "is_flyable": false,
            "classname": "SPseudo1x3",
            "module": "ophyd.sim",
            "components": {
                "pseudo1": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "PseudoSingle",
                    "module": "ophyd.pseudopos",
                    "components": {
                        "readback": {
                            "is_readable": true,
                            "is_movable": true,
                            "is_flyable": false,
                            "classname": "AttributeSignal",
                            "module": "ophyd.signal"
                        },
                        "setpoint": {
                            "is_readable": true,
                            "is_movable": true,
                            "is_flyable": false,
                            "classname": "AttributeSignal",
                            "module": "ophyd.signal"
                        }
                    }
                },
                "real1": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "SoftPositioner",
                    "module": "ophyd.positioner"
                },
                "real2": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "SoftPositioner",
                    "module": "ophyd.positioner"
                },
                "real3": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "SoftPositioner",
                    "module": "ophyd.positioner"
                }
            }
        },
        "ab_det": {
            "is_readable": true,
            "is_movable": false,
            "is_flyable": false,
            "classname": "ABDetector",
            "module": "ophyd.sim",
            "components": {
                "a": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "SynSignal",
                    "module": "ophyd.sim"
                },
                "b": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "SynSignal",
                    "module": "ophyd.sim"
                }
            }
        },
        "det2": {
            "is_readable": true,
            "is_movable": false,
            "is_flyable": false,
            "classname": "SynGauss",
            "module": "ophyd.sim",
            "components": {
                "val": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "SynSignal",
                    "module": "ophyd.sim"
                },
                "Imax": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "Signal",
                    "module": "ophyd.signal"
                },
                "center": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "Signal",
                    "module": "ophyd.signal"
                },
                "sigma": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "Signal",
                    "module": "ophyd.signal"
                },
                "noise": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "EnumSignal",
                    "module": "ophyd.sim"
                },
                "noise_multiplier": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "Signal",
                    "module": "ophyd.signal"
                }
            }
        },
        "custom_test_device": {
            "is_readable": true,
            "is_movable": false,
            "is_flyable": false,
            "classname": "Device",
            "module": "ophyd.device"
        },
        "direct_img": {
            "is_readable": true,
            "is_movable": false,
            "is_flyable": false,
            "classname": "DirectImage",
            "module": "ophyd.sim",
            "components": {
                "img": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "SynSignal",
                    "module": "ophyd.sim"
                }
            }
        },
        "motor_no_pos": {
            "is_readable": true,
            "is_movable": true,
            "is_flyable": false,
            "classname": "SynAxisNoPosition",
            "module": "ophyd.sim",
            "components": {
                "readback": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "_ReadbackSignal",
                    "module": "ophyd.sim"
                },
                "setpoint": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "_SetpointSignal",
                    "module": "ophyd.sim"
                },
                "velocity": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "Signal",
                    "module": "ophyd.signal"
                },
                "acceleration": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "Signal",
                    "module": "ophyd.signal"
                },
                "unused": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "Signal",
                    "module": "ophyd.signal"
                }
            }
        },
        "motor_empty_hints1": {
            "is_readable": true,
            "is_movable": true,
            "is_flyable": false,
            "classname": "SynAxisEmptyHints",
            "module": "ophyd.sim",
            "components": {
                "readback": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "_ReadbackSignal",
                    "module": "ophyd.sim"
                },
                "setpoint": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "_SetpointSignal",
                    "module": "ophyd.sim"
                },
                "velocity": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "Signal",
                    "module": "ophyd.signal"
                },
                "acceleration": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "Signal",
                    "module": "ophyd.signal"
                },
                "unused": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "Signal",
                    "module": "ophyd.signal"
                }
            }
        },
        "bool_sig": {
            "is_readable": true,
            "is_movable": true,
            "is_flyable": false,
            "classname": "Signal",
            "module": "ophyd.signal"
        },
        "det3": {
            "is_readable": true,
            "is_movable": false,
            "is_flyable": false,
            "classname": "SynGauss",
            "module": "ophyd.sim",
            "components": {
                "val": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "SynSignal",
                    "module": "ophyd.sim"
                },
                "Imax": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "Signal",
                    "module": "ophyd.signal"
                },
                "center": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "Signal",
                    "module": "ophyd.signal"
                },
                "sigma": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "Signal",
                    "module": "ophyd.signal"
                },
                "noise": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "EnumSignal",
                    "module": "ophyd.sim"
                },
                "noise_multiplier": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "Signal",
                    "module": "ophyd.signal"
                }
            }
        },
        "sim_m4": {
            "is_readable": true,
            "is_movable": true,
            "is_flyable": false,
            "classname": "EpicsSignal",
            "module": "ophyd.signal"
        },
        "signal": {
            "is_readable": true,
            "is_movable": true,
            "is_flyable": false,
            "classname": "SynSignal",
            "module": "ophyd.sim"
        },
        "det_with_count_time": {
            "is_readable": true,
            "is_movable": false,
            "is_flyable": false,
            "classname": "DetWithCountTime",
            "module": "ophyd.sim",
            "components": {
                "intensity": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "SynSignal",
                    "module": "ophyd.sim"
                },
                "count_time": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "Signal",
                    "module": "ophyd.signal"
                }
            }
        },
        "sim_bundle_B": {
            "is_readable": true,
            "is_movable": false,
            "is_flyable": false,
            "classname": "SimBundle",
            "module": "__main__",
            "components": {
                "mtrs": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "SimStage",
                    "module": "__main__",
                    "components": {
                        "x": {
                            "is_readable": true,
                            "is_movable": true,
                            "is_flyable": false,
                            "classname": "SynAxis",
                            "module": "ophyd.sim",
                            "components": {
                                "readback": {
                                    "is_readable": true,
                                    "is_movable": true,
                                    "is_flyable": false,
                                    "classname": "_ReadbackSignal",
                                    "module": "ophyd.sim"
                                },
                                "setpoint": {
                                    "is_readable": true,
                                    "is_movable": true,
                                    "is_flyable": false,
                                    "classname": "_SetpointSignal",
                                    "module": "ophyd.sim"
                                },
                                "velocity": {
                                    "is_readable": true,
                                    "is_movable": true,
                                    "is_flyable": false,
                                    "classname": "Signal",
                                    "module": "ophyd.signal"
                                },
                                "acceleration": {
                                    "is_readable": true,
                                    "is_movable": true,
                                    "is_flyable": false,
                                    "classname": "Signal",
                                    "module": "ophyd.signal"
                                },
                                "unused": {
                                    "is_readable": true,
                                    "is_movable": true,
                                    "is_flyable": false,
                                    "classname": "Signal",
                                    "module": "ophyd.signal"
                                }
                            }
                        },
                        "y": {
                            "is_readable": true,
                            "is_movable": true,
                            "is_flyable": false,
                            "classname": "SynAxis",
                            "module": "ophyd.sim",
                            "components": {
                                "readback": {
                                    "is_readable": true,
                                    "is_movable": true,
                                    "is_flyable": false,
                                    "classname": "_ReadbackSignal",
                                    "module": "ophyd.sim"
                                },
                                "setpoint": {
                                    "is_readable": true,
                                    "is_movable": true,
                                    "is_flyable": false,
                                    "classname": "_SetpointSignal",
                                    "module": "ophyd.sim"
                                },
                                "velocity": {
                                    "is_readable": true,
                                    "is_movable": true,
                                    "is_flyable": false,
                                    "classname": "Signal",
                                    "module": "ophyd.signal"
                                },
                                "acceleration": {
                                    "is_readable": true,
                                    "is_movable": true,
                                    "is_flyable": false,
                                    "classname": "Signal",
                                    "module": "ophyd.signal"
                                },
                                "unused": {
                                    "is_readable": true,
                                    "is_movable": true,
                                    "is_flyable": false,
                                    "classname": "Signal",
                                    "module": "ophyd.signal"
                                }
                            }
                        },
                        "z": {
                            "is_readable": true,
                            "is_movable": true,
                            "is_flyable": false,
                            "classname": "SynAxis",
                            "module": "ophyd.sim",
                            "components": {
                                "readback": {
                                    "is_readable": true,
                                    "is_movable": true,
                                    "is_flyable": false,
                                    "classname": "_ReadbackSignal",
                                    "module": "ophyd.sim"
                                },
                                "setpoint": {
                                    "is_readable": true,
                                    "is_movable": true,
                                    "is_flyable": false,
                                    "classname": "_SetpointSignal",
                                    "module": "ophyd.sim"
                                },
                                "velocity": {
                                    "is_readable": true,
                                    "is_movable": true,
                                    "is_flyable": false,
                                    "classname": "Signal",
                                    "module": "ophyd.signal"
                                },
                                "acceleration": {
                                    "is_readable": true,
                                    "is_movable": true,
                                    "is_flyable": false,
                                    "classname": "Signal",
                                    "module": "ophyd.signal"
                                },
                                "unused": {
                                    "is_readable": true,
                                    "is_movable": true,
                                    "is_flyable": false,
                                    "classname": "Signal",
                                    "module": "ophyd.signal"
                                }
                            }
                        }
                    }
                },
                "dets": {
                    "is_readable": true,
                    "is_movable": false,
                    "is_flyable": false,
                    "classname": "SimDetectors",
                    "module": "__main__",
                    "components": {
                        "det_A": {
                            "is_readable": true,
                            "is_movable": false,
                            "is_flyable": false,
                            "classname": "SynGauss",
                            "module": "ophyd.sim",
                            "components": {
                                "val": {
                                    "is_readable": true,
                                    "is_movable": true,
                                    "is_flyable": false,
                                    "classname": "SynSignal",
                                    "module": "ophyd.sim"
                                },
                                "Imax": {
                                    "is_readable": true,
                                    "is_movable": true,
                                    "is_flyable": false,
                                    "classname": "Signal",
                                    "module": "ophyd.signal"
                                },
                                "center": {
                                    "is_readable": true,
                                    "is_movable": true,
                                    "is_flyable": false,
                                    "classname": "Signal",
                                    "module": "ophyd.signal"
                                },
                                "sigma": {
                                    "is_readable": true,
                                    "is_movable": true,
                                    "is_flyable": false,
                                    "classname": "Signal",
                                    "module": "ophyd.signal"
                                },
                                "noise": {
                                    "is_readable": true,
                                    "is_movable": true,
                                    "is_flyable": false,
                                    "classname": "EnumSignal",
                                    "module": "ophyd.sim"
                                },
                                "noise_multiplier": {
                                    "is_readable": true,
                                    "is_movable": true,
                                    "is_flyable": false,
                                    "classname": "Signal",
                                    "module": "ophyd.signal"
                                }
                            }
                        },
                        "det_B": {
                            "is_readable": true,
                            "is_movable": false,
                            "is_flyable": false,
                            "classname": "SynGauss",
                            "module": "ophyd.sim",
                            "components": {
                                "val": {
                                    "is_readable": true,
                                    "is_movable": true,
                                    "is_flyable": false,
                                    "classname": "SynSignal",
                                    "module": "ophyd.sim"
                                },
                                "Imax": {
                                    "is_readable": true,
                                    "is_movable": true,
                                    "is_flyable": false,
                                    "classname": "Signal",
                                    "module": "ophyd.signal"
                                },
                                "center": {
                                    "is_readable": true,
                                    "is_movable": true,
                                    "is_flyable": false,
                                    "classname": "Signal",
                                    "module": "ophyd.signal"
                                },
                                "sigma": {
                                    "is_readable": true,
                                    "is_movable": true,
                                    "is_flyable": false,
                                    "classname": "Signal",
                                    "module": "ophyd.signal"
                                },
                                "noise": {
                                    "is_readable": true,
                                    "is_movable": true,
                                    "is_flyable": false,
                                    "classname": "EnumSignal",
                                    "module": "ophyd.sim"
                                },
                                "noise_multiplier": {
                                    "is_readable": true,
                                    "is_movable": true,
                                    "is_flyable": false,
                                    "classname": "Signal",
                                    "module": "ophyd.signal"
                                }
                            }
                        }
                    }
                }
            }
        },
        "rand": {
            "is_readable": true,
            "is_movable": true,
            "is_flyable": false,
            "classname": "SynPeriodicSignal",
            "module": "ophyd.sim"
        },
        "pseudo3x3": {
            "is_readable": true,
            "is_movable": true,
            "is_flyable": false,
            "classname": "SPseudo3x3",
            "module": "ophyd.sim",
            "components": {
                "pseudo1": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "PseudoSingle",
                    "module": "ophyd.pseudopos",
                    "components": {
                        "readback": {
                            "is_readable": true,
                            "is_movable": true,
                            "is_flyable": false,
                            "classname": "AttributeSignal",
                            "module": "ophyd.signal"
                        },
                        "setpoint": {
                            "is_readable": true,
                            "is_movable": true,
                            "is_flyable": false,
                            "classname": "AttributeSignal",
                            "module": "ophyd.signal"
                        }
                    }
                },
                "pseudo2": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "PseudoSingle",
                    "module": "ophyd.pseudopos",
                    "components": {
                        "readback": {
                            "is_readable": true,
                            "is_movable": true,
                            "is_flyable": false,
                            "classname": "AttributeSignal",
                            "module": "ophyd.signal"
                        },
                        "setpoint": {
                            "is_readable": true,
                            "is_movable": true,
                            "is_flyable": false,
                            "classname": "AttributeSignal",
                            "module": "ophyd.signal"
                        }
                    }
                },
                "pseudo3": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "PseudoSingle",
                    "module": "ophyd.pseudopos",
                    "components": {
                        "readback": {
                            "is_readable": true,
                            "is_movable": true,
                            "is_flyable": false,
                            "classname": "AttributeSignal",
                            "module": "ophyd.signal"
                        },
                        "setpoint": {
                            "is_readable": true,
                            "is_movable": true,
                            "is_flyable": false,
                            "classname": "AttributeSignal",
                            "module": "ophyd.signal"
                        }
                    }
                },
                "real1": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "SoftPositioner",
                    "module": "ophyd.positioner"
                },
                "real2": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "SoftPositioner",
                    "module": "ophyd.positioner"
                },
                "real3": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "SoftPositioner",
                    "module": "ophyd.positioner"
                },
                "sig": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "Signal",
                    "module": "ophyd.signal"
                }
            }
        },
        "motor_no_hints2": {
            "is_readable": true,
            "is_movable": true,
            "is_flyable": false,
            "classname": "SynAxisNoHints",
            "module": "ophyd.sim",
            "components": {
                "readback": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "_ReadbackSignal",
                    "module": "ophyd.sim"
                },
                "setpoint": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "_SetpointSignal",
                    "module": "ophyd.sim"
                },
                "velocity": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "Signal",
                    "module": "ophyd.signal"
                },
                "acceleration": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "Signal",
                    "module": "ophyd.signal"
                },
                "unused": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "Signal",
                    "module": "ophyd.signal"
                }
            }
        },
        "sim_m3": {
            "is_readable": true,
            "is_movable": true,
            "is_flyable": false,
            "classname": "EpicsSignal",
            "module": "ophyd.signal"
        },
        "motor2": {
            "is_readable": true,
            "is_movable": true,
            "is_flyable": false,
            "classname": "SynAxis",
            "module": "ophyd.sim",
            "components": {
                "readback": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "_ReadbackSignal",
                    "module": "ophyd.sim"
                },
                "setpoint": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "_SetpointSignal",
                    "module": "ophyd.sim"
                },
                "velocity": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "Signal",
                    "module": "ophyd.signal"
                },
                "acceleration": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "Signal",
                    "module": "ophyd.signal"
                },
                "unused": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "Signal",
                    "module": "ophyd.signal"
                }
            }
        },
        "jittery_motor1": {
            "is_readable": true,
            "is_movable": true,
            "is_flyable": false,
            "classname": "SynAxis",
            "module": "ophyd.sim",
            "components": {
                "readback": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "_ReadbackSignal",
                    "module": "ophyd.sim"
                },
                "setpoint": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "_SetpointSignal",
                    "module": "ophyd.sim"
                },
                "velocity": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "Signal",
                    "module": "ophyd.signal"
                },
                "acceleration": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "Signal",
                    "module": "ophyd.signal"
                },
                "unused": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "Signal",
                    "module": "ophyd.signal"
                }
            }
        },
        "det4": {
            "is_readable": true,
            "is_movable": false,
            "is_flyable": false,
            "classname": "Syn2DGauss",
            "module": "ophyd.sim",
            "components": {
                "val": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "SynSignal",
                    "module": "ophyd.sim"
                },
                "Imax": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "Signal",
                    "module": "ophyd.signal"
                },
                "center": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "Signal",
                    "module": "ophyd.signal"
                },
                "sigma": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "Signal",
                    "module": "ophyd.signal"
                },
                "noise": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "EnumSignal",
                    "module": "ophyd.sim"
                },
                "noise_multiplier": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "Signal",
                    "module": "ophyd.signal"
                }
            }
        },
        "det_with_conf": {
            "is_readable": true,
            "is_movable": false,
            "is_flyable": false,
            "classname": "DetWithConf",
            "module": "ophyd.sim",
            "components": {
                "a": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "SynSignal",
                    "module": "ophyd.sim"
                },
                "b": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "SynSignal",
                    "module": "ophyd.sim"
                },
                "c": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "SynSignal",
                    "module": "ophyd.sim"
                },
                "d": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "SynSignal",
                    "module": "ophyd.sim"
                }
            }
        },
        "flyer1": {
            "is_readable": false,
            "is_movable": false,
            "is_flyable": true,
            "classname": "MockFlyer",
            "module": "ophyd.sim"
        },
        "motor3": {
            "is_readable": true,
            "is_movable": true,
            "is_flyable": false,
            "classname": "SynAxis",
            "module": "ophyd.sim",
            "components": {
                "readback": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "_ReadbackSignal",
                    "module": "ophyd.sim"
                },
                "setpoint": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "_SetpointSignal",
                    "module": "ophyd.sim"
                },
                "velocity": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "Signal",
                    "module": "ophyd.signal"
                },
                "acceleration": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "Signal",
                    "module": "ophyd.signal"
                },
                "unused": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "Signal",
                    "module": "ophyd.signal"
                }
            }
        },
        "new_trivial_flyer": {
            "is_readable": false,
            "is_movable": false,
            "is_flyable": true,
            "classname": "NewTrivialFlyer",
            "module": "ophyd.sim"
        },
        "custom_test_flyer": {
            "is_readable": false,
            "is_movable": false,
            "is_flyable": true,
            "classname": "MockFlyer",
            "module": "ophyd.sim"
        },
        "flyer2": {
            "is_readable": false,
            "is_movable": false,
            "is_flyable": true,
            "classname": "MockFlyer",
            "module": "ophyd.sim"
        },
        "motor": {
            "is_readable": true,
            "is_movable": true,
            "is_flyable": false,
            "classname": "SynAxis",
            "module": "ophyd.sim",
            "components": {
                "readback": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "_ReadbackSignal",
                    "module": "ophyd.sim"
                },
                "setpoint": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "_SetpointSignal",
                    "module": "ophyd.sim"
                },
                "velocity": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "Signal",
                    "module": "ophyd.signal"
                },
                "acceleration": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "Signal",
                    "module": "ophyd.signal"
                },
                "unused": {
                    "is_readable": true,
                    "is_movable": true,
                    "is_flyable": false,
                    "classname": "Signal",
                    "module": "ophyd.signal"
                }
            }
        }
    },
    "devices_allowed_uid": "6c737d64-1567-42be-8d91-713dacda17cf"
};

const mockPlansAllowedResponse = {
    "success": true,
    "msg": "",
    "plans_allowed": {
        "log_scan": {
            "name": "log_scan",
            "properties": {
                "is_generator": true
            },
            "parameters": [
                {
                    "name": "detectors",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "list of 'readable' objects"
                },
                {
                    "name": "motor",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "any 'settable' object (motor, temp controller, etc.)"
                },
                {
                    "name": "start",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "starting position of motor"
                },
                {
                    "name": "stop",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "ending position of motor"
                },
                {
                    "name": "num",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "number of steps"
                },
                {
                    "name": "per_step",
                    "kind": {
                        "name": "KEYWORD_ONLY",
                        "value": 3
                    },
                    "description": "hook for customizing action of inner loop (messages per step)\nExpected signature: ``f(detectors, motor, step)``",
                    "default": "None"
                },
                {
                    "name": "md",
                    "kind": {
                        "name": "KEYWORD_ONLY",
                        "value": 3
                    },
                    "description": "metadata",
                    "default": "None"
                }
            ],
            "module": "bluesky.plans",
            "description": "Scan over one variable in log-spaced steps."
        },
        "spiral_square": {
            "name": "spiral_square",
            "properties": {
                "is_generator": true
            },
            "parameters": [
                {
                    "name": "detectors",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "list of 'readable' objects"
                },
                {
                    "name": "x_motor",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "any 'settable' object (motor, temp controller, etc.)"
                },
                {
                    "name": "y_motor",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "any 'settable' object (motor, temp controller, etc.)"
                },
                {
                    "name": "x_center",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "x center"
                },
                {
                    "name": "y_center",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "y center"
                },
                {
                    "name": "x_range",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "x width of spiral"
                },
                {
                    "name": "y_range",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "y width of spiral"
                },
                {
                    "name": "x_num",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "number of x axis points"
                },
                {
                    "name": "y_num",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "Number of y axis points."
                },
                {
                    "name": "per_step",
                    "kind": {
                        "name": "KEYWORD_ONLY",
                        "value": 3
                    },
                    "description": "hook for cutomizing action of inner loop (messages per step).\nSee docstring of :func:`bluesky.plans.one_nd_step` (the default) for\ndetails.",
                    "default": "None"
                },
                {
                    "name": "md",
                    "kind": {
                        "name": "KEYWORD_ONLY",
                        "value": 3
                    },
                    "description": "metadata",
                    "default": "None"
                }
            ],
            "module": "bluesky.plans",
            "description": "Absolute square spiral scan, centered around (x_center, y_center)"
        },
        "count": {
            "name": "count",
            "properties": {
                "is_generator": true
            },
            "parameters": [
                {
                    "name": "detectors",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "list of 'readable' objects"
                },
                {
                    "name": "num",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "number of readings to take; default is 1\n\nIf None, capture data until canceled",
                    "default": "1"
                },
                {
                    "name": "delay",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "Time delay in seconds between successive readings; default is 0.",
                    "default": "None"
                },
                {
                    "name": "per_shot",
                    "kind": {
                        "name": "KEYWORD_ONLY",
                        "value": 3
                    },
                    "description": "hook for customizing action of inner loop (messages per step)\nExpected signature ::\n\n   def f(detectors: Iterable[OphydObj]) -> Generator[Msg]:\n       ...",
                    "default": "None"
                },
                {
                    "name": "md",
                    "kind": {
                        "name": "KEYWORD_ONLY",
                        "value": 3
                    },
                    "description": "metadata",
                    "default": "None"
                }
            ],
            "module": "bluesky.plans",
            "description": "Take one or more readings from detectors."
        },
        "tune_centroid": {
            "name": "tune_centroid",
            "properties": {
                "is_generator": true
            },
            "parameters": [
                {
                    "name": "detectors",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "list of 'readable' objects"
                },
                {
                    "name": "signal",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "detector field whose output is to maximize"
                },
                {
                    "name": "motor",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "any 'settable' object (motor, temp controller, etc.)"
                },
                {
                    "name": "start",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "start of range"
                },
                {
                    "name": "stop",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "end of range, note: start < stop"
                },
                {
                    "name": "min_step",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "smallest step size to use."
                },
                {
                    "name": "num",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "number of points with each traversal, default = 10",
                    "default": "10"
                },
                {
                    "name": "step_factor",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "used in calculating new range after each pass\n\nnote: step_factor > 1.0, default = 3",
                    "default": "3.0"
                },
                {
                    "name": "snake",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "if False (default), always scan from start to stop",
                    "default": "False"
                },
                {
                    "name": "md",
                    "kind": {
                        "name": "KEYWORD_ONLY",
                        "value": 3
                    },
                    "description": "metadata",
                    "default": "None"
                }
            ],
            "module": "bluesky.plans",
            "description": "plan: tune a motor to the centroid of signal(motor)"
        },
        "rel_grid_scan": {
            "name": "rel_grid_scan",
            "properties": {
                "is_generator": true
            },
            "parameters": [
                {
                    "name": "detectors",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "list of 'readable' objects"
                },
                {
                    "name": "args",
                    "kind": {
                        "name": "VAR_POSITIONAL",
                        "value": 2
                    }
                },
                {
                    "name": "snake_axes",
                    "kind": {
                        "name": "KEYWORD_ONLY",
                        "value": 3
                    },
                    "description": "which axes should be snaked, either ``False`` (do not snake any axes),\n``True`` (snake all axes) or a list of axes to snake. \"Snaking\" an axis\nis defined as following snake-like, winding trajectory instead of a\nsimple left-to-right trajectory. The elements of the list are motors\nthat are listed in `args`. The list must not contain the slowest\n(first) motor, since it can't be snaked.",
                    "default": "None"
                },
                {
                    "name": "per_step",
                    "kind": {
                        "name": "KEYWORD_ONLY",
                        "value": 3
                    },
                    "description": "hook for customizing action of inner loop (messages per step).\nSee docstring of :func:`bluesky.plan_stubs.one_nd_step` (the default)\nfor details.",
                    "default": "None"
                },
                {
                    "name": "md",
                    "kind": {
                        "name": "KEYWORD_ONLY",
                        "value": 3
                    },
                    "description": "metadata",
                    "default": "None"
                }
            ],
            "module": "bluesky.plans",
            "description": "Scan over a mesh relative to current position."
        },
        "count_bundle_test": {
            "name": "count_bundle_test",
            "properties": {
                "is_generator": true
            },
            "parameters": [
                {
                    "name": "detectors",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "annotation": {
                        "type": "typing.List[DetList]",
                        "devices": {
                            "DetList": [
                                "det",
                                "det1",
                                "det2",
                                "det3",
                                "sim_bundle_A",
                                "sim_bundle_A.dets",
                                "sim_bundle_A.dets.det_A",
                                "sim_bundle_A.dets.det_A.center",
                                "sim_bundle_A.dets.det_A.Imax",
                                "sim_bundle_A.dets.det_A.noise",
                                "sim_bundle_A.dets.det_A.noise_multiplier",
                                "sim_bundle_A.dets.det_A.sigma",
                                "sim_bundle_A.dets.det_A.val",
                                "sim_bundle_A.dets.det_B",
                                "sim_bundle_A.dets.det_B.center",
                                "sim_bundle_A.dets.det_B.Imax",
                                "sim_bundle_A.dets.det_B.noise",
                                "sim_bundle_A.dets.det_B.noise_multiplier",
                                "sim_bundle_A.dets.det_B.sigma",
                                "sim_bundle_A.dets.det_B.val",
                                "sim_bundle_A.mtrs",
                                "sim_bundle_A.mtrs.x",
                                "sim_bundle_A.mtrs.x.acceleration",
                                "sim_bundle_A.mtrs.x.readback",
                                "sim_bundle_A.mtrs.x.setpoint",
                                "sim_bundle_A.mtrs.x.unused",
                                "sim_bundle_A.mtrs.x.velocity",
                                "sim_bundle_A.mtrs.y",
                                "sim_bundle_A.mtrs.y.acceleration",
                                "sim_bundle_A.mtrs.y.readback",
                                "sim_bundle_A.mtrs.y.setpoint",
                                "sim_bundle_A.mtrs.y.unused",
                                "sim_bundle_A.mtrs.y.velocity",
                                "sim_bundle_A.mtrs.z",
                                "sim_bundle_A.mtrs.z.acceleration",
                                "sim_bundle_A.mtrs.z.readback",
                                "sim_bundle_A.mtrs.z.setpoint",
                                "sim_bundle_A.mtrs.z.unused",
                                "sim_bundle_A.mtrs.z.velocity",
                                "sim_bundle_B",
                                "sim_bundle_B.dets",
                                "sim_bundle_B.dets.det_A",
                                "sim_bundle_B.dets.det_A.center",
                                "sim_bundle_B.dets.det_A.Imax",
                                "sim_bundle_B.dets.det_A.noise",
                                "sim_bundle_B.dets.det_A.noise_multiplier",
                                "sim_bundle_B.dets.det_A.sigma",
                                "sim_bundle_B.dets.det_A.val",
                                "sim_bundle_B.dets.det_B",
                                "sim_bundle_B.dets.det_B.center",
                                "sim_bundle_B.dets.det_B.Imax",
                                "sim_bundle_B.dets.det_B.noise",
                                "sim_bundle_B.dets.det_B.noise_multiplier",
                                "sim_bundle_B.dets.det_B.sigma",
                                "sim_bundle_B.dets.det_B.val",
                                "sim_bundle_B.mtrs",
                                "sim_bundle_B.mtrs.x",
                                "sim_bundle_B.mtrs.x.acceleration",
                                "sim_bundle_B.mtrs.x.readback",
                                "sim_bundle_B.mtrs.x.setpoint",
                                "sim_bundle_B.mtrs.x.unused",
                                "sim_bundle_B.mtrs.x.velocity",
                                "sim_bundle_B.mtrs.y",
                                "sim_bundle_B.mtrs.y.acceleration",
                                "sim_bundle_B.mtrs.y.readback",
                                "sim_bundle_B.mtrs.y.setpoint",
                                "sim_bundle_B.mtrs.y.unused",
                                "sim_bundle_B.mtrs.y.velocity",
                                "sim_bundle_B.mtrs.z",
                                "sim_bundle_B.mtrs.z.acceleration",
                                "sim_bundle_B.mtrs.z.readback",
                                "sim_bundle_B.mtrs.z.setpoint",
                                "sim_bundle_B.mtrs.z.unused",
                                "sim_bundle_B.mtrs.z.velocity"
                            ]
                        }
                    }
                },
                {
                    "name": "num",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "default": "1"
                },
                {
                    "name": "delay",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "default": "None"
                },
                {
                    "name": "per_shot",
                    "kind": {
                        "name": "KEYWORD_ONLY",
                        "value": 3
                    },
                    "default": "None"
                },
                {
                    "name": "md",
                    "kind": {
                        "name": "KEYWORD_ONLY",
                        "value": 3
                    },
                    "default": "None"
                }
            ],
            "module": "__main__"
        },
        "sim_multirun_plan_nested": {
            "name": "sim_multirun_plan_nested",
            "properties": {
                "is_generator": true
            },
            "parameters": [
                {
                    "name": "npts",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "The number of measurements in the outer run. Inner run will contain 'npts+1' measurements.",
                    "annotation": {
                        "type": "int"
                    }
                },
                {
                    "name": "delay",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "Delay between measurements.",
                    "annotation": {
                        "type": "float"
                    },
                    "default": "1.0"
                }
            ],
            "module": "__main__",
            "description": "Simulated multi-run plan: two nested runs. The plan is included for testing purposes only."
        },
        "rel_spiral": {
            "name": "rel_spiral",
            "properties": {
                "is_generator": true
            },
            "parameters": [
                {
                    "name": "detectors",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    }
                },
                {
                    "name": "x_motor",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "any 'settable' object (motor, temp controller, etc.)"
                },
                {
                    "name": "y_motor",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "any 'settable' object (motor, temp controller, etc.)"
                },
                {
                    "name": "x_range",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "x width of spiral"
                },
                {
                    "name": "y_range",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "y width of spiral"
                },
                {
                    "name": "dr",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "Delta radius along the minor axis of the ellipse."
                },
                {
                    "name": "nth",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "Number of theta steps"
                },
                {
                    "name": "dr_y",
                    "kind": {
                        "name": "KEYWORD_ONLY",
                        "value": 3
                    },
                    "description": "Delta radius along the major axis of the ellipse. If None, it\ndefaults to dr.",
                    "default": "None"
                },
                {
                    "name": "tilt",
                    "kind": {
                        "name": "KEYWORD_ONLY",
                        "value": 3
                    },
                    "description": "Tilt angle in radians, default 0.0",
                    "default": "0.0"
                },
                {
                    "name": "per_step",
                    "kind": {
                        "name": "KEYWORD_ONLY",
                        "value": 3
                    },
                    "description": "hook for customizing action of inner loop (messages per step).\nSee docstring of :func:`bluesky.plan_stubs.one_nd_step` (the default)\nfor details.",
                    "default": "None"
                },
                {
                    "name": "md",
                    "kind": {
                        "name": "KEYWORD_ONLY",
                        "value": 3
                    },
                    "description": "metadata",
                    "default": "None"
                }
            ],
            "module": "bluesky.plans",
            "description": "Relative spiral scan"
        },
        "scan": {
            "name": "scan",
            "properties": {
                "is_generator": true
            },
            "parameters": [
                {
                    "name": "detectors",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "list of 'readable' objects"
                },
                {
                    "name": "args",
                    "kind": {
                        "name": "VAR_POSITIONAL",
                        "value": 2
                    },
                    "description": "For one dimension, ``motor, start, stop``.\nIn general:\n\n.. code-block:: python\n\n    motor1, start1, stop1,\n    motor2, start2, stop2,\n    ...,\n    motorN, startN, stopN\n\nMotors can be any 'settable' object (motor, temp controller, etc.)"
                },
                {
                    "name": "num",
                    "kind": {
                        "name": "KEYWORD_ONLY",
                        "value": 3
                    },
                    "description": "number of points",
                    "default": "None"
                },
                {
                    "name": "per_step",
                    "kind": {
                        "name": "KEYWORD_ONLY",
                        "value": 3
                    },
                    "description": "hook for customizing action of inner loop (messages per step).\nSee docstring of :func:`bluesky.plan_stubs.one_nd_step` (the default)\nfor details.",
                    "default": "None"
                },
                {
                    "name": "md",
                    "kind": {
                        "name": "KEYWORD_ONLY",
                        "value": 3
                    },
                    "description": "metadata",
                    "default": "None"
                }
            ],
            "module": "bluesky.plans",
            "description": "Scan over one multi-motor trajectory."
        },
        "marked_up_count": {
            "name": "marked_up_count",
            "properties": {
                "is_generator": true
            },
            "parameters": [
                {
                    "name": "detectors",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "annotation": {
                        "type": "typing.List[typing.Any]"
                    }
                },
                {
                    "name": "num",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "annotation": {
                        "type": "int"
                    },
                    "default": "1"
                },
                {
                    "name": "delay",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "annotation": {
                        "type": "typing.Optional[float]"
                    },
                    "default": "None"
                },
                {
                    "name": "md",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "annotation": {
                        "type": "typing.Optional[typing.Dict[str, typing.Any]]"
                    },
                    "default": "None"
                }
            ],
            "module": "__main__"
        },
        "fly": {
            "name": "fly",
            "properties": {
                "is_generator": true
            },
            "parameters": [
                {
                    "name": "flyers",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "objects that support the flyer interface"
                },
                {
                    "name": "md",
                    "kind": {
                        "name": "KEYWORD_ONLY",
                        "value": 3
                    },
                    "description": "metadata",
                    "default": "None"
                }
            ],
            "module": "bluesky.plans",
            "description": "Perform a fly scan with one or more 'flyers'."
        },
        "inner_product_scan": {
            "name": "inner_product_scan",
            "properties": {
                "is_generator": true
            },
            "parameters": [
                {
                    "name": "detectors",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    }
                },
                {
                    "name": "num",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    }
                },
                {
                    "name": "args",
                    "kind": {
                        "name": "VAR_POSITIONAL",
                        "value": 2
                    }
                },
                {
                    "name": "per_step",
                    "kind": {
                        "name": "KEYWORD_ONLY",
                        "value": 3
                    },
                    "default": "None"
                },
                {
                    "name": "md",
                    "kind": {
                        "name": "KEYWORD_ONLY",
                        "value": 3
                    },
                    "default": "None"
                }
            ],
            "module": "bluesky.plans"
        },
        "spiral_fermat": {
            "name": "spiral_fermat",
            "properties": {
                "is_generator": true
            },
            "parameters": [
                {
                    "name": "detectors",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "list of 'readable' objects"
                },
                {
                    "name": "x_motor",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "any 'settable' object (motor, temp controller, etc.)"
                },
                {
                    "name": "y_motor",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "any 'settable' object (motor, temp controller, etc.)"
                },
                {
                    "name": "x_start",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "x center"
                },
                {
                    "name": "y_start",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "y center"
                },
                {
                    "name": "x_range",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "x width of spiral"
                },
                {
                    "name": "y_range",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "y width of spiral"
                },
                {
                    "name": "dr",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "delta radius"
                },
                {
                    "name": "factor",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "radius gets divided by this"
                },
                {
                    "name": "dr_y",
                    "kind": {
                        "name": "KEYWORD_ONLY",
                        "value": 3
                    },
                    "description": "Delta radius along the major axis of the ellipse, if not specifed\ndefaults to dr.",
                    "default": "None"
                },
                {
                    "name": "tilt",
                    "kind": {
                        "name": "KEYWORD_ONLY",
                        "value": 3
                    },
                    "description": "Tilt angle in radians, default 0.0",
                    "default": "0.0"
                },
                {
                    "name": "per_step",
                    "kind": {
                        "name": "KEYWORD_ONLY",
                        "value": 3
                    },
                    "description": "hook for customizing action of inner loop (messages per step).\nSee docstring of :func:`bluesky.plan_stubs.one_nd_step` (the default)\nfor details.",
                    "default": "None"
                },
                {
                    "name": "md",
                    "kind": {
                        "name": "KEYWORD_ONLY",
                        "value": 3
                    },
                    "description": "metadata",
                    "default": "None"
                }
            ],
            "module": "bluesky.plans",
            "description": "Absolute fermat spiral scan, centered around (x_start, y_start)"
        },
        "rel_spiral_fermat": {
            "name": "rel_spiral_fermat",
            "properties": {
                "is_generator": true
            },
            "parameters": [
                {
                    "name": "detectors",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "list of 'readable' objects"
                },
                {
                    "name": "x_motor",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "any 'settable' object (motor, temp controller, etc.)"
                },
                {
                    "name": "y_motor",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "any 'settable' object (motor, temp controller, etc.)"
                },
                {
                    "name": "x_range",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "x width of spiral"
                },
                {
                    "name": "y_range",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "y width of spiral"
                },
                {
                    "name": "dr",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "delta radius"
                },
                {
                    "name": "factor",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "radius gets divided by this"
                },
                {
                    "name": "dr_y",
                    "kind": {
                        "name": "KEYWORD_ONLY",
                        "value": 3
                    },
                    "description": "Delta radius along the major axis of the ellipse, if not specifed\ndefaults to dr",
                    "default": "None"
                },
                {
                    "name": "tilt",
                    "kind": {
                        "name": "KEYWORD_ONLY",
                        "value": 3
                    },
                    "description": "Tilt angle in radians, default 0.0",
                    "default": "0.0"
                },
                {
                    "name": "per_step",
                    "kind": {
                        "name": "KEYWORD_ONLY",
                        "value": 3
                    },
                    "description": "hook for customizing action of inner loop (messages per step).\nSee docstring of :func:`bluesky.plan_stubs.one_nd_step` (the default)\nfor details.",
                    "default": "None"
                },
                {
                    "name": "md",
                    "kind": {
                        "name": "KEYWORD_ONLY",
                        "value": 3
                    },
                    "description": "metadata",
                    "default": "None"
                }
            ],
            "module": "bluesky.plans",
            "description": "Relative fermat spiral scan"
        },
        "adaptive_scan": {
            "name": "adaptive_scan",
            "properties": {
                "is_generator": true
            },
            "parameters": [
                {
                    "name": "detectors",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "list of 'readable' objects"
                },
                {
                    "name": "target_field",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "data field whose output is the focus of the adaptive tuning"
                },
                {
                    "name": "motor",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "any 'settable' object (motor, temp controller, etc.)"
                },
                {
                    "name": "start",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "starting position of motor"
                },
                {
                    "name": "stop",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "ending position of motor"
                },
                {
                    "name": "min_step",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "smallest step for fast-changing regions"
                },
                {
                    "name": "max_step",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "largest step for slow-chaning regions"
                },
                {
                    "name": "target_delta",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "desired fractional change in detector signal between steps"
                },
                {
                    "name": "backstep",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "whether backward steps are allowed -- this is concern with some motors"
                },
                {
                    "name": "threshold",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "threshold for going backward and rescanning a region, default is 0.8",
                    "default": "0.8"
                },
                {
                    "name": "md",
                    "kind": {
                        "name": "KEYWORD_ONLY",
                        "value": 3
                    },
                    "description": "metadata",
                    "default": "None"
                }
            ],
            "module": "bluesky.plans",
            "description": "Scan over one variable with adaptively tuned step size."
        },
        "rel_scan": {
            "name": "rel_scan",
            "properties": {
                "is_generator": true
            },
            "parameters": [
                {
                    "name": "detectors",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "list of 'readable' objects"
                },
                {
                    "name": "args",
                    "kind": {
                        "name": "VAR_POSITIONAL",
                        "value": 2
                    },
                    "description": "For one dimension, ``motor, start, stop``.\nIn general:\n\n.. code-block:: python\n\n    motor1, start1, stop1,\n    motor2, start2, start2,\n    ...,\n    motorN, startN, stopN,\n\nMotors can be any 'settable' object (motor, temp controller, etc.)"
                },
                {
                    "name": "num",
                    "kind": {
                        "name": "KEYWORD_ONLY",
                        "value": 3
                    },
                    "description": "number of points",
                    "default": "None"
                },
                {
                    "name": "per_step",
                    "kind": {
                        "name": "KEYWORD_ONLY",
                        "value": 3
                    },
                    "description": "hook for customizing action of inner loop (messages per step).\nSee docstring of :func:`bluesky.plan_stubs.one_nd_step` (the default)\nfor details.",
                    "default": "None"
                },
                {
                    "name": "md",
                    "kind": {
                        "name": "KEYWORD_ONLY",
                        "value": 3
                    },
                    "description": "metadata",
                    "default": "None"
                }
            ],
            "module": "bluesky.plans",
            "description": "Scan over one multi-motor trajectory relative to current position."
        },
        "tweak": {
            "name": "tweak",
            "properties": {
                "is_generator": true
            },
            "parameters": [
                {
                    "name": "detector",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    }
                },
                {
                    "name": "target_field",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "data field whose output is the focus of the adaptive tuning"
                },
                {
                    "name": "motor",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    }
                },
                {
                    "name": "step",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "initial suggestion for step size"
                },
                {
                    "name": "md",
                    "kind": {
                        "name": "KEYWORD_ONLY",
                        "value": 3
                    },
                    "description": "metadata",
                    "default": "None"
                }
            ],
            "module": "bluesky.plans",
            "description": "Move and motor and read a detector with an interactive prompt."
        },
        "ramp_plan": {
            "name": "ramp_plan",
            "properties": {
                "is_generator": true
            },
            "parameters": [
                {
                    "name": "go_plan",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "plan to start the ramp.  This will be run inside of a open/close\nrun.\n\nThis plan must return a `ophyd.StatusBase` object."
                },
                {
                    "name": "monitor_sig",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    }
                },
                {
                    "name": "inner_plan_func",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "generator which takes no input\n\nThis will be called for every data point.  This should create\none or more events."
                },
                {
                    "name": "take_pre_data",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "If True, add a pre data at beginning",
                    "default": "True"
                },
                {
                    "name": "timeout",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "If not None, the maximum time the ramp can run.\n\nIn seconds",
                    "default": "None"
                },
                {
                    "name": "period",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "If not None, take data no faster than this.  If None, take\ndata as fast as possible\n\nIf running the inner plan takes longer than `period` than take\ndata with no dead time.\n\nIn seconds.",
                    "default": "None"
                },
                {
                    "name": "md",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "default": "None"
                }
            ],
            "module": "bluesky.plans",
            "description": "Take data while ramping one or more positioners."
        },
        "grid_scan": {
            "name": "grid_scan",
            "properties": {
                "is_generator": true
            },
            "parameters": [
                {
                    "name": "detectors",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "list of 'readable' objects"
                },
                {
                    "name": "args",
                    "kind": {
                        "name": "VAR_POSITIONAL",
                        "value": 2
                    }
                },
                {
                    "name": "snake_axes",
                    "kind": {
                        "name": "KEYWORD_ONLY",
                        "value": 3
                    },
                    "description": "which axes should be snaked, either ``False`` (do not snake any axes),\n``True`` (snake all axes) or a list of axes to snake. \"Snaking\" an axis\nis defined as following snake-like, winding trajectory instead of a\nsimple left-to-right trajectory. The elements of the list are motors\nthat are listed in `args`. The list must not contain the slowest\n(first) motor, since it can't be snaked.",
                    "default": "None"
                },
                {
                    "name": "per_step",
                    "kind": {
                        "name": "KEYWORD_ONLY",
                        "value": 3
                    },
                    "description": "hook for customizing action of inner loop (messages per step).\nSee docstring of :func:`bluesky.plan_stubs.one_nd_step` (the default)\nfor details.",
                    "default": "None"
                },
                {
                    "name": "md",
                    "kind": {
                        "name": "KEYWORD_ONLY",
                        "value": 3
                    },
                    "description": "metadata",
                    "default": "None"
                }
            ],
            "module": "bluesky.plans",
            "description": "Scan over a mesh; each motor is on an independent trajectory."
        },
        "plan_test_progress_bars": {
            "name": "plan_test_progress_bars",
            "properties": {
                "is_generator": true
            },
            "parameters": [
                {
                    "name": "n_progress_bars",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "The number of progress bars to display.",
                    "annotation": {
                        "type": "int"
                    },
                    "default": "1"
                }
            ],
            "module": "__main__",
            "description": "Test visualization of progress bars."
        },
        "spiral": {
            "name": "spiral",
            "properties": {
                "is_generator": true
            },
            "parameters": [
                {
                    "name": "detectors",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    }
                },
                {
                    "name": "x_motor",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "any 'settable' object (motor, temp controller, etc.)"
                },
                {
                    "name": "y_motor",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "any 'settable' object (motor, temp controller, etc.)"
                },
                {
                    "name": "x_start",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "x center"
                },
                {
                    "name": "y_start",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "y center"
                },
                {
                    "name": "x_range",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "x width of spiral"
                },
                {
                    "name": "y_range",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "y width of spiral"
                },
                {
                    "name": "dr",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "Delta radius along the minor axis of the ellipse."
                },
                {
                    "name": "nth",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "Number of theta steps"
                },
                {
                    "name": "dr_y",
                    "kind": {
                        "name": "KEYWORD_ONLY",
                        "value": 3
                    },
                    "description": "Delta radius along the major axis of the ellipse. If None, defaults to\ndr.",
                    "default": "None"
                },
                {
                    "name": "tilt",
                    "kind": {
                        "name": "KEYWORD_ONLY",
                        "value": 3
                    },
                    "description": "Tilt angle in radians, default 0.0",
                    "default": "0.0"
                },
                {
                    "name": "per_step",
                    "kind": {
                        "name": "KEYWORD_ONLY",
                        "value": 3
                    },
                    "description": "hook for customizing action of inner loop (messages per step).\nSee docstring of :func:`bluesky.plan_stubs.one_nd_step` (the default)\nfor details.",
                    "default": "None"
                },
                {
                    "name": "md",
                    "kind": {
                        "name": "KEYWORD_ONLY",
                        "value": 3
                    },
                    "description": "metadata",
                    "default": "None"
                }
            ],
            "module": "bluesky.plans",
            "description": "Spiral scan, centered around (x_start, y_start)"
        },
        "rel_log_scan": {
            "name": "rel_log_scan",
            "properties": {
                "is_generator": true
            },
            "parameters": [
                {
                    "name": "detectors",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "list of 'readable' objects"
                },
                {
                    "name": "motor",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "any 'settable' object (motor, temp controller, etc.)"
                },
                {
                    "name": "start",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "starting position of motor"
                },
                {
                    "name": "stop",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "ending position of motor"
                },
                {
                    "name": "num",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "number of steps"
                },
                {
                    "name": "per_step",
                    "kind": {
                        "name": "KEYWORD_ONLY",
                        "value": 3
                    },
                    "description": "hook for customizing action of inner loop (messages per step)\nExpected signature: ``f(detectors, motor, step)``",
                    "default": "None"
                },
                {
                    "name": "md",
                    "kind": {
                        "name": "KEYWORD_ONLY",
                        "value": 3
                    },
                    "description": "metadata",
                    "default": "None"
                }
            ],
            "module": "bluesky.plans",
            "description": "Scan over one variable in log-spaced steps relative to current position."
        },
        "move_then_count": {
            "name": "move_then_count",
            "properties": {
                "is_generator": true
            },
            "parameters": [
                {
                    "name": "motors",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "List of motors to be moved into specified positions before the measurement",
                    "annotation": {
                        "type": "typing.List[Motors]",
                        "devices": {
                            "Motors": [
                                "motor1",
                                "motor2"
                            ]
                        }
                    }
                },
                {
                    "name": "detectors",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "Detectors to use for measurement.",
                    "annotation": {
                        "type": "typing.List[Detectors]",
                        "devices": {
                            "Detectors": [
                                "det1",
                                "det2",
                                "det3"
                            ]
                        }
                    },
                    "default": "['det1', 'det2']",
                    "default_defined_in_decorator": true
                },
                {
                    "name": "positions",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "Motor positions. The number of positions must be equal to the number of the motors.",
                    "annotation": {
                        "type": "typing.List[float]"
                    },
                    "default": "None",
                    "min": "-10",
                    "max": "10",
                    "step": "0.01"
                }
            ],
            "module": "__main__",
            "description": "Move motors into positions; then count dets."
        },
        "list_grid_scan": {
            "name": "list_grid_scan",
            "properties": {
                "is_generator": true
            },
            "parameters": [
                {
                    "name": "detectors",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "list of 'readable' objects"
                },
                {
                    "name": "args",
                    "kind": {
                        "name": "VAR_POSITIONAL",
                        "value": 2
                    },
                    "description": "patterned like (``motor1, position_list1,``\n                ``motor2, position_list2,``\n                ``motor3, position_list3,``\n                ``...,``\n                ``motorN, position_listN``)\n\nThe first motor is the \"slowest\", the outer loop. ``position_list``'s\nare lists of positions, all lists must have the same length. Motors\ncan be any 'settable' object (motor, temp controller, etc.)."
                },
                {
                    "name": "snake_axes",
                    "kind": {
                        "name": "KEYWORD_ONLY",
                        "value": 3
                    },
                    "description": "which axes should be snaked, either ``False`` (do not snake any axes),\n``True`` (snake all axes) or a list of axes to snake. \"Snaking\" an axis\nis defined as following snake-like, winding trajectory instead of a\nsimple left-to-right trajectory.The elements of the list are motors\nthat are listed in `args`. The list must not contain the slowest\n(first) motor, since it can't be snaked.",
                    "default": "False"
                },
                {
                    "name": "per_step",
                    "kind": {
                        "name": "KEYWORD_ONLY",
                        "value": 3
                    },
                    "description": "hook for customizing action of inner loop (messages per step).\nSee docstring of :func:`bluesky.plan_stubs.one_nd_step` (the default)\nfor details.",
                    "default": "None"
                },
                {
                    "name": "md",
                    "kind": {
                        "name": "KEYWORD_ONLY",
                        "value": 3
                    },
                    "description": "metadata",
                    "default": "None"
                }
            ],
            "module": "bluesky.plans",
            "description": "Scan over a mesh; each motor is on an independent trajectory."
        },
        "x2x_scan": {
            "name": "x2x_scan",
            "properties": {
                "is_generator": true
            },
            "parameters": [
                {
                    "name": "detectors",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "list of 'readable' objects"
                },
                {
                    "name": "motor1",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "The second motor will move half as much as the first"
                },
                {
                    "name": "motor2",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "The second motor will move half as much as the first"
                },
                {
                    "name": "start",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "The relative limits of the first motor.  The second motor\nwill move between ``start / 2`` and ``stop / 2``"
                },
                {
                    "name": "stop",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "The relative limits of the first motor.  The second motor\nwill move between ``start / 2`` and ``stop / 2``"
                },
                {
                    "name": "num",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    }
                },
                {
                    "name": "per_step",
                    "kind": {
                        "name": "KEYWORD_ONLY",
                        "value": 3
                    },
                    "description": "hook for cutomizing action of inner loop (messages per step).\nSee docstring of :func:`bluesky.plan_stubs.one_nd_step` (the default)\nfor details.",
                    "default": "None"
                },
                {
                    "name": "md",
                    "kind": {
                        "name": "KEYWORD_ONLY",
                        "value": 3
                    },
                    "description": "metadata",
                    "default": "None"
                }
            ],
            "module": "bluesky.plans",
            "description": "Relatively scan over two motors in a 2:1 ratio"
        },
        "rel_adaptive_scan": {
            "name": "rel_adaptive_scan",
            "properties": {
                "is_generator": true
            },
            "parameters": [
                {
                    "name": "detectors",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "list of 'readable' objects"
                },
                {
                    "name": "target_field",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "data field whose output is the focus of the adaptive tuning"
                },
                {
                    "name": "motor",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "any 'settable' object (motor, temp controller, etc.)"
                },
                {
                    "name": "start",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "starting position of motor"
                },
                {
                    "name": "stop",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "ending position of motor"
                },
                {
                    "name": "min_step",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "smallest step for fast-changing regions"
                },
                {
                    "name": "max_step",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "largest step for slow-chaning regions"
                },
                {
                    "name": "target_delta",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "desired fractional change in detector signal between steps"
                },
                {
                    "name": "backstep",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "whether backward steps are allowed -- this is concern with some motors"
                },
                {
                    "name": "threshold",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "threshold for going backward and rescanning a region, default is 0.8",
                    "default": "0.8"
                },
                {
                    "name": "md",
                    "kind": {
                        "name": "KEYWORD_ONLY",
                        "value": 3
                    },
                    "description": "metadata",
                    "default": "None"
                }
            ],
            "module": "bluesky.plans",
            "description": "Relative scan over one variable with adaptively tuned step size."
        },
        "rel_spiral_square": {
            "name": "rel_spiral_square",
            "properties": {
                "is_generator": true
            },
            "parameters": [
                {
                    "name": "detectors",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "list of 'readable' objects"
                },
                {
                    "name": "x_motor",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "any 'settable' object (motor, temp controller, etc.)"
                },
                {
                    "name": "y_motor",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "any 'settable' object (motor, temp controller, etc.)"
                },
                {
                    "name": "x_range",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "x width of spiral"
                },
                {
                    "name": "y_range",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "y width of spiral"
                },
                {
                    "name": "x_num",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "number of x axis points"
                },
                {
                    "name": "y_num",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "Number of y axis points."
                },
                {
                    "name": "per_step",
                    "kind": {
                        "name": "KEYWORD_ONLY",
                        "value": 3
                    },
                    "description": "hook for cutomizing action of inner loop (messages per step).\nSee docstring of :func:`bluesky.plans.one_nd_step` (the default) for\ndetails.",
                    "default": "None"
                },
                {
                    "name": "md",
                    "kind": {
                        "name": "KEYWORD_ONLY",
                        "value": 3
                    },
                    "description": "metadata",
                    "default": "None"
                }
            ],
            "module": "bluesky.plans",
            "description": "Relative square spiral scan, centered around current (x, y) position."
        },
        "relative_inner_product_scan": {
            "name": "relative_inner_product_scan",
            "properties": {
                "is_generator": true
            },
            "parameters": [
                {
                    "name": "detectors",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    }
                },
                {
                    "name": "num",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    }
                },
                {
                    "name": "args",
                    "kind": {
                        "name": "VAR_POSITIONAL",
                        "value": 2
                    }
                },
                {
                    "name": "per_step",
                    "kind": {
                        "name": "KEYWORD_ONLY",
                        "value": 3
                    },
                    "default": "None"
                },
                {
                    "name": "md",
                    "kind": {
                        "name": "KEYWORD_ONLY",
                        "value": 3
                    },
                    "default": "None"
                }
            ],
            "module": "bluesky.plans"
        },
        "rel_list_scan": {
            "name": "rel_list_scan",
            "properties": {
                "is_generator": true
            },
            "parameters": [
                {
                    "name": "detectors",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "list of 'readable' objects"
                },
                {
                    "name": "args",
                    "kind": {
                        "name": "VAR_POSITIONAL",
                        "value": 2
                    },
                    "description": "For one dimension, ``motor, [point1, point2, ....]``.\nIn general:\n\n.. code-block:: python\n\n    motor1, [point1, point2, ...],\n    motor2, [point1, point2, ...],\n    ...,\n    motorN, [point1, point2, ...]\n\nMotors can be any 'settable' object (motor, temp controller, etc.)\npoint1, point2 etc are relative to the current location."
                },
                {
                    "name": "per_step",
                    "kind": {
                        "name": "KEYWORD_ONLY",
                        "value": 3
                    },
                    "description": "hook for customizing action of inner loop (messages per step)\nExpected signature: ``f(detectors, motor, step)``",
                    "default": "None"
                },
                {
                    "name": "md",
                    "kind": {
                        "name": "KEYWORD_ONLY",
                        "value": 3
                    },
                    "description": "metadata",
                    "default": "None"
                }
            ],
            "module": "bluesky.plans",
            "description": "Scan over one variable in steps relative to current position."
        },
        "rel_list_grid_scan": {
            "name": "rel_list_grid_scan",
            "properties": {
                "is_generator": true
            },
            "parameters": [
                {
                    "name": "detectors",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "list of 'readable' objects"
                },
                {
                    "name": "args",
                    "kind": {
                        "name": "VAR_POSITIONAL",
                        "value": 2
                    },
                    "description": "patterned like (``motor1, position_list1,``\n                ``motor2, position_list2,``\n                ``motor3, position_list3,``\n                ``...,``\n                ``motorN, position_listN``)\n\nThe first motor is the \"slowest\", the outer loop. ``position_list``'s\nare lists of positions, all lists must have the same length. Motors\ncan be any 'settable' object (motor, temp controller, etc.)."
                },
                {
                    "name": "snake_axes",
                    "kind": {
                        "name": "KEYWORD_ONLY",
                        "value": 3
                    },
                    "description": "which axes should be snaked, either ``False`` (do not snake any axes),\n``True`` (snake all axes) or a list of axes to snake. \"Snaking\" an axis\nis defined as following snake-like, winding trajectory instead of a\nsimple left-to-right trajectory.The elements of the list are motors\nthat are listed in `args`. The list must not contain the slowest\n(first) motor, since it can't be snaked.",
                    "default": "False"
                },
                {
                    "name": "per_step",
                    "kind": {
                        "name": "KEYWORD_ONLY",
                        "value": 3
                    },
                    "description": "hook for customizing action of inner loop (messages per step).\nSee docstring of :func:`bluesky.plan_stubs.one_nd_step` (the default)\nfor details.",
                    "default": "None"
                },
                {
                    "name": "md",
                    "kind": {
                        "name": "KEYWORD_ONLY",
                        "value": 3
                    },
                    "description": "metadata",
                    "default": "None"
                }
            ],
            "module": "bluesky.plans",
            "description": "Scan over a mesh; each motor is on an independent trajectory. Each point is\nrelative to the current position."
        },
        "scan_nd": {
            "name": "scan_nd",
            "properties": {
                "is_generator": true
            },
            "parameters": [
                {
                    "name": "detectors",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    }
                },
                {
                    "name": "cycler",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "cycler.Cycler object mapping movable interfaces to positions"
                },
                {
                    "name": "per_step",
                    "kind": {
                        "name": "KEYWORD_ONLY",
                        "value": 3
                    },
                    "description": "hook for customizing action of inner loop (messages per step).\nSee docstring of :func:`bluesky.plan_stubs.one_nd_step` (the default)\nfor details.",
                    "default": "None"
                },
                {
                    "name": "md",
                    "kind": {
                        "name": "KEYWORD_ONLY",
                        "value": 3
                    },
                    "description": "metadata",
                    "default": "None"
                }
            ],
            "module": "bluesky.plans",
            "description": "Scan over an arbitrary N-dimensional trajectory."
        },
        "list_scan": {
            "name": "list_scan",
            "properties": {
                "is_generator": true
            },
            "parameters": [
                {
                    "name": "detectors",
                    "kind": {
                        "name": "POSITIONAL_OR_KEYWORD",
                        "value": 1
                    },
                    "description": "list of 'readable' objects"
                },
                {
                    "name": "args",
                    "kind": {
                        "name": "VAR_POSITIONAL",
                        "value": 2
                    },
                    "description": "For one dimension, ``motor, [point1, point2, ....]``.\nIn general:\n\n.. code-block:: python\n\n    motor1, [point1, point2, ...],\n    motor2, [point1, point2, ...],\n    ...,\n    motorN, [point1, point2, ...]\n\nMotors can be any 'settable' object (motor, temp controller, etc.)"
                },
                {
                    "name": "per_step",
                    "kind": {
                        "name": "KEYWORD_ONLY",
                        "value": 3
                    },
                    "description": "hook for customizing action of inner loop (messages per step)\nExpected signature:\n``f(detectors, motor, step) -> plan (a generator)``",
                    "default": "None"
                },
                {
                    "name": "md",
                    "kind": {
                        "name": "KEYWORD_ONLY",
                        "value": 3
                    },
                    "description": "metadata",
                    "default": "None"
                }
            ],
            "module": "bluesky.plans",
            "description": "Scan over one or more variables in steps simultaneously (inner product)."
        }
    },
    "plans_allowed_uid": "a2fea229-75eb-496f-a776-d2405d7f24a3"
};

const mockGetQueueItemResponse = {
    "msg": "",
    "item": {
        "name": "count",
        "kwargs": {
            "detectors": [
                "jittery_motor2"
            ]
        },
        "item_type": "plan",
        "user": "UNAUTHENTICATED_SINGLE_USER",
        "user_group": "primary",
        "item_uid": "070d4e21-8408-43f9-a418-20afb411449f"
    }  
}

export { mockDevicesAllowedResponse, mockPlansAllowedResponse, mockGetQueueItemResponse };