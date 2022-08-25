<template>
  <div class="back-panel">
    <div class="content-container">

    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount } from "vue";
import { Gain as ToneGain, Midi } from "tone";
import { Piano as TonePiano } from '@tonejs/piano';
import { IMidiMessage, MidiFunction } from "@/shared/interfaces/midi/IMidiMessage";
import { v4 as uuidv4 } from "uuid";

export default defineComponent({
  emits: ["deviceMounted"],
  setup(props, context) {
    const guid = ref(uuidv4());
    const name = ref("Piano");
    const output = new ToneGain(1);
    const piano = new TonePiano({
      velocities: 1
    });

    // todo: option to select number of velocities, volume knob
    
    piano.load().then(() => {
      // todo: show modal while loading samples
      piano.connect(output);
      console.log('piano samples loaded');
    });

    function dispose() {
      piano.disconnect(output);
      piano.dispose();
      output.dispose();
    }

    function receiveMidi(message: IMidiMessage, time?: number) {
      switch (message.midiFunction) {
        case MidiFunction.noteon:
          piano.keyDown({ note: Midi(message.noteNumber).toNote(), time: time, velocity: message.noteVelocity / 127});
          break;
        case MidiFunction.noteoff:
          piano.keyUp({ note: Midi(message.noteNumber).toNote(), time: time, velocity: message.noteVelocity / 127});
          break;
      }
    }

    function applySettings(settings: any) {
      // nothing to see here
    }

    onMounted(() => {
      context.emit("deviceMounted");
    });

    onBeforeUnmount(() => {
      dispose();
    });

    return {
      guid,
      name,
      output,
      receiveMidi,
      applySettings
    }
  }
});

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
