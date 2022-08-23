<template>
  <div class="sequencer-container" ref="container" :style="cssVars">
    <div class="sequencer">
      <div
        class="sequencer-controls"
        :class="[$vuetify.breakpoint.mobile ? 'top' : 'vertical']"
      >
        <div
          @click="displayNoteSequence"
          :class="[selectedSequence === noteSequence ? 'selected' : '']"
          class="graph-option"
        >
          Note
        </div>
        <div
          @click="displayOctaveSequence"
          :class="[selectedSequence === octaveSequence ? 'selected' : '']"
          class="graph-option"
        >
          Octave
        </div>
        <div
          @click="displayVelocitySequence"
          :class="[selectedSequence === velocitySequence ? 'selected' : '']"
          class="graph-option"
        >
          Velocity
        </div>
        <div
          @click="displayLengthSequence"
          :class="[selectedSequence === lengthSequence ? 'selected' : '']"
          class="graph-option"
        >
          Length
        </div>
        <div
          @click="displayGateSequence"
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
          :graphWidth="graphWidth"
        ></bar-graph-control>
        <!-- OCTAVE -->
        <bar-graph-control
          v-show="selectedSequence === octaveSequence"
          @update="updateOctave"
          :valueSteps="4"
          :numColumns="maxNumSteps"
          :activeStep="octaveSequence.currentStep"
          :graphWidth="graphWidth"
        ></bar-graph-control>
        <!-- VELOCITY -->
        <bar-graph-control
          v-show="selectedSequence === velocitySequence"
          @update="updateVelocity"
          :valueSteps="126"
          :numColumns="maxNumSteps"
          :activeStep="velocitySequence.currentStep"
          :graphWidth="graphWidth"
        ></bar-graph-control>
        <!-- LENGTH -->
        <bar-graph-control
          v-show="selectedSequence === lengthSequence"
          @update="updateLength"
          :valueSteps="126"
          :numColumns="maxNumSteps"
          :activeStep="lengthSequence.currentStep"
          :graphWidth="graphWidth"
        ></bar-graph-control>
        <!-- GATE/TRIGGER -->
        <bar-graph-control
          v-show="selectedSequence === gateSequence"
          @update="updateGate"
          :valueSteps="1"
          :numColumns="maxNumSteps"
          :activeStep="gateSequence.currentStep"
          :graphWidth="graphWidth"
        ></bar-graph-control>
      </div>

      <div
        class="sequencer-controls"
        :class="[$vuetify.breakpoint.mobile ? 'bottom' : 'vertical']"
      >
        <v-select
          :items="transposeOptions"
          v-model="transpose"
          dense
          dark
          solo
          item-value="note"
          item-text="label"
          label="Transpose"
          hide-details
          class="sequencer-select"
        ></v-select>
        <v-select
          :items="scaleOptions"
          v-model="scale"
          dense
          dark
          solo
          item-value="scale"
          item-text="label"
          label="Scale"
          hide-details
        ></v-select>
        <v-text-field
          v-model="selectedSequenceNonNull.length"
          name="length"
          dense
          dark
          type="number"
          solo
          hide-details
          min="1"
          :max="maxNumSteps"
        />
        <v-select
          :items="directionOptions"
          v-model="selectedSequenceNonNull.direction"
          dense
          dark
          solo
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
import { defineComponent, ref, onMounted, computed, onBeforeUnmount, getCurrentInstance } from "vue";
import { quantizePitch, getScale } from "@/musicTheory/scales"; 
import { MidiFunction, IMidiMessage } from "@/shared/interfaces/midi/IMidiMessage";
import { ToneEvent, Transport as ToneTransport } from "tone";
import BarGraphControl from "@/components/BarGraphControl.vue";
import { v4 as uuidv4 } from "uuid";
import { useMidiConnections } from "@/composables/useMidiConnections";
import { useSequencerOptions } from "@/composables/useSequencerOptions";
import { PropertySequence, Step } from "@/shared/classes/sequencing/PropertySequence";

