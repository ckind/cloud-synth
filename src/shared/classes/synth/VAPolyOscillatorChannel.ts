import { ToneOscillatorType, Signal } from "tone";
import { OscillatorChannel } from "../../interfaces/synth/OscillatorChannel";

export class VAPolyOscillatorChannel implements OscillatorChannel {
  readonly frequency: Signal<"frequency">;

  private readonly oscGroup: Array<OscillatorChannel>;
  private _detune: number;
  private _type: ToneOscillatorType;
  private _volume: number;
  private _pan: number;
  private _transpose: number;

  constructor(oscGroup: Array<OscillatorChannel>) {
    this._type = oscGroup[0].type;
    this._transpose = 0;
    this._detune = 0;
    this._volume = 0;
    this._pan = 0;
    this.frequency = new Signal(0, "frequency");
    this.oscGroup = oscGroup;
    this.oscGroup.forEach(o => {
      o.type = this._type;
      o.transpose = this._transpose;
      o.detune = this._detune;
      o.volume = this._volume;
      o.pan = this._pan;
      this.frequency.connect(o.frequency);
    });
  }

  reset() {
    this.oscGroup.forEach(o => {
      this.frequency.disconnect(o.frequency);
      o.reset();
      this.frequency.connect(o.frequency);
      o.transpose = this._transpose;
      o.detune = this._detune;
    });
  }

  dispose() {
    this.oscGroup.forEach(o => {
      this.frequency.disconnect(o.frequency);
      // o.dispose(); don't dispose this -- should be handled by the voice it belongs to
    });
    this.frequency.dispose();
  }

  get detune() {
    return this._detune;
  }
  set detune(d: number) {
    this._detune = d;
    // todo: will this affect oscillator phase?
    this.oscGroup.forEach(o => {
      o.detune = d;
    });
  }

  get transpose() {
    return this._transpose;
  }
  set transpose(t: number) {
    this._transpose = t;
    // todo: phase?
    this.oscGroup.forEach(o => {
      o.transpose = t;
    });
  }

  get volume() {
    return this._volume;
  }
  set volume(v: number) {
    this._volume = v;
    this.oscGroup.forEach(o => {
      o.volume = v;
    });
  }

  get pan() {
    return this._pan;
  }
  set pan(p: number) {
    this._pan = p;
    this.oscGroup.forEach(o => {
      o.pan = p;
    });
  }

  get type() {
    return this._type;
  }
  set type(t: ToneOscillatorType) {
    this._type = t;
    this.oscGroup.forEach(o => {
      o.type = t;
    });
  }
}
