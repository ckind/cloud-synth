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
import { defineComponent, watch, ref, onMounted, onUnmounted } from "vue";
import AdsrGraph from "@/components/AdsrGraph.vue";
import KnobControl from "@/components/KnobControl.vue";
import WaveformSelector from "@/components/WaveformSelector.vue";
import NoiseTypeSelector from "@/components/NoiseTypeSelector.vue";
import { getDefaultJvaSettings } from "@/services/OfflinePresetService";
import { VAPolySynth } from "@/shared/classes/synth/VAPolySynth";
import {
  NoiseType as ToneNoiseType,
  Volume as ToneVolume,
  LFO as ToneLFO,
  immediate as ToneImmediate,
} from "tone";
import { VANoiseSynth } from "@/shared/classes/synth/VANoiseSynth";
import { IJvaSettings } from "@/shared/interfaces/presets/IJvaSettings";
import { IMidiMessage } from "@/shared/interfaces/midi/IMidiMessage";
import { useAudioDevice } from "@/composables/useAudioDevice";

export default defineComponent({
  emits: ["deviceMounted"],
  components: {
    AdsrGraph,
    KnobControl,
    WaveformSelector,
    NoiseTypeSelector
  },
  setup(props, context) {
    const {
      guid,
      name,
      settings,
      output
    } = useAudioDevice<IJvaSettings>("Jva Poly", getDefaultJvaSettings());

    const synth = new VAPolySynth(6, 3, "sawtooth");
    const volume = new ToneVolume();
    const filterLFO = new ToneLFO();
    const ampLFO = new ToneLFO();
    const pitchLFO = new ToneLFO();
    const noise = new VANoiseSynth("white");
    const noiseVolume = new ToneVolume(-24);

    const filterTypes: Array<BiquadFilterType> = [
      "lowpass",
      "highpass"
    ];
    const filterTypeIndex = ref(0);

    function dispose() {
      filterLFO.stop().disconnect();
      ampLFO.stop().disconnect();
      pitchLFO.stop().disconnect();
      volume.disconnect();
      synth.output.disconnect();
      noise.output.disconnect();
      noiseVolume.disconnect();
      output.disconnect();

      filterLFO.dispose();
      ampLFO.dispose();
      pitchLFO.dispose();
      volume.dispose();
      synth.dispose();
      noise.dispose();
      noiseVolume.dispose();
      output.dispose();
    }

    function receiveMidi(message: IMidiMessage, time?: number) {
      synth.receiveMidi(message, time);
      noise.receiveMidi(message, time); // todo: don't release noise if keys are still down
    }

    function applySettings(_settings: IJvaSettings) {
      settings.oscillator1.transpose = _settings.oscillator1.transpose;
      settings.oscillator2.transpose = _settings.oscillator2.transpose;
      settings.oscillator3.transpose = _settings.oscillator3.transpose;

      settings.oscillator1.detune = _settings.oscillator1.detune;
      settings.oscillator2.detune = _settings.oscillator2.detune;
      settings.oscillator3.detune = _settings.oscillator3.detune;

      settings.oscillator1.volume = _settings.oscillator1.volume;
      settings.oscillator2.volume = _settings.oscillator2.volume;
      settings.oscillator3.volume = _settings.oscillator3.volume;

      settings.oscillator1.type = _settings.oscillator1.type;
      settings.oscillator2.type = _settings.oscillator2.type;
      settings.oscillator3.type = _settings.oscillator3.type;

      settings.oscillator1.type = _settings.oscillator1.type;

      settings.filter.type = _settings.filter.type;
      settings.filter.frequency = _settings.filter.frequency;
      settings.filter.q = _settings.filter.q;
      settings.filter.envelope.attack = _settings.filter.envelope.attack;
      settings.filter.envelope.decay = _settings.filter.envelope.decay;
      settings.filter.envelope.sustain = _settings.filter.envelope.sustain;
      settings.filter.envelope.release = _settings.filter.envelope.release;
      settings.filter.envelopeAmount = _settings.filter.envelopeAmount;
      settings.filter.modulationAmount = _settings.filter.modulationAmount;
      settings.filter.modulationRate = _settings.filter.modulationRate;

      settings.amp.envelope.attack = _settings.amp.envelope.attack;
      settings.amp.envelope.decay = _settings.amp.envelope.decay;
      settings.amp.envelope.sustain = _settings.amp.envelope.sustain;
      settings.amp.envelope.release = _settings.amp.envelope.release;
      settings.amp.modulationAmount = _settings.amp.modulationAmount;
      settings.amp.modulationRate = _settings.amp.modulationRate;

      settings.noise.volume = _settings.noise.volume;
      settings.noise.type = _settings.noise.type;

      settings.volume = _settings.volume;
    }

    watch(() => settings.oscillator1.transpose, (currentValue, oldValue) => {
      synth.oscillators[0].transpose = currentValue;
    });
    watch(() => settings.oscillator2.transpose, (currentValue, oldValue) => {
      synth.oscillators[1].transpose = currentValue;
    });
    watch(() => settings.oscillator3.transpose, (currentValue, oldValue) => {
      synth.oscillators[2].transpose = currentValue;
    });

    watch(() => settings.oscillator1.detune, (currentValue, oldValue) => {
      synth.oscillators[0].detune = currentValue;
    });
    watch(() => settings.oscillator2.detune, (currentValue, oldValue) => {
      synth.oscillators[1].detune = currentValue;
    });
    watch(() => settings.oscillator3.detune, (currentValue, oldValue) => {
      synth.oscillators[2].detune = currentValue;
    });

    watch(() => settings.oscillator1.volume, (currentValue, oldValue) => {
      synth.oscillators[0].volume = currentValue;
    });
    watch(() => settings.oscillator2.volume, (currentValue, oldValue) => {
      synth.oscillators[1].volume = currentValue;
    });
    watch(() => settings.oscillator3.volume, (currentValue, oldValue) => {
      synth.oscillators[2].volume = currentValue;
    });

    watch(() => settings.oscillator1.type, (currentValue, oldValue) => {
      synth.oscillators[0].type = currentValue;
    });
    watch(() => settings.oscillator2.type, (currentValue, oldValue) => {
      synth.oscillators[1].type = currentValue;
    });
    watch(() => settings.oscillator3.type, (currentValue, oldValue) => {
      synth.oscillators[2].type = currentValue;
    });

    watch(filterTypeIndex, (currentValue, oldValue) => {
      settings.filter.type = filterTypes[currentValue];
    });

    watch(() => settings.filter.type, (currentValue, oldValue) => {
      synth.filterType = currentValue;
      noise.filterType = currentValue;
    });
    watch(() => settings.filter.frequency, (currentValue, oldValue) => {
      synth.filterFrequency = currentValue;
      noise.filterFrequency = currentValue;
    });
    watch(() => settings.filter.q, (currentValue, oldValue) => {
      synth.filterQ = currentValue;
      noise.filterQ = currentValue;
    });
    watch(() => settings.filter.envelope.attack, (currentValue, oldValue) => {
      synth.filterAttack = currentValue;
      noise.filterAttack = currentValue;
    });
    watch(() => settings.filter.envelope.decay, (currentValue, oldValue) => {
      synth.filterDecay = currentValue;
      noise.filterDecay = currentValue;
    });
    watch(() => settings.filter.envelope.sustain, (currentValue, oldValue) => {
      synth.filterSustain = currentValue;
      noise.filterSustain = currentValue;
    });
    watch(() => settings.filter.envelope.release, (currentValue, oldValue) => {
      synth.filterRelease = currentValue;
      noise.filterRelease = currentValue;
    });
    watch(() => settings.filter.envelopeAmount, (currentValue, oldValue) => {
      synth.filterEnvelopeAmount = currentValue;
      noise.filterEnvelopeAmount = currentValue;
    });
    watch(() => settings.filter.modulationAmount, (currentValue, oldValue) => {
      synth.filterFrequencyModulationMix = currentValue;
      noise.filterFrequencyModulationMix = currentValue;
    });
    watch(() => settings.filter.modulationRate, (currentValue, oldValue) => {
      filterLFO.frequency.setValueAtTime(currentValue, ToneImmediate());
    });

    watch(() => settings.amp.envelope.attack, (currentValue, oldValue) => {
      synth.ampAttack = currentValue;
      noise.ampAttack = currentValue;
    });
    watch(() => settings.amp.envelope.decay, (currentValue, oldValue) => {
      synth.ampDecay = currentValue;
      noise.ampDecay = currentValue;
    });
    watch(() => settings.amp.envelope.sustain, (currentValue, oldValue) => {
      synth.ampSustain = currentValue;
      noise.ampSustain = currentValue;
    });
    watch(() => settings.amp.envelope.release, (currentValue, oldValue) => {
      synth.ampRelease = currentValue;
      noise.ampRelease = currentValue;
    });
    watch(() => settings.amp.modulationAmount, (currentValue, oldValue) => {
      synth.ampModulationMix = currentValue;
      noise.ampModulationMix = currentValue;
    });
    watch(() => settings.amp.modulationRate, (currentValue, oldValue) => {
      ampLFO.frequency.setValueAtTime(currentValue, ToneImmediate());
    });

    watch(() => settings.noise.volume, (currentValue, oldValue) => {
      noiseVolume.volume.setValueAtTime(currentValue, ToneImmediate());
    });
    watch(() => settings.noise.type, (currentValue, oldValue) => {
      noise.noiseType = currentValue as ToneNoiseType;
    });

    watch(() => settings.volume, (currentValue, oldValue) => {
      volume.volume.setValueAtTime(currentValue, ToneImmediate());
    });

    onMounted(() => {
      context.emit("deviceMounted");
    });

    onUnmounted(() => {
      dispose();
    });

    filterLFO.start().connect(synth.filterFrequencyModulation);
    ampLFO.start().connect(synth.ampModulation);
    pitchLFO.start().connect(synth.pitchModulation);
    noise.output.chain(noiseVolume, volume);
    synth.output.connect(volume);
    volume.connect(output);

    return {
      guid,
      name,
      settings,
      output,
      filterTypeIndex,
      receiveMidi,
      applySettings
    }
  }
});

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
