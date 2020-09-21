import { NoiseType } from "../../interfaces/synth/NoiseModule";
import { IMidiReceiver } from "../../interfaces/midi/IMidiReceiver";
import { IMidiMessage, MidiFunction } from "../../interfaces/midi/IMidiMessage";
import { Noise, immediate, Time } from "tone";
import { VABaseSynth } from "./VABaseSynth";

export class VANoiseSynth extends VABaseSynth implements IMidiReceiver {
  private readonly noiseSource: Noise;
  private _noiseType: NoiseType;

  constructor(type: NoiseType) {
    super();
    this._noiseType = type;
    this.noiseSource = new Noise(type).start().connect(this.filter);
  }

  dispose() {
    this.noiseSource.disconnect(this.filter);
    this.noiseSource.dispose();
    super.dispose();
  }

  public receiveMidi(message: IMidiMessage) {
    switch (message.midiFunction) {
      case MidiFunction.noteon:
        this.triggerAttack();
        break;
      case MidiFunction.noteoff:
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