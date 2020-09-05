<template>
  <!-- todo: this is kind of messy...should generate keys in a loop -->
  <!-- prettier-ignore -->
  <div class="keyboard-container">
    <ul class="keyboard">
      <li id="key24" class="key"
      @mousedown="e => { keyMouseDown(e, 24) }" @mouseup="e => { keyMouseUp(e, 24) }">
        <div id="key25" class="black-key"
        @mousedown="e => { keyMouseDown(e, 25) }" @mouseup="e => { keyMouseUp(e, 25) }"></div>
      </li>
      <li id="key26" class="key"
      @mousedown="e => { keyMouseDown(e, 26) }" @mouseup="e => { keyMouseUp(e, 26) }">
        <div id="key27" class="black-key"
        @mousedown="e => { keyMouseDown(e, 27) }" @mouseup="e => { keyMouseUp(e, 27) }"></div>
      </li>
      <li id="key28" class="key"
      @mousedown="e => { keyMouseDown(e, 28) }" @mouseup="e => { keyMouseUp(e, 28) }"></li>
      <li id="key29" class="key"
      @mousedown="e => { keyMouseDown(e, 29) }" @mouseup="e => { keyMouseUp(e, 29) }">
        <div id="key30" class="black-key"
        @mousedown="e => { keyMouseDown(e, 30) }" @mouseup="e => { keyMouseUp(e, 30) }"></div>
      </li>
      <li id="key31" class="key"
      @mousedown="e => { keyMouseDown(e, 31) }" @mouseup="e => { keyMouseUp(e, 31) }">
        <div id="key32" class="black-key"
        @mousedown="e => { keyMouseDown(e, 32) }" @mouseup="e => { keyMouseUp(e, 32) }"></div>
      </li>
      <li id="key33" class="key"
      @mousedown="e => { keyMouseDown(e, 33) }" @mouseup="e => { keyMouseUp(e, 33) }">
        <div id="key34" class="black-key"
        @mousedown="e => { keyMouseDown(e, 34) }" @mouseup="e => { keyMouseUp(e, 34) }"></div>
      </li>
      <li id="key35" class="key"
      @mousedown="e => { keyMouseDown(e, 35) }" @mouseup="e => { keyMouseUp(e, 35) }"></li>
      <li id="key36" class="key"
      @mousedown="e => { keyMouseDown(e, 36) }" @mouseup="e => { keyMouseUp(e, 36) }">
        <div id="key37" class="black-key"
        @mousedown="e => { keyMouseDown(e, 37) }" @mouseup="e => { keyMouseUp(e, 37) }"></div>
      </li>
      <li id="key38" class="key"
      @mousedown="e => { keyMouseDown(e, 38) }" @mouseup="e => { keyMouseUp(e, 38) }">
        <div id="key39" class="black-key"
        @mousedown="e => { keyMouseDown(e, 39) }" @mouseup="e => { keyMouseUp(e, 39) }"></div>
      </li>
      <li id="key40" class="key"
      @mousedown="e => { keyMouseDown(e, 40) }" @mouseup="e => { keyMouseUp(e, 40) }"></li>
      <li id="key41" class="key"
      @mousedown="e => { keyMouseDown(e, 41) }" @mouseup="e => { keyMouseUp(e, 41) }">
        <div id="key42" class="black-key"
        @mousedown="e => { keyMouseDown(e, 42) }" @mouseup="e => { keyMouseUp(e, 42) }"></div>
      </li>
      <li id="key43" class="key"
      @mousedown="e => { keyMouseDown(e, 43) }" @mouseup="e => { keyMouseUp(e, 43) }">
        <div id="key44" class="black-key"
        @mousedown="e => { keyMouseDown(e, 44) }" @mouseup="e => { keyMouseUp(e, 44) }"></div>
      </li>
      <li id="key45" class="key"
      @mousedown="e => { keyMouseDown(e, 45) }" @mouseup="e => { keyMouseUp(e, 45) }">
        <div id="key46" class="black-key"
        @mousedown="e => { keyMouseDown(e, 46) }" @mouseup="e => { keyMouseUp(e, 46) }"></div>
      </li>
      <li id="key47" class="key"
      @mousedown="e => { keyMouseDown(e, 47) }" @mouseup="e => { keyMouseUp(e, 47) }"></li>
      <li id="key48" class="key"
      @mousedown="e => { keyMouseDown(e, 48) }" @mouseup="e => { keyMouseUp(e, 48) }">
        <div id="key49" class="black-key"
        @mousedown="e => { keyMouseDown(e, 49) }" @mouseup="e => { keyMouseUp(e, 49) }"></div>
      </li>
      <li id="key50" class="key"
      @mousedown="e => { keyMouseDown(e, 50) }" @mouseup="e => { keyMouseUp(e, 50) }">
        <div id="key51" class="black-key"
        @mousedown="e => { keyMouseDown(e, 51) }" @mouseup="e => { keyMouseUp(e, 51) }"></div>
      </li>
      <li id="key52" class="key"
      @mousedown="e => { keyMouseDown(e, 52) }" @mouseup="e => { keyMouseUp(e, 52) }"></li>
      <li id="key53" class="key"
      @mousedown="e => { keyMouseDown(e, 53) }" @mouseup="e => { keyMouseUp(e, 53) }">
        <div id="key54" class="black-key"
        @mousedown="e => { keyMouseDown(e, 54) }" @mouseup="e => { keyMouseUp(e, 54) }"></div>
      </li>
      <li id="key55" class="key"
      @mousedown="e => { keyMouseDown(e, 55) }" @mouseup="e => { keyMouseUp(e, 55) }">
        <div id="key56" class="black-key"
        @mousedown="e => { keyMouseDown(e, 56) }" @mouseup="e => { keyMouseUp(e, 56) }"></div>
      </li>
      <li id="key57" class="key"
      @mousedown="e => { keyMouseDown(e, 57) }" @mouseup="e => { keyMouseUp(e, 57) }">
        <div id="key58" class="black-key"
        @mousedown="e => { keyMouseDown(e, 58) }" @mouseup="e => { keyMouseUp(e, 58) }"></div>
      </li>
      <li id="key59" class="key"
      @mousedown="e => { keyMouseDown(e, 59) }" @mouseup="e => { keyMouseUp(e, 59) }"></li>
      <li id="key60" class="key"
      @mousedown="e => { keyMouseDown(e, 60) }" @mouseup="e => { keyMouseUp(e, 60) }">
        <div id="key61" class="black-key"
        @mousedown="e => { keyMouseDown(e, 61) }" @mouseup="e => { keyMouseUp(e, 61) }"></div>
      </li>
      <li id="key62" class="key"
      @mousedown="e => { keyMouseDown(e, 62) }" @mouseup="e => { keyMouseUp(e, 62) }">
        <div id="key63" class="black-key"
        @mousedown="e => { keyMouseDown(e, 63) }" @mouseup="e => { keyMouseUp(e, 63) }"></div>
      </li>
      <li id="key64" class="key"
      @mousedown="e => { keyMouseDown(e, 64) }" @mouseup="e => { keyMouseUp(e, 64) }"></li>
      <li id="key65" class="key"
      @mousedown="e => { keyMouseDown(e, 65) }" @mouseup="e => { keyMouseUp(e, 65) }">
        <div id="key66" class="black-key"
        @mousedown="e => { keyMouseDown(e, 66) }" @mouseup="e => { keyMouseUp(e, 66) }"></div>
      </li>
      <li id="key67" class="key"
      @mousedown="e => { keyMouseDown(e, 67) }" @mouseup="e => { keyMouseUp(e, 67) }">
        <div id="key68" class="black-key"
        @mousedown="e => { keyMouseDown(e, 68) }" @mouseup="e => { keyMouseUp(e, 68) }"></div>
      </li>
      <li id="key69" class="key"
      @mousedown="e => { keyMouseDown(e, 69) }" @mouseup="e => { keyMouseUp(e, 69) }">
        <div id="key70" class="black-key"
        @mousedown="e => { keyMouseDown(e, 70) }" @mouseup="e => { keyMouseUp(e, 70) }"></div>
      </li>
      <li id="key71" class="key"
      @mousedown="e => { keyMouseDown(e, 71) }" @mouseup="e => { keyMouseUp(e, 71) }"></li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Draw, immediate } from "tone";
