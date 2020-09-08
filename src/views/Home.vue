<template>
  <div class="home">
    <v-row>
      <v-col cols="4">
        <v-row>
          <v-col cols="3">
            <knob-control
              v-model="settings.oscillator1.transpose"
              :minValue="-12"
              :maxValue="12"
              :step="1"
              :id="`oscillator1TransposeControl`"
              :label="`Osc 1 Trans`"
              size="70"
            ></knob-control>
          </v-col>
          <v-col cols="3">
            <knob-control
              v-model="settings.oscillator1.detune"
              :minValue="-50"
              :maxValue="50"
              :id="`oscillator1FineTuningControl`"
              :label="`Fine Tune`"
              size="70"
            ></knob-control>
          </v-col>
          <v-col cols="3">
            <knob-control
              v-model="settings.oscillator1.volume"
              :minValue="-60"
              :maxValue="0"
              :id="`oscillator1Volume`"
              :label="`Volume`"
              size="70"
            ></knob-control>
          </v-col>
          <v-col cols="3" class="waveform-select-container">
            <select class="waveform-select" v-model="settings.oscillator1.type">
              <option
                v-for="(waveform, j) in waveforms"
                :key="j"
                :value="waveform"
              >
                {{ waveform }}
              </option>
            </select>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="3">
            <knob-control
              v-model="settings.oscillator2.transpose"
              :minValue="-12"
              :maxValue="12"
              :step="1"
              :id="`oscillator2TransposeControl`"
              :label="`Osc 2 Trans`"
              size="70"
            ></knob-control>
          </v-col>
          <v-col cols="3">
            <knob-control
              v-model="settings.oscillator2.detune"
              :minValue="-50"
              :maxValue="50"
              :id="`oscillator2FineTuningControl`"
              :label="`Fine Tune`"
              size="70"
            ></knob-control>
          </v-col>
          <v-col cols="3">
            <knob-control
              v-model="settings.oscillator2.volume"
              :minValue="-60"
              :maxValue="0"
              :id="`oscillator2Volume`"
              :label="`Volume`"
              size="70"
            ></knob-control>
          </v-col>
          <v-col cols="3" class="waveform-select-container">
            <select class="waveform-select" v-model="settings.oscillator2.type">
              <option
                v-for="(waveform, j) in waveforms"
                :key="j"
                :value="waveform"
              >
                {{ waveform }}
              </option>
            </select>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="3">
            <knob-control
              v-model="settings.oscillator3.transpose"
              :minValue="-12"
              :maxValue="12"
              :step="1"
              :id="`oscillator3TransposeControl`"
              :label="`Osc 3 Trans`"
              size="70"
            ></knob-control>
          </v-col>
          <v-col cols="3">
            <knob-control
              v-model="settings.oscillator3.detune"
              :minValue="-50"
              :maxValue="50"
              :id="`oscillator1FineTuningControl`"
              :label="`Fine Tune`"
              size="70"
            ></knob-control>
          </v-col>
          <v-col cols="3">
            <knob-control
              v-model="settings.oscillator3.volume"
              :minValue="-60"
              :maxValue="0"
              :id="`oscillator3Volume`"
              :label="`Volume`"
              size="70"
            ></knob-control>
          </v-col>
          <v-col cols="3" class="waveform-select-container">
            <select class="waveform-select" v-model="settings.oscillator3.type">
              <option
                v-for="(waveform, j) in waveforms"
                :key="j"
                :value="waveform"
              >
                {{ waveform }}
              </option>
            </select>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4">
            <knob-control
              v-model="settings.oscillatorSpread"
              :minValue="0"
              :maxValue="1"
              id="oscillatorSpreadKnob"
              label="Osc Spread"
              size="70"
            ></knob-control>
          </v-col>
          <v-col cols="4">
            <knob-control
              v-model="settings.noise.volume"
              :minValue="-60"
              :maxValue="0"
              id="noiseLevelKnob"
              label="Noise Level"
              size="70"
            ></knob-control>
          </v-col>
          <v-col cols="4" class="waveform-select-container">
            <select class="waveform-select" v-model="settings.noise.type">
              <option v-for="(noiseType, j) in noiseTypes" :key="j" :value="noiseType">
                {{ noiseType }}
              </option>
            </select>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="4">
        <adsr-graph class="adsr" v-model="settings.filter.envelope" :width="300" />
        <v-row>
          <v-col cols="1" />
          <v-col cols="10">
            <v-row>
              <v-col cols="3">
                <knob-control
                  v-model="settings.filter.frequency"
                  :minValue="20"
                  :maxValue="20000"
                  id="filterFrequencyKnob"
                  label="Cutoff"
                  scale="exponential"
                  size="70"
                ></knob-control>
              </v-col>
              <v-col cols="3">
                <knob-control
                  v-model="settings.filter.q"
                  :minValue="0"
                  :maxValue="10"
                  id="filterQKnob"
                  label="Q"
                  size="70"
                ></knob-control>
              </v-col>
              <v-col cols="3">
                <knob-control
                  v-model="settings.filter.envelopeAmount"
                  :minValue="0"
                  :maxValue="1"
                  id="envAmtKnob"
                  label="Env Amt"
                  size="70"
                ></knob-control>
              </v-col>
              <v-col cols="3">
                <knob-control
                  v-model="filterTypeIndex"
                  :minValue="0"
                  :maxValue="1"
                  :step="1"
                  id="filterTypeKnob"
                  label="Type"
                  size="70"
                ></knob-control>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="1" />
        </v-row>
        <v-row>
          <v-col cols="6">
            <knob-control
              v-model="settings.filter.modulationAmount"
              :minValue="0"
              :maxValue="1"
              scale="quadratic bezier"
              id="filterModKnob"
              label="Filter Mod"
            ></knob-control>
          </v-col>
          <v-col cols="6">
            <knob-control
              v-model="settings.filter.modulationRate"
              :minValue="0"
              :maxValue="10"
              id="filterModRateKnob"
              label="Mod Rate"
            ></knob-control>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="4">
        <adsr-graph class="adsr" v-model="settings.amp.envelope" :width="300" />
        <!--
        <v-row>
          <v-col cols="6">
            <knob-control
              v-model="ampLFOAmt"
              :minValue="0"
              :maxValue="1"
              id="ampModKnob"
              label="Amp Mod"
            ></knob-control>
          </v-col>
          <v-col cols="6">
            <knob-control
              v-model="ampLFORate"
              :minValue="0"
              :maxValue="10"
              id="ampModRateKnob"
              label="Mod Rate"
            ></knob-control>
          </v-col>
        </v-row>
        -->
        <v-row>
          <v-col cols="6">
            <knob-control
              v-model="settings.pitch.modulationAmount"
              :minValue="0"
              :maxValue="0.1"
              id="pitchModKnob"
              label="Pitch Mod"
            ></knob-control>
          </v-col>
          <v-col cols="6">
            <knob-control
              v-model="settings.pitch.modulationRate"
              :minValue="0"
              :maxValue="10"
              id="pitchModRateKnob"
              label="Mod Rate"
            ></knob-control>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <knob-control
              v-model="settings.volume"
              :minValue="-60"
              :maxValue="0"
              id="volumeLevelKnob"
              label="Volume"
            ></knob-control>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <div class="row keyboard-container">
      <piano-keyboard ref="pianoKeyboard"></piano-keyboard>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import PianoKeyboard from "@/components/PianoKeyboard.vue";
