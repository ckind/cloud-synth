import { ToneAudioNode } from "tone";
import { IAudioModule } from "./IAudioModule";
import { IMidiReceiver } from "../midi/IMidiReceiver";

export interface SubtractiveSynthModule extends IAudioModule, IMidiReceiver {

  ampAttack: number;

  ampDecay: number;

  ampSustain: number;

  ampRelease: number;

  // todo: break these out into other interfaces? -- IAmplitudeModulatable
  readonly ampModulation: ToneAudioNode;

  ampModulationMix: number;
  //
  
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
