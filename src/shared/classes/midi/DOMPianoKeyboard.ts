import { MidiReceiver } from "../../interfaces/midi/MidiReceiver";
import { MidiSender } from "../../interfaces/midi/MidiSender"; 
import { MidiMessage} from "../../interfaces/midi/MidiMessage";

class DOMPianoKeyboard implements MidiSender {
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

  constructor() {
    this.connections = [];
    this.keysPressed = new Array<boolean>(127);
    this.keysPressed.fill(false);
  }

  connect(receiver: MidiReceiver) {
    this.connections.push(receiver);
  }

  disconnect(receiver: MidiReceiver) {
    const i = this.connections.indexOf(receiver)
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

  userKeyPressed(e: KeyboardEvent): number {
    console.log(e.code + " down");
    let n = this.noteKeyCodes.findIndex(c => {
      return c === e.code;
    });
    // this.keysPressed needed to stop keydown from firing multiple times
    if (n > -1 && !this.keysPressed[n]) {
      this.keysPressed[n] = true;
      n += this.playerOctaveOffset + this.playerTransposeOffset;
      this.sendMidi({
        midiFunction: "noteon",
        noteNumber: n,
        noteVelocity: 67
      });
    }
    return n;
  }

  userKeyReleased(e: KeyboardEvent): number {
    console.log(e.code + " up");
    let n = this.noteKeyCodes.findIndex(c => {
      return c === e.code;
    });
    if (n > -1) {
      this.keysPressed[n] = false;
      // todo: doesn't release if you change octave or transpose while holding a key
      n += this.playerOctaveOffset + this.playerTransposeOffset;
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
    return n;
  }
}