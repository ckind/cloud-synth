import { AudioModule } from '@/shared/interfaces/AudioModule';
import { Disposable } from '@/shared/interfaces/utility/Disposable';
import { DryWet } from '@/shared/interfaces/utility/DryWet';
import { ToneOscillatorType, Signal, Channel, Gain, Oscillator, immediate } from "tone";
import { OscillatorChannel } from "../../interfaces/synth/OscillatorChannel";
import { DryWetMixer } from '../utility/DryWetMixer';

// a free running digital oscillator
export class VAMonoOscillatorChannel implements OscillatorChannel, Disposable, AudioModule {
  
  readonly frequency: Signal<"frequency">;
  readonly output: Gain;
  
  private readonly _transposeSignal: Signal<"cents">;
  private readonly _detuneSignal: Signal<"cents">;
  private _transpose: number;
  private _detune: number;
  private _type: ToneOscillatorType;
  private _toneOscillator!: Oscillator; // intialized in function call
  private readonly _channel: Channel;

  constructor(type: ToneOscillatorType) {
    this._type = type;
    this._channel = new Channel(-12);
    this._transpose = 0;
    this._detune = 0;
    this._transposeSignal = new Signal<"cents">(this._transpose * 100);
    this._detuneSignal = new Signal(this._detune, "cents");
    this.frequency = new Signal(0, "frequency");
    this.output = new Gain(1);
    this.initOscillator();
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
    this._toneOscillator.chain(this._channel, this.output);
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
    return this._channel.volume.value;
  }
  set volume(v: number) {
    this._channel.volume.value = v;
  }

  get pan() {
    return this._channel.pan.value
  }
  set pan(p: number) {
    this._channel.pan.value = p;
  }

  get type() {
    return this._type;
  }
  set type(t: ToneOscillatorType) {
    this._type = t;
    this._toneOscillator.type = t;
  }
}
