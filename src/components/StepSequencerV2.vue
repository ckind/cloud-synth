<template>
  <div class="sequencer-container">
    <div class="sequencer">
      <div class="sequncer-controls">
        <div
          @click="selectedSequence = noteSequence"
          :class="[selectedSequence === noteSequence ? 'selected' : '']"
          class="graph-option"
        >
          Note
        </div>
        <div
          @click="selectedSequence = octaveSequence"
          :class="[selectedSequence === octaveSequence ? 'selected' : '']"
          class="graph-option"
        >
          Octave
        </div>
        <div
          @click="selectedSequence = velocitySequence"
          :class="[selectedSequence === velocitySequence ? 'selected' : '']"
          class="graph-option"
        >
          Velocity
        </div>
        <div
          @click="selectedSequence = lengthSequence"
          :class="[selectedSequence === lengthSequence ? 'selected' : '']"
          class="graph-option"
        >
          Length
        </div>
        <div
          @click="selectedSequence = gateSequence"
          :class="[selectedSequence === gateSequence ? 'selected' : '']"
          class="graph-option"
        >
          Gate
        </div>
      </div>

      <div class="graph-container">
        <!-- NOTE -->
        <bar-graph-control
          v-show="selectedSequence === noteSequence"
          @update="updateNote"
          :valueSteps="11"
          :numColumns="maxNumSteps"
          :activeStep="noteSequence.currentStep"
        ></bar-graph-control>
        <!-- OCTAVE -->
        <bar-graph-control
          v-show="selectedSequence === octaveSequence"
          @update="updateOctave"
          :valueSteps="4"
          :numColumns="maxNumSteps"
          :activeStep="octaveSequence.currentStep"
        ></bar-graph-control>
        <!-- VELOCITY -->
        <bar-graph-control
          v-show="selectedSequence === velocitySequence"
          @update="updateVelocity"
          :valueSteps="126"
          :numColumns="maxNumSteps"
          :activeStep="velocitySequence.currentStep"
        ></bar-graph-control>
        <!-- LENGTH -->
        <bar-graph-control
          v-show="selectedSequence === lengthSequence"
          @update="updateLength"
          :valueSteps="126"
          :numColumns="maxNumSteps"
          :activeStep="lengthSequence.currentStep"
        ></bar-graph-control>
        <!-- GATE/TRIGGER -->
        <bar-graph-control
          v-show="selectedSequence === this.gateSequence"
          @update="updateGate"
          :valueSteps="1"
          :numColumns="maxNumSteps"
          :activeStep="gateSequence.currentStep"
        ></bar-graph-control>
      </div>
      <div class="sequncer-controls">
        <v-select
          :items="transposeOptions"
          v-model="transpose"
          dense
          dark
          solo
          full-width
          item-value="note"
          item-text="label"
          label="Transpose"
          hide-details
        ></v-select>
        <v-select
          :items="scaleOptions"
          v-model="scale"
          dense
          dark
          solo
          full-width
          item-value="scale"
          item-text="label"
          label="Scale"
          hide-details
        ></v-select>
        <v-text-field
          v-model="selectedSequence.length"
          name="length"
          dense
          dark
          type="number"
          full-width
          solo
          hide-details
          min="1"
          :max="maxNumSteps"
        />
        <v-select
          :items="directionOptions"
          v-model="selectedSequence.direction"
          dense
          dark
          solo
          full-width
          return-object
          item-text="label"
          label="Direction"
          hide-details
        ></v-select>
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
import { Scale, ToneEvent } from "tone";
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

class PropertySequence<T> {
  public steps: T[];
  public length: number;
  public currentStep: number;
  public direction: DirectionOption;
  public pingPongForward: boolean;

  constructor(_steps: T[], _length: number, _direction: DirectionOption) {
    this.steps = _steps;
    this.length = _length;
    this.direction = _direction;
    this.currentStep = this.steps.length - 1;
    this.pingPongForward = true;
  }

  getNextValue(): T {
    this.currentStep = this.direction.nextStepFunction(this);
    return this.steps[this.currentStep];
  }
}

type SequencerAdvanceFunction = (sequence: PropertySequence<any>) => number;

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

  private maxNumSteps = 12;
  private directionOptions: DirectionOption[];
  private scaleOptions: ScaleOption[];
  private transposeOptions: TransposeOption[];
  private scale: ScaleType;
  private transpose: number;
  private running = false;
  private subdivision = 16;
  private sequencerEvent: ToneEvent;
  private connections: Array<IMidiReceiver>;

  private noteSequence: PropertySequence<number>;
  private octaveSequence: PropertySequence<number>;
  private velocitySequence: PropertySequence<number>;
  private lengthSequence: PropertySequence<number>;
  private gateSequence: PropertySequence<boolean>;

  private selectedSequence: PropertySequence<any>;

  public constructor() {
    super();
    this.connections = [];

    this.directionOptions = [
      { label: "forward", nextStepFunction: this.getNextStepForward },
      { label: "reverse", nextStepFunction: this.getNextStepReverse },
      { label: "ping pong", nextStepFunction: this.getNextStepPingPong },
      { label: "random", nextStepFunction: this.getNextStepRandom },
    ];

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

    this.scale = this.scaleOptions[0].scale;

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

    this.transpose = this.transposeOptions[0].note;

    this.noteSequence = new PropertySequence<number>(
      new Array<number>(this.maxNumSteps).fill(0),
      this.maxNumSteps,
      this.directionOptions[0]
    );
    this.octaveSequence = new PropertySequence<number>(
      new Array<number>(this.maxNumSteps).fill(3),
      this.maxNumSteps,
      this.directionOptions[0]
    );
    this.velocitySequence = new PropertySequence<number>(
      new Array<number>(this.maxNumSteps).fill(67),
      this.maxNumSteps,
      this.directionOptions[0]
    );
    this.lengthSequence = new PropertySequence<number>(
      new Array<number>(this.maxNumSteps).fill(0.5),
      this.maxNumSteps,
      this.directionOptions[0]
    );
    this.gateSequence = new PropertySequence<boolean>(
      new Array<boolean>(this.maxNumSteps).fill(true),
      this.maxNumSteps,
      this.directionOptions[0]
    );

    this.selectedSequence = this.noteSequence;

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
    const scale = getScale(this.scale, this.transpose);
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

  getNextStepForward(sequence: PropertySequence<any>): number {
    return sequence.currentStep + 1 >= sequence.length
      ? 0
      : sequence.currentStep + 1;
  }
  getNextStepReverse(sequence: PropertySequence<any>): number {
    return sequence.currentStep - 1 < 0
      ? sequence.length - 1
      : sequence.currentStep - 1;
  }
  getNextStepPingPong(sequence: PropertySequence<any>): number {
    if (sequence.pingPongForward) {
      if (sequence.currentStep >= sequence.length - 1) {
        sequence.pingPongForward = false;
        return this.getNextStepReverse(sequence);
      } else {
        return this.getNextStepForward(sequence);
      }
    } else {
      if (sequence.currentStep <= 0) {
        sequence.pingPongForward = true;
        return this.getNextStepForward(sequence);
      } else {
        return this.getNextStepReverse(sequence);
      }
    }
  }
  getNextStepRandom(sequence: PropertySequence<any>): number {
    return Math.floor(Math.random() * sequence.length);
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
  max-width: 140px;
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
