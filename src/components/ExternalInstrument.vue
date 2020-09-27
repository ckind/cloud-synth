<template>
  <div class="synth-panel">
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
    <!-- <v-menu bottom offset-y v-else>
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
    </v-menu> -->
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Gain as ToneGain, Filter as ToneFilter } from "tone";
import { IMidiMessage } from "@/shared/interfaces/midi/IMidiMessage";
import { IInstrumentDevice } from "@/shared/interfaces/devices/IInstrumentDevice";

@Component({})
export default class ExternalInstrument extends Vue implements IInstrumentDevice {
  name = "External";
  output: ToneGain;
  settings = {};

  private selectedExternalDevice = "Click to Select Device";
  private webmidiSupported = true;
  private webmidiError = "";
  private availableDevices: string[] = ["device 1", "device 2", "device 3"];

  public constructor() {
    super();

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

  applySettings(settings: any) {
    // nothing here
  }

  dispose() {
    // todo: cleanup
  }

  receiveMidi(message: IMidiMessage) {
    // todo: send midi to ext instrument
  }

  // Watches
}
</script>

<style scoped>
div.synth-panel {
  justify-content: center;
  background-color: black;
  position: relative;
  height: 200px;
}
div.synth-panel::after {
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
</style>
