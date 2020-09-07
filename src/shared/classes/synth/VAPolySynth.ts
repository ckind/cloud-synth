import { Gain, ToneOscillatorType } from "tone";
import { MidiMessage, MidiFunction } from "../../interfaces/midi/MidiMessage";
import { VASynthVoice } from "../polyphonic/VASynthVoice";
import { BasicVoiceAssigner } from "../polyphonic/BasicVoiceAssigner";
import { PolyOscillator } from "./VAPolyOscillatorChannel";
import { AnalogSynthVoice } from "../../interfaces/polyphonic/AnalogSynthVoice";
import { VoiceAssigner } from "../../interfaces/polyphonic/VoiceAssigner";
import { OscillatorChannel } from "../../interfaces/synth/OscillatorChannel";
import { AnalogPolySynthModule } from "../../interfaces/synth/AnalogPolySynthModule";
import { VAMonoSynth } from './VAMonoSynth';

const defaults = {
  ampAttack: 0.1,
  ampDecay: 0.3,
  ampSustain: 0.5,
  ampRelease: 0.3,
  filterFrequency: 20,
  filterType: "lowpass",
  filterAttack: 0.3,
  filterDecay: 0.3,
  filterSustain: 0.3,
  filterRelease: 0.3,
  filterEnvAmt: 0.7
}

export class VAPolySynth implements AnalogPolySynthModule {
  readonly output: Gain;
  readonly oscillators: Array<OscillatorChannel>;
  readonly ampModulation: Gain;
  readonly filterFrequencyModulation: Gain;
  readonly filterQModulation: Gain;
  readonly pitchModulation: Gain;

  private readonly voices: Array<AnalogSynthVoice>;
  private readonly voiceAssigner: VoiceAssigner;
  private _ampAttack: number;
  private _ampDecay: number;
  private _ampSustain: number;
  private _ampRelease: number;
  private _filterAttack: number;
  private _filterDecay: number;
  private _filterSustain: number;
  private _filterRelease: number;
  private _filterType: BiquadFilterType;

  constructor(
    numVoices: number,
    numOscillators: number,
    type: ToneOscillatorType
  ) {
    this.output = new Gain(1);
    this.voices = new Array<AnalogSynthVoice>(numVoices);
    this.oscillators = new Array<OscillatorChannel>(numOscillators);
    this.pitchModulation = new Gain(1); // will be scaled by synthVoice
    this.ampModulation = new Gain(1); // will be scaled by synthVoice
    this.filterFrequencyModulation = new Gain(1); // will be scaled by synthVoice
    this.filterQModulation = new Gain(1); // will be scaled by synthVoice
    for (let i = 0; i < numVoices; i++) {
      this.voices[i] = new VASynthVoice(new VAMonoSynth(numOscillators, type));
      this.voices[i].synth.output.connect(this.output);
      this.pitchModulation.connect(this.voices[i].synth.pitchModulation);
      this.ampModulation.connect(this.voices[i].synth.ampModulation);
      this.filterFrequencyModulation.connect(this.voices[i].synth.filterFrequencyModulation);
      this.filterQModulation.connect(this.voices[i].synth.filterFrequencyModulation);
    }
    this.voiceAssigner = new BasicVoiceAssigner(this.voices);
    this._ampAttack = defaults.ampAttack;
    this._ampDecay = defaults.ampDecay;
    this._ampSustain = defaults.ampSustain;
    this._ampRelease = defaults.ampRelease;
    this._filterAttack = defaults.filterAttack;
    this._filterDecay = defaults.filterDecay;
    this._filterSustain = defaults.filterSustain;
    this._filterRelease = defaults.filterRelease;
    this.filterFrequency = defaults.filterFrequency;
    this._filterType = defaults.filterType as BiquadFilterType;
    this.filterEnvelopeAmount = defaults.filterEnvAmt;
    const oscGroup = new Array<OscillatorChannel>(numVoices);
    for (let i = 0; i < this.voices[0].synth.oscillators.length; i++) {
      this.voices.forEach((v, index) => {
        oscGroup[index] = v.synth.oscillators[i];
      });
      this.oscillators[i] = new PolyOscillator(oscGroup);
    } 
  }

  // oscillatorSpread
  get oscillatorSpread() {
    return this.voices[0].synth.oscillatorSpread;
  }

  set oscillatorSpread(s: number) {
    this.voices.forEach(v => {
      v.synth.oscillatorSpread = s;
    });
  }

  // pitchModulationMix
  get pitchModulationMix() {
    return this.voices[0].synth.pitchModulationMix; // should all be the same
  }
  set pitchModulationMix(w: number) {
    this.voices.forEach(v => {
      v.synth.pitchModulationMix = w;
    });
  }

