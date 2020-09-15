import { IMidiMessage } from "./IMidiMessage";

export interface IMidiReceiver {
  receiveMidi(message: IMidiMessage): void;
}
