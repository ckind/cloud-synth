<template>
  <div>
    <!-- todo: this is kind of messy...should generate keys in a loop -->
    <!-- prettier-ignore -->
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
                size="70"
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
                size="70"
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
          <div class="keyboard">
            <div v-if="$vuetify.breakpoint.mdAndUp" class="octave-section">

              <div id="key24" class="key"> 
                <div id="key25" class="black-key"></div>
              </div>
              <div id="key26" class="key">
                <div id="key27" class="black-key"></div>
              </div>
              <div id="key28" class="key"></div>
              <div id="key29" class="key">
                <div id="key30" class="black-key"></div>
              </div>
              <div id="key31" class="key">
                <div id="key32" class="black-key"></div>
              </div>
              <div id="key33" class="key">
                <div id="key34" class="black-key"></div>
              </div>
              <div id="key35" class="key"></div>

            </div>

            <div v-if="$vuetify.breakpoint.smAndUp" class="octave-section">

              <div id="key36" class="key">
                <div id="key37" class="black-key"></div>
              </div>
              <div id="key38" class="key">
                <div id="key39" class="black-key"></div>
              </div>
              <div id="key40" class="key"></div>
              <div id="key41" class="key">
                <div id="key42" class="black-key"></div>
              </div>
              <div id="key43" class="key">
                <div id="key44" class="black-key"></div>
              </div>
              <div id="key45" class="key">
                <div id="key46" class="black-key"></div>
              </div>
              <div id="key47" class="key"></div>

            </div>

            <div class="octave-section">

              <div id="key48" class="key">
                <div id="key49" class="black-key"></div>
              </div>
              <div id="key50" class="key">
                <div id="key51" class="black-key"></div>
              </div>
              <div id="key52" class="key"></div>
              <div id="key53" class="key">
                <div id="key54" class="black-key"></div>
              </div>
              <div id="key55" class="key">
                <div id="key56" class="black-key"></div>
              </div>
              <div id="key57" class="key">
                <div id="key58" class="black-key"></div>
              </div>
              <div id="key59" class="key"></div>

            </div>

            <div v-if="$vuetify.breakpoint.lgAndUp" class="octave-section">

              <div id="key60" class="key">
                <div id="key61" class="black-key"></div>
              </div>
              <div id="key62" class="key">
                <div id="key63" class="black-key"></div>
              </div>
              <div id="key64" class="key"></div>
              <div id="key65" class="key">
                <div id="key66" class="black-key"></div>
              </div>
              <div id="key67" class="key">
                <div id="key68" class="black-key"></div>
              </div>
              <div id="key69" class="key">
                <div id="key70" class="black-key"></div>
              </div>
              <div id="key71" class="key"></div>
              
            </div>
          </div>
        </v-row>
      </div>
      <!-- <div class="pa-0"></div> -->
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Draw, immediate } from "tone";
import { IMidiDevice } from "@/shared/interfaces/devices/IMidiDevice";
import { IMidiReceiver } from "@/shared/interfaces/midi/IMidiReceiver";
import {
  MidiFunction,
  IMidiMessage,
} from "@/shared/interfaces/midi/IMidiMessage";
import { IComputerMidiKeyboardSettings } from "@/shared/interfaces/presets/IComputerMidiKeyboardSettings";
import { getDefaultKeypadSettings } from "@/services/OfflinePresetService";
import KnobControl from "@/components/KnobControl.vue";

@Component({
  components: {
    KnobControl,
  },
})
export default class ComputerMidiKeyboard extends Vue implements IMidiDevice {
  name = "Computer Keyboard";
  settings: IComputerMidiKeyboardSettings;

