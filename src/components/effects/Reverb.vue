<template>
  <div class="reverb-container">
		<h3 class="center-x mb-2">Reverb</h3>
		<knob-control
			v-model="dryWetSignal.value"
			:minValue="0"
			:maxValue="1"
			label="Mix"
			id="dryWet"
			size="50"
      :shadowColor="'#3f3f3f'"
		></knob-control>
		<knob-control
			v-model="toneReverb.decay"
			:minValue="0"
			:maxValue="20"
			label="Decay"
			id="dryWet"
			size="50"
      :shadowColor="'#3f3f3f'"
		></knob-control>
	</div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { IEffectsDevice } from "@/shared/interfaces/devices/IEffectsDevice";
import KnobControl from "@/components/KnobControl.vue";
import { ToneAudioNode, Gain as ToneGain, Reverb as ToneReverb, Signal as ToneSignal } from "tone";

@Component({
	components: {
		KnobControl
	}
})
export default class Reverb extends Vue implements IEffectsDevice {
  public output: ToneAudioNode;
  public input: ToneAudioNode;
  public name: string;
  public settings: any;

  private toneReverb: ToneReverb;
	private dryWetSignal: ToneSignal;

  constructor() {
    super();

    this.output = new ToneGain(1);
    this.input = new ToneGain(1);
    this.name = "Reverb";
    this.settings = {};

    this.toneReverb = new ToneReverb(2);
		this.dryWetSignal = new ToneSignal(0.5);

		this.dryWetSignal.connect(this.toneReverb.wet);

    this.input.connect(this.toneReverb);
    this.toneReverb.connect(this.output);
  }

	beforeDestroy() {
		this.dispose();
	}

  applySettings(settings: any) {
    this.settings = settings;
  }

  dispose() {
    this.input.disconnect(this.toneReverb);
    this.toneReverb.disconnect(this.output);

    this.toneReverb.dispose();
		this.input.dispose();
		this.output.dispose();
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

.center-x {
  display: flex;
  justify-content: center;
}
.center-y {
  display: flex;
  align-items: center;
}
</style>
