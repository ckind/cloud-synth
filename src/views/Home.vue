<template>
  <div class="home">
    <div class="row">
      <div class="col-4">
        <div class="row" v-for="(o, i) in synth.oscillators" :key="i">
          <div class="col-4">
            <knob-control
              v-model="oscillatorTunings[i][0]"
              :minValue="-1200"
              :maxValue="1200"
              :step="100"
              :id="`oscillator${i + 1}TransposeControl`"
              :label="`Osc ${i + 1} Transpose`"
              @input="
                v => {
                  oscillatorTunings[i][0] = v;
                  oscillatorDetuneControlChange();
                }
              "
              size="70"
            ></knob-control>
          </div>
          <div class="col-4">
            <knob-control
              v-model="oscillatorTunings[i][1]"
              :minValue="-50"
              :maxValue="50"
              :id="`oscillator${i + 1}FineTuningControl`"
              :label="`Fine Tune`"
              @input="
                v => {
                  oscillatorTunings[i][1] = v;
                  oscillatorDetuneControlChange();
                }
              "
              size="70"
            ></knob-control>
          </div>
          <div class="col-4 waveform-select-container">
            <select class="waveform-select" v-model="synth.oscillators[i].type">
              <option
                v-for="(waveform, j) in waveforms"
                :key="j"
                :value="waveform"
              >
                {{ waveform }}
              </option>
            </select>
          </div>
        </div>
        <div class="row">
          <div class="col-4" />
          <div class="col-4">
            <knob-control
              v-model="oscillatorTunings[0][0]"
              :minValue="-1200"
              :maxValue="1200"
              :step="100"
              id="noiseLevelKnob"
              label="Noise Level"
              size="70"
            ></knob-control>
          </div>
          <div class="col-4 waveform-select-container">
            <select class="waveform-select" v-model="noiseTypeIndex">
              <option v-for="(noiseType, j) in noiseTypes" :key="j" :value="j">
                {{ noiseType }}
              </option>
            </select>
          </div>
        </div>
      </div>
      <div class="col-4">
        <adsr-graph class="adsr" v-model="filterEnv" :width="300" />
        <div class="row">
          <div class="col-1" />
          <div class="col-10">
            <div class="row">
              <div class="col-3">
                <knob-control-new
                  v-model="synth.filterFrequency"
                  :minValue="20"
                  :maxValue="20000"
                  id="filterFrequencyKnob"
                  label="Cutoff"
                  scale="quadratic bezier"
                  size="70"
                ></knob-control-new>
              </div>
              <div class="col-3">
                <knob-control
                  v-model="synth.filterQ"
                  :minValue="0"
                  :maxValue="10"
                  id="filterQKnob"
                  label="Q"
                  size="70"
                ></knob-control>
              </div>
              <div class="col-3">
                <knob-control
                  v-model="synth.filterEnvelopeAmount"
                  :minValue="0"
                  :maxValue="1"
                  id="envAmtKnob"
                  label="Env Amt"
                  size="70"
                ></knob-control>
              </div>
              <div class="col-3">
                <knob-control
                  v-model="filterTypeIndex"
                  :minValue="0"
                  :maxValue="2"
                  id="filterTypeKnob"
                  label="Type"
                  size="70"
                ></knob-control>
              </div>
            </div>
          </div>
          <div class="col-1" />
        </div>
        <div class="row">
          <div class="col-6">
            <knob-control
              v-model="filterLFOAmt"
              :minValue="0"
              :maxValue="1"
              id="filterModKnob"
              label="Filter Mod"
            ></knob-control>
          </div>
          <div class="col-6">
            <knob-control
              v-model="filterLFORate"
              :minValue="0"
              :maxValue="10"
              id="filterModRateKnob"
              label="Mod Rate"
            ></knob-control>
          </div>
        </div>
      </div>
      <div class="col-4">
        <adsr-graph class="adsr" v-model="ampEnv" :width="300" />
        <!--
        <div class="row">
          <div class="col-6">
            <knob-control
              v-model="ampLFOAmt"
              :minValue="0"
              :maxValue="1"
              id="ampModKnob"
              label="Amp Mod"
            ></knob-control>
          </div>
          <div class="col-6">
            <knob-control
              v-model="ampLFORate"
              :minValue="0"
              :maxValue="10"
              id="ampModRateKnob"
              label="Mod Rate"
            ></knob-control>
          </div>
        </div>
        -->
        <div class="row">
          <div class="col-6">
            <knob-control
              v-model="pitchLFOAmt"
              :minValue="0"
              :maxValue="0.1"
              id="pitchModKnob"
              label="Pitch Mod"
            ></knob-control>
          </div>
          <div class="col-6">
            <knob-control
              v-model="pitchLFORate"
              :minValue="0"
              :maxValue="10"
              id="pitchModRateKnob"
              label="Mod Rate"
            ></knob-control>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <knob-control
              v-model="volumeLevel"
              :minValue="-60"
              :maxValue="0"
              id="volumeLevelKnob"
              label="Volume"
            ></knob-control>
          </div>
        </div>
      </div>
    </div>
    <div class="row keyboard-container">
      <piano-keyboard ref="pianoKeyboard"></piano-keyboard>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import PianoKeyboard from "@/components/PianoKeyboard.vue";
