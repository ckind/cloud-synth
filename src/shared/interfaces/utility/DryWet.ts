import { ToneAudioNode } from "tone";

export interface DryWet {
  readonly output: ToneAudioNode;

  wetness: number;
}
