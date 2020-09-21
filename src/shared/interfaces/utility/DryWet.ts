import { ToneAudioNode } from "tone";
import { IDisposable } from "./IDisposable";

export interface DryWet extends IDisposable {
  readonly output: ToneAudioNode;

  wetness: number;
}
