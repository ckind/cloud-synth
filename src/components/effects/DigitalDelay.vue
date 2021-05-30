<template>
  <div
    class="flex"
    draggable
    @dragstart="this.componentDragstart"
    @dragend="this.componentDragend"
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
            :shadowColor="'#5e5e5e'"
          ></knob-control>
          <knob-control
            v-model="settings.delayTime"
            :minValue="0.001"
            :maxValue="1"
            label="Time"
            id="time"
            size="50"
            :shadowColor="'#5e5e5e'"
          ></knob-control>
          <knob-control
            v-model="settings.feedback"
            :minValue="0"
            :maxValue="0.99"
            label="Feedback"
            id="feedback"
            size="50"
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
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { IEffectsDevice } from "@/shared/interfaces/devices/IEffectsDevice";
import KnobControl from "@/components/KnobControl.vue";
import { v4 as uuidv4 } from "uuid";
import {
  ToneAudioNode,
  Gain as ToneGain,
  FeedbackDelay as ToneFeedbackDelay,
  Signal as ToneSignal,
} from "tone";

interface IDigitalDelaySettings {
  mix: number;
  delayTime: number;
  feedback: number;
}

@Component({
  components: {
    KnobControl,
  },
})
export default class DigitalDelay extends Vue implements IEffectsDevice {
  public guid: string;
  public name: string;
  public settings: IDigitalDelaySettings;
  public input!: ToneAudioNode;
  public output!: ToneAudioNode;

  private toneDelay!: ToneFeedbackDelay;
  private dryWetSignal!: ToneSignal;
  private delayTimeSignal!: ToneSignal;
  private feedbackSignal!: ToneSignal;

  constructor() {
    super();

    this.guid = uuidv4();
    this.name = "Digital Delay";
    this.settings = {
      mix: 0.5,
      delayTime: 0.2,
      feedback: 0.5,
    };
  }

  // Lifecycle Hooks

  created() {
    this.input = new ToneGain(1);
    this.output = new ToneGain(1);

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
    this.input.disconnect();
    this.toneDelay.disconnect();
    this.dryWetSignal.disconnect();
    this.feedbackSignal.disconnect();
    this.delayTimeSignal.disconnect();
    // this.output.disconnect(); todo: should we handle this here?

    this.input.dispose();
    this.output.dispose();
    this.toneDelay.dispose();
    this.dryWetSignal.dispose();
    this.feedbackSignal.dispose();
    this.delayTimeSignal.dispose();
  }

  // Watches

  @Watch("settings.mix")
  private setMix(value: number) {
    this.dryWetSignal.value = value;
  }

  @Watch("settings.delayTime")
  private setDelayTime(value: number) {
    this.delayTimeSignal.linearRampTo(value, 0.1);
  }

  @Watch("settings.feedback")
  private setFeedback(value: number) {
    this.feedbackSignal.value = value;
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
