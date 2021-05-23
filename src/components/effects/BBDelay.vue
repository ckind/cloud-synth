<template>
  <div class="delay-container">
    <h3 class="center-x mb-2">BBDelay</h3>
    <knob-control
      v-model="wethack"
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
      v-model="feedbackSignal.gain.value"
      :minValue="0"
      :maxValue="1.05"
      label="Feedback"
      id="feedback"
      size="50"
      :shadowColor="'#3f3f3f'"
    ></knob-control>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { IEffectsDevice } from "@/shared/interfaces/devices/IEffectsDevice";
import { DryWetMixer } from "@/shared/classes/utility/DryWetMixer";
import KnobControl from "@/components/KnobControl.vue";
import {
  ToneAudioNode,
  Gain as ToneGain,
  Delay as ToneDelay,
  Signal as ToneSignal,
  Filter as ToneFilter,
  Distortion as ToneDistortion,
} from "tone";

@Component({
  components: {
    KnobControl,
  },
})
export default class BBDelay extends Vue implements IEffectsDevice {
  public output: ToneAudioNode;
  public input: ToneAudioNode;
  public name: string;
  public settings: any;

  private toneDelay: ToneDelay;
  private delayTimeSignal: ToneSignal;
  private feedbackSignal: ToneGain;
  private dryWetMixer: DryWetMixer;
  private drySignal: ToneGain;
  private wetSignal: ToneGain;
  private filter: ToneFilter;
  private distortion: ToneDistortion;

  private wethack: number;

  constructor() {
    super();

    this.output = new ToneGain(1);
    this.input = new ToneGain(1);
    this.name = "BBDelay";
    this.settings = {};

    this.toneDelay = new ToneDelay();
    this.feedbackSignal = new ToneGain(0.5);
    this.delayTimeSignal = new ToneSignal(0.2);

    this.distortion = new ToneDistortion(0.05);

    this.drySignal = new ToneGain(1);
    this.wetSignal = new ToneGain(1);
    this.dryWetMixer = new DryWetMixer(this.drySignal, this.wetSignal);

    this.filter = new ToneFilter(4000, "lowpass");

    this.wethack = 0.5;

    this.delayTimeSignal.connect(this.toneDelay.delayTime);

    this.input.chain(
      this.toneDelay,
      this.distortion,
      this.filter,
      this.feedbackSignal,
      this.toneDelay,
      this.wetSignal
    );
    this.input.chain(this.drySignal);

    this.dryWetMixer.output.connect(this.output);
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

  // v-model doesn't like class getters and setters...
  @Watch("wethack")
  private setWethack(value: number) {
    this.dryWetMixer.wetness = value;
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
