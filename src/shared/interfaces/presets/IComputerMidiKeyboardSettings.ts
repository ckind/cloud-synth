
export enum ArpeggioMode {
  UP = 0,
  DOWN = 1,
  UP_DOWN_INC = 2,
  UP_DOWN_EXC = 3,
  RANDOM = 4
}

export interface IComputerMidiKeyboardSettings {
  arpOn: boolean;
  arpMode: ArpeggioMode;
  arpNodeRepeat: number;
  chordTrigger: number[];
  octaveOffset: number;
  transposeOffset: number;
}