<template>
  <div class="sequencer-container">
    <div class="sequencer">
      <!-- NOTE -->
      <div class="sequencer-row">
        <div class="sequencer-block">
          <div class="row-label">note</div>
        </div>
        <div
          class="sequencer-block"
          v-for="(step, i) in selectedPage.steps"
          :key="i"
        >
          <knob-control
            class="step-column"
            v-model="step.note"
            :minValue="0"
            :maxValue="11"
            :id="`step${i}note`"
            :step="1"
            :default="0"
            size="60"
          ></knob-control>
        </div>
        <div class="sequencer-block">
          <v-icon @click="randomizeNotes">
            mdi-refresh
          </v-icon>
        </div>
        <div class="wide-sequencer-block">
          <select class="option-dropdown" v-model="scaleOption">
            <option
              v-for="(option, i) in scaleOptions"
              :key="i"
              :value="option"
            >
              {{ option.label }}
            </option>
          </select>
        </div>
      </div>
      <!-- OCTAVE -->
      <div class="sequencer-row">
        <div class="sequencer-block">
          <div class="row-label">octave</div>
        </div>
        <div
          class="sequencer-block"
          v-for="(step, i) in selectedPage.steps"
          :key="i"
        >
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
        <div class="wide-sequencer-block">
          <select class="option-dropdown" v-model="transposeOption">
            <option
              v-for="(option, i) in transposeOptions"
              :key="i"
              :value="option"
            >
              {{ option.label }}
            </option>
          </select>
        </div>
      </div>
      <!-- VELOCITY -->
      <div class="sequencer-row">
        <div class="sequencer-block">
          <div class="row-label">velocity</div>
        </div>
        <div
          class="sequencer-block"
          v-for="(step, i) in selectedPage.steps"
          :key="i"
        >
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
        <div class="wide-sequencer-block">
          <select class="option-dropdown" v-model="directionOption">
            <option
              v-for="(option, i) in directionOptions"
              :key="i"
              :value="option"
            >
              {{ option.label }}
            </option>
          </select>
        </div>
      </div>
      <!-- LENGTH -->
      <div class="sequencer-row">
        <div class="sequencer-block">
          <div class="row-label">length</div>
        </div>
        <div
          class="sequencer-block"
          v-for="(step, i) in selectedPage.steps"
          :key="i"
        >
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
        <div class="wide-sequencer-block">
          <select class="option-dropdown" v-model="sequenceLength">
            <option v-for="len in numPages * pageLength" :key="len">
              {{ len }}
            </option>
          </select>
        </div>
      </div>
      <!-- GATE/TRIGGER -->
      <div class="sequencer-row">
        <div class="sequencer-block">
          <v-icon
            @click="toggleSequence()"
            :class="[running ? 'sequence-running' : '']"
          >
            mdi-play-pause
          </v-icon>
        </div>
        <div
          class="sequencer-block"
          v-for="(step, i) in selectedPage.steps"
          :key="i"
        >
          <div class="trigger-container">
            <div
              :class="[
                'step-trigger',
                step.active
                  ? 'active-step'
                  : !step.gate
                  ? 'no-gate'
                  : 'inactive-step'
              ]"
              @click="toggleGate(i)"
              :id="`step${i}trigger`"
            />
          </div>
        </div>
        <div class="sequencer-block">
          <v-icon @click="randomizeGates">
            mdi-refresh
          </v-icon>
        </div>
        <div class="wide-sequencer-block">
          <page-selector :options="pageOptions" @pageSelected="pageSelected" />
        </div>
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
  KeySignature
} from "@/musicTheory/scales.ts";
import {
  MidiFunction,
  IMidiMessage
} from "@/shared/interfaces/midi/IMidiMessage";
import { ToneEvent } from "tone";
import KnobControl from "@/components/KnobControl.vue";
import PageSelector from "@/components/PageSelector.vue";

