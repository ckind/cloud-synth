<template>
  <div>
    <v-row class="wood-background justify-center">
      <!-- <div class="pa-0">
        <div class="metal-1-background control-panel">
          <v-row>
            <v-col cols="6" class="pa-0">
              <knob-control
                :minValue="0"
                :maxValue="5"
                :step="1"
                v-model="settings.arpMode"
                :size="70"
                id="arpStyleKnob"
                label="Arp Style"
              ></knob-control>
            </v-col>
            <v-col cols="6" class="pa-0">
              <knob-control
                :minValue="0"
                :maxValue="8"
                :step="1"
                v-model="settings.arpRate"
                :size="70"
                id="arpRateKnob"
                label="Arp Rate"
              ></knob-control>
            </v-col>
          </v-row>
          <v-row class="pa-0">
            <v-col cols="6" class="pa-0">
              <v-switch :messages="['Arp']" class="switch-center"></v-switch>
            </v-col>
            <v-col cols="6" class="pa-0">
              <v-switch :messages="['Chord']"  class="switch-center"></v-switch>
            </v-col>
          </v-row>
        </div>
      </div> -->
      <div class="pa-0">
        <v-row class="justify-center">
          <dom-piano
            ref="domPiano"
            @keyMouseDown="keyMouseDown"
            @keyMouseUp="keyMouseUp"
            @keySlideOn="keySlideOn"
            @keySlideOff="keySlideOff"
          ></dom-piano>
        </v-row>
      </div>
      <!-- <div class="pa-0"></div> -->
    </v-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount } from "vue";
import { Draw, immediate } from "tone";
import { MidiFunction, IMidiMessage } from "@/shared/interfaces/midi/IMidiMessage";
import { IComputerMidiKeyboardSettings } from "@/shared/interfaces/presets/IComputerMidiKeyboardSettings";
import { getDefaultKeypadSettings } from "@/services/OfflinePresetService";
import KnobControl from "@/components/KnobControl.vue";
import DomPiano from "@/components/DomPiano.vue";
import { IDomPiano } from "@/components/DomPiano.vue";
import { v4 as uuidv4 } from "uuid";
import { useMidiConnections } from "@/composables/useMidiConnections"

