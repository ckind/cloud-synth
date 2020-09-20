import { ToneOscillatorType, Signal, Param } from "tone";
import { IDisposable } from "../utility/IDisposable";

export interface OscillatorChannel extends IDisposable {

  type: ToneOscillatorType;

  volume: number;

  pan: number;

  transpose: number;

  detune: number;

  readonly frequency: Signal<"frequency">;

  reset(): void;

}
