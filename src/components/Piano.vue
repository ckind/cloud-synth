<template>
  <div class="back-panel">
    <div class="content-container">

    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Gain as ToneGain, Midi } from "tone";
import { Piano as TonePiano } from '@tonejs/piano';
import { IMidiMessage, MidiFunction } from "@/shared/interfaces/midi/IMidiMessage";
import { IInstrumentDevice } from "@/shared/interfaces/devices/IInstrumentDevice";
import { v4 as uuidv4 } from "uuid";

@Component({})
export default class Piano extends Vue implements IInstrumentDevice {
  guid: string;
  name = "Piano";
  output!: ToneGain;
  piano!: TonePiano;
  settings = {};

  public constructor() {
    super();

    this.guid = uuidv4();
  }

  // Lifecycle Hooks

  mounted() {
    this.$emit("deviceMounted");
  }

  created() {
    /**
     * Important: define web audio objects outside of the constructor so vue doesn't
     * apply reactivity to them. Reactivity can interfere with the dispose methods
     * of some Tone/WebAudio objects
     */

    this.piano = new TonePiano({
      velocities: 1
    });

    this.output = new ToneGain(1);

    // todo: this takes fucking forever to load multiple velocities
    this.piano.load().then(() => {
      this.piano.connect(this.output);
      console.log('piano samples loaded');
    });    
  }

  beforeDestroy() {
    this.dispose();
  }

  // Methods

  applySettings(settings: any) {
    // nothing to see here
  }

  dispose() {
    this.piano.disconnect(this.output);
    this.piano.dispose();
    this.output.dispose();
  }

  receiveMidi(message: IMidiMessage, time?: number) {
    switch (message.midiFunction) {
      case MidiFunction.noteon:
        this.piano.keyDown({ note: Midi(message.noteNumber).toNote(), time: time, velocity: message.noteVelocity / 127});
        break;
      case MidiFunction.noteoff:
        this.piano.keyUp({ note: Midi(message.noteNumber).toNote(), time: time, velocity: message.noteVelocity / 127});
        break;
    }
  }

  // Watches
}
</script>

<style scoped>
div.back-panel {
  justify-content: center;
  background-color: black;
  position: relative;
  height: 200px;
}
div.back-panel::after {
  content: "";
  background: url("../assets/piano.jpeg");
  background-position: 0px -600px;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  position: absolute;
  z-index: 2;
  opacity: 0.8;
}
div.content-container {
  position: absolute;
  justify-content: center;
  display: flex;
  height: 100%;
  width: 100%;
}
.selected-device-disp {
  top: 30%;
  position: absolute;
  opacity: 1;
  z-index: 3;
}
</style>
