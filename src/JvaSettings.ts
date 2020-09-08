import { ToneOscillatorType } from "tone";

export interface JvaSettings {
  oscillator1: JvaOscillatorSettings;
  oscillator2: JvaOscillatorSettings;
  oscillator3: JvaOscillatorSettings;
  oscillatorSpread: number;
  amp: JvaAmpSettings;
  filter: JvaFilterSettings;
  pitch: JvaPitchSettings;
  noise: JVANoiseSettings;
  volume: number;
}

interface JvaOscillatorSettings {
  volume: number;
  transpose: number;
  detune: number;
  type: ToneOscillatorType;
}

interface JvaAmpSettings {
  envelope: JvaEnvelopeSettings;
  modulationAmount: number;
  modulationRate: number;
}

interface JvaFilterSettings {
  envelope: JvaEnvelopeSettings;
  envelopeAmount: number;
  frequency: number;
  q: number;
  type: BiquadFilterType;
  modulationAmount: number;
  modulationRate: number;
}

interface JvaPitchSettings {
  modulationAmount: number;
  modulationRate: number;
}

interface JVANoiseSettings {
  type: string;
  volume: number;
}

interface JvaEnvelopeSettings {
  attack: number;
  decay: number;
  sustain: number;
  release: number;
}