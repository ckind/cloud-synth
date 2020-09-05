<template>
  <div class="keyboard-container">
    <ul class="keyboard">
      <li id="key24" class="key">
        <div id="key25" class="black-key"></div>
      </li>
      <li id="key26" class="key">
        <div id="key27" class="black-key"></div>
      </li>
      <li id="key28" class="key"></li>
      <li id="key29" class="key">
        <div id="key30" class="black-key"></div>
      </li>
      <li id="key31" class="key">
        <div id="key32" class="black-key"></div>
      </li>
      <li id="key33" class="key">
        <div id="key34" class="black-key"></div>
      </li>
      <li id="key35" class="key"></li>
      <li id="key36" class="key">
        <div id="key37" class="black-key"></div>
      </li>
      <li id="key38" class="key">
        <div id="key39" class="black-key"></div>
      </li>
      <li id="key40" class="key"></li>
      <li id="key41" class="key">
        <div id="key42" class="black-key"></div>
      </li>
      <li id="key43" class="key">
        <div id="key44" class="black-key"></div>
      </li>
      <li id="key45" class="key">
        <div id="key46" class="black-key"></div>
      </li>
      <li id="key47" class="key"></li>
      <li id="key48" class="key">
        <div id="key49" class="black-key"></div>
      </li>
      <li id="key50" class="key">
        <div id="key51" class="black-key"></div>
      </li>
      <li id="key52" class="key"></li>
      <li id="key53" class="key">
        <div id="key54" class="black-key"></div>
      </li>
      <li id="key55" class="key">
        <div id="key56" class="black-key"></div>
      </li>
      <li id="key57" class="key">
        <div id="key58" class="black-key"></div>
      </li>
      <li id="key59" class="key"></li>
      <li id="key60" class="key">
        <div id="key61" class="black-key"></div>
      </li>
      <li id="key62" class="key">
        <div id="key63" class="black-key"></div>
      </li>
      <li id="key64" class="key"></li>
      <li id="key65" class="key">
        <div id="key66" class="black-key"></div>
      </li>
      <li id="key67" class="key">
        <div id="key68" class="black-key"></div>
      </li>
      <li id="key69" class="key">
        <div id="key70" class="black-key"></div>
      </li>
      <li id="key71" class="key"></li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Draw, immediate } from "tone";
import { MidiSender } from "@/shared/interfaces/midi/MidiSender";
import { MidiReceiver } from "@/shared/interfaces/midi/MidiReceiver";
import { MidiMessage } from "@/shared/interfaces/midi/MidiMessage";

@Component({})
export default class PianoKeyboard extends Vue implements MidiSender {
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
        midiFunction: "noteon",
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
        midiFunction: "noteoff",
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