import ParamControl from "@/components/ParamControl.vue";
import AdsrGraph from "@/components/AdsrGraph.vue";
import KnobControl from "@/components/KnobControl.vue";
import KnobControlNew from "@/components/KnobControlNew.vue";
import { VAPolySynth } from "@/shared/classes/synth/VAPolySynth";
import * as Tone from "tone";
import { ToneOscillatorType } from "tone";
import { QuadBezierCurvedRange } from "@/shared/classes/utility/QuadBezierCurvedRange";
import { VANoiseSynth } from "@/shared/classes/synth/VANoiseSynth";

@Component({
  components: {
    PianoKeyboard,
    ParamControl,
    AdsrGraph,
    KnobControl,
    KnobControlNew
  }
})
export default class Home extends Vue {
  private synth: VAPolySynth;
  private oscillatorTunings: Array<Array<number>>;
  private volume: Tone.Volume;
  private volumeLevel: number;
  private LFORateCurve: QuadBezierCurvedRange;
  private LFOAmtCurve: QuadBezierCurvedRange;
  private filterLFORate: number;
  private filterLFOAmt: number;
  private filterLFO: Tone.LFO;
  private ampLFORate: number;
  private ampLFOAmt: number;
  private ampLFO: Tone.LFO;
  private pitchLFORate: number;
  private pitchLFOAmt: number;
  private pitchLFO: Tone.LFO;
  private waveforms: Array<Tone.ToneOscillatorType>;
  private noiseTypes: Array<string>;
  private noiseTypeIndex: number;
  private filterTypes: Array<BiquadFilterType>;
  private filterTypeIndex: number;
  private ampEnv: Record<string, number>;
  private filterEnv: Record<string, number>;
  private verb: Tone.Reverb;
  private noise: VANoiseSynth;

  $refs!: {
    pianoKeyboard: PianoKeyboard;
  };

  private test() {
    const min = 20;
    const max = 20000;
    const step = 100;
    const range = new QuadBezierCurvedRange(min, max);
    for (let i = min; i <= max; i += step) {
      console.log(i);
      console.log(
        "linear value",
        range.getLinearValue(range.getCurvedValue(i))
      );
      console.log("curved value", range.getCurvedValue(i));
    }
    console.log(max);
    console.log(
      "linear value",
      range.getLinearValue(range.getCurvedValue(max))
    );
    console.log("curved value", range.getCurvedValue(max));
  }

  public constructor() {
    super();

    try {
      this.test();
    } catch (err) {
      console.log(`Error! ${err}`);
    }

    this.verb = new Tone.Reverb();
    this.verb.wet.setValueAtTime(0.5, Tone.immediate());

    Tone.start().then(() => {
      Tone.Transport.start();
      this.verb.generate();
    });

    const numOscillators = 3;

    this.synth = new VAPolySynth(6, numOscillators, "square");
    this.volumeLevel = -24;
    this.volume = new Tone.Volume(this.volumeLevel);
    this.synth.output.chain(this.volume, Tone.Master);

    this.noise = new VANoiseSynth("white");
    // this.noise.output.chain(this.volume, Tone.Master);

    this.LFORateCurve = new QuadBezierCurvedRange(0, 10);
    this.LFOAmtCurve = new QuadBezierCurvedRange(0, 1);

    this.filterLFORate = 4;
    this.filterLFOAmt = 0;
    this.filterLFO = new Tone.LFO(this.filterLFORate);

    this.ampLFORate = 4;
    this.ampLFOAmt = 0;
    this.ampLFO = new Tone.LFO(this.ampLFORate);

    this.pitchLFORate = 4;
    this.pitchLFOAmt = 0;
    this.pitchLFO = new Tone.LFO(this.pitchLFORate);

    this.filterLFO.start().connect(this.synth.filterFrequencyModulation);
    this.ampLFO.start().connect(this.synth.ampModulation);
    this.pitchLFO.start().connect(this.synth.pitchModulation);

    this.waveforms = new Array<Tone.ToneOscillatorType>(4);
    this.waveforms[0] = "sine";
    this.waveforms[1] = "triangle";
    this.waveforms[2] = "sawtooth";
    this.waveforms[3] = "square";

    this.noiseTypes = new Array<string>(3);
    this.noiseTypes[0] = "white";
    this.noiseTypes[1] = "pink";
    this.noiseTypes[2] = "brown";
    this.noiseTypeIndex = 0;

    this.filterTypes = new Array<BiquadFilterType>(3);
    this.filterTypes[0] = "lowpass";
    this.filterTypes[1] = "bandpass";
    this.filterTypes[2] = "highpass";
    this.filterTypeIndex = 0;
    this.synth.filterType = this.filterTypes[this.filterTypeIndex];

    this.oscillatorTunings = new Array<Array<number>>(numOscillators);
    for (let i = 0; i < numOscillators; i++) {
      this.oscillatorTunings[i] = new Array<number>(2);
      this.oscillatorTunings[i][0] = 0;
      this.oscillatorTunings[i][1] = 0;
    }

    this.ampEnv = {
      attack: this.synth.ampAttack,
      decay: this.synth.ampDecay,
      sustain: this.synth.ampSustain,
      release: this.synth.ampRelease
    };

    this.filterEnv = {
      attack: this.synth.filterAttack,
      decay: this.synth.filterDecay,
      sustain: this.synth.filterSustain,
      release: this.synth.filterRelease
    };
  }

