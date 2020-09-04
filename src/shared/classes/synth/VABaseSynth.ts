import { SubtractiveSynthModule } from "../../interfaces/synth/SubtractiveSynthModule";
import { FilterEnvelope } from "../utility/FilterEnvelope";
import { DryWetMixer } from "../utility/DryWetMixer";
import { Envelope, Filter, ScaleExp, Scale, Gain, Signal, immediate, Time, Frequency } from "tone";
import { MidiMessage } from '@/shared/interfaces/midi/MidiMessage';

export abstract class VABaseSynth implements SubtractiveSynthModule {
  readonly output: Gain;
  readonly ampModulation: Scale;
  readonly filterFrequencyModulation: ScaleExp;
  readonly filterQModulation: Scale;

  protected readonly ampEnvelope: Envelope;
  protected readonly filterEnvelope: FilterEnvelope;
  protected readonly filter: Filter;
  protected readonly ampModulationMixer: DryWetMixer;
  protected readonly ampModulationStage: Gain;
  protected readonly filterFrequencyModulationMixer: DryWetMixer;
  protected readonly filterQModulationMixer: DryWetMixer;
  protected readonly filterQSignal: Signal<"positive">;

  constructor() {
    this.output = new Gain(1);

    this.ampEnvelope = new Envelope(0.1, 0.1, 0.8, 0.2);
    this.ampModulation = new Scale(0, 1);
    this.ampModulationStage = new Gain(0);
    this.ampModulationMixer = new DryWetMixer(
      this.ampEnvelope,
      this.ampModulation
    );
    this.ampModulationMixer.wetness = 0.0;
    this.ampModulationMixer.output.connect(this.ampModulationStage.gain);

    this.filter = new Filter(0, "lowpass", -24); // frequency set by envelope baseFrequency
    this.filterFrequencyModulation = new ScaleExp(20, 20000, 2);
    this.filterEnvelope = new FilterEnvelope(20);
    this.filterEnvelope.baseFrequency = 20000;
    this.filterEnvelope.amount = 1.0;
    this.filterFrequencyModulationMixer = new DryWetMixer(
      this.filterEnvelope.output,
      this.filterFrequencyModulation
    );
    this.filterFrequencyModulationMixer.wetness = 0.0;
    this.filterFrequencyModulationMixer.output.connect(this.filter.frequency);
    this.filterQSignal = new Signal<"positive">(0);
    this.filterQModulation = new Scale(0, 12);
    this.filterQModulationMixer = new DryWetMixer(
      this.filterQSignal,
      this.filterQModulation
    );
    this.filterQModulationMixer.output.connect(this.filter.Q);

    this.filter.chain(this.ampModulationStage, this.output);
  }

  // ampModulationMix
  get ampModulationMix() {
    return this.ampModulationMixer.wetness;
  }
  set ampModulationMix(w: number) {
    this.ampModulationMixer.wetness = w;
  }

  // filterFrequencyModulationMix
  get filterFrequencyModulationMix() {
    return this.filterFrequencyModulationMixer.wetness;
  }
  set filterFrequencyModulationMix(w: number) {
    this.filterFrequencyModulationMixer.wetness = w;
  }

  // filterQModulationMix
  get filterQModulationMix() {
    return this.filterQModulationMixer.wetness;
  }
  set filterQModulationMix(w: number) {
    this.filterQModulationMixer.wetness = w;
  }

  // filterFrequency
  get filterFrequency() {
    return Frequency(this.filterEnvelope.baseFrequency).toFrequency();
  }
  set filterFrequency(f: number) {
    this.filterEnvelope.baseFrequency = Frequency(f).toFrequency();
  }

  // filterQ
  get filterQ() {
    return this.filter.Q.getValueAtTime(immediate());
  }
  set filterQ(n: number) {
    this.filter.Q.setValueAtTime(n, immediate());
  }

  // filterEnvelopeAmount
  get filterEnvelopeAmount() {
    return this.filterEnvelope.amount;
  }
  set filterEnvelopeAmount(n: number) {
    this.filterEnvelope.amount = n;
  }

  // ampAttack
  get ampAttack() {
    return Time(this.ampEnvelope.attack).toMilliseconds();
  }
  set ampAttack(attack: number) {
    this.ampEnvelope.attack = attack/1000; // convert to seconds
  }

  // ampDecay
  get ampDecay() {
    return Time(this.ampEnvelope.decay).toMilliseconds();
  }
  set ampDecay(decay: number) {
    this.ampEnvelope.decay = decay/1000;
  }

  // ampSustain
  get ampSustain() {
    return this.ampEnvelope.sustain;
  }
  set ampSustain(sustain: number) {
    this.ampEnvelope.sustain = sustain;
  }

  // ampRelease
  get ampRelease() {
    return Time(this.ampEnvelope.release).toMilliseconds();
  }
  set ampRelease(release: number) {
    this.ampEnvelope.release = release/1000;
  }

  // filterAttack
  get filterAttack() {
    return Time(this.filterEnvelope.attack).toMilliseconds();
  }
  set filterAttack(attack: number) {
    this.filterEnvelope.attack = attack/1000;
  }

  // filterDecay
  get filterDecay() {
    return Time(this.filterEnvelope.decay).toMilliseconds();
  }
  set filterDecay(decay: number) {
    this.filterEnvelope.decay = decay/1000;
  }

  // filterSustain
  get filterSustain() {
    return this.filterEnvelope.sustain;
  }
  set filterSustain(sustain: number) {
    this.filterEnvelope.sustain = sustain;
  }

  // filterRelease
  get filterRelease() {
    return Time(this.filterEnvelope.release).toMilliseconds();
  }
  set filterRelease(release: number) {
    this.filterEnvelope.release = release/1000;
  }

  // filterType
  get filterType() {
    return this.filter.type;
  }
  set filterType(type: BiquadFilterType) {
    this.filter.type = type;
  }

  receiveMidi(message: MidiMessage) {
    throw "receiveMidi midi must be overriden in child class";
  }

}