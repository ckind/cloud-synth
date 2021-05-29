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
          class="dist-container"
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
            size="50"
            :shadowColor="'#3f3f3f'"
          ></knob-control>
          <knob-control
            v-model="settings.drive"
            :minValue="0.001"
            :maxValue="1"
            label="Drive"
            id="Drive"
            size="50"
            :shadowColor="'#3f3f3f'"
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
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { IEffectsDevice } from "@/shared/interfaces/devices/IEffectsDevice";
import KnobControl from "@/components/KnobControl.vue";
import { v4 as uuidv4 } from "uuid";
import {
  ToneAudioNode,
  Gain as ToneGain,
  Distortion as ToneDistortion,
  Signal as ToneSignal,
} from "tone";

interface IDistortionSettings {
  mix: number;
  drive: number;
}

@Component({
  components: {
    KnobControl,
  },
})
export default class Distortion extends Vue implements IEffectsDevice {
  public guid: string;
  public name: string;
  public settings: IDistortionSettings;

  public input!: ToneAudioNode;
  public output!: ToneAudioNode;
  private toneDistortion!: ToneDistortion;

  constructor() {
    super();

    this.guid = uuidv4();
    this.name = "Distortion";
    this.settings = {
      mix: 1.0,
      drive: 0.4,
    };
  }

  // Lifecycle Hooks

  created() {
    this.input = new ToneGain(1);
    this.output = new ToneGain(1);
    this.toneDistortion = new ToneDistortion(0.4);

    this.input.connect(this.toneDistortion);
    this.toneDistortion.connect(this.output);
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

  applySettings(settings: any) {
    this.settings = settings;
  }

  dispose() {
    this.input.disconnect(this.toneDistortion);
    this.toneDistortion.disconnect(this.output);

    this.input.dispose();
    this.output.dispose();
    this.toneDistortion.dispose();
  }

  // Watch

  @Watch("settings.mix")
  private setMix(value: number) {
    this.toneDistortion.wet.value = value;
  }

  @Watch("settings.drive")
  private setDrive(value: number) {
    this.toneDistortion.distortion = value;
  }
}
</script>

<style scoped>
.dist-container {
  background-image: url("../../assets/metal-1.png");
  background-repeat: repeat;
  display: inline-block;
  font-size: 10pt;
  padding: 10px;
  border: 1px solid black;
}
</style>
