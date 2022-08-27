<template>
  <div class="back-panel">
    <div class="content-container">
      <v-card
        v-if="!webmidiSupported"
        class="mx-auto not-supported-message"
        max-width="344"
        dark
      >
        <v-card-text>
          <p>
            Sorry, but your browser doesn't support WebMidi! Please check the
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/MIDIAccess#Browser_compatibility"
              target="_blank"
            >
              compatibility list
            </a>
            .
          </p>
        </v-card-text>
      </v-card>
      <!-- todo: figure this out -->
      <v-menu bottom offset-y nudge-top="12" v-else>
        <template v-slot:activator="{ on }">
          <v-text-field
            v-on="on"
            dense
            dark
            readonly
            :value="selectedExternalDevice"
            class="selected-device-disp"
          />
        </template>
        <v-list>
          <v-divider></v-divider>
          <span v-for="device in availableDevices" :key="device" @click="externalDeviceSelected(device)">
            <v-list-item link>
              {{ device }}
            </v-list-item>
            <v-divider></v-divider>
          </span>
        </v-list>
      </v-menu>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, onMounted, onUnmounted } from "vue";
import { useAudioDevice } from "@/composables/useAudioDevice";
import { IMidiMessage, MidiFunction } from "@/shared/interfaces/midi/IMidiMessage";
import webmidi, { Output } from "webmidi";

type TExternalInstrumentSettings = {}

export default defineComponent({
  emits: ["deviceMounted"],
  setup(props, context) {
    const { 
      guid,
      name,
      settings,
      output
    } = useAudioDevice<TExternalInstrumentSettings>("External Instrument", {});

    const selectedExternalDevice = ref("Click to Select Device");
    const webmidiSupported = ref(true);
    const webmidiError = ref("");
    const availableDevices = reactive([] as string[]);

    let selectedOutput: Output | false = false;

    function externalDeviceSelected(deviceName: string) {
      selectedExternalDevice.value = deviceName;
      selectedOutput = webmidi.getOutputByName(deviceName);
    }

    function applySettings(setting: TExternalInstrumentSettings) {
      // todo: nothing yet
    }

    function dispose() {
      // todo: cleanup
    }

    function receiveMidi(message: IMidiMessage, time?: number) {
      // todo: this has inaccurate timing when used with step sequencer
      if (selectedOutput) {
        switch (message.midiFunction) {
          case MidiFunction.noteon:
            // ToneTransport.scheduleOnce(() => {
            //   if (this.selectedOutput) {
            //     this.selectedOutput.playNote("C4", "all");
            //   }
            // }, time !== undefined ? time : toneImmediate());
            selectedOutput?.playNote(message.noteNumber, "all");
            break;
          case MidiFunction.noteoff:
            // ToneTransport.scheduleOnce(() => {
            //   if (this.selectedOutput) {
            //     this.selectedOutput.stopNote("C4", "all");
            //   }
            // }, time !== undefined ? time : toneImmediate());
            selectedOutput?.stopNote(message.noteNumber, "all");
            break;
        }
      }
    }

    onMounted(() => {
      context.emit("deviceMounted");
    });

    onUnmounted(() => {
      dispose();
    });

    webmidi.enable(err => {
      if (err) {
        webmidiSupported.value = false;
        webmidiError.value = err ? err.message : "";
      } else {
        webmidi.outputs.forEach(output => {
          availableDevices.push(output.name);
        });
      }
    });

    return {
      guid,
      name,
      settings,
      output,
      selectedExternalDevice,
      availableDevices,
      webmidiSupported,
      webmidiError,
      externalDeviceSelected,
      applySettings,
      dispose,
      receiveMidi
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
  background: url("../assets/Modular2.png");
  background-position: 0px -200px;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  position: absolute;
  z-index: 2;
  opacity: 0.4;
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
