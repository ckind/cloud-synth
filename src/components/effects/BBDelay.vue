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
          <v-row class="py-0 my-0">
            <v-col class="col-6 py-0 my-0">
              <knob-control
                v-model="settings.mix"
                :minValue="0"
                :maxValue="1"
                label="Mix"
                id="dryWet"
                :size="50"
                :shadowColor="'#5e5e5e'"
              ></knob-control>
            </v-col>
            <v-col class="col-6 py-0 my-0">
              <knob-control
                v-model="settings.modRate"
                :minValue="minDelayTimeModRate"
                :maxValue="maxDelayTimeModRate"
                label="Mod"
                id="modRate"
                :size="50"
                :shadowColor="'#5e5e5e'"
              ></knob-control>
            </v-col>
          </v-row>
          <v-row class="py-0 my-0">
            <v-col class="col-6 py-0 my-0">
              <knob-control
                v-show="settings.sync"
                v-model="settings.delayTimeSynced"
                :minValue="0.25"
                :maxValue="2"
                label="Time"
                id="syncedTime"
                :size="50"
                :step="0.25"
                :shadowColor="'#5e5e5e'"
              ></knob-control>
              <knob-control
                v-show="!settings.sync"
                v-model="settings.delayTime"
                :minValue="minDelayTime"
                :maxValue="maxDelayTime"
                label="Time"
                id="time"
                :size="50"
                :shadowColor="'#5e5e5e'"
              ></knob-control>
            </v-col>
            <v-col class="col-6 py-0 my-0">
              <knob-control
                v-model="settings.modAmount"
                :minValue="minDelayTimeModAmount"
                :maxValue="maxDelayTimeModAmount"
                label="Depth"
                id="modAmount"
                :size="50"
                :shadowColor="'#5e5e5e'"
              ></knob-control>
            </v-col>
          </v-row>
          <v-row class="py-0 my-0">
            <v-col class="col-6 py-0 my-0">
              <knob-control
                v-model="settings.feedback"
                :minValue="0"
                :maxValue="1.1"
                label="Feedback"
                id="feedback"
                :size="50"
                :shadowColor="'#5e5e5e'"
              ></knob-control>
            </v-col>
            <v-col class="col-6 py-0 my-0">
              <v-row class="py-0 my-0 justify-center">
                <v-switch v-model="settings.sync" hide-details></v-switch>
              </v-row>
              <v-row class="py-0 my-0 justify-center">
                <span>Sync</span>
              </v-row>
            </v-col>
          </v-row>
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
  Transport as ToneTransport,
  LFO as ToneLFO,
} from "tone";

interface IBBDelaySettings {
  mix: number;
  sync: boolean;
  delayTime: number;
  delayTimeSynced: number;
  modRate: number;
  modAmount: number;
  feedback: number;
}

@Component({
  components: {
    KnobControl,
  },
})
export default class BBDelay extends Vue implements IEffectsDevice {
  public guid: string;
  public output!: ToneAudioNode;
  public input!: ToneAudioNode;
  public name: string;
  public settings: IBBDelaySettings;
  public selected = false;

  private minDelayTime = 0.001;
  private maxDelayTime = 1;
  private minDelayTimeModAmount = 0;
  private maxDelayTimeModAmount = 0.01;
  private minDelayTimeModRate = 0.01;
  private maxDelayTimeModRate = 10;

  private toneDelay!: ToneDelay;
  private delayTimeSignal!: ToneSignal;
  private feedbackSignal!: ToneGain;
  private dryWetMixer!: DryWetMixer;
  private drySignal!: ToneGain;
  private wetSignal!: ToneGain;
  private filter!: ToneFilter;
  private distortion!: ToneDistortion;
  private delayTimeLFO!: ToneLFO;
  private delayTimeLFOGain!: ToneGain;

  private delayTimeSmoothing = 0.05;

  get bpmInterval() {
    return 60 / ToneTransport.bpm.value;
  }

  constructor() {
    super();

    this.guid = uuidv4();
    this.name = "Analog Delay";
    this.settings = {
      mix: 0.5,
      sync: false,
      delayTime: 0.2,
      delayTimeSynced: 0.75,
      modRate: 2,
      modAmount: 0.001,
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
    this.delayTimeLFO = new ToneLFO(
      this.settings.modRate,
      this.minDelayTime,
      this.maxDelayTime
    );
    this.delayTimeLFOGain = new ToneGain(this.settings.modAmount);

    this.delayTimeSignal.connect(this.toneDelay.delayTime);
    this.input.chain(
      this.toneDelay,
      this.distortion,
      this.filter,
      this.feedbackSignal,
      this.toneDelay,
      this.wetSignal
    );
    this.delayTimeLFO.chain(this.delayTimeLFOGain, this.toneDelay.delayTime);
    this.input.chain(this.drySignal);
    this.dryWetMixer.output.connect(this.output);

    this.delayTimeLFO.start();
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
    this.delayTimeLFO.stop();

    this.input.disconnect();
    this.toneDelay.disconnect();
    this.distortion.disconnect();
    this.filter.disconnect();
    this.feedbackSignal.disconnect();
    this.toneDelay.disconnect();
    this.wetSignal.disconnect();
    this.drySignal.disconnect();
    this.dryWetMixer.output.disconnect();
    this.delayTimeLFO.disconnect();
    this.delayTimeLFOGain.disconnect();
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
    this.delayTimeLFO.dispose();
    this.delayTimeLFOGain.dispose();
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

  @Watch("settings.sync")
  private setSync(value: boolean) {
    if (value) {
      this.setDelayTimeSynced(this.settings.delayTimeSynced);
    } else {
      this.setDelayTime(this.settings.delayTime);
    }
  }

  @Watch("settings.delayTime")
  private setDelayTime(value: number) {
    if (!this.settings.sync) {
      this.delayTimeSignal.linearRampTo(value, 0.05);
    }
  }

  @Watch("settings.delayTimeSynced")
  private setDelayTimeSynced(value: number) {
    if (this.settings.sync) {
      this.delayTimeSignal.linearRampTo(value * this.bpmInterval, 0.3);
    }
  }

  @Watch("settings.modRate")
  private setModRate(value: number) {
    this.delayTimeLFO.frequency.value = value;
  }

  @Watch("settings.modAmount")
  private setModAmount(value: number) {
    this.delayTimeLFOGain.gain.value = value;
  }
}
</script>

<style scoped>
.delay-container {
  background-image: url("../../assets/metal-1.png");
  background-repeat: repeat;
  display: inline-block;
  padding: 10px;
  font-size: 10pt;
  border: 1px solid black;
}
</style>
