import { AnalogSynthModule } from "../../interfaces/synth/AnalogSynthModule";
import { AnalogSynthVoice } from "../../interfaces/polyphonic/AnalogSynthVoice";

export class VASynthVoice implements AnalogSynthVoice {
  currentMidiNote: number;
  isActive: boolean;
  synth: AnalogSynthModule;

  constructor(synth: AnalogSynthModule) {
    this.synth = synth;
    this.isActive = false;
    this.currentMidiNote = -1;
  }
}
