<template>
  <div class="sequencer-container">
    <div class="sequencer">
      <div class="sequncer-controls">
        <div
          @click="selectedGraph = 'notes'"
          :class="[selectedGraph === 'notes' ? 'selected' : '']"
          class="graph-option"
        >
          Note
        </div>
        <div
          @click="selectedGraph = 'octaves'"
          :class="[selectedGraph === 'octaves' ? 'selected' : '']"
          class="graph-option"
        >
          Octave
        </div>
        <div
          @click="selectedGraph = 'velocities'"
          :class="[selectedGraph === 'velocities' ? 'selected' : '']"
          class="graph-option"
        >
          Velocity
        </div>
        <div
          @click="selectedGraph = 'lengths'"
          :class="[selectedGraph === 'lengths' ? 'selected' : '']"
          class="graph-option"
        >
          Length
        </div>
        <div
          @click="selectedGraph = 'gates'"
          :class="[selectedGraph === 'gates' ? 'selected' : '']"
          class="graph-option"
        >
          Gate
        </div>
      </div>

      <div class="graph-container">
        <!-- NOTE -->
        <bar-graph-control
          v-show="selectedGraph === 'notes'"
          @update="updateNote"
          :valueSteps="11"
          :numColumns="numSteps"
          :activeStep="noteSequence.currentStep"
        ></bar-graph-control>
        <!-- OCTAVE -->
        <bar-graph-control
          v-show="selectedGraph === 'octaves'"
          @update="updateOctave"
          :valueSteps="4"
          :numColumns="numSteps"
          :activeStep="octaveSequence.currentStep"
        ></bar-graph-control>
        <!-- VELOCITY -->
        <bar-graph-control
          v-show="selectedGraph === 'velocities'"
          @update="updateVelocity"
          :valueSteps="126"
          :numColumns="numSteps"
          :activeStep="velocitySequence.currentStep"
        ></bar-graph-control>
        <!-- LENGTH -->
        <bar-graph-control
          v-show="selectedGraph === 'lengths'"
          @update="updateLength"
          :valueSteps="126"
          :numColumns="numSteps"
          :activeStep="lengthSequence.currentStep"
        ></bar-graph-control>
        <!-- GATE/TRIGGER -->
        <bar-graph-control
          v-show="selectedGraph === 'gates'"
          @update="updateGate"
          :valueSteps="1"
          :numColumns="numSteps"
          :activeStep="lengthSequence.currentStep"
        ></bar-graph-control>
      </div>
      <div class="sequncer-controls">
        <select class="option-dropdown" v-model="transposeOption">
          <option
            v-for="(option, i) in transposeOptions"
            :key="i"
            :value="option"
          >
            {{ option.label }}
          </option>
        </select>
        <select class="option-dropdown" v-model="scaleOption">
          <option v-for="(option, i) in scaleOptions" :key="i" :value="option">
            {{ option.label }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { IMidiDevice } from "@/shared/interfaces/devices/IMidiDevice";
import { IMidiReceiver } from "@/shared/interfaces/midi/IMidiReceiver";
import {
  quantizePitch,
  ScaleType,
  getScale,
  KeySignature,
} from "@/musicTheory/scales";
import {
  MidiFunction,
  IMidiMessage,
} from "@/shared/interfaces/midi/IMidiMessage";
import { ToneEvent } from "tone";
import KnobControl from "@/components/KnobControl.vue";
import PageSelector from "@/components/PageSelector.vue";
import BarGraphControl from "@/components/BarGraphControl.vue";

interface Step {
  note: number;
  octave: number;
  velocity: number;
  length: number;
  gate: boolean;
}

interface PropertySequence<T> {
  steps: T[];
  length: number;
  currentStep: number;
  getNextStep: SequencerAdvanceFunction;
  getNextValue: () => T;
}

type SequencerAdvanceFunction = (
  currentStep: number,
  sequenceLength: number
) => number;

interface DirectionOption {
  label: string;
  nextStepFunction: SequencerAdvanceFunction;
}

interface ScaleOption {
  label: string;
  scale: ScaleType;
}

interface TransposeOption {
  label: string;
  note: number;
}

@Component({
  components: {
    KnobControl,
    PageSelector,
    BarGraphControl,
  },
})
export default class StepSequencerV2 extends Vue implements IMidiDevice {
  name = "Step Sequencer V2";
  settings = {};

  private numSteps = 8;
  private sequenceLength: number;
  private selectedPageIndex = 0;
  private directionOptions: DirectionOption[];
  private scaleOptions: ScaleOption[];
  private transposeOptions: TransposeOption[];
  private directionOption: DirectionOption;
  private scaleOption: ScaleOption;
  private transposeOption: TransposeOption;
  private activeStepIndex: number;
  private running = false;
  private subdivision = 8;
  private sequencerEvent: ToneEvent;
  private connections: Array<IMidiReceiver>;
  private pingPongForward = true;
  private selectedGraph = "notes";

  private noteSequence: PropertySequence<number>;
  private octaveSequence: PropertySequence<number>;
  private velocitySequence: PropertySequence<number>;
  private lengthSequence: PropertySequence<number>;
  private gateSequence: PropertySequence<boolean>;

  public constructor() {
    super();
    this.connections = [];

    this.directionOptions = [
      { label: "forward", nextStepFunction: this.getNextStepForward },
      { label: "reverse", nextStepFunction: this.getNextStepReverse },
      { label: "ping pong", nextStepFunction: this.getNextStepPingPong },
      { label: "random", nextStepFunction: this.getNextStepRandom },
    ];

    this.directionOption = this.directionOptions[0];

    this.scaleOptions = [
      { label: "chromatic", scale: ScaleType.Chromatic },
      { label: "major", scale: ScaleType.Ionian },
      { label: "minor", scale: ScaleType.Aeolian },
      { label: "dorian", scale: ScaleType.Dorian },
      { label: "phrygian", scale: ScaleType.Phrygian },
      { label: "lydian", scale: ScaleType.Lydian },
      { label: "mixolydian", scale: ScaleType.Mixolydian },
      { label: "locrian", scale: ScaleType.Locrian },
      { label: "harm. minor", scale: ScaleType.HarmonicMinor },
      { label: "blues", scale: ScaleType.Blues },
    ];

    this.scaleOption = this.scaleOptions[3];

    this.transposeOptions = [
      { label: "C", note: KeySignature.C },
      { label: "C#", note: KeySignature.CSharp },
      { label: "D", note: KeySignature.D },
      { label: "D#", note: KeySignature.DSharp },
      { label: "E", note: KeySignature.E },
      { label: "F", note: KeySignature.F },
      { label: "F#", note: KeySignature.FSharp },
      { label: "G", note: KeySignature.G },
      { label: "G#", note: KeySignature.GSharp },
      { label: "A", note: KeySignature.A },
      { label: "Bb", note: KeySignature.BFlat },
      { label: "B", note: KeySignature.B },
    ];

    this.transposeOption = this.transposeOptions[0];

    this.noteSequence = {
      steps: new Array<number>(this.numSteps).fill(0),
      getNextStep: this.getNextStepForward,
      length: this.numSteps,
      currentStep: 0,
      getNextValue() {
        this.currentStep = ++this.currentStep % this.length;
        return this.steps[this.getNextStep(this.currentStep, this.length)];
      },
    };
    this.octaveSequence = {
      steps: new Array<number>(this.numSteps).fill(3),
      getNextStep: this.getNextStepForward,
      length: this.numSteps - 2,
      currentStep: 0,
      getNextValue() {
        this.currentStep = ++this.currentStep % this.length;
        return this.steps[this.getNextStep(this.currentStep, this.length)];
      },
    };
    this.velocitySequence = {
      steps: new Array<number>(this.numSteps).fill(67),
      getNextStep: this.getNextStepForward,
      length: this.numSteps,
      currentStep: 0,
      getNextValue() {
        this.currentStep = ++this.currentStep % this.length;
        return this.steps[this.getNextStep(this.currentStep, this.length)];
      },
    };
    this.lengthSequence = {
      steps: new Array<number>(this.numSteps).fill(0.5),
      getNextStep: this.getNextStepForward,
      length: this.numSteps,
      currentStep: 0,
      getNextValue() {
        this.currentStep = ++this.currentStep % this.length;
        return this.steps[this.getNextStep(this.currentStep, this.length)];
      },
    };
    this.gateSequence = {
      steps: new Array<boolean>(this.numSteps).fill(true),
      getNextStep: this.getNextStepForward,
      length: this.numSteps,
      currentStep: 0,
      getNextValue() {
        this.currentStep = ++this.currentStep % this.length;
        return this.steps[this.getNextStep(this.currentStep, this.length)];
      },
    };

    this.activeStepIndex = this.numSteps - 1;
    this.sequenceLength = this.numSteps;

    this.sequencerEvent = new ToneEvent((time) => {
      this.advanceSequencer(time);
    });
    this.sequencerEvent.loop = true;
    this.sequencerEvent.playbackRate = this.subdivision;
  }

  // Lifecycle Hooks

  mounted() {
    this.$emit("deviceMounted");
    this.sequencerEvent.start();
    this.running = true;
  }

  beforeDestroy() {
    this.dispose();
  }

  // Computed

  get quantizeScale() {
    const scale = getScale(this.scaleOption.scale, this.transposeOption.note);
    return scale;
  }

  // Methods

  updateNote(i: number, val: number) {
    this.noteSequence.steps[i] = val;
  }
  updateOctave(i: number, val: number) {
    this.octaveSequence.steps[i] = val + 2; // add min octave
  }
  updateVelocity(i: number, val: number) {
    this.velocitySequence.steps[i] = val;
  }
  updateLength(i: number, val: number) {
    this.lengthSequence.steps[i] = val;
  }
  updateGate(i: number, val: number) {
    this.gateSequence.steps[i] = val === 1;
  }

  getNextStepForward(currentStep: number, sequenceLength: number): number {
    return currentStep + 1 >= sequenceLength ? 0 : currentStep + 1;
  }

  getNextStepReverse(currentStep: number, sequenceLength: number): number {
    return currentStep - 1 < 0 ? sequenceLength - 1 : currentStep - 1;
  }

  getNextStepPingPong(currentStep: number, sequenceLength: number): number {
    // todo: each sequence needs to maintain it's own ping pong state
    if (this.pingPongForward) {
      if (currentStep >= sequenceLength - 1) {
        this.pingPongForward = false;
        return this.getNextStepReverse(currentStep, sequenceLength);
      } else {
        return this.getNextStepForward(currentStep, sequenceLength);
      }
    } else {
      if (currentStep <= 0) {
        this.pingPongForward = true;
        return this.getNextStepForward(currentStep, sequenceLength);
      } else {
        return this.getNextStepReverse(currentStep, sequenceLength);
      }
    }
  }

  getNextStepRandom(currentStep: number, sequenceLength: number): number {
    return Math.floor(Math.random() * sequenceLength);
  }

  advanceSequencer(time: number) {
    const step = {
      note: this.noteSequence.getNextValue(),
      octave: this.octaveSequence.getNextValue(),
      velocity: this.velocitySequence.getNextValue(),
      length: this.lengthSequence.getNextValue(),
      gate: this.gateSequence.getNextValue(),
    };

    this.triggerStep(step, time);
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
    this.connections.forEach((r) => {
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

  triggerStep(step: Step, time: number) {
    const noteNumber = quantizePitch(
      step.note + 12 * step.octave,
      this.quantizeScale
    );
    if (step.gate) {
      this.sendMidi(
        {
          midiFunction: MidiFunction.noteon,
          noteNumber: noteNumber,
          noteVelocity: step.velocity,
        },
        time
      );
      this.sendMidi(
        {
          midiFunction: MidiFunction.noteoff,
          noteNumber: noteNumber,
          noteVelocity: step.velocity,
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
  display: flex;
}
div.sequncer-controls {
  background: black;
  height: 100%;
  min-width: 100px;
}
.graph-option {
  color: white;
  padding: 4px;
  cursor: pointer;
  font-size: 11pt;
}
.graph-option.selected {
  background: gray;
}
div.graph-container {
  border: 2px solid gray;
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
.no-gate {
  background-color: white;
  border: 1px solid #323232;
}
div.sequencer-row {
  display: flex;
  justify-content: center;
  padding-left: 20px;
  padding-right: 20px;
}
div.sequencer-block {
  max-height: 60px;
  width: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
}
div.wide-sequencer-block {
  max-height: 60px;
  width: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
}
div.row-label {
  width: 80%;
  color: black;
}
.octave-selector {
  padding-top: 10px;
  padding-bottom: 10px;
}
.option-dropdown {
  background-color: white;
  border: 1px solid gray;
  margin: 4px;
  display: block;
}
.sequence-running {
  color: #2196f3;
}
</style>
