<template>
  <div class="delay-container">
    <h3 class="center-x mb-2">{{ name }}</h3>
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
			v-model="delayTimeSignal.value"
			:minValue="0.001"
			:maxValue="1"
			label="Time"
			id="time"
			size="50"
      :shadowColor="'#3f3f3f'"
		></knob-control>
		<knob-control
			v-model="feedbackSignal.value"
			:minValue="0"
			:maxValue=".99"
			label="Feedback"
			id="feedback"
			size="50"
      :shadowColor="'#3f3f3f'"
		></knob-control>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { IEffectsDevice } from "@/shared/interfaces/devices/IEffectsDevice";
import KnobControl from "@/components/KnobControl.vue";
import { v4 as uuidv4 } from "uuid";
import {
  ToneAudioNode,
  Gain as ToneGain,
  FeedbackDelay as ToneFeedbackDelay,
  Signal as ToneSignal,
} from "tone";

@Component({
  components: {
    KnobControl,
  },
})
export default class DigitalDelay extends Vue implements IEffectsDevice {
  public guid: string;
  public output: ToneAudioNode;
  public input: ToneAudioNode;
  public name: string;
  public settings: any;

  private toneDelay: ToneFeedbackDelay;
  private dryWetSignal: ToneSignal;
	private delayTimeSignal: ToneSignal;
	private feedbackSignal: ToneSignal;

  constructor() {
    super();

    this.guid = uuidv4();
    this.output = new ToneGain(1);
    this.input = new ToneGain(1);
    this.name = "Digital Delay";
    this.settings = {};

    this.toneDelay = new ToneFeedbackDelay();
    this.dryWetSignal = new ToneSignal(0.5);
		this.delayTimeSignal = new ToneSignal(1);
		this.feedbackSignal = new ToneSignal(0.5);

		this.delayTimeSignal.connect(this.toneDelay.delayTime);
		this.dryWetSignal.connect(this.toneDelay.wet);
		this.feedbackSignal.connect(this.toneDelay.feedback);

    this.input.connect(this.toneDelay);
    this.toneDelay.connect(this.output);
  }

  beforeDestroy() {
    this.dispose();
  }

  applySettings(settings: any) {
    this.settings = settings;
  }

  dispose() {
    this.input.disconnect(this.toneDelay);
    this.toneDelay.disconnect(this.output);

    this.toneDelay.dispose();
    this.input.dispose();
    this.output.dispose();
  }
}
</script>

<style scoped>
.delay-container {
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