import AdsrGraph from "@/components/AdsrGraph.vue";
import KnobControl from "@/components/KnobControl.vue";
import { VAPolySynth } from "@/shared/classes/synth/VAPolySynth";
import * as Tone from "tone";
import { NoiseType, ToneOscillatorType } from "tone";
import { VANoiseSynth } from "@/shared/classes/synth/VANoiseSynth";
import { JvaSettings } from "@/JvaSettings";

@Component({
  components: {
    PianoKeyboard,
    AdsrGraph,
    KnobControl
  }
})
export default class Home extends Vue {
  private settings: JvaSettings;
  private synth: VAPolySynth;
  private volume: Tone.Volume;
  private filterLFO: Tone.LFO;
  private ampLFO: Tone.LFO;
  private pitchLFO: Tone.LFO;
  private waveforms: Array<Tone.ToneOscillatorType>;
  private noiseTypes: Array<string>;
  private noiseTypeIndex: number;
  private filterTypes: Array<BiquadFilterType>;
  private filterTypeIndex: number;
  private verb: Tone.Reverb;
  private noise: VANoiseSynth;
  private noiseVolume: Tone.Volume;

  $refs!: {
    pianoKeyboard: PianoKeyboard;
  };

  private getDefaultSettings(): JvaSettings {
    return {
      oscillator1: {
        volume: -12,
        transpose: 0,
        detune: 0,
        type: "sawtooth"
      },
      oscillator2: {
        volume: -12,
        transpose: 0,
        detune: 0,
        type: "sawtooth"
      },
      oscillator3: {
        volume: -12,
        transpose: 0,
        detune: 0,
        type: "sawtooth"
      },
      oscillatorSpread: 0,
      amp: {
        envelope: {
          attack: 0,
          decay: 0.2,
          sustain: 0.8,
          release: 0.2
        },
        modulationAmount: 0,
        modulationRate: 4
      },
      filter: {
        envelope: {
          attack: 0,
          decay: 0.2,
          sustain: 0.8,
          release: 0.2
        },
        envelopeAmount: 0.7,
        frequency: 500,
        q: 3,
        type: "lowpass",
        modulationAmount: 0,
        modulationRate: 4
      },
      pitch: {
        modulationAmount: 0,
        modulationRate: 8
      },
      noise: {
        type: "white",
        volume: -60
      },
      volume: -12
    };
  }

