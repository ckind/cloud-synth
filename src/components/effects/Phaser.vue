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
          class="phaser-container"
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
            v-model="settings.frequency"
            :minValue="0.1"
            :maxValue="8"
            label="Frequency"
            id="frequency"
            :size="50"
            :shadowColor="'#5e5e5e'"
          ></knob-control>
          <knob-control
            v-model="settings.octaves"
            :minValue="0.05"
            :maxValue="2"
            label="Range"
            id="octaves"
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
import { v4 as uuidv4 } from "uuid";
import {
  ToneAudioNode,
  Gain as ToneGain,
  Phaser as TonePhaser
} from "tone";

interface IPhaserSettings {
  mix: number;
  frequency: number;
  baseFrequency: number;
  octaves: number;
}

@Component({
  components: {
    KnobControl,
  },
})
export default class Phaser extends Vue implements IEffectsDevice {
  public guid: string;
  public input!: ToneAudioNode;
  public output!: ToneAudioNode;
  public name: string;
  public settings: IPhaserSettings;

  private tonePhaser!: TonePhaser;

  constructor() {
    super();

    this.guid = uuidv4();
    this.name = "Phaser";
    this.settings = {
      mix: 0.5,
      frequency: 2,
      baseFrequency: 1200,
      octaves: 0.2,
    };
  }

  // Lifecycle hooks

  created() {
    this.output = new ToneGain(1);
    this.input = new ToneGain(1);
    this.tonePhaser = new TonePhaser(2);

    this.onMixChange(this.settings.mix);
		this.onFrequencyChange(this.settings.frequency);
		this.onBaseFrequencyChange(this.settings.baseFrequency);
		this.onOctavesChange(this.settings.octaves);

    this.input.chain(this.tonePhaser, this.output);
  }

  beforeDestroy() {
		this.dispose();
  }

  // Methods

  deleteComponent() {
    this.$emit("deleteComponent", this);
  }

  componentDragstart() {
    this.$emit("componentDragstart", this);
  }

  componentDragend() {
    this.$emit("componentDragend", this);
  }

  elementDropped() {
    this.$emit("elementDropped", this);
  }

  applySettings(settings: IPhaserSettings) {
    this.settings = settings;
  }

  dispose() {
    this.input.disconnect();
    this.tonePhaser.disconnect();

    this.input.dispose();
    this.output.dispose();
    this.tonePhaser.dispose();
  }

  @Watch("settings.mix")
  private onMixChange(value: number) {
    this.tonePhaser.wet.value = value;
  }

  @Watch("settings.frequency")
  private onFrequencyChange(value: number) {
    this.tonePhaser.frequency.value = value;
  }

  @Watch("settings.baseFrequency")
  private onBaseFrequencyChange(value: number) {
    this.tonePhaser.baseFrequency = value;
  }

	@Watch("settings.octaves")
  private onOctavesChange(value: number) {
    this.tonePhaser.octaves = value;
  }
}
</script>

<style scoped>
.phaser-container {
  background-image: url("../../assets/metal-1.png");
  background-repeat: repeat;
  display: inline-block;
  font-size: 10pt;
  padding: 10px;
  border: 1px solid black;
}
</style>
