import { ToneAudioNode } from "tone";
import { RackModule } from "../RackModule";
import { MidiReceiver } from "../midi/MidiReceiver";

export interface SubtractiveSynthModule extends RackModule, MidiReceiver {

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