  // filterEnvelopeAmount
  get filterEnvelopeAmount() {
    return this.voices[0].synth.filterEnvelopeAmount;
  }
  set filterEnvelopeAmount(a: number) {
    this.voices.forEach(v => {
      v.synth.filterEnvelopeAmount = a;
    });
  }

  // ampModulationMix
  get ampModulationMix() {
    return this.voices[0].synth.ampModulationMix; // should all be the same
  }
  set ampModulationMix(m: number) {
    this.voices.forEach(v => {
      v.synth.ampModulationMix = m;
    });
  }

  // filterFrequencyMix
  get filterFrequencyModulationMix() {
    return this.voices[0].synth.filterFrequencyModulationMix; // should all be the same
  }
  set filterFrequencyModulationMix(m: number) {
    this.voices.forEach(v => {
      v.synth.filterFrequencyModulationMix = m;
    });
  }

  // filterQModulationMix
  get filterQModulationMix() {
    return this.voices[0].synth.filterQModulationMix; // should all be the same
  }
  set filterQModulationMix(m: number) {
    this.voices.forEach(v => {
      v.synth.filterQModulationMix = m;
    });
  }

  // filterFrequency
  get filterFrequency() {
    return this.voices[0].synth.filterFrequency; // should all be the same
  }
  set filterFrequency(f: number) {
    this.voices.forEach(v => {
      v.synth.filterFrequency = f;
    });
  }

  // filterQ
  get filterQ() {
    return this.voices[0].synth.filterQ; // should all be the same
  }
  set filterQ(q: number) {
    this.voices.forEach(v => {
      v.synth.filterQ = q;
    });
  }

  // ampAttack
  get ampAttack() {
    return this._ampAttack;
  }
  set ampAttack(attack: number) {
    this._ampAttack = attack;
    this.voices.forEach(v => {
      v.synth.ampAttack = attack;
    });
  }

  // ampDecay
  get ampDecay() {
    return this._ampDecay;
  }
  set ampDecay(decay: number) {
    this._ampDecay = decay;
    this.voices.forEach(v => {
      v.synth.ampDecay = decay;
    });
  }

  // ampSustain
  get ampSustain() {
    return this._ampSustain;
  }
  set ampSustain(sustain: number) {
    this._ampSustain = sustain;
    this.voices.forEach(v => {
      v.synth.ampSustain = sustain;
    });
  }

  // ampRelease
  get ampRelease() {
    return this._ampRelease;
  }
  set ampRelease(release: number) {
    this._ampRelease = release;
    this.voices.forEach(v => {
      v.synth.ampRelease = release;
    });
  }

  // filterAttack
  get filterAttack() {
    return this._filterAttack;
  }
  set filterAttack(attack: number) {
    this._filterAttack = attack;
    this.voices.forEach(v => {
      v.synth.filterAttack = attack;
    });
  }

  // filterDecay
  get filterDecay() {
    return this._filterDecay;
  }
  set filterDecay(decay: number) {
    this._filterDecay = decay;
    this.voices.forEach(v => {
      v.synth.filterDecay = decay;
    });
  }

  // filterSustain
  get filterSustain() {
    return this._filterSustain;
  }
  set filterSustain(sustain: number) {
    this._filterSustain = sustain;
    this.voices.forEach(v => {
      v.synth.filterSustain = sustain;
    });
  }

  // filterRelease
  get filterRelease() {
    return this._filterRelease;
  }
  set filterRelease(release: number) {
    this._filterRelease = release;
    this.voices.forEach(v => {
      v.synth.filterRelease = release;
    });
  }

  // filterType
  get filterType() {
    return this._filterType;
  }
  set filterType(type: BiquadFilterType) {
    this._filterType = type;
    this.voices.forEach(v => {
      v.synth.filterType = type;
    });
  }

  receiveMidi(message: MidiMessage) {
    let voiceNum: number;
    switch (message.midiFunction) {
      case MidiFunction.noteon:
        voiceNum = this.voiceAssigner.assignNoteOn(message.noteNumber);
        if (voiceNum > -1) {
          this.voices[voiceNum].currentMidiNote = message.noteNumber;
          this.voices[voiceNum].isActive = true;
          this.voices[voiceNum].synth.receiveMidi(message);
        } else {
          // nothing to do - no voices available
        }
        break;
      case MidiFunction.noteoff:
        voiceNum = this.voiceAssigner.assignNoteOff(message.noteNumber);
        if (voiceNum > -1) {
          this.voices[voiceNum].currentMidiNote = -1;
          this.voices[voiceNum].isActive = false;
          this.voices[voiceNum].synth.receiveMidi(message);
        } else {
          // nothing to do - no voices available
        }
        break;
    }
  }
}
