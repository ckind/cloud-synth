import { ToneOscillatorType, Signal, Param, Volume } from "tone";
import { OscillatorChannel } from "../../interfaces/synth/OscillatorChannel";

export class PolyOscillator implements OscillatorChannel {
  readonly detune: Signal<"cents">;
  readonly frequency: Signal<"frequency">;
  private readonly oscGroup: Array<OscillatorChannel>;
  private _type: ToneOscillatorType;
  private _volume: number;
  private _pan: number;

  constructor(oscGroup: Array<OscillatorChannel>) {
    this._type = oscGroup[0].type;
    this.detune = new Signal(0, "cents");
    this.frequency = new Signal(0, "frequency");
    this.oscGroup = oscGroup;
    this.oscGroup.forEach(o => {
      o.type = this._type;
      this.detune.connect(o.detune);
      this.frequency.connect(o.frequency);
    });
    this._volume = this.oscGroup[0].volume;
    this._pan = this.oscGroup[0].pan;
  }

  reset() {
    this.oscGroup.forEach(o => {
      this.detune.disconnect(o.detune);
      this.frequency.disconnect(o.frequency);
      o.reset();
      this.detune.connect(o.detune);
      this.frequency.connect(o.frequency);
    });
  }

  dispose() {
    this.oscGroup.forEach(o => {
      this.detune.disconnect(o.detune);
      this.frequency.disconnect(o.frequency);
      o.dispose();
    });
    this.detune.dispose();
    this.frequency.dispose();
  }

  get volume() {
    return this._volume;
  }

  set volume(v: number) {
    this.oscGroup.forEach(o => {
      o.volume = v;
    });
  }

  get pan() {
    return this._pan;
  }

  set pan(p: number) {
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
