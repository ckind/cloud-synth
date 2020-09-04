import { Voice } from "./Voice";
import { AnalogSynthModule } from "../synth/AnalogSynthModule";

export interface AnalogSynthVoice extends Voice {

  synth: AnalogSynthModule;
  
}
