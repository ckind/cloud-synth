<template>
  <div
    class="flex"
    draggable
    @dragstart="componentDragstart"
    @dragend="componentDragend"
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
            :size="50"
            :shadowColor="'#5e5e5e'"
          ></knob-control>
          <knob-control
            v-model="settings.drive"
            :minValue="0.001"
            :maxValue="1"
            label="Drive"
            id="Drive"
            :size="50"
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
import { defineComponent, ref, onBeforeUnmount, getCurrentInstance, reactive } from "vue";
import { Component, Vue, Watch } from "vue-property-decorator";
import { IEffectsDevice } from "@/shared/interfaces/devices/IEffectsDevice";
import KnobControl from "@/components/KnobControl.vue";
import { v4 as uuidv4 } from "uuid";
import {
  ToneAudioNode,
  Gain as ToneGain,
  Distortion as ToneDistortion
} from "tone";

interface IDistortionSettings {
  mix: number;
  drive: number;
}

//#region composition api

// todo: probably need to refactor effects rack first
defineComponent({
// export default defineComponent({
  emits: [
    "deleteComponent",
    "componentDragstart",
    "componentDragend",
    "elementDropped"
  ],
  setup(props, context) {
    const guid = ref(uuidv4());
    const name = ref("Distrotion");
    const settings = reactive({
      mix: 1.0,
      drive: 0.4,
    });

    const input = new ToneGain(1);
    const output = new ToneGain(1);
    const toneDistortion = new ToneDistortion(0.4);

    input.connect(toneDistortion);
    toneDistortion.connect(output);

    function deleteComponent() {
      context.emit("deleteComponent", getCurrentInstance());
    }

    function componentDragstart() {
      context.emit("componentDragstart", getCurrentInstance());
    }

    function componentDragend() {
      context.emit("componentDragend", getCurrentInstance());
    }

    function elementDropped() {
      context.emit("elementDropped", getCurrentInstance());
    }

    function applySettings(newSettings: IDistortionSettings) {
      settings.drive = newSettings.drive;
      settings.mix = newSettings.mix;
    }

    function dispose() {
      input.disconnect(toneDistortion);
      toneDistortion.disconnect(output);

      input.dispose();
      output.dispose();
      toneDistortion.dispose();
    }

    onBeforeUnmount(() => dispose());

    return {
      input,
      output,
      guid,
      name,
      settings,
      deleteComponent,
      componentDragstart,
      componentDragend,
      elementDropped,
      applySettings
    }
  }
});

//#endregion

//#region class api

@Component({
  components: {
    KnobControl,
  },
})
// class Distortion extends Vue implements IEffectsDevice {
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

//#endregion
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
