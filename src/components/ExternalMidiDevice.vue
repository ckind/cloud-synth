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
    <ul class="ext-keyboard">
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
  </v-row>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount } from "vue";
import { Component, Vue } from "vue-property-decorator";
import { Draw, immediate } from "tone";
import { IMidiDevice } from "@/shared/interfaces/devices/IMidiDevice";
import { IMidiReceiver } from "@/shared/interfaces/midi/IMidiReceiver";
import {
  MidiFunction,
  IMidiMessage
} from "@/shared/interfaces/midi/IMidiMessage";
import webmidi, { InputEventNoteoff, InputEventNoteon } from "webmidi";
import { v4 as uuidv4 } from "uuid";

export default defineComponent({
  emits: ["deviceMounted"],
  setup(props, context) {
    const guid = ref(uuidv4());
    const name = ref("External Midi Device");
    const settings = ref({}); // todo: settings for external?
    const webmidiSupported = ref(true);
    const webmidiError = ref("");
    const selectedExternalDevice = ref("Click to Select Device");
    const availableDevices = ref(new Array<string>());

    const keyPressedColor = "#ff2929";
    const blackKeys = [1, 3, 6, 8, 10];
    const connections = new Array<IMidiReceiver>();
    
    function applySettings(settings: any) {
      // nothing yet
    }

    function connect(receiver: IMidiReceiver) {
      connections.push(receiver);
    }

    function disconnect(receiver: IMidiReceiver) {
      const i = connections.indexOf(receiver);
      if (i > -1) {
        connections.splice(i, 1);
      } else {
        throw `no existing connection to given midi receiver`;
      }
    }

    function displayKeyDown(keyNumber: number) {
      const key: HTMLElement | null = document.querySelector(`#key${keyNumber}`);
      if (key != null) {
        key.style.background = keyPressedColor;
      }
    }

    function displayKeyUp(keyNumber: number) {
      const key: HTMLElement | null = document.querySelector(`#key${keyNumber}`);
      if (key != null) {
        key.style.background = blackKeys.includes(keyNumber % 12)
          ? "black"
          : "white";
      }
    }

    function sendMidi(message: IMidiMessage) {
      connections.forEach(r => {
        r.receiveMidi(message);
      });
    }

    function receiveMidi(message: IMidiMessage) {
      switch (message.midiFunction) {
        case MidiFunction.noteon:
          Draw.schedule(() => {
            displayKeyDown(message.noteNumber);
          }, immediate());
          sendMidi(message);
          break;
        case MidiFunction.noteoff:
          Draw.schedule(() => {
            displayKeyUp(message.noteNumber);
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
      displayKeyDown(e.note.number);
    }

    function extNoteOff(e: InputEventNoteoff) {
      sendMidi({
        midiFunction: MidiFunction.noteoff,
        noteNumber: e.note.number,
        noteVelocity: Math.round(e.velocity * 127)
      });
      displayKeyUp(e.note.number);
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
      externalDeviceSelected
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
ul {
  list-style: none;
  display: flex;
  background-color: black;
  padding-left: 0px;
  border-radius: 5px; /* should be the same as ul .key */
}
ul .key {
  position: relative;
  width: 30px;
  height: 130px;
  border: 1px solid black;
  border-right: none;
  background: #ffffff;
  border-radius: 5px;
  /* box-shadow: 0px 3px 5px #666; */
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding-bottom: 10px;
  font-weight: bold;
  user-select: none;
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
  user-select: none;
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
