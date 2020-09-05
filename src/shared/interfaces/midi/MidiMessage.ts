export enum MidiFunction {
  noteon = "noteon",
  noteoff = "noteoff",
}

export interface MidiMessage {
  // todo: better implementation

  midiFunction: MidiFunction;

  noteNumber: number;

  noteVelocity: number;
}
