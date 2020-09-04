import { AnalogSynthModule } from "./AnalogSynthModule";
import { ToneAudioNode } from "tone";

export interface AnalogMonoSynthModule extends AnalogSynthModule {

  pitch: ToneAudioNode;

}
