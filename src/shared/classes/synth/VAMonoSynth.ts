import {
  Oscillator,
  ScaleExp,
  Signal,
  ToneOscillatorType,
  immediate,
  Midi
} from "tone";
import { MidiMessage, MidiFunction } from "../../interfaces/midi/MidiMessage";
import { DryWetMixer } from "../utility/DryWetMixer";
import { VAMonoOscillatorChannel } from "../synth/VAMonoOscillatorChannel";
import { AnalogMonoSynthModule } from "../../interfaces/synth/AnalogMonoSynthModule";
import { VABaseSynth } from "./VABaseSynth";
import { OscillatorChannel } from '@/shared/interfaces/synth/OscillatorChannel';

export class VAMonoSynth extends VABaseSynth implements AnalogMonoSynthModule {
  // todo: replace VAMonoOscillatorChannel with an interface?
  readonly oscillators: Array<VAMonoOscillatorChannel>; 
  readonly pitch: Signal<"frequency">;
  readonly pitchModulation: ScaleExp;

  private readonly pitchModulationMixer: DryWetMixer;
  private currentMidiNote: number;
  private _oscillatorSpread: number;

  constructor(
    numOscillators: number,
    type: ToneOscillatorType
  ) {
    super();
    this.currentMidiNote = -1;
    this.pitch = new Signal<"frequency">(0);
    this.pitchModulation = new ScaleExp(20, 20000, 2);
    this.pitchModulationMixer = new DryWetMixer(
      this.pitch,
      this.pitchModulation
    );
    this.pitchModulationMixer.wetness = 0.0;
    this.oscillators = new Array<VAMonoOscillatorChannel>(numOscillators);
    for (let i = 0; i < numOscillators; i++) {
      this.oscillators[i] = new VAMonoOscillatorChannel(type);
      this.oscillators[i].output.connect(this.filter);
      this.pitchModulationMixer.output.connect(this.oscillators[i].frequency);
    }
    this._oscillatorSpread = 0;
    this.oscillatorSpread = 0; 
  }

  // oscillatorSpread
  get oscillatorSpread() {
    return this._oscillatorSpread;
  }
  set oscillatorSpread(s: number) {
    if (s > 1 || s < 0) {
      throw `given spread value ${s} is out of range (0, 1)`;
    }
    this._oscillatorSpread = s;
    // todo: come up with more general formula
    this.oscillators[0].pan = -1 * s;
    this.oscillators[1].pan = 0;
    this.oscillators[2].pan = 1 * s;

    // const oscCount = this.oscillators.length;
    // let spreadAmt = 2/(oscCount - 1);
    // let panAmt = -1;
    // this.oscillators.forEach(o => {
    //   o.pan = panAmt + spreadAmt;
    //   panAmt += panAmt;
    // }); 
  }

  // pitchModulationMix
  get pitchModulationMix() {
    return this.pitchModulationMixer.wetness;
  }
  set pitchModulationMix(w: number) {
    this.pitchModulationMixer.wetness = w;
  }

  receiveMidi(message: MidiMessage) {
    switch (message.midiFunction) {
      case MidiFunction.noteon:
        this.triggerAttack(message.noteNumber);
        break;
      case MidiFunction.noteoff:
        this.triggerRelease(message.noteNumber);
        break;
    }
  }

  private resetPhase() {
    // todo: need to figure this out
    this.oscillators.forEach(o => {
      o.reset();
    });
  }

  private triggerAttack(midiNote: number) {
    this.currentMidiNote = midiNote;
    // this.resetPhase();
    this.pitch.setValueAtTime(Midi(midiNote).toFrequency(), immediate());
    this.ampEnvelope.triggerAttack(immediate());
    this.filterEnvelope.triggerAttack(immediate());
  }

  private triggerRelease(midiNote: number) {
    if (midiNote === this.currentMidiNote) {
      this.ampEnvelope.cancel(immediate()); // because triggering release before attack finishes fucks up envelope
      this.filterEnvelope.cancel(immediate()); // todo: find a better way
      this.ampEnvelope.triggerRelease(immediate());
      this.filterEnvelope.triggerRelease(immediate());
    }
  }
}
