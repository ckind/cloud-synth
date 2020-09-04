import { MidiMessage } from "./MidiMessage";

export interface MidiReceiver {
  receiveMidi(message: MidiMessage): void;
}
