import { ToneOscillatorType, Signal } from "tone";
import { SynthOscillator } from "../../interfaces/synth/SynthOscillator";

export class PolyOscillator implements SynthOscillator {
  readonly detune: Signal<"cents">;
  readonly frequency: Signal<"frequency">;
  private readonly oscGroup: Array<SynthOscillator>;
  private _type: ToneOscillatorType;

  constructor(oscGroup: Array<SynthOscillator>) {
    this._type = oscGroup[0].type;
    this.detune = new Signal(0, "cents");
    this.frequency = new Signal(0, "frequency");
    this.oscGroup = oscGroup;
    this.oscGroup.forEach(o => {
      o.type = this._type;
      this.detune.connect(o.detune);
      // this.frequency.connect(o.frequency);
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
