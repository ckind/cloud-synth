import { NoiseType } from "../../interfaces/synth/NoiseModule";
import { MidiReceiver } from "../../interfaces/midi/MidiReceiver";
import { MidiMessage } from "../../interfaces/midi/MidiMessage";
import { Noise, immediate, Time } from "tone";
import { VABaseSynth } from "./VABaseSynth";

export class VANoiseSynth extends VABaseSynth implements MidiReceiver {
  private readonly noiseSource: Noise;
  private _noiseType: NoiseType;

  constructor(type: NoiseType) {
    super();
    this._noiseType = type;
    this.noiseSource = new Noise(type).start().connect(this.filter);
  }

  public receiveMidi(message: MidiMessage) {
    switch (message.midiFunction) {
      case "noteon":
        this.triggerAttack();
        break;
      case "noteoff":
        this.triggerRelease();
        break;
    }
  }

  // noiseType
  get noiseType() {
    return this._noiseType;
  }
  set noiseType(t: NoiseType) {
    this._noiseType = t;
    this.noiseSource.type = t;
  }

  private triggerAttack() {
    this.filterEnvelope.triggerAttack(immediate());
    this.ampEnvelope.triggerAttack(immediate());
  }

  private triggerRelease() {
    this.filterEnvelope.triggerRelease(immediate());
    this.ampEnvelope.triggerRelease(immediate());
  }

}