import { MidiSender } from "@/shared/interfaces/midi/MidiSender";
import { MidiReceiver } from "@/shared/interfaces/midi/MidiReceiver";
import {
  MidiFunction,
  MidiMessage
} from "@/shared/interfaces/midi/MidiMessage";

@Component({})
export default class PianoKeyboard extends Vue
  implements MidiSender, MidiReceiver {
  private readonly keyPressedColor = "#ff2929";
  private readonly blackKeys = [1, 3, 6, 8, 10];
  private connections: Array<MidiReceiver>;
  private keysPressed: Array<boolean>;
  private playerOctaveOffset = 48;
  private playerTransposeOffset = 0;
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
    "KeyL"
  ];

  public constructor() {
    super();
    this.connections = [];
    this.keysPressed = new Array<boolean>(127);
    this.keysPressed.fill(false);
    // todo: cleanup handlers?
    document.onkeydown = e => {
      this.userKeyPressed(e);
    };
    document.onkeyup = e => {
      this.userKeyReleased(e);
    };
  }

  connect(receiver: MidiReceiver) {
    this.connections.push(receiver);
  }

  disconnect(receiver: MidiReceiver) {
    const i = this.connections.indexOf(receiver);
    if (i > -1) {
      this.connections.splice(i, 1);
    } else {
      throw `no existing connection to given midi receiver`;
    }
  }

  sendMidi(message: MidiMessage) {
    this.connections.forEach(r => {
      r.receiveMidi(message);
    });
  }

  receiveMidi(message: MidiMessage) {
    switch (message.midiFunction) {
      case MidiFunction.note_on:
        Draw.schedule(() => {
          this.displayKeyDown(message.noteNumber);
        }, immediate());
        this.sendMidi(message);
        break;
      case MidiFunction.note_off:
        Draw.schedule(() => {
          this.displayKeyUp(message.noteNumber);
        }, immediate());
        this.sendMidi(message);
        break;
    }
    this.sendMidi(message);
  }

  private keyMouseDown(e: Event, keyNum: number) {
    e.stopPropagation();
    const n = keyNum - this.playerOctaveOffset - this.playerTransposeOffset;
    if (!this.keysPressed[n]) {
      this.keysPressed[n] = true;
      Draw.schedule(() => {
        this.displayKeyDown(keyNum);
      }, immediate());
      this.sendMidi({
        midiFunction: MidiFunction.note_on,
        noteNumber: keyNum,
        noteVelocity: 67
      });
    }
  }

  private keyMouseUp(e: Event, keyNum: number) {
    e.stopPropagation();
    const n = keyNum - this.playerOctaveOffset - this.playerTransposeOffset;
    this.keysPressed[n] = false;
    // todo: doesn't release if you change octave or transpose while holding a key
    Draw.schedule(() => {
      this.displayKeyUp(keyNum);
    }, immediate());
    this.sendMidi({
      midiFunction: MidiFunction.note_off,
      noteNumber: keyNum,
      noteVelocity: 67
    });
  }

  private userKeyPressed(e: KeyboardEvent) {
    let n = this.noteKeyCodes.findIndex(c => {
      return c === e.code;
    });
    // this.keysPressed needed to stop keydown from firing multiple times
    if (n > -1 && !this.keysPressed[n]) {
      this.keysPressed[n] = true;
      n += this.playerOctaveOffset + this.playerTransposeOffset;
      Draw.schedule(() => {
        this.displayKeyDown(n);
      }, immediate());
      this.sendMidi({
        midiFunction: MidiFunction.note_on,
        noteNumber: n,
        noteVelocity: 67
      });
    }
  }

  private userKeyReleased(e: KeyboardEvent) {
    let n = this.noteKeyCodes.findIndex(c => {
      return c === e.code;
    });
    if (n > -1) {
      this.keysPressed[n] = false;
      // todo: doesn't release if you change octave or transpose while holding a key
      n += this.playerOctaveOffset + this.playerTransposeOffset;
      Draw.schedule(() => {
        this.displayKeyUp(n);
      }, immediate());
      this.sendMidi({
        midiFunction: MidiFunction.note_off,
        noteNumber: n,
        noteVelocity: 67
      });
    } else if (e.code === "KeyZ") {
      // go down an octave
      this.playerOctaveOffset = Math.max(this.playerOctaveOffset - 12, 0);
    } else if (e.code === "KeyX") {
      // go up an octave
      this.playerOctaveOffset = Math.min(this.playerOctaveOffset + 12, 120);
    } else if (e.code === "KeyC") {
      // transpose down a step
      this.playerTransposeOffset = Math.max(
        this.playerTransposeOffset - 1,
        -126
      );
    } else if (e.code === "KeyV") {
      // transpose up a step
      this.playerTransposeOffset = Math.min(
        this.playerTransposeOffset + 1,
        126
      );
    }
  }

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
ul {
  list-style: none;
  display: flex;
}
ul .key {
  position: relative;
  width: 30px;
  height: 130px;
  border: 1px solid black;
  border-right: none;
  background: #ffffff;
  border-radius: 5px;
  box-shadow: 0px 3px 5px #666;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding-bottom: 10px;
  font-weight: bold;
}
ul .key:last-child {
  border-right: 1px solid black;
}
ul .black-key {
  position: absolute;
  top: -1px;
  left: 20px;
  width: 20px;
  height: 80px;
  background: black;
  border-radius: 5px;
  box-shadow: 0px 3px 5px #666;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding-bottom: 10px;
  color: white;
}
ul .keyboard-octave {
  padding: 0 0 0 0;
  margin: 0 0 0 0;
}
</style>
