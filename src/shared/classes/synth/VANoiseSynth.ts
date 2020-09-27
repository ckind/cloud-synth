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

  public receiveMidi(message: IMidiMessage, time?: number) {
    switch (message.midiFunction) {
      case MidiFunction.noteon:
        this.triggerAttack(time);
        break;
      case MidiFunction.noteoff:
        this.triggerRelease(time);
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

  private triggerAttack(time?: number) {
    this.filterEnvelope.triggerAttack(time ? time : immediate());
    this.ampEnvelope.triggerAttack(time ? time : immediate());
  }

  private triggerRelease(time?: number) {
    this.filterEnvelope.triggerRelease(time ? time : immediate());
    this.ampEnvelope.triggerRelease(time ? time : immediate());
  }

}