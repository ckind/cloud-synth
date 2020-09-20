import { IAudioModule } from "@/shared/interfaces/synth/IAudioModule";
import { IDisposable } from "@/shared/interfaces/utility/IDisposable";
import {
  ToneOscillatorType,
  Signal,
  PanVol,
  Gain,
  Oscillator,
  immediate
} from "tone";
import { OscillatorChannel } from "../../interfaces/synth/OscillatorChannel";

// a free running digital oscillator
export class VAMonoOscillatorChannel implements OscillatorChannel, IDisposable, IAudioModule {
  readonly frequency: Signal<"frequency">;
  readonly output: Gain;
  
  private readonly _transposeSignal: Signal<"cents">;
  private readonly _detuneSignal: Signal<"cents">;
  private _transpose: number;
  private _detune: number;
  private _type: ToneOscillatorType;
  private _toneOscillator!: Oscillator; // intialized in function call
  private readonly _channel: PanVol;

  constructor(type: ToneOscillatorType) {
    this._type = type;
    this._channel = new PanVol();
    this._transpose = 0;
    this._detune = 0;
    this._transposeSignal = new Signal<"cents">(this._transpose * 100);
    this._detuneSignal = new Signal(this._detune, "cents");
    this.frequency = new Signal(0, "frequency");
    this.output = new Gain(1);
    this.initOscillator();
    this._channel.connect(this.output);
  }

  reset() {
    this.disposeOscillator();
    this.initOscillator();
  }

  dispose() {
    this.disposeOscillator();
    this._transposeSignal.dispose();
    this._detuneSignal.dispose();
    this.frequency.dispose();
    this._channel.disconnect(this.output);
    this._channel.dispose();
    this.output.dispose();
  }

  private disposeOscillator() {
    this._transposeSignal.disconnect(this._toneOscillator.detune);
    this._detuneSignal.disconnect(this._toneOscillator.detune);
    this.frequency.disconnect(this._toneOscillator.frequency);
    this._toneOscillator.disconnect(this._channel);
    this._toneOscillator.stop().dispose();
  }

  private initOscillator() {
    this._toneOscillator = new Oscillator(0, this._type).start();
    this._transposeSignal.connect(this._toneOscillator.detune);
    this._detuneSignal.connect(this._toneOscillator.detune);
    this.frequency.connect(this._toneOscillator.frequency);
    this._toneOscillator.connect(this._channel);
  }

  get detune() {
    return this._detune;
  }
  set detune(d: number) {
    this._detune = d;
    this._detuneSignal.setValueAtTime(d, immediate());
  }

  get transpose() {
    return this._transpose;
  }
  set transpose(t: number) {
    this._transpose = t;
    this._transposeSignal.setValueAtTime(t * 100, immediate());
  }

  get volume() {
    return this._channel.volume.getValueAtTime(immediate());
  }
  set volume(v: number) {
    this._channel.volume.setValueAtTime(v, immediate());
  }

  get pan() {
    return this._channel.pan.getValueAtTime(immediate());
  }
  set pan(p: number) {
    this._channel.pan.setValueAtTime(p, immediate());
  }

  get type() {
    return this._type;
  }
  set type(t: ToneOscillatorType) {
    this._type = t;
    this._toneOscillator.type = t;
  }
}
