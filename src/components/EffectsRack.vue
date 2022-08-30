<template>
  <div class="effects-rack-container">
    <!-- new effects will be mounted here -->
    <div class="effects-rack" id="effectsRack">

      <component
        v-for="(effectsComponent, index) in effectsComponents"
        :key="effectsComponent.id"
        :is="effectsComponent.componentName"
        @effectsDeviceMounted="effectsDeviceMounted"
        @deleteComponent="(device) => removeEffect(device, index)"
        @elementDropped="(device) => moveEffect(device, index)"
        @componentDragstart="(device) => setDragSource(device, index)"
      />

    </div>

    <div class="add-new center-y center-x">
      <v-menu top :offset-x="true">
        <template v-slot:activator="{ on, attrs }">
          <v-icon
            large
            dark
            v-bind="attrs"
            v-on="on"
            @contextmenu="
              (e) => {
                e.preventDefault();
                on.click(e);
              }
            "
          >
            mdi-plus
          </v-icon>
        </template>

        <v-list dark>
          <v-list-item
            link
            v-for="(item, index) in effectsOptions"
            :key="index"
            @click="addEffect(item)"
          >
            <v-list-item-title class="effects-option">{{
              item.type
            }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { IEffectsDevice } from "@/shared/interfaces/devices/IEffectsDevice";
import EffectsChain from "@/shared/classes/effects/EffectsChain";
import Reverb from "@/components/effects/Reverb.vue";
import DigitalDelay from "@/components/effects/DigitalDelay.vue";
import BBDelay from "@/components/effects/BBDelay.vue";
import Visualizer from "@/components/effects/Visualizer.vue";
import Distortion from "@/components/effects/Distortion.vue";
import Phaser from "@/components/effects/Phaser.vue";
import Chorus from "@/components/effects/Chorus.vue";
import { ToneAudioNode } from "tone";
import { v4 as uuidv4 } from "uuid";

type TEffectsComponentType =
  | "Digital Delay"
  | "Analog Delay"
  | "Visualizer"
  | "Reverb"
  | "Distortion"
  | "Phaser"
  | "Chorus";

type TEffectsComponentOption = {
  type: TEffectsComponentType;
  componentName: string;
}

type TEffectsComponent = {
  componentName: string;
  id: string;
}

@Component({
  components: {
    Reverb,
    DigitalDelay,
    BBDelay,
    Visualizer,
    Distortion,
    Phaser,
    Chorus
  },
})
export default class EffectsRack extends Vue implements IEffectsDevice {
  public guid: string;
  public output: ToneAudioNode;
  public input: ToneAudioNode;
  public name: string;
  public settings: any;

  public effectsComponents: TEffectsComponent[];

  private chain: EffectsChain;
  private effectsOptions: TEffectsComponentOption[];
  private dragSourceIndex?: number;

  private dragSourceDevice: IEffectsDevice | undefined;

  constructor() {
    super();

    this.guid = uuidv4();
    this.chain = new EffectsChain();
    this.effectsOptions = [
      { type: "Digital Delay", componentName: "DigitalDelay" },
      { type: "Analog Delay", componentName: "BBDelay" },
      { type: "Visualizer", componentName: "Visualizer" },
      { type: "Reverb", componentName: "Reverb" },
      { type: "Distortion", componentName: "Distortion" },
      { type: "Phaser", componentName: "Phaser" }
      // "Chorus" - commenting this out for now because it sounds kinda crappy
    ];

    this.effectsComponents = [];

    this.name = "Effects Rack";
    this.output = this.chain.output;
    this.input = this.chain.input;
    this.settings = {};
  }

  // Lifecycle Hooks

  mounted() {
    this.addEffect({ type: "Visualizer", componentName: "Visualizer" });
    this.$emit("deviceMounted");
  }

  beforeDestroy() {
    this.dispose();
  }

  // Methods

  effectsDeviceMounted(effectsDevice: IEffectsDevice) {
    this.chain.addComponent(effectsDevice, this.chain.components.length);
  }

  addEffect(option: TEffectsComponentOption) {
    this.effectsComponents.push({
      componentName: option.componentName, id: uuidv4()
    });
  }

  removeEffect(device: IEffectsDevice, index: number) {
    this.chain.removeComponent(device);
    this.effectsComponents.splice(index, 1).map(c => c.id);
  }

  setDragSource(device: IEffectsDevice, sourceIndex: number) {
    this.dragSourceDevice = device;
    this.dragSourceIndex = sourceIndex;
  }

  moveEffect(destinationDevice: IEffectsDevice, dragDestinationIndex: number) {
    if (this.dragSourceDevice === undefined || this.dragSourceIndex === undefined) return;

    if (this.dragSourceIndex != dragDestinationIndex) {
      this.chain.removeComponentByIndex(this.dragSourceIndex);

      const effectsComponent = this.effectsComponents.splice(this.dragSourceIndex, 1)[0];

      this.effectsComponents.splice(dragDestinationIndex, 0, effectsComponent);

      this.chain.addComponent(this.dragSourceDevice, dragDestinationIndex);
    }

    // todo: will stay defined if the drag ends somewhere else
    this.dragSourceDevice = this.dragSourceIndex = undefined;
  }

  applySettings(settings: any): void {
    this.settings = settings;
  }

  dispose() {
    this.chain.dispose();
  }
}
</script>

<style scoped>
.effects-rack-container {
  display: flex;
  justify-content: stretch;
  flex-wrap: wrap;
}

.effects-rack {
  display: flex;
  flex-wrap: wrap;
}

.effects-option {
  cursor: pointer;
}

.add-new {
  background: rgba(0, 0, 0, 0.5);
  padding: 6px;
}
</style>

<style>
.center-x {
  display: flex;
  justify-content: center;
}
.center-y {
  display: flex;
  align-items: center;
}
.flex {
  display: flex;
}
</style>
