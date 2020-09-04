export interface MidiMessage {
  // todo: better implementation

  midiFunction: string;

  noteNumber: number;

  noteVelocity: number;
}
