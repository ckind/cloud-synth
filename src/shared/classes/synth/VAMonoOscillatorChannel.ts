import { AudioModule } from '@/shared/interfaces/AudioModule';
import { Disposable } from '@/shared/interfaces/utility/Disposable';
import { ToneOscillatorType, Signal, Channel, Gain, Oscillator } from "tone";
import { OscillatorChannel } from "../../interfaces/synth/OscillatorChannel";

// a free running digital oscillator
export class VAMonoOscillatorChannel implements OscillatorChannel, Disposable, AudioModule {
  readonly detune: Signal<"cents">;
  readonly frequency: Signal<"frequency">;
  readonly output: Gain;
  
  private _type: ToneOscillatorType;
  private _toneOscillator!: Oscillator; // intialized in function call
  private readonly _channel: Channel;

  constructor(type: ToneOscillatorType) {
    this._type = type;
    this._channel = new Channel();
    this.detune = new Signal(0, "cents");
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
    this.detune.dispose();
    this.frequency.dispose();
    this._channel.disconnect(this.output);
    this._channel.dispose();
    this.output.dispose();
  }

  private disposeOscillator() {
    this.detune.disconnect(this._toneOscillator.detune);
    this.frequency.disconnect(this._toneOscillator.frequency);
    this._toneOscillator.disconnect(this._channel);
    this._toneOscillator.stop().dispose();
  }

  private initOscillator() {
    this._toneOscillator = new Oscillator(0, this._type).start();
    this.detune.connect(this._toneOscillator.detune);
    this.frequency.connect(this._toneOscillator.frequency);
    this._toneOscillator.chain(this._channel, this.output);
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
