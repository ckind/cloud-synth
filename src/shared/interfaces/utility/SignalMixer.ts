import { ToneAudioNode } from "tone";
import { IDisposable } from "./IDisposable";

export interface SignalMixer extends IDisposable {
  readonly output: ToneAudioNode;

  addInput(n: number, input: ToneAudioNode): void;

  removeInput(n: number): void;

  channel(n: number): ToneAudioNode;

  balance(): void;

}
