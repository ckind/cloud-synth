import {
  Gain,
  Oscillator,
  Envelope,
  Filter,
  Scale,
  ScaleExp,
  Signal,
  ToneOscillatorType,
  immediate,
  Midi,
  Time,
  Frequency
} from "tone";
import { MidiMessage, MidiFunction } from "../../interfaces/midi/MidiMessage";
import { DryWetMixer } from "../utility/DryWetMixer";
import { AnalogMonoSynthModule } from "../../interfaces/synth/AnalogMonoSynthModule";
import { FilterEnvelope } from "../utility/FilterEnvelope";
import { VABaseSynth } from "./VABaseSynth";

export class VAMonoSynth extends VABaseSynth implements AnalogMonoSynthModule {
  readonly oscillators: Array<Oscillator>;
  readonly pitch: Signal<"frequency">;
  readonly pitchModulation: ScaleExp;

  private readonly pitchModulationMixer: DryWetMixer;
  private currentMidiNote: number;

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
    this.oscillators = new Array<Oscillator>(numOscillators);
    for (let i = 0; i < numOscillators; i++) {
      this.oscillators[i] = new Oscillator(0, type)
        .start(immediate())
        .connect(this.filter);
      this.pitchModulationMixer.output.connect(this.oscillators[i].frequency);
    }    
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

  private triggerAttack(midiNote: number) {
    this.currentMidiNote = midiNote;
    this.pitch.setValueAtTime(Midi(midiNote).toFrequency(), immediate());
    this.ampEnvelope.triggerAttack(immediate());
    this.filterEnvelope.triggerAttack(immediate());
  }

  private triggerRelease(midiNote: number) {
    if (midiNote === this.currentMidiNote) {
      this.ampEnvelope.cancel(immediate()); // because triggering release before attack finishes fucks up envelope
      this.filterEnvelope.cancel(immediate()); // find a better way
      this.ampEnvelope.triggerRelease(immediate());
      this.filterEnvelope.triggerRelease(immediate());
    }
  }
}
