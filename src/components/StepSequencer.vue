<template>
  <v-row class="sequencer-container">
    <div class="sequencer">
      <v-btn @click="sequencerEvent.start()">start</v-btn>
      <v-btn @click="sequencerEvent.stop()">stop</v-btn>
      <v-text-field
        v-model="sequenceLength"
        type="number"
        label="Length"
        min="1"
        max="16"
      ></v-text-field>
      <v-text-field
        v-model="subdivision"
        type="number"
        label="Subdivision"
        min="1"
        max="32"
      ></v-text-field>
      <div class="step-column" v-for="(step, i) in steps" :key="i">
        <knob-control
          v-model="step.note"
          :minValue="1"
          :maxValue="127"
          :id="`step${i}note`"
          :step="1"
          size="60"
        ></knob-control>
        <knob-control
          v-model="step.velocity"
          :minValue="1"
          :maxValue="127"
          :id="`step${i}velocity`"
          :step="1"
          size="60"
        ></knob-control>
        <knob-control
          v-model="step.length"
          :minValue="0.001"
          :maxValue="1.0"
          :id="`step${i}length`"
          :step="0.001"
          size="60"
        ></knob-control>
        <div class="trigger-container">
          <div
            :class="[
              'step-trigger',
              step.active ? 'active-step' : 'inactive-step'
            ]"
            @click="triggerStep(step)"
            :id="`step${i}trigger`"
          />
        </div>
      </div>
    </div>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { IMidiDevice } from "@/shared/interfaces/devices/IMidiDevice";
import { IMidiReceiver } from "@/shared/interfaces/midi/IMidiReceiver";
import {
  MidiFunction,
  IMidiMessage
} from "@/shared/interfaces/midi/IMidiMessage";
import { Transport as ToneTransport, ToneEvent } from "tone";
import KnobControl from "@/components/KnobControl.vue";

interface IStep {
  index: number;
  note: number;
  velocity: number;
  length: number;
  on: boolean;
  active: boolean;
}

@Component({
  components: {
    KnobControl
  }
})
export default class ExternalMidiDevice extends Vue implements IMidiDevice {
  name = "External Midi Device";
  settings = {};

  private sequenceLength = 16;
  private previousStep = this.sequenceLength - 1;
  private activeStep = 0;
  private subdivision = 16;
  private sequencerEvent: ToneEvent;
  private connections: Array<IMidiReceiver>;
  private steps: IStep[];
  private readonly keyPressedColor = "#ff2929";
  private readonly blackKeys = [1, 3, 6, 8, 10];

  public constructor() {
    super();
    this.connections = [];
    this.steps = new Array<IStep>(this.sequenceLength);
    for (let i = 0; i < this.sequenceLength; i++) {
      this.steps[i] = {
        index: i,
        note: 67,
        velocity: 67,
        length: 1.0,
        on: true,
        active: false
      };
    }
    this.sequencerEvent = new ToneEvent(time => {
      this.advanceSequencer(time);
    });
    this.sequencerEvent.loop = true;
    this.sequencerEvent.playbackRate = this.subdivision;
    ToneTransport.start();
  }

  // Lifecycle Hooks

  mounted() {
    this.$emit("deviceMounted");
  }

  beforeDestroy() {
    this.dispose();
  }

  // Methods

  advanceSequencer(time: number) {
    this.previousStep = this.activeStep;
    this.activeStep = (this.activeStep + 1) % this.sequenceLength;
    this.triggerStep(this.steps[this.activeStep], time);
    this.$set(this.steps, this.activeStep, {
      index: this.steps[this.activeStep].index,
      note: this.steps[this.activeStep].note,
      velocity: this.steps[this.activeStep].velocity,
      length: this.steps[this.activeStep].length,
      on: this.steps[this.activeStep].on,
      active: true
    });
    this.$set(this.steps, this.previousStep, {
      index: this.steps[this.previousStep].index,
      note: this.steps[this.previousStep].note,
      velocity: this.steps[this.previousStep].velocity,
      length: this.steps[this.previousStep].length,
      on: this.steps[this.previousStep].on,
      active: false
    });
  }

  applySettings(settings: any) {
    // nothing yet
  }

  connect(receiver: IMidiReceiver) {
    this.connections.push(receiver);
  }

  disconnect(receiver: IMidiReceiver) {
    const i = this.connections.indexOf(receiver);
    if (i > -1) {
      this.connections.splice(i, 1);
    } else {
      throw `no existing connection to given midi receiver`;
    }
  }

  dispose() {
    this.sequencerEvent.stop();
    this.sequencerEvent.dispose();
  }

  sendMidi(message: IMidiMessage, time?: number) {
    this.connections.forEach(r => {
      r.receiveMidi(message, time);
    });
  }

  receiveMidi(message: IMidiMessage, time?: number) {
    // does nothing for now
  }

  triggerStep(step: IStep, time: number) {
    this.sendMidi(
      {
        midiFunction: MidiFunction.noteon,
        noteNumber: step.note,
        noteVelocity: step.velocity
      },
      time
    );
    this.sendMidi(
      {
        midiFunction: MidiFunction.noteoff,
        noteNumber: step.note,
        noteVelocity: step.velocity
      },
      time + 0.1
    );
  }

  // Watches
  @Watch("subdivision")
  onSubdivisionChange(value: number) {
    this.sequencerEvent.playbackRate = value;
  }
}
</script>

<style scoped>
div.sequencer-container {
  justify-content: center;
  background-image: url("../assets/wood-2.png");
  background-repeat: repeat;
  position: relative;
}
div.sequencer {
  background-image: url("../assets/metal-1.png");
  background-repeat: repeat;
  color: white;
  font-size: 10pt;
}
div.step-column {
  display: inline-block;
}
div.trigger-container {
  display: flex;
  justify-content: center;
  padding: 10px;
}
div.step-trigger {
  height: 16px;
  width: 16px;
  border-radius: 50%;
  cursor: pointer;
}
div.active-step {
  background-color: #2196f3;
}
div.inactive-step {
  background-color: #323232;
}
</style>
