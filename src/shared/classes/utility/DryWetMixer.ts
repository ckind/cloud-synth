import { GainMixer } from "./GainMixer";
import { DryWet } from "../../interfaces/utility/DryWet";
import { ToneAudioNode, immediate } from "tone";

const DRY_CHANNEL = 0;
const WET_CHANNEL = 1;

export class DryWetMixer implements DryWet {
  readonly output: ToneAudioNode;
  private mixer: GainMixer;
  private _wetness: number;

  constructor(dryInput: ToneAudioNode, wetInput: ToneAudioNode) {
    this.mixer = new GainMixer(2);
    this.mixer.addInput(DRY_CHANNEL, dryInput);
    this.mixer.addInput(WET_CHANNEL, wetInput);
    this.mixer.balance();
    this._wetness = 0.0;
    this.output = this.mixer.output;
  }

  get wetness() {
    return this._wetness;
  }

  set wetness(n: number) {
    this.mixer.channel(DRY_CHANNEL).gain.setValueAtTime(1.0 - n, immediate());
    this.mixer.channel(WET_CHANNEL).gain.setValueAtTime(n, immediate());
  }
}
