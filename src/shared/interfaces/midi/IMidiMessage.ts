export enum MidiFunction {
  noteon = "noteon",
  noteoff = "noteoff",
}

export interface IMidiMessage {
  // todo: better implementation

  midiFunction: MidiFunction;

  noteNumber: number;

  noteVelocity: number;
}
