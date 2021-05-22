<template>
  <div class="effects-rack">
    <div v-for="(c, i) in chain.components" :key="i" :id="c.name"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { IEffectsDevice } from "@/shared/interfaces/devices/IEffectsDevice";
import Reverb from "@/components/effects/Reverb.vue";
import Delay from "@/components/effects/Delay.vue";
import { ToneAudioNode, Gain as ToneGain } from "tone";

interface IEffectsComponent extends IEffectsDevice, Vue {}

class EffectsChain {
  public components: IEffectsComponent[];
  public input: ToneGain;
  public output: ToneGain;

  constructor(components: IEffectsComponent[] = []) {
    this.components = components;
    this.input = new ToneGain(1);
    this.output = new ToneGain(1);

    if (components.length > 0) {
      this.input.connect(this.components[0].input);
      this.components[this.components.length - 1].output.connect(this.output);
    } else {
      this.input.connect(this.output);
    }

    for (let i = 0; i < this.components.length - 1; i++) {
      this.components[i].output.connect(this.components[i + 1].input);
    }
  }

  dispose() {
    this.input.disconnect(this.components[0].input);
    this.components[this.components.length - 1].output.disconnect(this.output);

    for (let i = 0; i < this.components.length - 1; i++) {
      this.components[i].output.disconnect(this.components[i + 1].input);
      this.components[i].dispose();
    }

    this.components[this.components.length - 1].dispose();

    this.input.dispose();
    this.output.dispose();
  }
}

@Component({
  components: {
    Reverb,
    Delay,
  },
})
export default class EffectsRack extends Vue implements IEffectsDevice {
  public output: ToneAudioNode;
  public input: ToneAudioNode;
  public name: string;
  public settings: any;

  private chain: EffectsChain;

  $refs!: {
    rack: HTMLElement
  };

  constructor() {
    super();

    this.chain = new EffectsChain([new Delay(), new Reverb()]);

    this.name = "Effects Chain";
    this.output = this.chain.output;
    this.input = this.chain.input;
    this.settings = {};
  }

  mounted() {
    this.chain.components.forEach(c => {
      const el = document.getElementById(c.name);
      if (el) c.$mount(el);
    });

    this.$emit("deviceMounted");
  }

  beforeDestroy() {
    this.dispose();
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
.effects-rack {
  display: flex;
}
</style>
