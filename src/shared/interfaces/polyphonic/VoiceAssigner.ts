import { Voice } from "./Voice";

export interface VoiceAssigner {
  readonly voices: Array<Voice>;

  assignNoteOn(midiNote: number): number;

  assignNoteOff(midiNote: number): number;
}
