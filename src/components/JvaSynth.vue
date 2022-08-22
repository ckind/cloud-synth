<template>
  <div class="synth-panel">
    <div class="synth-section">
      <v-row class="dense-row mb-4">
        <v-col cols="3" class="center-x">
          Coarse
        </v-col>
        <v-col cols="3" class="center-x">
          Fine
        </v-col>
        <v-col cols="3" class="center-x">
          Vol.
        </v-col>
        <v-col cols="3" class="center-x">
          Wave
        </v-col>
      </v-row>
      <v-row class="dense-row mb-4">
        <v-col cols="3">
          <knob-control
            v-model="settings.oscillator1.transpose"
            :minValue="-12"
            :maxValue="12"
            :step="1"
            :id="`oscillator1TransposeControl`"
            :size="50"
          ></knob-control>
        </v-col>
        <v-col cols="3">
          <knob-control
            v-model="settings.oscillator1.detune"
            :minValue="-50"
            :maxValue="50"
            :id="`oscillator1FineTuningControl`"
            :size="50"
          ></knob-control>
        </v-col>
        <v-col cols="3">
          <knob-control
            v-model="settings.oscillator1.volume"
            :minValue="-60"
            :maxValue="0"
            :default="-12"
            :id="`oscillator1Volume`"
            :size="50"
          ></knob-control>
        </v-col>
        <v-col cols="3" class="center-x center-y">
          <waveform-selector v-model="settings.oscillator1.type"/>
        </v-col>
      </v-row>
      <v-row class="dense-row mb-4">
        <v-col cols="3">
          <knob-control
            v-model="settings.oscillator2.transpose"
            :minValue="-12"
            :maxValue="12"
            :step="1"
            :id="`oscillator2TransposeControl`"
            :size="50"
          ></knob-control>
        </v-col>
        <v-col cols="3">
          <knob-control
            v-model="settings.oscillator2.detune"
            :minValue="-50"
            :maxValue="50"
            :id="`oscillator2FineTuningControl`"
            :size="50"
          ></knob-control>
        </v-col>
        <v-col cols="3">
          <knob-control
            v-model="settings.oscillator2.volume"
            :minValue="-60"
            :maxValue="0"
            :default="-12"
            :id="`oscillator2Volume`"
            :size="50"
          ></knob-control>
        </v-col>
        <v-col cols="3" class="center-x center-y">
          <waveform-selector v-model="settings.oscillator2.type"/>
        </v-col>
      </v-row>
      <v-row class="dense-row mb-4">
        <v-col cols="3">
          <knob-control
            v-model="settings.oscillator3.transpose"
            :minValue="-12"
            :maxValue="12"
            :step="1"
            :id="`oscillator3TransposeControl`"
            :size="50"
          ></knob-control>
        </v-col>
        <v-col cols="3">
          <knob-control
            v-model="settings.oscillator3.detune"
            :minValue="-50"
            :maxValue="50"
            :id="`oscillator1FineTuningControl`"
            :size="50"
          ></knob-control>
        </v-col>
        <v-col cols="3">
          <knob-control
            v-model="settings.oscillator3.volume"
            :minValue="-60"
            :maxValue="0"
            :default="-12"
            :id="`oscillator3Volume`"
            :size="50"
          ></knob-control>
        </v-col>
        <v-col cols="3" class="center-x center-y">
          <waveform-selector v-model="settings.oscillator3.type"/>
        </v-col>
      </v-row>
      <v-row class="dense-row mb-4">
        <v-col cols="3">
          <knob-control
            v-model="settings.oscillatorSpread"
            :minValue="0"
            :maxValue="1"
            id="oscillatorSpreadKnob"
            label="Spread"
            :size="50"
          ></knob-control>
        </v-col>
        <v-col cols="3" />
        <v-col cols="3">
          <knob-control
            v-model="settings.noise.volume"
            :minValue="-60"
            :maxValue="0"
            id="noiseLevelKnob"
            label="Noise"
            :size="50"
          ></knob-control>
        </v-col>
        <v-col cols="3" class="center-x center-y">
          <noise-type-selector v-model="settings.noise.type"/>
        </v-col>
      </v-row>
    </div>
    <div class="synth-section">
      <adsr-graph
        class="py-2"
        v-model="settings.filter.envelope"
        :width="$vuetify.breakpoint.name = 'xs' ? 250 : 300"
      />
      <v-row>
        <v-col cols="1" />
        <v-col cols="10">
          <v-row class="dense-row">
            <v-col cols="3">
              <knob-control
                v-model="settings.filter.frequency"
                :minValue="20"
                :maxValue="20000"
                id="filterFrequencyKnob"
                label="Cutoff"
                scale="exponential"
                :size="50"
              ></knob-control>
            </v-col>
            <v-col cols="3">
              <knob-control
                v-model="settings.filter.q"
                :minValue="0"
                :maxValue="10"
                id="filterQKnob"
                label="Q"
                :size="50"
              ></knob-control>
            </v-col>
            <v-col cols="3">
              <knob-control
                v-model="settings.filter.envelopeAmount"
                :minValue="0"
                :maxValue="1"
                id="envAmtKnob"
                label="Env Amt"
                :size="50"
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
                :size="50"
              ></knob-control>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="1" />
      </v-row>
      <v-row class="dense-row">
        <v-col cols="6">
          <knob-control
            v-model="settings.filter.modulationAmount"
            :minValue="0"
            :maxValue="1"
            :size="50"
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
            :size="50"
            scale="quadratic bezier"
            id="filterModRateKnob"
            label="Mod Rate"
          ></knob-control>
        </v-col>
      </v-row>
    </div>
    <div class="synth-section">
      <adsr-graph
        class="py-2"
        v-model="settings.amp.envelope"
        :width="$vuetify.breakpoint.name = 'xs' ? 250 : 300"
      />
      <v-row>
        <v-col cols="6">
          <knob-control
            v-model="settings.pitch.modulationAmount"
            :minValue="0"
            :maxValue="0.005"
            :size="50"
            id="pitchModKnob"
            label="Pitch Mod"
          ></knob-control>
        </v-col>
        <v-col cols="6">
          <knob-control
            v-model="settings.pitch.modulationRate"
            :minValue="0"
            :maxValue="10"
            :size="50"
            id="pitchModRateKnob"
            label="Mod Rate"
          ></knob-control>
        </v-col>
      </v-row>
      <v-row class="dense-row">
        <v-col cols="12">
          <knob-control
            v-model="settings.volume"
            :minValue="-60"
            :maxValue="0"
            :size="50"
            id="volumeLevelKnob"
            label="Volume"
          ></knob-control>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import AdsrGraph from "@/components/AdsrGraph.vue";
