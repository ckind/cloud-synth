import { ToneOscillatorType, Signal } from "tone";

export interface SynthOscillator {
  type: ToneOscillatorType;

  readonly detune: Signal<"cents">;

  readonly frequency: Signal<"frequency">;
}
