import { IMidiMessage } from "./IMidiMessage";

export interface IMidiReceiver {
  receiveMidi(message: IMidiMessage, time?: number): void;
}
