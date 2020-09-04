import { SubtractiveSynthModule } from "./SubtractiveSynthModule";
import { SynthOscillator } from "./SynthOscillator";
import { ToneAudioNode } from "tone";

export interface AnalogSynthModule extends SubtractiveSynthModule {

  pitchModulation: ToneAudioNode;

  pitchModulationMix: number;

  readonly oscillators: Array<SynthOscillator>;

}