  mounted() {
    this.$refs.pianoKeyboard.connect(this.synth);
    this.$refs.pianoKeyboard.connect(this.noise);
  }

  // Computed

  // Methods

  private waveformSelectChange(e: HTMLInputElement, i: number) {
    this.synth.oscillators[i].type = this.waveforms[parseInt(e.value)];
  }

  private oscillatorDetuneControlChange() {
    this.synth.oscillators.forEach((o, i) => {
      o.detune.setValueAtTime(
        this.oscillatorTunings[i][0] + this.oscillatorTunings[i][1],
        Tone.immediate()
      );
    });
    this.$forceUpdate();
  }

  // Watches

  @Watch("volumeLevel")
  private onVolumeLevelChanged(value: number) {
    this.volume.volume.setValueAtTime(value, Tone.immediate());
  }

  @Watch("filterLFOAmt")
  private onFilterLFOAmtChanged(value: number) {
    this.synth.filterFrequencyModulationMix = this.LFOAmtCurve.getCurvedValue(
      value
    );
  }
  @Watch("filterLFORate")
  private onFilterLFORateChanged(value: number) {
    this.filterLFO.frequency.setValueAtTime(
      this.LFORateCurve.getCurvedValue(value),
      Tone.immediate()
    );
  }

  @Watch("ampLFOAmt")
  private onAmpLFOAmtChanged(value: number) {
    this.synth.ampModulationMix = this.LFOAmtCurve.getCurvedValue(value);
  }
  @Watch("ampLFORate")
  private onAmpLFORateChange(value: number) {
    this.ampLFO.frequency.setValueAtTime(value, Tone.immediate());
  }

  @Watch("pitchLFOAmt")
  private onPitchLFOAmtChanged(value: number) {
    this.synth.pitchModulationMix = this.LFOAmtCurve.getCurvedValue(value);
  }
  @Watch("pitchLFORate")
  private onPitchLFORateChange(value: number) {
    this.pitchLFO.frequency.setValueAtTime(
      this.LFORateCurve.getCurvedValue(value),
      Tone.immediate()
    );
  }

  @Watch("ampEnv.attack")
  private onAmpEnvAttackChange(value: number) {
    this.synth.ampAttack = value;
    this.noise.ampAttack = value;
    // forceUpdate is needed because vue won't detect changes in the getter for ampAttack
    this.$forceUpdate();
  }
  @Watch("ampEnv.decay")
  private onAmpEnvDecayChange(value: number) {
    this.synth.ampDecay = value;
    this.noise.ampDecay = value;
    this.$forceUpdate();
  }
  @Watch("ampEnv.sustain")
  private onAmpEnvSustainChange(value: number) {
    this.synth.ampSustain = value;
    this.noise.ampSustain = value;
    this.$forceUpdate();
  }
  @Watch("ampEnv.release")
  private onAmpEnvReleaseChange(value: number) {
    this.synth.ampRelease = value;
    this.noise.ampRelease = value;
    this.$forceUpdate();
  }

  @Watch("filterEnv.attack")
  private onfilterEnvAttackChange(value: number) {
    this.synth.filterAttack = value;
    this.noise.filterAttack = value;
    this.$forceUpdate();
  }
  @Watch("filterEnv.decay")
  private onfilterEnvDecayChange(value: number) {
    this.synth.filterDecay = value;
    this.noise.filterAttack = value;
    this.$forceUpdate();
  }
  @Watch("filterEnv.sustain")
  private onfilterEnvSustainChange(value: number) {
    this.synth.filterSustain = value;
    this.noise.filterSustain = value;
    this.$forceUpdate();
  }
  @Watch("filterEnv.release")
  private onfilterEnvReleaseChange(value: number) {
    this.synth.filterRelease = value;
    this.noise.filterRelease = value;
    this.$forceUpdate();
  }
}
</script>

<style scoped>
.keyboard-container {
  justify-content: center;
}
.home {
  background-image: url("../assets/metal-1.png");
  background-repeat: repeat;
  color: white;
  font-size: 10pt;
}
.waveform-select {
  background-color: white;
  border: 1px solid gray;
  width: 75px;
}
.waveform-select-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
.waveform-select-label {
  padding-right: 20px;
}
</style>
