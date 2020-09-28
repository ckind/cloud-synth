<template>
  <div class="sequencer-container">
    <div class="sequencer">
      <div class="sequencer-row">
        <div class="sequencer-block">
          <div class="row-label">note</div>
        </div>
        <div class="sequencer-block" v-for="(step, i) in steps" :key="i">
          <knob-control
            class="step-column"
            v-model="step.note"
            :minValue="1"
            :maxValue="12"
            :id="`step${i}note`"
            :step="1"
            size="60"
          ></knob-control>
        </div>
        <div class="sequencer-block">
          <v-icon @click="randomizeNotes">
            mdi-refresh
          </v-icon>
        </div>
        <div class="sequencer-block">
          <knob-control
            class="step-column"
            v-model="sequenceLength"
            :minValue="1"
            :maxValue="8"
            :id="`sequencerLengthKnob`"
            :step="1"
            size="60"
          ></knob-control>
        </div>
      </div>
      <div class="sequencer-row">
        <div class="sequencer-block">
          <div class="row-label">octave</div>
        </div>
        <div class="sequencer-block" v-for="(step, i) in steps" :key="i">
          <knob-control
            class="step-column"
            v-model="step.octave"
            :minValue="3"
            :maxValue="6"
            :id="`step${i}octave`"
            :step="1"
            size="60"
          ></knob-control>
        </div>
        <div class="sequencer-block">
          <v-icon @click="randomizeOctaves">
            mdi-refresh
          </v-icon>
        </div>
        <div class="sequencer-block"></div>
      </div>
      <div class="sequencer-row">
        <div class="sequencer-block">
          <div class="row-label">velocity</div>
        </div>
        <div class="sequencer-block" v-for="(step, i) in steps" :key="i">
          <knob-control
            class="step-column"
            v-model="step.velocity"
            :minValue="1"
            :maxValue="127"
            :id="`step${i}velocity`"
            :step="1"
            size="60"
          ></knob-control>
        </div>
        <div class="sequencer-block">
          <v-icon @click="randomizeVelocities">
            mdi-refresh
          </v-icon>
        </div>
        <div class="sequencer-block"></div>
      </div>
      <div class="sequencer-row">
        <div class="sequencer-block">
          <div class="row-label">length</div>
        </div>
        <div class="sequencer-block" v-for="(step, i) in steps" :key="i">
          <knob-control
            class="step-column"
            v-model="step.length"
            :minValue="0.01"
            :maxValue="1"
            :id="`step${i}length`"
            :step="0.01"
            size="60"
          ></knob-control>
        </div>
        <div class="sequencer-block">
          <v-icon @click="randomizeLengths">
            mdi-refresh
          </v-icon>
        </div>
        <div class="sequencer-block"></div>
      </div>
      <div class="sequencer-row">
        <div class="sequencer-block"></div>
        <div class="sequencer-block" v-for="(step, i) in steps" :key="i">
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
        <div class="sequencer-block">
          <v-icon @click="toggleSequence()">
            mdi-play-pause
          </v-icon>
        </div>
        <div class="sequencer-block"></div>
      </div>
    </div>
  </div>
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
  octave: number;
  // quantizedPitch: number; // maybe this would be useful for some quantization algorithms?
  velocity: number;
  length: number;
  gate: boolean;
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

  private running = false;
  private sequenceLength = 8;
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
        note: 7,
        octave: 4,
        velocity: 67,
        length: 1.0,
        gate: true,
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
      octave: this.steps[this.activeStep].octave,
      velocity: this.steps[this.activeStep].velocity,
      length: this.steps[this.activeStep].length,
      gate: this.steps[this.activeStep].gate,
      active: true
    });
    this.$set(this.steps, this.previousStep, {
      index: this.steps[this.previousStep].index,
      note: this.steps[this.previousStep].note,
      octave: this.steps[this.previousStep].octave,
      velocity: this.steps[this.previousStep].velocity,
      length: this.steps[this.previousStep].length,
      gate: this.steps[this.previousStep].gate,
      active: false
    });
  }

  randomizeNotes() {
    this.steps.forEach(step => {
      step.note = Math.floor(Math.random() * 12) + 1;
    });
  }

  randomizeOctaves() {
    this.steps.forEach(step => {
      step.octave = Math.floor(Math.random() * 4) + 3;
    });
  }

  randomizeVelocities() {
    this.steps.forEach(step => {
      step.velocity = Math.floor(Math.random() * 127) + 1;
    });
  }

  randomizeLengths() {
    this.steps.forEach(step => {
      step.length = Math.random();
    });
  }

  randomizeGates() {
    this.steps.forEach(step => {
      step.gate = Math.random() < 0.5;
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

  toggleSequence() {
    if (this.sequencerEvent.state === "stopped") {
      this.sequencerEvent.start();
      this.running = true;
    } else {
      this.sequencerEvent.stop();
      this.running = false;
    }
  }

  triggerStep(step: IStep, time: number) {
    if (step.gate) {
      this.sendMidi(
        {
          midiFunction: MidiFunction.noteon,
          noteNumber: step.note + 12 * step.octave,
          noteVelocity: step.velocity
        },
        time
      );
      this.sendMidi(
        {
          midiFunction: MidiFunction.noteoff,
          noteNumber: step.note + 12 * step.octave,
          noteVelocity: step.velocity
        },
        time + 0.1
      );
    }
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
  display: flex;
  color: black;
}
div.sequencer {
  background-image: url("../assets/metal-1.png");
  background-repeat: repeat;
  color: white;
  font-size: 10pt;
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
div.sequencer-row {
  display: flex;
  justify-content: center;
  padding-left: 20px;
  padding-right: 20px;
}
div.sequencer-block {
  height: 60px;
  width: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
}
div.row-label {
  width: 80%;
}
</style>