  private readonly keyPressedColor = "#ff2929";
  private readonly blackKeys = [1, 3, 6, 8, 10];
  private connections: Array<IMidiReceiver>;
  private keysPressed: Array<boolean>;
  private mouseIsDown = false;
  private noteKeyCodes = [
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

  public constructor() {
    super();
    this.connections = [];
    this.keysPressed = new Array<boolean>(127);
    this.keysPressed.fill(false);
    this.settings = getDefaultKeypadSettings();

    document.addEventListener("keydown", this.userKeyPressed);
    document.addEventListener("keyup", this.userKeyReleased);
  }

  // Lifecycle Hooks

  mounted() {
    this.assignKeyboardListeners();
    this.$emit("deviceMounted");
  }

  beforeDestroy() {
    this.dispose();
  }

  // Methods

  applySettings(settings: IComputerMidiKeyboardSettings) {
    this.settings = settings;
    // this.updateSynthWatches(); updates watches?
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
    this.connections.length = 0;
    document.removeEventListener("keydown", this.userKeyPressed);
    document.removeEventListener("keyup", this.userKeyReleased);
  }

  sendMidi(message: IMidiMessage) {
    this.connections.forEach((r) => {
      r.receiveMidi(message);
    });
  }

  receiveMidi(message: IMidiMessage) {
    switch (message.midiFunction) {
      case MidiFunction.noteon:
        Draw.schedule(() => {
          this.displayKeyDown(message.noteNumber);
        }, immediate());
        this.sendMidi(message);
        break;
      case MidiFunction.noteoff:
        Draw.schedule(() => {
          this.displayKeyUp(message.noteNumber);
        }, immediate());
        this.sendMidi(message);
        break;
    }
    this.sendMidi(message);
  }

  private assignKeyboardListeners() {
    // @mousedown="e => { keyMouseDown(e, 48) }" @mouseup="e => { keyMouseUp(e, 48) }"
    // @mouseover="e => { keySlideOn(e, 48) }" @mouseout="e => { keySlideOff(e, 48) }"
    // @touchstart="e => { keyMouseDown(e, 48) }" @touchend="e => { keyMouseUp(e, 48) }">
    const keys = document.querySelectorAll("div.keyboard div.key, div.keyboard div.black-key");
    for (const key of keys) {
      key.addEventListener('mousedown', this.keyMouseDown);
      key.addEventListener('mouseup', this.keyMouseUp);
      key.addEventListener('mouseover', this.keySlideOn);
      key.addEventListener('mouseout', this.keySlideOff);
      key.addEventListener('touchstart', this.keyMouseDown);
      key.addEventListener('touchend', this.keyMouseUp);
      // todo: need to implement keySlideOn and keySlideOff for touch events - see: https://gist.github.com/VehpuS/6fd5dca2ea8cd0eb0471
    }
  }

  private getKeyNum(e: Event) {
    const el = e.target as HTMLElement;
    return parseInt(el.id.replace('key', ''));
  }

  // private clearKeyboardListeners() {

  // }

  // begin todo: could probably refactor these functions to share some logic

  private keySlideOn(e: Event) {
    e.stopPropagation();
    const keyNum = this.getKeyNum(e);
    if (this.mouseIsDown) {
      this.settings.chordTrigger.forEach((offset) => {
        const note = keyNum + offset;
        const n =
          note - this.settings.octaveOffset - this.settings.transposeOffset;
        if (!this.keysPressed[n]) {
          this.keysPressed[n] = true;
          Draw.schedule(() => {
            this.displayKeyDown(note);
          }, immediate());
          this.sendMidi({
            midiFunction: MidiFunction.noteon,
            noteNumber: note,
            noteVelocity: 67,
          });
        }
      });
    }
  }

  private keySlideOff(e: Event) {
    e.stopPropagation();
    const keyNum = this.getKeyNum(e);
    if (this.mouseIsDown) {
      this.settings.chordTrigger.forEach((offset) => {
        const note = keyNum + offset;
        const n =
          note - this.settings.octaveOffset - this.settings.transposeOffset;
        this.keysPressed[n] = false;
        // todo: doesn't release if you change octave or transpose while holding a key
        Draw.schedule(() => {
          this.displayKeyUp(note);
        }, immediate());
        this.sendMidi({
          midiFunction: MidiFunction.noteoff,
          noteNumber: note,
          noteVelocity: 67,
        });
      });
    }
  }

  private keyMouseDown(e: Event) {
    e.stopPropagation();
    const keyNum = this.getKeyNum(e);
    this.mouseIsDown = true;
    this.settings.chordTrigger.forEach((offset) => {
      const note = keyNum + offset;
      const n =
        note - this.settings.octaveOffset - this.settings.transposeOffset;
      if (!this.keysPressed[n]) {
        this.keysPressed[n] = true;
        Draw.schedule(() => {
          this.displayKeyDown(note);
        }, immediate());
        this.sendMidi({
          midiFunction: MidiFunction.noteon,
          noteNumber: note,
          noteVelocity: 67,
        });
      }
    });
  }

  private keyMouseUp(e: Event) {
    e.stopPropagation();
    const keyNum = this.getKeyNum(e);
    this.mouseIsDown = false;
    this.settings.chordTrigger.forEach((offset) => {
      const note = keyNum + offset;
      const n =
        note - this.settings.octaveOffset - this.settings.transposeOffset;
      this.keysPressed[n] = false;
      // todo: doesn't release if you change octave or transpose while holding a key
      Draw.schedule(() => {
        this.displayKeyUp(note);
      }, immediate());
      this.sendMidi({
        midiFunction: MidiFunction.noteoff,
        noteNumber: note,
        noteVelocity: 67,
      });
    });
  }

  private userKeyPressed(e: KeyboardEvent) {
    const n = this.noteKeyCodes.findIndex((c) => {
      return c === e.code;
    });
    // this.keysPressed needed to stop keydown from firing multiple times
    if (n > -1) {
      this.settings.chordTrigger.forEach((offset) => {
        if (!this.keysPressed[n + offset]) {
          this.keysPressed[n + offset] = true;
          const note =
            n +
            offset +
            this.settings.octaveOffset +
            this.settings.transposeOffset;
          Draw.schedule(() => {
            this.displayKeyDown(note);
          }, immediate());
          this.sendMidi({
            midiFunction: MidiFunction.noteon,
            noteNumber: note,
            noteVelocity: 67,
          });
        }
      });
    }
  }

  private userKeyReleased(e: KeyboardEvent) {
    const n = this.noteKeyCodes.findIndex((c) => {
      return c === e.code;
    });
    if (n > -1) {
      this.settings.chordTrigger.forEach((offset) => {
        this.keysPressed[n + offset] = false;
        // todo: doesn't release if you change octave or transpose while holding a key
        const note =
          n +
          offset +
          this.settings.octaveOffset +
          this.settings.transposeOffset;
        Draw.schedule(() => {
          this.displayKeyUp(note);
        }, immediate());
        this.sendMidi({
          midiFunction: MidiFunction.noteoff,
          noteNumber: note,
          noteVelocity: 67,
        });
      });
    } else if (e.code === "KeyZ") {
      // go down an octave
      this.settings.octaveOffset = Math.max(this.settings.octaveOffset - 12, 0);
    } else if (e.code === "KeyX") {
      // go up an octave
      this.settings.octaveOffset = Math.min(
        this.settings.octaveOffset + 12,
        120
      );
    } else if (e.code === "KeyC") {
      // transpose down a step
      this.settings.transposeOffset = Math.max(
        this.settings.transposeOffset - 1,
        -126
      );
    } else if (e.code === "KeyV") {
      // transpose up a step
      this.settings.transposeOffset = Math.min(
        this.settings.transposeOffset + 1,
        126
      );
    }
  }

  // end todo

  private displayKeyDown(keyNumber: number) {
    const key: HTMLElement | null = document.querySelector(`#key${keyNumber}`);
    if (key != null) {
      key.style.background = this.keyPressedColor;
    }
  }

  public displayKeyUp(keyNumber: number) {
    const key: HTMLElement | null = document.querySelector(`#key${keyNumber}`);
    if (key != null) {
      key.style.background = this.blackKeys.includes(keyNumber % 12)
        ? "black"
        : "white";
    }
  }
}
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

/* keyboard */
.keyboard {
  padding-left: 0px;
  border-radius: 5px; /* should be the same as .key */
  height: 140px;
}
.keyboard .key {
  position: relative;
  width: 30px;
  height: 130px;
  border: 1px solid black;
  border-right: none;
  background: #ffffff;
  border-radius: 5px;
  cursor: pointer;
  user-select: none;
  display: inline-block;
}
.keyboard .black-key {
  position: absolute;
  top: -1px;
  left: 20px;
  width: 20px;
  height: 80px;
  background: black;
  border-radius: 5px;
  box-shadow: 0px 3px 5px #666;
  z-index: 2;
  user-select: none;
  display: inline-block;
}
.keyboard > .key:last-child {
  border-right: 1px solid black;
}
.octave-section {
  display: inline-block;
}
</style>
