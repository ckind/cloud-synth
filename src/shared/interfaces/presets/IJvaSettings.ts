import { ToneOscillatorType } from "tone";

export interface IJvaSettings {
  oscillator1: IJvaOscillatorSettings;
  oscillator2: IJvaOscillatorSettings;
  oscillator3: IJvaOscillatorSettings;
  oscillatorSpread: number;
  amp: IJvaAmpSettings;
  filter: IJvaFilterSettings;
  pitch: IJvaPitchSettings;
  noise: IJVANoiseSettings;
  volume: number;
}

interface IJvaOscillatorSettings {
  volume: number;
  transpose: number;
  detune: number;
  type: ToneOscillatorType;
}

interface IJvaAmpSettings {
  envelope: IJvaEnvelopeSettings;
  modulationAmount: number;
  modulationRate: number;
}

interface IJvaFilterSettings {
  envelope: IJvaEnvelopeSettings;
  envelopeAmount: number;
  frequency: number;
  q: number;
  type: BiquadFilterType;
  modulationAmount: number;
  modulationRate: number;
}

interface IJvaPitchSettings {
  modulationAmount: number;
  modulationRate: number;
}

interface IJVANoiseSettings {
  type: string;
  volume: number;
}

interface IJvaEnvelopeSettings {
  attack: number;
  decay: number;
  sustain: number;
  release: number;
}