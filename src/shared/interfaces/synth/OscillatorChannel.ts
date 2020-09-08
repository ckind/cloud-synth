import { ToneOscillatorType, Signal, Param } from "tone";
import { Disposable } from "../utility/Disposable";

export interface OscillatorChannel extends Disposable {

  type: ToneOscillatorType;

  volume: number;

  pan: number;

  transpose: number;

  detune: number;

  readonly frequency: Signal<"frequency">;

  reset(): void;

}
