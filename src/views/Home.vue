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
              :default="-12"
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
              :default="-12"
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
              :default="-12"
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
import {
  NoiseType as ToneNoiseType,
  ToneOscillatorType,
  Volume as ToneVolume,
  LFO as ToneLFO,
  Reverb as ToneReverb,
  immediate as ToneImmediate,
  start as ToneStart,
  Master as ToneMaster,
  context as ToneContext,
  Transport as ToneTransport
} from "tone";
import { VANoiseSynth } from "@/shared/classes/synth/VANoiseSynth";
import { IJvaSettings } from "@/IJvaSettings";
import { getLocalDefaultSettings } from "../assets/presets/LocalDefaultSettings"; 
import {
  IJvaPresetServiceClient,
  getJvaPresetServiceClient
} from "../services/JvaPresetServiceClient";

@Component({
  components: {
    PianoKeyboard,
    AdsrGraph,
    KnobControl
  }
})
export default class Home extends Vue {
  private settings!: IJvaSettings;
  private presetServiceClient: IJvaPresetServiceClient;
  private synth: VAPolySynth;
  private volume: ToneVolume;
  private filterLFO: ToneLFO;
  private ampLFO: ToneLFO;
  private pitchLFO: ToneLFO;
  private waveforms: Array<ToneOscillatorType>;
  private noiseTypes: Array<string>;
  private noiseTypeIndex: number;
  private filterTypes: Array<BiquadFilterType>;
  private filterTypeIndex: number;
  private verb: ToneReverb;
  private noise: VANoiseSynth;
  private noiseVolume: ToneVolume;

  $refs!: {
    pianoKeyboard: PianoKeyboard;
  };

  public constructor() {
    super();

    this.verb = new ToneReverb();
    this.verb.wet.setValueAtTime(0.5, ToneImmediate());

    ToneStart().then(() => {
      ToneTransport.start();
      this.verb.generate();
    });

    // hack for making sure audio context starts right away
    document.documentElement.addEventListener("mousedown", function() {
      if (ToneContext.state !== "running") {
        ToneContext.resume();
      }
    });

    this.synth = new VAPolySynth(6, 3, "sawtooth");

    this.filterLFO = new ToneLFO();
    this.filterLFO.start().connect(this.synth.filterFrequencyModulation);

    this.ampLFO = new ToneLFO();
    this.ampLFO.start().connect(this.synth.ampModulation);

    this.pitchLFO = new ToneLFO();
    this.pitchLFO.start().connect(this.synth.pitchModulation);

    this.waveforms = new Array<ToneOscillatorType>(4);
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
    this.noiseVolume = new ToneVolume(-24);

    this.filterTypes = new Array<BiquadFilterType>(2);
    this.filterTypes[0] = "lowpass";
    this.filterTypes[1] = "highpass";
    this.filterTypeIndex = 0;

    this.volume = new ToneVolume();
    this.noise.output.chain(this.noiseVolume, this.volume, ToneMaster);
    this.synth.output.chain(this.volume, ToneMaster);

    this.settings = getLocalDefaultSettings();
    this.presetServiceClient = getJvaPresetServiceClient();
  }

  mounted() {
    this.$refs.pianoKeyboard.connect(this.synth);
    this.$refs.pianoKeyboard.connect(this.noise);
    this.getDefaultCloudSettings()
      .then(settings => {
        this.settings = settings;
        this.updateSynthWatches();
      })
      .catch(error => {
        console.log(error);
      });
  }

  async getDefaultCloudSettings(): Promise<IJvaSettings> {
    return await this.presetServiceClient.getDefaultPreset();
  }

