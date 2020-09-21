import { Voice } from "./Voice";
import { AnalogSynthModule } from "../synth/AnalogSynthModule";
import { IDisposable } from "../utility/IDisposable";

export interface AnalogSynthVoice extends Voice, IDisposable {

  synth: AnalogSynthModule;
  
}
