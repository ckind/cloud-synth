<template>
  <div class="back-panel">
    <v-dialog
      :value="loadingPiano"
      dark
      max-width="600"
    >
      <v-card>
        <v-card-title class="headline">Loading Piano Samples...</v-card-title>
      </v-card>
    </v-dialog>
    <!-- <v-text-field
      class="number-input"
      v-model="settings.velocities"
      dark
      label="Velocities"
      type="number"
    /> -->
    <knob-control
      v-model="settings.volume"
      :minValue="-20"
      :maxValue="0"
      :id="`pianoVolume`"
      :size="50"
      label="Volume"
    ></knob-control>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onBeforeUnmount, watch, ref } from "vue";
import { Midi, Volume as ToneVolume } from "tone";
import { Piano as TonePiano } from '@tonejs/piano';
import { IMidiMessage, MidiFunction } from "@/shared/interfaces/midi/IMidiMessage";
import { useAudioDevice } from "@/composables/useAudioDevice";
import KnobControl from "@/components/KnobControl.vue";

type TPianoSettings = {
  velocities: number;
  volume: number;
}

export default defineComponent({
  emits: ["deviceMounted"],
  components: {
    KnobControl
  },
  setup(props, context) {
    const { guid, name, settings, output } =
      useAudioDevice<TPianoSettings>("Piano", {
        velocities: 5,
        volume: -6
      });
    const loadingPiano = ref(false);
    const piano = new TonePiano({
      velocities: settings.velocities
    });
    const volume = new ToneVolume(settings.volume);

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

    function applySettings(settings: TPianoSettings) {
      // volume.volume.value = settings.volume;
    }

    function reloadPiano() {
      loadingPiano.value = true;
      piano.load().then(() => {
        loadingPiano.value = false;
        console.log('piano samples loaded');
      });
    }

    function dispose() {
      piano.disconnect();
      volume.disconnect();
      output.disconnect();

      piano.dispose();
      volume.dispose();
      output.dispose();
    }

    watch(() => settings.volume, (currentValue, oldValue) => {
      volume.volume.value = currentValue;
    });

    watch(() => settings.velocities, (currentValue, oldValue) => {
      piano.set({ velocities: currentValue});
      reloadPiano();
    });

    onMounted(() => {
      context.emit("deviceMounted");
    });

    onBeforeUnmount(() => {
      dispose();
    });

    loadingPiano.value = true;
    
    piano.load().then(() => {
      loadingPiano.value = false;
      piano.chain(volume, output);
      console.log('piano samples loaded');
    });

    return {
      guid,
      name,
      settings,
      output,
      loadingPiano,
      reloadPiano,
      receiveMidi,
      applySettings
    }
  }
});

</script>

<style scoped>
div.back-panel  {
  background-image: url("../assets/metal-2.png");
  background-repeat: repeat;
  color: white;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
}
.selected-device-disp {
  top: 30%;
  position: absolute;
  opacity: 1;
  z-index: 3;
}
.number-input {
  max-width: 100px;
}
</style>
