import { MidiMessage } from "./MidiMessage";
import { MidiReceiver } from "./MidiReceiver";

export interface MidiSender {

  sendMidi(message: MidiMessage): void;

  connect(receiver: MidiReceiver): void;

  disconnect(receiver: MidiReceiver): void;

}
