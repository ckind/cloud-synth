<template>
  <div class="flex">
    <v-menu>
      <template v-slot:activator="{ on }">
        <div
          class="delay-container"
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
            v-model="settings.delayTime"
            :minValue="0.001"
            :maxValue="1"
            label="Time"
            id="time"
            size="50"
            :shadowColor="'#3f3f3f'"
          ></knob-control>
          <knob-control
            v-model="settings.feedback"
            :minValue="0"
            :maxValue="1.05"
            label="Feedback"
            id="feedback"
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
import { Component, Vue, Watch } from "vue-property-decorator";
import { IEffectsDevice } from "@/shared/interfaces/devices/IEffectsDevice";
import { DryWetMixer } from "@/shared/classes/utility/DryWetMixer";
import KnobControl from "@/components/KnobControl.vue";
import { v4 as uuidv4 } from "uuid";
import {
  ToneAudioNode,
  Gain as ToneGain,
  Delay as ToneDelay,
  Signal as ToneSignal,
  Filter as ToneFilter,
  Distortion as ToneDistortion,
} from "tone";

interface IBBDelaySettings {
  mix: number;
  delayTime: number;
  feedback: number;
}

@Component({
  components: {
    KnobControl,
  }
})
export default class BBDelay extends Vue implements IEffectsDevice {
  public guid: string;
  public output!: ToneAudioNode;
  public input!: ToneAudioNode;
  public name: string;
  public settings: IBBDelaySettings;
  public selected = false;

  private toneDelay!: ToneDelay;
  private delayTimeSignal!: ToneSignal;
  private feedbackSignal!: ToneGain;
  private dryWetMixer!: DryWetMixer;
  private drySignal!: ToneGain;
  private wetSignal!: ToneGain;
  private filter!: ToneFilter;
  private distortion!: ToneDistortion;

  constructor() {
    super();

    this.guid = uuidv4();
    this.name = "BBDelay";
    this.settings = {
      mix: 0.5,
      delayTime: 0.2,
      feedback: 0.5,
    };
  }

  // Lifecycle Hooks

  created() {
    this.output = new ToneGain(1);
    this.input = new ToneGain(1);
    this.toneDelay = new ToneDelay();
    this.feedbackSignal = new ToneGain(0.5);
    this.delayTimeSignal = new ToneSignal(0.2);
    this.distortion = new ToneDistortion(0.05);
    this.drySignal = new ToneGain(1);
    this.wetSignal = new ToneGain(1);
    this.dryWetMixer = new DryWetMixer(this.drySignal, this.wetSignal);
    this.filter = new ToneFilter(4000, "lowpass");

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

  // Methods

  deleteComponent() {
    this.$emit("deleteComponent", this);
  }

  applySettings(settings: any) {
    this.settings = settings;
  }

  dispose() {
    this.input.disconnect();
    this.toneDelay.disconnect();
    this.distortion.disconnect();
    this.filter.disconnect();
    this.feedbackSignal.disconnect();
    this.toneDelay.disconnect();
    this.wetSignal.disconnect();
    this.drySignal.disconnect();
    this.dryWetMixer.output.disconnect();
    // this.output.disconnect(); todo: should we handle this here?

    this.input.dispose();
    this.toneDelay.dispose();
    this.distortion.dispose();
    this.filter.dispose();
    this.feedbackSignal.dispose();
    this.toneDelay.dispose();
    this.wetSignal.dispose();
    this.drySignal.dispose();
    this.output.dispose();
  }

  // Watches

  @Watch("settings.mix")
  private setMix(value: number) {
    this.dryWetMixer.wetness = value;
  }

  @Watch("settings.feedback")
  private setFeedback(value: number) {
    this.feedbackSignal.gain.value = value;
  }

  @Watch("settings.delayTime")
  private setDelayTime(value: number) {
    this.delayTimeSignal.value = value;
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
</style>
