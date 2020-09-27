import {
  ScaleExp,
  Signal,
  ToneOscillatorType,
  immediate,
  Midi,
  Transport
} from "tone";
import { IMidiMessage, MidiFunction } from "../../interfaces/midi/IMidiMessage";
import { DryWetMixer } from "../utility/DryWetMixer";
import { VAMonoOscillatorChannel } from "../synth/VAMonoOscillatorChannel";
import { AnalogMonoSynthModule } from "../../interfaces/synth/AnalogMonoSynthModule";
import { VABaseSynth } from "./VABaseSynth";

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

  dispose() {
    this.oscillators.forEach(osc => {
      osc.output.disconnect(this.filter);
      this.pitchModulationMixer.output.disconnect(osc.frequency);
      osc.dispose();
    });
    this.pitch.dispose();
    this.pitchModulation.dispose();
    this.pitchModulationMixer.dispose();
    
    super.dispose();
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
    const spacing = 2 / (this.oscillators.length - 1);
    let p = -1;
    this.oscillators.forEach(o => {
      o.pan = p * s;
      p += spacing;
    });
  }

  // pitchModulationMix
  get pitchModulationMix() {
    return this.pitchModulationMixer.wetness;
  }
  set pitchModulationMix(w: number) {
    this.pitchModulationMixer.wetness = w;
  }

  receiveMidi(message: IMidiMessage, time?: number) {
    switch (message.midiFunction) {
      case MidiFunction.noteon:
        this.triggerAttack(message.noteNumber, time);
        break;
      case MidiFunction.noteoff:
        this.triggerRelease(message.noteNumber, time);
        break;
    }
  }

  private resetPhase() {
    // todo: need to figure this out
    this.oscillators.forEach(o => {
      o.reset();
    });
  }

  private triggerAttack(midiNote: number, time?: number) {
    this.currentMidiNote = midiNote;
    // this.resetPhase();
    this.pitch.setValueAtTime(Midi(midiNote).toFrequency(), time ? time : immediate());
    this.ampEnvelope.triggerAttack(time ? time - Transport.sampleTime : immediate());
    this.filterEnvelope.triggerAttack(time ? time - Transport.sampleTime : immediate());
  }

  private triggerRelease(midiNote: number, time?: number) {
    if (midiNote === this.currentMidiNote) {
      this.ampEnvelope.cancel(time ? time : immediate()); // because triggering release before attack finishes fucks up envelope
      this.filterEnvelope.cancel(time ? time : immediate()); // todo: find a better way
      this.ampEnvelope.triggerRelease(time ? time : immediate());
      this.filterEnvelope.triggerRelease(time ? time : immediate());
    }
  }
}
