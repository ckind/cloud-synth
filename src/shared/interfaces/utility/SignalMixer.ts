import { ToneAudioNode } from "tone";

export interface SignalMixer {
  readonly output: ToneAudioNode;

  addInput(n: number, input: ToneAudioNode): void;

  removeInput(n: number): void;

  channel(n: number): ToneAudioNode;

  balance(): void;
}
