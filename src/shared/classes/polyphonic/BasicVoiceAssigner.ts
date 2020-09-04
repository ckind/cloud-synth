import { Voice } from "../../interfaces/polyphonic/Voice";
import { VoiceAssigner } from "../../interfaces/polyphonic/VoiceAssigner";

export class BasicVoiceAssigner implements VoiceAssigner {
  readonly voices: Array<Voice>;

  constructor(voices: Array<Voice>) {
    this.voices = voices;
  }

  assignNoteOn(midiNote: number) {
    let result = -1;
    let assignedVoice = -1;
    this.voices.forEach((v, index) => {
      if (v.currentMidiNote === midiNote) {
        assignedVoice = index;
      }
    });
    if (assignedVoice < 0) {
      for (let i = 0; i < this.voices.length; i++) {
        if (!this.voices[i].isActive) {
          result = i;
          break;
        }
      }
    }
    // if (assignedVoice > -1) {
    //   console.log(`voice ${assignedVoice} already assigned to ${midiNote}`);
    // } else if (result > -1) {
    //   console.log(`voice ${result} assigned to ${midiNote}`);
    // } else {
    //   console.log(`no voices available for ${midiNote}`);
    // }
    return result;
  }

  assignNoteOff(midiNote: number) {
    let result = -1;
    for (let i = 0; i < this.voices.length; i++) {
      if (this.voices[i].currentMidiNote === midiNote) {
        result = i;
        break;
      }
    }
    // console.log(
    //   result > -1
    //     ? `voice ${result} freed from ${midiNote}`
    //     : `no active voice assigned to ${midiNote}`
    // );
    return result;
  }
}
