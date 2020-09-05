export enum MidiFunction {
  note_on = "noteon",
  note_off = "noteoff",
}

export interface MidiMessage {
  // todo: better implementation

  midiFunction: MidiFunction;

  noteNumber: number;

  noteVelocity: number;
}
