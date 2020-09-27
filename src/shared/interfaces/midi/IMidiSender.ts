import { IMidiMessage } from "./IMidiMessage";
import { IMidiReceiver } from "./IMidiReceiver";

export interface IMidiSender {

  sendMidi(message: IMidiMessage, time?: number): void;

  connect(receiver: IMidiReceiver): void;

  disconnect(receiver: IMidiReceiver): void;

}