  public constructor() {
    super();

    this.verb = new Tone.Reverb();
    this.verb.wet.setValueAtTime(0.5, Tone.immediate());

    Tone.start().then(() => {
      Tone.Transport.start();
      this.verb.generate();
    });

    // hack for making sure audio context starts right away
    document.documentElement.addEventListener("mousedown", function() {
      if (Tone.context.state !== "running") {
        Tone.context.resume();
      }
    });

    this.synth = new VAPolySynth(6, 3, "sine");

    this.filterLFO = new Tone.LFO();
    this.filterLFO.start().connect(this.synth.filterFrequencyModulation);

    this.ampLFO = new Tone.LFO();
    this.ampLFO.start().connect(this.synth.ampModulation);

    this.pitchLFO = new Tone.LFO();
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
    this.noise = new VANoiseSynth("white");
    this.noiseVolume = new Tone.Volume(-24);

    this.filterTypes = new Array<BiquadFilterType>(2);
    this.filterTypes[0] = "lowpass";
    this.filterTypes[1] = "highpass";
    this.filterTypeIndex = 0;

    this.volume = new Tone.Volume();
    this.noise.output.chain(this.noiseVolume, this.volume, Tone.Master);
    this.synth.output.chain(this.volume, Tone.Master);

    this.settings = this.getDefaultSettings();
  }

  mounted() {
    this.$refs.pianoKeyboard.connect(this.synth);
    this.$refs.pianoKeyboard.connect(this.noise);
  }

  // Computed

  // Methods

  // Watches

  @Watch("settings.oscillator1.transpose")
  private onOscillator1TranposeChanged(value: number) {
    this.synth.oscillators[0].transpose = value;
  }
  @Watch("settings.oscillator1.detune")
  private onOscillator1DetuneChanged(value: number) {
    this.synth.oscillators[0].detune = value;
  }
  @Watch("settings.oscillator1.volume")
  private onOscillator1VolumeChanged(value: number) {
    this.synth.oscillators[0].volume = value;
  }
  @Watch("settings.oscillator1.type")
  private onOscillator1TypeChanged(value: ToneOscillatorType) {
    this.synth.oscillators[0].type = value;
  }

  @Watch("settings.oscillator2.transpose")
  private onOscillator2TranposeChanged(value: number) {
    this.synth.oscillators[1].transpose = value;
  }
  @Watch("settings.oscillator2.detune")
  private onOscillator2DetuneChanged(value: number) {
    this.synth.oscillators[1].detune = value;
  }
  @Watch("settings.oscillator2.volume")
  private onOscillator2VolumeChanged(value: number) {
    this.synth.oscillators[1].volume = value;
  }
  @Watch("settings.oscillator2.type")
  private onOscillator2TypeChanged(value: ToneOscillatorType) {
    this.synth.oscillators[1].type = value;
  }

