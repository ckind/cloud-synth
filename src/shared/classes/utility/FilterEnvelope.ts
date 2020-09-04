import { Envelope, ScaleExp, TimeClass, Time, Gain, Signal, immediate } from "tone";
import { FreqEnvelope } from "../../interfaces/utility/FreqEnvelope";

export class FilterEnvelope implements FreqEnvelope {
  output: Gain;
  private _amount: number;
  private _baseFrequency: number;
  private minOut = 20;
  private maxOut = 20000;
  private expScale: ScaleExp;
  private amountMult: Gain;
  private baseFrequencySignal: Signal<"frequency">;
  private baseFrequencyMult: Gain;
  private envelope: Envelope;

  constructor(baseFrequency: number) {
    this._amount = 1.0;
    this.envelope = new Envelope();
    this._baseFrequency = baseFrequency ? baseFrequency : this.minOut;
    this.baseFrequencySignal = new Signal(this._baseFrequency - this.minOut);
    this.baseFrequencyMult = new Gain(1 - this.minOut/this._baseFrequency);
    this.amountMult = new Gain(1.0);
    this.output = new Gain(1.0);
    this.expScale = new ScaleExp(this.minOut, this.maxOut, 2);

    this.envelope.chain(this.amountMult, this.expScale, this.output);
    this.baseFrequencySignal.chain(this.baseFrequencyMult, this.output);
  }

  get baseFrequency() {
    return this._baseFrequency
  }
  set baseFrequency(v: number) {
    if (v > this.maxOut) {
      throw `baseFrequency above ${this.maxOut} hz`;
    } else if (v < this.minOut) {
      throw `baseFrequency below ${this.minOut} hz`;
    }
    this._baseFrequency = v;
    this.baseFrequencySignal.setValueAtTime(
      this._baseFrequency - this.minOut,
      immediate()
    );
    this.baseFrequencyMult.gain.setValueAtTime(
      1 - this.minOut/this._baseFrequency,
      immediate()
    );
  }

  get amount() {
    return this._amount;
  }
  set amount(v: number) {
    this._amount = v;
    this.amountMult.gain.setValueAtTime(this._amount, immediate());
  }

  get attack() {
    return Time(this.envelope.attack).toSeconds();
  }
  set attack(v: number) {
    this.envelope.attack = v;
  }

  get decay() {
    return Time(this.envelope.decay).toSeconds();
  }
  set decay(v: number) {
    this.envelope.decay = v;
  }

  get sustain() {
    return this.envelope.sustain;
  }
  set sustain(v: number) {
    this.envelope.sustain = v;
  }

  get release() {
    return Time(this.envelope.release).toSeconds();
  }
  set release(v: number) {
    this.envelope.release = v;
  }

  triggerAttack(t: number) {
    this.envelope.triggerAttack(t);
    return this;
  }

  triggerRelease(t: number) {
    this.envelope.triggerRelease(t);
    return this;
  }

  cancel(t: number) {
    this.envelope.cancel(t)
    return this;
  }

  dispose() {
    this.envelope.disconnect(this.amountMult);
    this.amountMult.disconnect(this.expScale);
    this.expScale.disconnect(this.output);
    this.baseFrequencySignal.disconnect(this.baseFrequencyMult);
    this.baseFrequencyMult.disconnect(this.output);
    this.envelope.dispose();
    this.amountMult.dispose();
    this.expScale.dispose();
    this.baseFrequencySignal.dispose();
    this.baseFrequencyMult.dispose();
    this.output.dispose();
    return this;
  }
}