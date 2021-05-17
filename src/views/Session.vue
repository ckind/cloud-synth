<template>
  <div class="session-container">
    <instrument-container
      ref="instrumentContainer"
      @newDeviceMounted="newInstrumentDeviceMounted"
    >
    </instrument-container>
    <midi-device-container
      ref="midiDeviceContainer"
      @newDeviceMounted="newMidiDeviceMounted"
    />
    <v-footer app class="session-footer">
      <div class="text-center bpm-bar">
        <v-slider
          hide-details
          dense
          max="240"
          min="40"
          v-model="bpm"
        ></v-slider>
      </div>
      <div class="text-center transport-controls">
        <v-icon
          @click="startStopTransport"
          :class="[transportRunning ? 'transport-running' : '']"
        >
          mdi-play-pause
        </v-icon>
        <v-icon
          @click="startStopRecording"
          :class="[recording ? 'recording' : '']"
        >
          mdi-record
        </v-icon>
      </div>
    </v-footer>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import {
  context as ToneContext,
  Master as ToneMaster,
  Transport as ToneTransport
} from "tone";
import InstrumentContainer from "@/components/InstrumentContainer.vue";
import MidiDeviceContainer from "@/components/MidiDeviceContainer.vue";

@Component({
  components: {
    InstrumentContainer,
    MidiDeviceContainer
  }
})
export default class Session extends Vue {
  private bpm = 120;
  private transportRunning = false;
  private recording = false;

  $refs!: {
    midiDeviceContainer: MidiDeviceContainer;
    instrumentContainer: InstrumentContainer;
  };

  public constructor() {
    super();

    // hack for making sure audio context starts right away
    document.documentElement.addEventListener("mousedown", function() {
      if (ToneContext.state !== "running") {
        ToneContext.resume();
        console.log("context resumed!");
      }
    });

    document.documentElement.addEventListener("touchstart", function() {
      if (ToneContext.state !== "running") {
        ToneContext.resume();
        console.log("context resumed!");
      }
    });

    ToneTransport.bpm.value = this.bpm;
  }

  // Methods

  newInstrumentDeviceMounted() {
    this.$refs.instrumentContainer.device.output.connect(ToneMaster); // relies on dispose method for disconnection
    this.$refs.midiDeviceContainer.device.connect(
      this.$refs.instrumentContainer.device
    );
  }

  newMidiDeviceMounted() {
    this.$refs.midiDeviceContainer.device.connect(
      this.$refs.instrumentContainer.device
    );
    // don't worry about disconnect - this is cleaned up in the beforeDestroy hook for midi devices
  }

  startStopTransport() {
    if (ToneTransport.state === "started") {
      ToneTransport.stop();
      this.transportRunning = false;
    } else {
      ToneTransport.start();
      this.transportRunning = true;
    }
  }

  startStopRecording() {
    if (this.recording) {
      this.recording = false;
    } else {
      this.recording = true;
    }
  }

  // Watches
  @Watch("bpm")
  onBpmChange(v: number) {
    ToneTransport.bpm.value = v;
  }
}
</script>

<style scoped>
.session-container {
  padding: 10px;
}
.session-footer {
  padding: 0px;
  margin: 0px;
  display: flex;
  justify-content: center;
  height: 50px;
  border-top: 1px solid black;
}
.bpm-bar {
  max-width: 600px;
  width: 75%;
}
.transport-running {
  color: #2196f3;
}
.recording {
  color: red;
}
</style>
