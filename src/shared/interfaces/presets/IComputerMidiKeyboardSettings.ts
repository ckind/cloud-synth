
export enum ArpeggioMode {
  UP = 0,
  DOWN = 1,
  UP_DOWN_INC = 2,
  UP_DOWN_EXC = 3,
  RANDOM = 4
}

export enum ArpeggioRate {
  QUARTER_NOTE = 0,
  QUARTER_NOTE_TRIPLET = 1,
  EIGHTH_NOTE= 2,
  EIGHTH_NOTE_TRIPLET = 3,
  SIXTEENTH_NOTE = 4,
  SIXTEENTH_NOTE_TRIPLET = 6,
  THRITYSECOND_NOTE = 7,
  THRITYSECOND_NOTE_TRIPLET = 8
}

export interface IComputerMidiKeyboardSettings {
  arpOn: boolean;
  arpRate: ArpeggioRate;
  arpMode: ArpeggioMode;
  arpNodeRepeat: number;
  chordTrigger: number[];
  octaveOffset: number;
  transposeOffset: number;
}