import KnobControl from "@/components/KnobControl.vue";
import WaveformSelector from "@/components/WaveformSelector.vue";
import NoiseTypeSelector from "@/components/NoiseTypeSelector.vue";
import { getDefaultJvaSettings } from "@/services/OfflinePresetService";
import { VAPolySynth } from "@/shared/classes/synth/VAPolySynth";
import {
  NoiseType as ToneNoiseType,
  ToneOscillatorType,
  Volume as ToneVolume,
  LFO as ToneLFO,
  immediate as ToneImmediate,
  Gain as ToneGain,
} from "tone";
import { VANoiseSynth } from "@/shared/classes/synth/VANoiseSynth";
import { IJvaSettings } from "@/shared/interfaces/presets/IJvaSettings";
import { IMidiMessage } from "@/shared/interfaces/midi/IMidiMessage";
import { IInstrumentDevice } from "@/shared/interfaces/devices/IInstrumentDevice";
import { v4 as uuidv4 } from "uuid";

@Component({
  components: {
    AdsrGraph,
    KnobControl,
    WaveformSelector,
    NoiseTypeSelector
  },
})
export default class JvaSynth extends Vue implements IInstrumentDevice {
  guid: string;
  name = "Jva Poly";
  output!: ToneGain;
  settings: IJvaSettings;

