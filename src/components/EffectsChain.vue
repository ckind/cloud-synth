<template>
  <div class="effects-rack">
		<!-- <reverb ref="reverb" /> -->
		<delay ref="reverb" />
	</div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { IEffectsDevice } from "@/shared/interfaces/devices/IEffectsDevice";
import Reverb from "@/components/effects/Reverb.vue";
import Delay from "@/components/effects/Delay.vue";
import { ToneAudioNode, Gain as ToneGain } from "tone";

@Component({
  components: {
    Reverb,
		Delay
  },
})
export default class EffectsChain extends Vue implements IEffectsDevice {
  public output: ToneAudioNode;
  public input: ToneAudioNode;
  public name: string;
  public settings: any;

	$refs!: {
    reverb: Reverb;
  };

  constructor() {
    super();

    this.name = "Effects Chain";
    this.output = new ToneGain(1);
    this.input = new ToneGain(1);
    this.settings = {};
  }

	mounted() {
		this.input.connect(this.$refs.reverb.input);
		this.$refs.reverb.output.connect(this.output);

		this.$emit("deviceMounted");
	}

	beforeDestroy() {
    this.dispose();
  }

  applySettings(settings: any): void {
    this.settings = settings;
  }

  dispose() {
		this.input.disconnect(this.$refs.reverb.input);
    this.$refs.reverb.output.disconnect(this.output);

		this.$refs.reverb.dispose();
		this.input.dispose();
		this.output.dispose();
  }
}
</script>

<style scoped>
.effects-rack {
  background-image: url("../assets/metal-2.png");
  background-repeat: repeat;
}
</style>