  // kind of verbose but needed for gui reactivity - maybe there's a cleaner way?
  private updateSynthWatches() {
    this.onOscillator1VolumeChanged(this.settings.oscillator1.volume);
    this.onOscillator1TranposeChanged(this.settings.oscillator1.transpose);
    this.onOscillator1DetuneChanged(this.settings.oscillator1.detune);
    this.onOscillator1TypeChanged(this.settings.oscillator1.type);

    this.onOscillator2VolumeChanged(this.settings.oscillator2.volume);
    this.onOscillator2TranposeChanged(this.settings.oscillator2.transpose);
    this.onOscillator2DetuneChanged(this.settings.oscillator2.detune);
    this.onOscillator2TypeChanged(this.settings.oscillator2.type);

    this.onOscillator3VolumeChanged(this.settings.oscillator3.volume);
    this.onOscillator3TranposeChanged(this.settings.oscillator3.transpose);
    this.onOscillator3DetuneChanged(this.settings.oscillator3.detune);
    this.onOscillator3TypeChanged(this.settings.oscillator3.type);

    this.onAmpEnvelopeAttackChange(this.settings.amp.envelope.attack);
    this.onAmpEnvelopeDecayChange(this.settings.amp.envelope.decay);
    this.onAmpEnvelopeSustainChange(this.settings.amp.envelope.sustain);
    this.onAmpEnvelopeReleaseChange(this.settings.amp.envelope.release);
    this.onAmpLFOAmtChanged(this.settings.amp.modulationAmount);
    this.onAmpLFORateChange(this.settings.amp.modulationRate);

    this.onFilterEnvelopeAttackChange(this.settings.filter.envelope.attack);
    this.onFilterEnvelopeDecayChange(this.settings.filter.envelope.decay);
    this.onFilterEnvelopeSustainChange(this.settings.filter.envelope.sustain);
    this.onFilterEnvelopeReleaseChange(this.settings.filter.envelope.release);
    this.onFilterEnvelopeAmountChanged(this.settings.filter.envelopeAmount);
    this.onFilterFrequencyChange(this.settings.filter.frequency);
    this.onFilterQChange(this.settings.filter.q);
    this.onFilterTypeChanged(this.settings.filter.type);
    this.onFilterLFOAmtChanged(this.settings.filter.modulationAmount);
    this.onFilterLFORateChanged(this.settings.filter.modulationRate);

    this.onPitchLFOAmtChanged(this.settings.pitch.modulationAmount);
    this.onPitchLFORateChanged(this.settings.pitch.modulationRate);

    this.onNoiseTypeChange(this.settings.noise.type);
    this.onNoiseVolumeChange(this.settings.noise.volume);

    this.onVolumeLevelChanged(this.settings.volume);

    this.$forceUpdate(); // make sure the gui updates
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

  @Watch("settings.oscillatorSpread")
  private onOscillatorSpreadChanged(value: number) {
    this.synth.oscillatorSpread = value;
  }

  @Watch("filterTypeIndex")
  private onFilterTypeIndexChanged(value: number) {
    this.settings.filter.type = this.filterTypes[value];
  }
  @Watch("settings.filter.type")
  private onFilterTypeChanged(value: BiquadFilterType) {
    this.synth.filterType = value;
    this.noise.filterType = value;
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
  private onFilterEnvelopeAttackChange(value: number) {
    this.synth.filterAttack = value;
    this.noise.filterAttack = value;
  }
  @Watch("settings.filter.envelope.decay")
  private onFilterEnvelopeDecayChange(value: number) {
    this.synth.filterDecay = value;
    this.noise.filterDecay = value;
  }
  @Watch("settings.filter.envelope.sustain")
  private onFilterEnvelopeSustainChange(value: number) {
    this.synth.filterSustain = value;
    this.noise.filterSustain = value;
  }
  @Watch("settings.filter.envelope.release")
  private onFilterEnvelopeReleaseChange(value: number) {
    this.synth.filterRelease = value;
    this.noise.filterRelease = value;
  }
  @Watch("settings.filter.envelopeAmount")
  private onFilterEnvelopeAmountChanged(value: number) {
    this.synth.filterEnvelopeAmount = value;
    this.noise.filterEnvelopeAmount = value;
  }
  @Watch("settings.filter.modulationAmount")
  private onFilterLFOAmtChanged(value: number) {
    this.synth.filterFrequencyModulationMix = value;
    this.noise.filterFrequencyModulationMix = value;
  }
  @Watch("settings.filter.modulationRate")
  private onFilterLFORateChanged(value: number) {
    this.filterLFO.frequency.setValueAtTime(value, ToneImmediate());
  }

  @Watch("settings.pitch.modulationAmount")
  private onPitchLFOAmtChanged(value: number) {
    this.synth.pitchModulationMix = value;
  }
  @Watch("settings.pitch.modulationRate")
  private onPitchLFORateChanged(value: number) {
    this.pitchLFO.frequency.setValueAtTime(value, ToneImmediate());
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
    this.ampLFO.frequency.setValueAtTime(value, ToneImmediate());
  }

  @Watch("settings.noise.volume")
  private onNoiseVolumeChange(value: number) {
    this.noiseVolume.volume.setValueAtTime(value, ToneImmediate());
  }
  @Watch("settings.noise.type")
  private onNoiseTypeChange(value: string) {
    this.noise.noiseType = value as ToneNoiseType;
  }

  @Watch("settings.volume")
  private onVolumeLevelChanged(value: number) {
    this.volume.volume.setValueAtTime(value, ToneImmediate());
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
