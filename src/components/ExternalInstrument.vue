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
import { Component, Vue } from "vue-property-decorator";
import { Gain as ToneGain, Filter as ToneFilter, Transport as ToneTransport, immediate as toneImmediate, Midi as ToneMidi } from "tone";
import { IMidiMessage, MidiFunction } from "@/shared/interfaces/midi/IMidiMessage";
import { IInstrumentDevice } from "@/shared/interfaces/devices/IInstrumentDevice";
import webmidi, { InputEventNoteoff, InputEventNoteon, Output, INoteParam } from "webmidi";
import { v4 as uuidv4 } from "uuid";

@Component({})
export default class ExternalInstrument extends Vue implements IInstrumentDevice {
  guid: string;
  name = "External";
  output: ToneGain;
  settings = {};

  private selectedExternalDevice = "Click to Select Device";
  private selectedOutput: Output | false = false;
  private webmidiSupported = true;
  private webmidiError = "";
  private availableDevices: string[] = [];

  public constructor() {
    super();

    this.guid = uuidv4();

    webmidi.enable(err => {
      if (err) {
        this.webmidiSupported = false;
        this.webmidiError = err ? err.message : "";
      } else {
        webmidi.outputs.forEach(output => {
          this.availableDevices.push(output.name);
        });
      }
    });

    // output does nothing for external instrument
    this.output = new ToneGain(0);
  }

  // Lifecycle Hooks

  mounted() {
    this.$emit("deviceMounted");
  }

  beforeDestroy() {
    this.dispose();
  }

  // Methods

  externalDeviceSelected(deviceName: string) {
    // todo: implement
    this.selectedExternalDevice = deviceName;
    this.selectedOutput = webmidi.getOutputByName(deviceName);
  }

  applySettings(settings: any) {
    // nothing to see here
  }

  dispose() {
    // todo: cleanup
  }

  receiveMidi(message: IMidiMessage, time?: number) {
    // todo: this has inaccurate timing when used with step sequencer
    if (this.selectedOutput) {
      switch (message.midiFunction) {
        case MidiFunction.noteon:
          // ToneTransport.scheduleOnce(() => {
          //   if (this.selectedOutput) {
          //     this.selectedOutput.playNote("C4", "all");
          //   }
          // }, time !== undefined ? time : toneImmediate());
          this.selectedOutput.playNote(message.noteNumber, "all");
          break;
        case MidiFunction.noteoff:
          // ToneTransport.scheduleOnce(() => {
          //   if (this.selectedOutput) {
          //     this.selectedOutput.stopNote("C4", "all");
          //   }
          // }, time !== undefined ? time : toneImmediate());
          this.selectedOutput.stopNote(message.noteNumber, "all");
          break;
      }
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