export default defineComponent({
  emits: ["deviceMounted"],
  components: {
    BarGraphControl
  },
  setup(props, context) {
    const guid = ref(uuidv4());
    const name = ref("Step Sequencer");
    const settings = ref({});
    const maxNumSteps = ref(12);
    const graphWidth = ref(768);
    const subdivision = ref(16);
    const running = ref(false);
    const selectedSequence = ref(null as PropertySequence<any> | null);
    const container = ref(null);

    const { connect, disconnect, connections } = useMidiConnections();
    const { directionOptions, scaleOptions, transposeOptions } = useSequencerOptions();

    const scale = ref(scaleOptions.value[0].scale);
    const transpose = ref(transposeOptions.value[0].note);

    const noteSequence = ref(new PropertySequence<number>(
      new Array<number>(maxNumSteps.value).fill(0),
      maxNumSteps.value,
      directionOptions.value[0]
    ));

    const octaveSequence = ref(new PropertySequence<number>(
      new Array<number>(maxNumSteps.value).fill(3),
      maxNumSteps.value,
      directionOptions.value[0]
    ));

    const velocitySequence = ref(new PropertySequence<number>(
      new Array<number>(maxNumSteps.value).fill(67),
      maxNumSteps.value,
      directionOptions.value[0]
    ));

    const lengthSequence = ref(new PropertySequence<number>(
      new Array<number>(maxNumSteps.value).fill(0.5),
      maxNumSteps.value,
      directionOptions.value[0]
    ));

    const gateSequence = ref(new PropertySequence<boolean>(
      new Array<boolean>(maxNumSteps.value).fill(true),
      maxNumSteps.value,
      directionOptions.value[0]
    ));

    const quantizeScale = computed(() => {
      return getScale(scale.value, transpose.value);
    });

    const maxTrigLengthInSeconds = computed(() => {
      // todo: should this be relative to the tempo somehow?
      return 0.1;
    });

    const cssVars = computed(() => {
      return {
        "--graphWidth": `${graphWidth}px`,
      };
    });

    selectedSequence.value = noteSequence.value;

    // hack to fix non-null assertion in template
    const selectedSequenceNonNull = computed(() => {
      return selectedSequence.value!;
    });

    let resizeTimer: ReturnType<typeof setTimeout>;
    let previousPitch = -1;
    let noteOffEventId = null as number?;

    function applySettings(settings: any) {
      // nothing yet
    }

    function sendMidi(message: IMidiMessage, time?: number) {
      connections.forEach((r) => {
        r.receiveMidi(message, time);
      });
    }

    function receiveMidi(message: IMidiMessage, time?: number) {
      // does nothing for now
    }

    function triggerPreviousNoteRelease(time?: number) {
      if (previousPitch && noteOffEventId) {
        ToneTransport.clear(noteOffEventId);
        noteOffEventId = null;
        sendMidi(
          {
            midiFunction: MidiFunction.noteoff,
            noteNumber: previousPitch,
            noteVelocity: 0, // shouldn't be applicable for this action
          },
          time
        );
      }
    }

    function triggerStep(step: Step, time: number) {
      if (step.gate) {

        const currrentPitch = quantizePitch(
          step.note + 12 * step.octave,
          quantizeScale.value
        );

        // this.triggerPreviousNoteRelease(time);

        sendMidi(
          {
            midiFunction: MidiFunction.noteon,
            noteNumber: currrentPitch,
            noteVelocity: step.velocity,
          },
          time
        );

        // todo: need be able to cancel this if the next note comes first
        // todo: apply length
        sendMidi(
          {
            midiFunction: MidiFunction.noteoff,
            noteNumber: currrentPitch,
            noteVelocity: step.velocity,
          },
          time + maxTrigLengthInSeconds.value
        );

        previousPitch = currrentPitch;
      }
    }

    function advanceSequencer(time: number) {
      const step = {
        note: noteSequence.value.getNextValue(),
        octave: octaveSequence.value.getNextValue(),
        velocity: velocitySequence.value.getNextValue(),
        length: lengthSequence.value.getNextValue(),
        gate: gateSequence.value.getNextValue(),
      };

      triggerStep(step, time);
    }

    function updateNote(i: number, val: number) {
      noteSequence.value.steps[i] = val;
    }

    function updateOctave(i: number, val: number) {
      octaveSequence.value.steps[i] = val + 2; // add min octave
    }

    function updateVelocity(i: number, val: number) {
      velocitySequence.value.steps[i] = val;
    }

    function updateLength(i: number, val: number) {
      lengthSequence.value.steps[i] = val;
    }

    function updateGate(i: number, val: number) {
      gateSequence.value.steps[i] = val === 1;
    }

    function displayNoteSequence() {
      selectedSequence.value = noteSequence.value;
    }

    function displayOctaveSequence() {
      selectedSequence.value = octaveSequence.value;
    }

    function displayVelocitySequence() {
      selectedSequence.value = velocitySequence.value;
    }

    function displayLengthSequence() {
      selectedSequence.value = lengthSequence.value;
    }

    function displayGateSequence() {
      selectedSequence.value = gateSequence.value;
    }

    function sizeGraph() {
      // todo: this is kinda buggy when resizing but not high priority since it works on first load
      // might want to refactor this to use pure css
      if (getCurrentInstance()?.proxy.$vuetify.breakpoint.mobile) {
        const el = container.value! as Element;
        graphWidth.value = el.getBoundingClientRect().width;
      } else {
        graphWidth.value = 768;
      }
    }

    function sizeGraphDebounce() {
      // window resize event only fires before resize is applied, so use this hack to get around that
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(sizeGraph, 100);
    }

    const sequencerEvent = new ToneEvent((time) => {
      advanceSequencer(time);
    });
    
    sequencerEvent.loop = true;
    sequencerEvent.playbackRate = subdivision.value;

    function dispose() {
      sequencerEvent.stop();
      sequencerEvent.dispose();
    }

    function toggleSequence() {
      if (sequencerEvent.state === "stopped") {
        sequencerEvent.start();
        running.value = true;
      } else {
        triggerPreviousNoteRelease();
        sequencerEvent.stop();
        running.value = false;
      }
    }

    onMounted(() => {
      sizeGraph();

      window.addEventListener("resize", sizeGraphDebounce);

      context.emit("deviceMounted");
      sequencerEvent.start();
      running.value = true;
    });

    onBeforeUnmount(() => {
      window.removeEventListener("resize", sizeGraphDebounce);

      dispose();
    });

    return {
      guid,
      name,
      settings,
      transposeOptions,
      scaleOptions,
      directionOptions,
      transpose,
      scale,
      selectedSequence,
      selectedSequenceNonNull,
      noteSequence,
      octaveSequence,
      velocitySequence,
      lengthSequence,
      gateSequence,
      cssVars,
      maxNumSteps,
      graphWidth,
      running,
      container,
      connect,
      disconnect,
      applySettings,
      updateNote,
      updateGate,
      updateLength,
      updateOctave,
      updateVelocity,
      toggleSequence,
      displayNoteSequence,
      displayOctaveSequence,
      displayVelocitySequence,
      displayLengthSequence,
      displayGateSequence
    }
  }
});

</script>

<style scoped>
div.sequencer-container {
  justify-content: center;
  width: 100%;
  background-image: url("../assets/wood-2.png");
  background-repeat: repeat;
  position: relative;
  display: flex;
  color: black;
}
div.sequencer {
  display: flex;
  flex-wrap: wrap;
}
div.sequencer-controls {
  background: black;
}
div.sequencer-controls.vertical {
  height: 100%;
  min-width: 100px;
  max-width: 140px;
}
div.sequencer-controls.top {
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
  width: var(--graphWidth);
  height: 30px;
}
div.sequencer-controls.bottom {
  width: var(--graphWidth);
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
