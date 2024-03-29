<template>
  <div
    class="flex"
    draggable
    @dragstart="this.componentDragstart"
    @dragend="this.componentDragend"
    @drop="elementDropped"
    @dragover="
      (e) => {
        e.preventDefault();
      }
    "
  >
    <v-menu>
      <template v-slot:activator="{ on }">
        <div
          class="reverb-container"
          @contextmenu="
            (e) => {
              e.preventDefault();
              on.click(e);
            }
          "
        >
          <h3 class="center-x mb-2">{{ name }}</h3>
          <knob-control
            v-model="settings.mix"
            :minValue="0"
            :maxValue="1"
            label="Mix"
            id="dryWet"
            :size="50"
            :shadowColor="'#5e5e5e'"
          ></knob-control>
          <knob-control
            v-model="settings.decay"
            :minValue="0"
            :maxValue="20"
            label="Decay"
            id="dryWet"
            :size="50"
            :shadowColor="'#5e5e5e'"
          ></knob-control>
          <knob-control
            v-model="settings.filterCutoff"
            :minValue="500"
            :maxValue="20000"
            label="Filter"
            id="filter"
            :size="50"
            scale="exponential"
            :shadowColor="'#5e5e5e'"
          ></knob-control>
        </div>
      </template>

      <v-list dark>
        <v-list-item link @click.stop="deleteComponent">
          <v-list-item-title>delete</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { IEffectsDevice } from "@/shared/interfaces/devices/IEffectsDevice";
import KnobControl from "@/components/KnobControl.vue";
import { DryWetMixer } from "@/shared/classes/utility/DryWetMixer";
import { v4 as uuidv4 } from "uuid";
import {
  ToneAudioNode,
  Gain as ToneGain,
  Reverb as ToneReverb,
  Signal as ToneSignal,
  Filter as ToneFilter,
} from "tone";

interface IReverbSettings {
  mix: number;
  decay: number;
  filterCutoff: number;
}

@Component({
  components: {
    KnobControl,
  },
})
export default class Reverb extends Vue implements IEffectsDevice {
  public guid: string;
  public input!: ToneAudioNode;
  public output!: ToneAudioNode;
  public name: string;
  public settings: IReverbSettings;

  private toneReverb!: ToneReverb;
  private filter!: ToneFilter;
  private filterCutoffSignal!: ToneSignal;
  private dryWetMixer!: DryWetMixer;
  private drySignal!: ToneGain;
  private wetSignal!: ToneGain;

  private effectsDeviceProxy!: IEffectsDevice;

  constructor() {
    super();

    this.guid = uuidv4();
    this.name = "Reverb";
    this.settings = {
      mix: 0.5,
      decay: 4,
      filterCutoff: 4000,
    };
  }

  // Lifecycle hooks

  created() {
    this.output = new ToneGain(1);
    this.input = new ToneGain(1);
    this.toneReverb = new ToneReverb(2);
    this.toneReverb.wet.value = 1;
    this.filter = new ToneFilter(4000, "lowpass");
    this.filterCutoffSignal = new ToneSignal(4000);
    this.drySignal = new ToneGain(1);
    this.wetSignal = new ToneGain(1);
    this.dryWetMixer = new DryWetMixer(this.drySignal, this.wetSignal);

    this.input.chain(this.drySignal);
    this.input.chain(this.toneReverb, this.filter, this.wetSignal);
    this.filterCutoffSignal.connect(this.filter.frequency);
    this.dryWetMixer.output.connect(this.output);

    this.effectsDeviceProxy = {
      guid: this.guid,
      name: this.name,
      settings: this.settings,
      input: this.input,
      output: this.output,
      applySettings: this.applySettings,
      dispose: this.dispose
    };

    this.onFilterCutoffChange(this.settings.filterCutoff);
  }

  mounted() {
    this.$emit("effectsDeviceMounted", this.effectsDeviceProxy);
  }

  beforeDestroy() {
    this.dispose();
  }

  // Methods

  deleteComponent() {
    this.$emit("deleteComponent", this.effectsDeviceProxy);
  }

  componentDragstart() {
    this.$emit("componentDragstart", this.effectsDeviceProxy);
  }

  componentDragend() {
    this.$emit("componentDragend", this.effectsDeviceProxy);
  }

  elementDropped() {
    this.$emit("elementDropped", this.effectsDeviceProxy);
  }

  applySettings(settings: IReverbSettings) {
    this.settings = settings;
  }

  dispose() {
    this.input.disconnect(this.drySignal);
    this.input.disconnect(this.toneReverb);
    this.toneReverb.disconnect(this.filter);
    this.filter.disconnect(this.wetSignal);
    this.filterCutoffSignal.disconnect(this.filter.frequency);
    this.dryWetMixer.output.disconnect(this.output);

    this.filterCutoffSignal.dispose();
    this.dryWetMixer.dispose();
    this.toneReverb.dispose();
    this.filter.dispose();
    this.input.dispose();
    this.output.dispose();
  }

  @Watch("settings.mix")
  private onMixChange(value: number) {
    this.dryWetMixer.wetness = value;
  }

  @Watch("settings.decay")
  private onDecayChange(value: number) {
    this.toneReverb.decay = value;
  }

  @Watch("settings.filterCutoff")
  private onFilterCutoffChange(value: number) {
    this.filterCutoffSignal.value = value;
  }
}
</script>

<style scoped>
.reverb-container {
  background-image: url("../../assets/metal-1.png");
  background-repeat: repeat;
  display: inline-block;
  font-size: 10pt;
  padding: 10px;
  border: 1px solid black;
}
</style>
