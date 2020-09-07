import { SubtractiveSynthModule } from "./SubtractiveSynthModule";
import { OscillatorChannel } from "./OscillatorChannel";
import { ToneAudioNode } from "tone";

export interface AnalogSynthModule extends SubtractiveSynthModule {

  pitchModulation: ToneAudioNode;

  pitchModulationMix: number;

  readonly oscillators: Array<OscillatorChannel>;

  oscillatorSpread: number; // todo: refactor into separate interface?

}