interface Step {
  note: number;
  octave: number;
  // quantizedPitch: number; // maybe this would be useful for some quantization algorithms?
  velocity: number;
  length: number;
  gate: boolean;
  active: boolean;
}

interface SequencerPage {
  steps: Step[];
}

interface Sequence {
  pages: SequencerPage[];
}

interface PageOption {
  label: string;
  value: number;
}

type SequencerAdvanceFunction = () => number;

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
    PageSelector
  }
})
export default class StepSequencer extends Vue implements IMidiDevice {
  name = "External Midi Device";
  settings = {};

  private sequence: Sequence;
  private pageLength = 8;
  private numPages = 4;
  private sequenceLength: number;
  private selectedPageIndex = 0;
  private pageOptions: PageOption[];
  private directionOptions: DirectionOption[];
  private scaleOptions: ScaleOption[];
  private transposeOptions: TransposeOption[];
  private directionOption: DirectionOption;
  private scaleOption: ScaleOption;
  private transposeOption: TransposeOption;
  private activeStepIndex: number;
  private activePageIndex: number;
  private running = false;
  private subdivision = 8;
  private sequencerEvent: ToneEvent;
  private connections: Array<IMidiReceiver>;
  private pingPongForward = true;

  public constructor() {
    super();
    this.connections = [];

    this.directionOptions = [
      { label: "forward", nextStepFunction: this.getNextStepForward },
      { label: "reverse", nextStepFunction: this.getNextStepReverse },
      { label: "ping pong", nextStepFunction: this.getNextStepPingPong },
      { label: "random", nextStepFunction: this.getNextStepRandom }
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
      { label: "blues", scale: ScaleType.Blues }
    ];

    this.scaleOption = this.scaleOptions[0];

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
      { label: "B", note: KeySignature.B }
    ];

    this.transposeOption = this.transposeOptions[0];

    this.sequence = { pages: new Array<SequencerPage>(this.numPages) };
    this.pageOptions = new Array<PageOption>(this.numPages);
    for (let i = 0; i < this.numPages; i++) {
      this.sequence.pages[i] = { steps: new Array<Step>(this.pageLength) };
      for (let j = 0; j < this.pageLength; j++) {
        this.sequence.pages[i].steps[j] = {
          note: 0,
          octave: 3,
          velocity: 67,
          length: 1.0,
          gate: true,
          active: false
        };
      }
      this.pageOptions[i] = { label: `${i}`, value: i };
    }

    this.activePageIndex = this.numPages - 1;
    this.activeStepIndex = this.pageLength - 1;
    this.sequenceLength = this.pageLength;

