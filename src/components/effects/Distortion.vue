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
      v-model="toneDistortion.distortion"
      :minValue="0.001"
      :maxValue="1"
      label="Drive"
      id="Drive"
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
  Distortion as ToneDistortion,
  Signal as ToneSignal,
} from "tone";

@Component({
  components: {
    KnobControl,
  },
})
export default class Distortion extends Vue implements IEffectsDevice {
  public guid: string;
  public output: ToneAudioNode;
  public input: ToneAudioNode;
  public name: string;
  public settings: any;

  private toneDistortion: ToneDistortion;
  private dryWetSignal: ToneSignal;

  constructor() {
    super();

    this.guid = uuidv4();
    this.output = new ToneGain(1);
    this.input = new ToneGain(1);
    this.name = "Distortion";
    this.settings = {};

    this.toneDistortion = new ToneDistortion(0.2);
    this.dryWetSignal = new ToneSignal(1);

    this.dryWetSignal.connect(this.toneDistortion.wet);
    this.input.connect(this.toneDistortion);
    this.toneDistortion.connect(this.output);
  }

  beforeDestroy() {
    this.dispose();
  }

  applySettings(settings: any) {
    this.settings = settings;
  }

  dispose() {
		this.dryWetSignal.disconnect(this.toneDistortion.wet);
    this.input.disconnect(this.toneDistortion);
    this.toneDistortion.disconnect(this.output);

    this.input.dispose();
    this.output.dispose();
    this.toneDistortion.dispose();
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