export default defineComponent({
  emits: ["deviceMounted"],
  components: { KnobControl, DomPiano },
  // todo: should break this up into composables
  setup(props, context) {
    const keysPressed = new Array<boolean>(127).fill(false);
    const noteKeyCodes = [
      "KeyA",
      "KeyW",
      "KeyS",
      "KeyE",
      "KeyD",
      "KeyF",
      "KeyT",
      "KeyG",
      "KeyY",
      "KeyH",
      "KeyU",
      "KeyJ",
      "KeyK",
      "KeyO",
      "KeyL",
    ];
    let mouseIsDown = false;

    const guid = ref(uuidv4())
    const name = ref("Computer Keyboard");
    const settings = ref(getDefaultKeypadSettings());
    const domPiano = ref(null as IDomPiano | null);

    const { connect, disconnect, connections } = useMidiConnections();

    function applySettings(newSettings: IComputerMidiKeyboardSettings) {
      settings.value = newSettings;
    }

    function sendMidi(message: IMidiMessage) {
      connections.forEach((r) => {
        r.receiveMidi(message);
      });
    }

    function receiveMidi(message: IMidiMessage) {
      switch (message.midiFunction) {
        case MidiFunction.noteon:
          Draw.schedule(() => {
            domPiano.value?.displayKeyDown(message.noteNumber);
          }, immediate());
          sendMidi(message);
          break;
        case MidiFunction.noteoff:
          Draw.schedule(() => {
            domPiano.value?.displayKeyUp(message.noteNumber);
          }, immediate());
          sendMidi(message);
          break;
      }
      sendMidi(message);
    }

    function keySlideOn(keyNum: number) {
      if (mouseIsDown) {
        settings.value.chordTrigger.forEach((offset) => {
          const note = keyNum + offset;
          const n =
            note - settings.value.octaveOffset - settings.value.transposeOffset;
          if (!keysPressed[n]) {
            keysPressed[n] = true;
            Draw.schedule(() => {
              domPiano.value?.displayKeyDown(note);
            }, immediate());
            sendMidi({
              midiFunction: MidiFunction.noteon,
              noteNumber: note,
              noteVelocity: 67,
            });
          }
        });
      }
    }

    function keySlideOff(keyNum: number) {
      if (mouseIsDown) {
        settings.value.chordTrigger.forEach((offset) => {
          const note = keyNum + offset;
          const n =
            note - settings.value.octaveOffset - settings.value.transposeOffset;
          keysPressed[n] = false;
          // todo: doesn't release if you change octave or transpose while holding a key
          Draw.schedule(() => {
            domPiano.value?.displayKeyUp(note);
          }, immediate());
          sendMidi({
            midiFunction: MidiFunction.noteoff,
            noteNumber: note,
            noteVelocity: 67,
          });
        });
      }
    }

    function keyMouseDown(keyNum: number) {
      mouseIsDown = true;
      settings.value.chordTrigger.forEach((offset) => {
        const note = keyNum + offset;
        const n =
          note - settings.value.octaveOffset - settings.value.transposeOffset;
        if (!keysPressed[n]) {
          keysPressed[n] = true;
          Draw.schedule(() => {
            domPiano.value?.displayKeyDown(note);
          }, immediate());
          sendMidi({
            midiFunction: MidiFunction.noteon,
            noteNumber: note,
            noteVelocity: 67,
          });
        }
      });
    }

    function keyMouseUp(keyNum: number) {
      mouseIsDown = false;
      settings.value.chordTrigger.forEach((offset) => {
        const note = keyNum + offset;
        const n =
          note - settings.value.octaveOffset - settings.value.transposeOffset;
        keysPressed[n] = false;
        // todo: doesn't release if you change octave or transpose while holding a key
        Draw.schedule(() => {
          domPiano.value?.displayKeyUp(note);
        }, immediate());
        sendMidi({
          midiFunction: MidiFunction.noteoff,
          noteNumber: note,
          noteVelocity: 67,
        });
      });
    }

    function userKeyPressed(e: KeyboardEvent) {
      const n = noteKeyCodes.findIndex((c) => {
        return c === e.code;
      });
      // this.keysPressed needed to stop keydown from firing multiple times
      if (n > -1) {
        settings.value.chordTrigger.forEach((offset) => {
          if (!keysPressed[n + offset]) {
            keysPressed[n + offset] = true;
            const note =
              n +
              offset +
              settings.value.octaveOffset +
              settings.value.transposeOffset;
            Draw.schedule(() => {
              domPiano.value?.displayKeyDown(note);
            }, immediate());
            sendMidi({
              midiFunction: MidiFunction.noteon,
              noteNumber: note,
              noteVelocity: 67,
            });
          }
        });
      }
    }

    function userKeyReleased(e: KeyboardEvent) {
      const n = noteKeyCodes.findIndex((c) => {
        return c === e.code;
      });
      if (n > -1) {
        settings.value.chordTrigger.forEach((offset) => {
          keysPressed[n + offset] = false;
          // todo: doesn't release if you change octave or transpose while holding a key
          const note =
            n +
            offset +
            settings.value.octaveOffset +
            settings.value.transposeOffset;
          Draw.schedule(() => {
            domPiano.value?.displayKeyUp(note);
          }, immediate());
          sendMidi({
            midiFunction: MidiFunction.noteoff,
            noteNumber: note,
            noteVelocity: 67,
          });
        });
      } else if (e.code === "KeyZ") {
        // go down an octave
        settings.value.octaveOffset = Math.max(settings.value.octaveOffset - 12, 0);
      } else if (e.code === "KeyX") {
        // go up an octave
        settings.value.octaveOffset = Math.min(
          settings.value.octaveOffset + 12,
          120
        );
      } else if (e.code === "KeyC") {
        // transpose down a step
        settings.value.transposeOffset = Math.max(
          settings.value.transposeOffset - 1,
          -126
        );
      } else if (e.code === "KeyV") {
        // transpose up a step
        settings.value.transposeOffset = Math.min(
          settings.value.transposeOffset + 1,
          126
        );
      }
    }

    function dispose() {
      connections.length = 0;
      document.removeEventListener("keydown", userKeyPressed);
      document.removeEventListener("keyup", userKeyReleased);
    }

    onMounted(() => {
      context.emit("deviceMounted");
    });

    onBeforeUnmount(() => {
      dispose();
    });

    document.addEventListener("keydown", userKeyPressed);
    document.addEventListener("keyup", userKeyReleased);

    return {
      name, 
      guid,
      settings,
      connect,
      disconnect,
      applySettings,
      keySlideOn,
      keySlideOff,
      keyMouseDown,
      keyMouseUp,
      domPiano
    }
  }
});

</script>

<style scoped>
/* misc */
div .wood-background {
  background-image: url("../assets/wood-2.png");
  background-repeat: repeat;
}
div .metal-1-background {
  background-image: url("../assets/metal-1.png");
  background-repeat: repeat;
}
div .justify-center {
  justify-content: center;
}
div .align-center {
  align-items: center;
}
.control-panel {
  font-size: 10pt;
}
.switch-center {
  padding-left: 35%;
}
</style>
