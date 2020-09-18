import { IPresetBank } from "@/shared/interfaces/presets/IPresetBank";
import { IJvaSettings } from "@/shared/interfaces/presets/IJvaSettings";
import { ArpeggioMode, IComputerMidiKeyboardSettings } from "@/shared/interfaces/presets/IComputerMidiKeyboardSettings";

const getDefaultJvaSettings = function(): IJvaSettings {
  return {
    oscillator1: {
      volume: -12,
      transpose: 0,
      detune: -5,
      type: "sawtooth"
    },
    oscillator2: {
      volume: -12,
      transpose: -12,
      detune: 0,
      type: "triangle"
    },
    oscillator3: {
      volume: -12,
      transpose: 0,
      detune: 7,
      type: "sawtooth"
    },
    oscillatorSpread: 0.4,
    amp: {
      envelope: {
        attack: 14,
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
      volume: -36
    },
    volume: -12
  };
};

const getDefaultComputerMidiKeyboardSettings = function(): IComputerMidiKeyboardSettings {
  return {
    arpOn: false,
    arpMode: ArpeggioMode.UP,
    arpNodeRepeat: 1,
    chordTrigger: [0],
    octaveOffset: 48,
    transposeOffset: 0
  };
}

export const getDefaultJvaBank = function(): IPresetBank {
  return { // todo: actually design presets -- this is all dummy data
    _id: "0",
    categories: [
      {
        category: "Lead",
        presets: [
          {
            name: "Synth Flute",
            version: 0,
            private: false,
            settings: getDefaultJvaSettings()
          },
          {
            name: "Super Saw",
            version: 0,
            private: false,
            settings: getDefaultJvaSettings()
          },
          {
            name: "West Coast Sine",
            version: 0,
            private: false,
            settings: getDefaultJvaSettings()
          },
          {
            name: "String Pluck",
            version: 0,
            private: false,
            settings: getDefaultJvaSettings()
          }
        ],
      },
      {
        category: "Bass",
        presets: [{
          name: "default",
          version: 0,
          private: false,
          settings: getDefaultJvaSettings()
        }],
      },
      {
        category: "Pad",
        presets: [{
          name: "default",
          version: 0,
          private: false,
          settings: getDefaultJvaSettings()
        }],
      },
      {
        category: "Percussion",
        presets: [{
          name: "default",
          version: 0,
          private: false,
          settings: getDefaultJvaSettings()
        }],
      },
    ]
  }
}

export const getDefaultComputerMidiKeyboardBank = function(): IPresetBank {
  return {
    _id: "0",
    categories: [{
      category: "Basic",
      presets: [{
        name: "Standard",
        version: 0,
        private: false,
        settings: getDefaultComputerMidiKeyboardSettings()
      }]
    }]
  }
}

