<template>
  <div class="effects-rack-container">
    <!-- new effects will be mounted here -->
    <div class="effects-rack" id="effectsRack"></div>

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
          <v-list-item v-for="(item, index) in effectsOptions" :key="index">
            <v-list-item-title
              class="effects-option"
              @click="addEffect(item)"
              >{{ item }}</v-list-item-title
            >
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { IEffectsDevice } from "@/shared/interfaces/devices/IEffectsDevice";
import Reverb from "@/components/effects/Reverb.vue";
import DigitalDelay from "@/components/effects/DigitalDelay.vue";
import BBDelay from "@/components/effects/BBDelay.vue";
import Visualizer from "@/components/effects/Visualizer.vue";
import Distortion from "@/components/effects/Distortion.vue";
import Vuetify from "vuetify";
import { ToneAudioNode, Gain as ToneGain } from "tone";
import { v4 as uuidv4 } from "uuid";

interface IEffectsComponent extends IEffectsDevice, Vue {}

type EffectsComponentType =
  | "DigitalDelay"
  | "BBDelay"
  | "Visualizer"
  | "Reverb"
  | "Distortion";

// factory method
function createEffectsComponent(type: EffectsComponentType): IEffectsComponent {
  let component: IEffectsComponent;
  switch (type) {
    case "DigitalDelay":
      component = new DigitalDelay();
      break;
    case "BBDelay":
      component = new BBDelay();
      break;
    case "Reverb":
      component = new Reverb();
      break;
    case "Visualizer":
      component = new Visualizer();
      break;
    case "Distortion":
      component = new Distortion();
      break;
    default:
      throw "invalid EffectsComponentType argument";
  }
  component.$vuetify = Vuetify.framework; // todo: this is kinda hacky - find a better way
  return component;
}

class EffectsChain {
  public components: IEffectsComponent[];
  public input: ToneGain;
  public output: ToneGain;

  constructor() {
    this.components = [];

    this.input = new ToneGain(1);
    this.output = new ToneGain(1);

    this.input.connect(this.output);
  }

  addComponent(component: IEffectsComponent, index: number) {
    if (index < 0 || index > this.components.length)
      throw "effects component index out of range";

    const prevNode: ToneAudioNode =
      index === 0 ? this.input : this.components[index - 1].output;
    const nextNode: ToneAudioNode =
      index === this.components.length
        ? this.output
        : this.components[index].input;

    prevNode.disconnect(nextNode);
    prevNode.connect(component.input);
    component.output.connect(nextNode);

    this.components.splice(index, 0, component);
  }

  removeComponent(component: IEffectsComponent) {
    const index = this.components.findIndex((c) => c === component);

    if (index < 0) throw "component not found in chain";

    const prevNode: ToneAudioNode =
      index === 0 ? this.input : this.components[index - 1].output;
    const nextNode: ToneAudioNode =
      index === this.components.length - 1
        ? this.output
        : this.components[index + 1].input;

    prevNode.disconnect(component.input);
    component.output.disconnect(nextNode);
    prevNode.connect(nextNode);

    this.components.splice(index, 1);
  }

  dispose() {
    this.input.disconnect(this.components[0].input);
    this.components[this.components.length - 1].output.disconnect(this.output);

    for (let i = 0; i < this.components.length - 1; i++) {
      this.components[i].output.disconnect(this.components[i + 1].input);
    }

    this.input.dispose();
    this.output.dispose();
  }
}

@Component({
  components: {
    Reverb,
    DigitalDelay,
    BBDelay,
    Visualizer,
    Distortion,
  },
})
export default class EffectsRack extends Vue implements IEffectsDevice {
  public guid: string;
  public output: ToneAudioNode;
  public input: ToneAudioNode;
  public name: string;
  public settings: any;

  private chain: EffectsChain;
  private rack?: HTMLElement | null;
  private effectsOptions: string[];
  private currentDragComponent: IEffectsComponent | undefined;

  $refs!: {
    rack: HTMLElement;
  };

  constructor() {
    super();

    this.guid = uuidv4();
    this.chain = new EffectsChain();
    this.effectsOptions = [
      "DigitalDelay",
      "BBDelay",
      "Visualizer",
      "Reverb",
      "Distortion",
    ];

    this.name = "Effects Chain";
    this.output = this.chain.output;
    this.input = this.chain.input;
    this.settings = {};
  }

  // Lifecycle Hooks

  mounted() {
    this.rack = document.getElementById("effectsRack");

    this.addEffect("Visualizer");

    this.$emit("deviceMounted");
  }

  beforeDestroy() {
    this.dispose();
  }

  // Methods

  addEffect(type: EffectsComponentType) {
    const el = document.createElement("div");

    if (this.rack?.appendChild(el)) {
      const component = createEffectsComponent(type);
      this.chain.addComponent(component, this.chain.components.length);
      component.$on("deleteComponent", this.removeEffect);
      component.$on("elementDropped", this.moveEffect);
      component.$on("componentDragstart", this.setCurrentDragComponent);
      component.$mount(el);
    }
  }

  removeEffect(component: IEffectsComponent) {
    this.chain.removeComponent(component);
    component.$destroy();
  }

  moveEffect(destinationComponent: IEffectsComponent) {
    if (!this.currentDragComponent) return;
    const sourceComponent = this.currentDragComponent;

    const srcIndex = this.chain.components.findIndex(
      (c) => c === sourceComponent
    );
    const dstIndex = this.chain.components.findIndex(
      (c) => c === destinationComponent
    );

    if (srcIndex < 0) throw "source component not found in chain";
    if (dstIndex < 0) throw "destination component not found in chain";

    if (destinationComponent.guid != sourceComponent.guid) {
      this.chain.removeComponent(sourceComponent);
      // dstIndex will now fall to the right of our destination component
      // because we spliced out the source component

      document.getElementById("effectsRack")!.removeChild(sourceComponent.$el);

      if (dstIndex < srcIndex) {
        destinationComponent.$el.insertAdjacentElement(
          "beforebegin",
          sourceComponent.$el
        );
      } else {
        destinationComponent.$el.insertAdjacentElement(
          "afterend",
          sourceComponent.$el
        );
      }

      this.chain.addComponent(sourceComponent, dstIndex);
    }

    this.currentDragComponent = undefined;
    // todo: this.currentDragComponent will stay defined if the drag ends somewhere else
  }

  setCurrentDragComponent(component: IEffectsComponent) {
    this.currentDragComponent = component;
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
