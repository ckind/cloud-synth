import { IPresetBank } from "@/shared/interfaces/presets/IPresetBank";
import { IJvaSettings } from "../../IJvaSettings";

export const getDefaultJvaSettings = function(): IJvaSettings {
  return {
    oscillator1: {
      volume: -12,
      transpose: 0,
      detune: 0,
      type: "sine"
    },
    oscillator2: {
      volume: -12,
      transpose: -12,
      detune: 0,
      type: "sawtooth"
    },
    oscillator3: {
      volume: -12,
      transpose: 0,
      detune: 0,
      type: "sawtooth"
    },
    oscillatorSpread: 0,
    amp: {
      envelope: {
        attack: 0,
        decay: 400,
        sustain: 0.8,
        release: 200
      },
      modulationAmount: 0,
      modulationRate: 4
    },
    filter: {
      envelope: {
        attack: 300,
        decay: 300,
        sustain: 0.8,
        release: 200
      },
      envelopeAmount: 0.7,
      frequency: 5000,
      q: 3,
      type: "lowpass",
      modulationAmount: 0,
      modulationRate: 4
    },
    pitch: {
      modulationAmount: 0,
      modulationRate: 8
    },
    noise: {
      type: "white",
      volume: -24
    },
    volume: -12
  };
};

export const getDefaultJvaBank = function(): IPresetBank {
  return {
    _id: "0",
    categories: [{
      category: "local",
      presets: [{
        name: "default",
        version: 0,
        private: false,
        settings: getDefaultJvaSettings()
      }]
    }]
  }
}

