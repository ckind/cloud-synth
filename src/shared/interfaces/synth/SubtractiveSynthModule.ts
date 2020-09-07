import { ToneAudioNode } from "tone";
import { AudioModule } from "../AudioModule";
import { MidiReceiver } from "../midi/MidiReceiver";

export interface SubtractiveSynthModule extends AudioModule, MidiReceiver {

  ampAttack: number;

  ampDecay: number;

  ampSustain: number;

  ampRelease: number;

  readonly ampModulation: ToneAudioNode;

  ampModulationMix: number;

  filterAttack: number;

  filterDecay: number;

  filterSustain: number;

  filterRelease: number;

  filterType: BiquadFilterType;

  filterEnvelopeAmount: number;

  filterFrequency: number;

  readonly filterFrequencyModulation: ToneAudioNode;

  filterFrequencyModulationMix: number;

  filterQ: number;

  readonly filterQModulation: ToneAudioNode;

  filterQModulationMix: number;

}
