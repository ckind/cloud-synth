<template>
  <v-row class="keyboard-container">
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
    <!-- "ext-keyboard" -->
    <dom-piano ref="domPiano" class="ext-keyboard" disabled></dom-piano>
  </v-row>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount } from "vue";
import { Draw, immediate } from "tone";
import { MidiFunction, IMidiMessage } from "@/shared/interfaces/midi/IMidiMessage";
import webmidi, { InputEventNoteoff, InputEventNoteon } from "webmidi";
import { v4 as uuidv4 } from "uuid";
import DomPiano from "@/components/DomPiano.vue";
import { IDomPiano } from "@/components/DomPiano.vue";
import { useMidiConnections } from "@/composables/useMidiConnections";

export default defineComponent({
  emits: ["deviceMounted"],
  components: { DomPiano },
  setup(props, context) {
    const guid = ref(uuidv4());
    const name = ref("External Midi Device");
    const settings = ref({}); // todo: settings for external?
    const webmidiSupported = ref(true);
    const webmidiError = ref("");
    const selectedExternalDevice = ref("Click to Select Device");
    const availableDevices = ref(new Array<string>());
    const domPiano = ref(null as IDomPiano | null);
    
    function applySettings(settings: any) {
      // nothing yet
    }

    const { connect, disconnect, connections } = useMidiConnections();

    function sendMidi(message: IMidiMessage) {
      connections.forEach(r => {
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

    function extNoteOn(e: InputEventNoteon) {
      sendMidi({
        midiFunction: MidiFunction.noteon,
        noteNumber: e.note.number,
        noteVelocity: Math.round(e.velocity * 127)
      });
      domPiano.value?.displayKeyDown(e.note.number);
    }

    function extNoteOff(e: InputEventNoteoff) {
      sendMidi({
        midiFunction: MidiFunction.noteoff,
        noteNumber: e.note.number,
        noteVelocity: Math.round(e.velocity * 127)
      });
      domPiano.value?.displayKeyUp(e.note.number);
    }

    function externalDeviceSelected(deviceName: string) {
      const old = webmidi.getInputByName(selectedExternalDevice.value);
      const input = webmidi.getInputByName(deviceName);
      if (input) {
        if (old) {
          old.removeListener("noteon", "all", extNoteOn);
          old.removeListener("noteoff", "all", extNoteOff);
        }
        selectedExternalDevice.value = deviceName;
        input.addListener("noteon", "all", extNoteOn);
        input.addListener("noteoff", "all", extNoteOff);
      }
    }

    function dispose() {
      connections.length = 0;
      if (webmidi.enabled) {
        const input = webmidi.getInputByName(selectedExternalDevice.value);
        if (input) {
          input.removeListener("noteon", "all", extNoteOn);
          input.removeListener("noteoff", "all", extNoteOff);
        }
        webmidi.disable();
      }
    }

    onMounted(() => {
      context.emit("deviceMounted");
    });

    onBeforeUnmount(() => {
      dispose();
    });

    webmidi.enable(err => {
      if (err) {
        webmidiSupported.value = false;
        webmidiError.value = err ? err.message : "";
      } else {
        webmidi.inputs.forEach(input => {
          availableDevices.value.push(input.name);
        });
      }
    });

    return {
      guid,
      name,
      settings,
      webmidiSupported,
      webmidiError,
      selectedExternalDevice,
      availableDevices,
      applySettings,
      connect,
      disconnect,
      externalDeviceSelected,
      domPiano
    }
  }
});


</script>

<style scoped>
div .keyboard-container {
  justify-content: center;
  background-image: url("../assets/wood-2.png");
  background-repeat: repeat;
  position: relative;
}
.ext-keyboard {
  opacity: 0.5;
}
.not-supported-message {
  top: 20px;
  position: absolute;
  opacity: 1;
  z-index: 2;
}
.selected-device-disp {
  top: 30%;
  position: absolute;
  opacity: 1;
  z-index: 2;
}
</style>