  @Watch("settings.oscillator3.transpose")
  private onOscillator3TranposeChanged(value: number) {
    this.synth.oscillators[2].transpose = value;
  }
  @Watch("settings.oscillator3.detune")
  private onOscillator3DetuneChanged(value: number) {
    this.synth.oscillators[2].detune = value;
  }
  @Watch("settings.oscillator3.volume")
  private onOscillator3VolumeChanged(value: number) {
    this.synth.oscillators[2].volume = value;
  }
  @Watch("settings.oscillator3.type")
  private onOscillator3TypeChanged(value: ToneOscillatorType) {
    this.synth.oscillators[2].type = value;
  }

  @Watch("filterTypeIndex")
  private onfilterTypeIndexChanged(value: number) {
    this.synth.filterType = this.filterTypes[value];
    this.noise.filterType = this.filterTypes[value];
  }
  @Watch("settings.filter.frequency")
  private onFilterFrequencyChange(value: number) {
    this.synth.filterFrequency = value;
    this.noise.filterFrequency = value;
  }
  @Watch("settings.filter.q")
  private onFilterQChange(value: number) {
    this.synth.filterQ = value;
    this.noise.filterQ = value;
  }
  @Watch("settings.filter.envelope.attack")
  private onfilterEnvelopeAttackChange(value: number) {
    this.synth.filterAttack = value;
    this.noise.filterAttack = value;
  }
  @Watch("settings.filter.envelope.decay")
  private onfilterEnvelopeDecayChange(value: number) {
    this.synth.filterDecay = value;
    this.noise.filterAttack = value;
  }
  @Watch("settings.filter.envelope.sustain")
  private onfilterEnvelopeSustainChange(value: number) {
    this.synth.filterSustain = value;
    this.noise.filterSustain = value;
  }
  @Watch("settings.filter.envelope.release")
  private onfilterEnvelopeReleaseChange(value: number) {
    this.synth.filterRelease = value;
    this.noise.filterRelease = value;
  }
  @Watch("settings.filter.modulationAmount")
  private onFilterLFOAmtChanged(value: number) {
    this.synth.filterFrequencyModulationMix = value;
    this.noise.filterFrequencyModulationMix = value;
  }
  @Watch("settings.filter.modulationRate")
  private onFilterLFORateChanged(value: number) {
    this.filterLFO.frequency.setValueAtTime(value, Tone.immediate());
  }

  @Watch("settings.pitch.modulationAmount")
  private onPitchLFOAmtChanged(value: number) {
    this.synth.pitchModulationMix = value;
  }
  @Watch("settings.pitch.modulationRate")
  private onPitchLFORateChange(value: number) {
    this.pitchLFO.frequency.setValueAtTime(value, Tone.immediate());
  }

  @Watch("settings.amp.envelope.attack")
  private onAmpEnvelopeAttackChange(value: number) {
    this.synth.ampAttack = value;
    this.noise.ampAttack = value;
  }
  @Watch("settings.amp.envelope.decay")
  private onAmpEnvelopeDecayChange(value: number) {
    this.synth.ampDecay = value;
    this.noise.ampDecay = value;
  }
  @Watch("settings.amp.envelope.sustain")
  private onAmpEnvelopeSustainChange(value: number) {
    this.synth.ampSustain = value;
    this.noise.ampSustain = value;
  }
  @Watch("settings.amp.envelope.release")
  private onAmpEnvelopeReleaseChange(value: number) {
    this.synth.ampRelease = value;
    this.noise.ampRelease = value;
  }
  @Watch("settings.amp.modulationAmount")
  private onAmpLFOAmtChanged(value: number) {
    this.synth.ampModulationMix = value;
    this.noise.ampModulationMix = value;
  }
  @Watch("settings.amp.modulationRate")
  private onAmpLFORateChange(value: number) {
    this.ampLFO.frequency.setValueAtTime(value, Tone.immediate());
  }

  @Watch("settings.noise.volume")
  private onNoiseVolumeChange(value: number) {
    this.noiseVolume.volume.setValueAtTime(value, Tone.immediate());
  }
  @Watch("settings.noise.type")
  private onNoiseTypehange(value: NoiseType) {
    this.noise.noiseType = value;
  }

  @Watch("settings.volume")
  private onVolumeLevelChanged(value: number) {
    this.volume.volume.setValueAtTime(value, Tone.immediate());
  }
}
</script>

<style scoped>
.keyboard-container {
  justify-content: center;
}

.home {
  background-image: url("../assets/metal-2.png");
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