    this.sequencerEvent = new ToneEvent(time => {
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

  get selectedPage() {
    return this.sequence.pages[this.selectedPageIndex];
  }

  get quantizeScale() {
    const scale = getScale(this.scaleOption.scale, this.transposeOption.note);
    console.log(scale);
    return scale;
  }

  // Methods

  pageSelected(option: PageOption) {
    this.selectedPageIndex = option.value;
  }

  toggleGate(stepIndex: number) {
    this.$set(this.sequence.pages[this.selectedPageIndex].steps, stepIndex, {
      note: this.sequence.pages[this.selectedPageIndex].steps[stepIndex].note,
      octave: this.sequence.pages[this.selectedPageIndex].steps[stepIndex]
        .octave,
      velocity: this.sequence.pages[this.selectedPageIndex].steps[stepIndex]
        .velocity,
      length: this.sequence.pages[this.selectedPageIndex].steps[stepIndex]
        .length,
      gate: !this.sequence.pages[this.selectedPageIndex].steps[stepIndex].gate,
      active: this.sequence.pages[this.selectedPageIndex].steps[stepIndex]
        .active
    });
  }

  getNextStepForward(): number {
    return this.activePageIndex * this.pageLength + this.activeStepIndex + 1 >=
      this.sequenceLength
      ? 0
      : this.activePageIndex * this.pageLength + this.activeStepIndex + 1;
  }

  getNextStepReverse(): number {
    return this.activePageIndex * this.pageLength + this.activeStepIndex - 1 < 0
      ? this.sequenceLength - 1
      : this.activePageIndex * this.pageLength + this.activeStepIndex - 1;
  }

  getNextStepPingPong(): number {
    if (this.pingPongForward) {
      if (
        this.activePageIndex * this.pageLength + this.activeStepIndex >=
        this.sequenceLength - 1
      ) {
        this.pingPongForward = false;
        return this.getNextStepReverse();
      } else {
        return this.getNextStepForward();
      }
    } else {
      if (this.activePageIndex * this.pageLength + this.activeStepIndex <= 0) {
        this.pingPongForward = true;
        return this.getNextStepForward();
      } else {
        return this.getNextStepReverse();
      }
    }
  }

  getNextStepRandom(): number {
    return Math.floor(Math.random() * this.sequenceLength);
  }

  advanceSequencer(time: number) {
    this.$set(
      this.sequence.pages[this.activePageIndex].steps,
      this.activeStepIndex,
      {
        note: this.sequence.pages[this.activePageIndex].steps[
          this.activeStepIndex
        ].note,
        octave: this.sequence.pages[this.activePageIndex].steps[
          this.activeStepIndex
        ].octave,
        velocity: this.sequence.pages[this.activePageIndex].steps[
          this.activeStepIndex
        ].velocity,
        length: this.sequence.pages[this.activePageIndex].steps[
          this.activeStepIndex
        ].length,
        gate: this.sequence.pages[this.activePageIndex].steps[
          this.activeStepIndex
        ].gate,
        active: false
      }
    );

    const nextstep = this.directionOption.nextStepFunction();

    this.activePageIndex = Math.floor(nextstep / this.pageLength);
    this.activeStepIndex = nextstep % this.pageLength;

    this.triggerStep(
      this.sequence.pages[this.activePageIndex].steps[this.activeStepIndex],
      time
    );

    this.$set(
      this.sequence.pages[this.activePageIndex].steps,
      this.activeStepIndex,
      {
        note: this.sequence.pages[this.activePageIndex].steps[
          this.activeStepIndex
        ].note,
        octave: this.sequence.pages[this.activePageIndex].steps[
          this.activeStepIndex
        ].octave,
        velocity: this.sequence.pages[this.activePageIndex].steps[
          this.activeStepIndex
        ].velocity,
        length: this.sequence.pages[this.activePageIndex].steps[
          this.activeStepIndex
        ].length,
        gate: this.sequence.pages[this.activePageIndex].steps[
          this.activeStepIndex
        ].gate,
        active: true
      }
    );
  }

  randomizeNotes() {
    this.selectedPage.steps.forEach(step => {
      step.note = Math.floor(Math.random() * 12);
    });
  }

  randomizeOctaves() {
    this.selectedPage.steps.forEach(step => {
      step.octave = Math.floor(Math.random() * 4) + 3;
    });
  }

  randomizeVelocities() {
    this.selectedPage.steps.forEach(step => {
      step.velocity = Math.floor(Math.random() * 127) + 1;
    });
  }

  randomizeLengths() {
    this.selectedPage.steps.forEach(step => {
      step.length = Math.random();
    });
  }

  randomizeGates() {
    this.selectedPage.steps.forEach(step => {
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

  triggerStep(step: Step, time: number) {
    const noteNumber = quantizePitch(
      step.note + 12 * step.octave,
      this.quantizeScale
    );
    console.log(noteNumber);
    if (step.gate) {
      this.sendMidi(
        {
          midiFunction: MidiFunction.noteon,
          noteNumber: noteNumber,
          noteVelocity: step.velocity
        },
        time
      );
      this.sendMidi(
        {
          midiFunction: MidiFunction.noteoff,
          noteNumber: noteNumber,
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
  width: 100%;
}
.sequence-running {
  color: #2196f3;
}
</style>
