import { ToneAudioNode } from "tone";

export interface RackModule {
  readonly output: ToneAudioNode;
}