  private synth!: VAPolySynth;
  private volume!: ToneVolume;
  private filterLFO!: ToneLFO;
  private ampLFO!: ToneLFO;
  private pitchLFO!: ToneLFO;
  private noise!: VANoiseSynth;
  private noiseVolume!: ToneVolume;

  private filterTypes: Array<BiquadFilterType>;
  private filterTypeIndex: number;

  public constructor() {
    super();

    this.guid = uuidv4();
    this.settings = getDefaultJvaSettings();

    this.filterTypes = new Array<BiquadFilterType>(2);
    this.filterTypes[0] = "lowpass";
    this.filterTypes[1] = "highpass";
    this.filterTypeIndex = 0;
  }

  // Lifecycle Hooks

  created() {
    /**
     * Important: define web audio objects outside of the constructor so vue doesn't
     * apply reactivity to them. Reactivity can interfere with the dispose methods
     * of some Tone/WebAudio objects
     */

    this.synth = new VAPolySynth(6, 3, "sawtooth");

    this.filterLFO = new ToneLFO();
    this.ampLFO = new ToneLFO();
    this.pitchLFO = new ToneLFO();

    this.filterLFO.start().connect(this.synth.filterFrequencyModulation);
    this.ampLFO.start().connect(this.synth.ampModulation);
    this.pitchLFO.start().connect(this.synth.pitchModulation);

    this.noise = new VANoiseSynth("white");
    this.noiseVolume = new ToneVolume(-24);

    this.output = new ToneGain(1);
    this.volume = new ToneVolume();

    this.noise.output.chain(this.noiseVolume, this.volume);
    this.synth.output.connect(this.volume);
    this.volume.connect(this.output);
  }

  mounted() {
    this.$emit("deviceMounted");
  }

  beforeDestroy() {
    this.dispose();
  }
  
  // Methods

  dispose() {
    this.volume.disconnect(this.output);
    this.synth.output.disconnect(this.volume);
    this.noise.output.disconnect(this.noiseVolume);
    this.noiseVolume.disconnect(this.volume);

    this.filterLFO.stop().disconnect(this.synth.filterFrequencyModulation);
    this.ampLFO.stop().disconnect(this.synth.ampModulation);
    this.pitchLFO.stop().disconnect(this.synth.pitchModulation);

    // todo: this is causing errors when switching instruments

    // this.filterLFO.dispose();
    // this.ampLFO.dispose();
    // this.pitchLFO.dispose();

    // this.noiseVolume.dispose();
    // this.noise.dispose();
    // this.synth.dispose();
    // this.volume.dispose();
    // this.output.dispose();
  }

  receiveMidi(message: IMidiMessage, time?: number) {
    this.synth.receiveMidi(message, time);
    this.noise.receiveMidi(message, time); // todo: don't release noise if keys are still down
  }

  applySettings(settings: IJvaSettings) {
    // create a deep copy so we don't mutate the preset
    this.settings = JSON.parse(JSON.stringify(settings));
    this.updateSynthWatches();
  }

  // kind of verbose but needed for reactivity in certain cases - maybe there's a cleaner way?
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

    this.onOscillatorSpreadChanged(this.settings.oscillatorSpread);

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
.synth-panel {
  background-image: url("../assets/metal-2.png");
  background-repeat: repeat;
  color: white;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  font-size: 10pt;
}

.synth-section {
  margin-top: 10px;
  margin-bottom: 10px;
  width: 400px;
}

.dense-row > div.col {
  padding: 0;
}

.center-x {
  display: flex;
  justify-content: center;
}
.center-y {
  display: flex;
  align-items: center;
}
</style>
