<template>
  <div class="session-container">
    <instrument-container
      ref="instrumentContainer"
      @newDeviceMounted="newInstrumentDeviceMounted"
    >
    </instrument-container>
    <effects-device-container
      ref="effectsDeviceContainer"
      @newDeviceMounted="newEffectsDeviceMounted"
    />
    <midi-device-container
      ref="midiDeviceContainer"
      @newDeviceMounted="newMidiDeviceMounted"
    />
    <v-footer dark app class="session-footer" style="background: black;">
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
  Destination as ToneDestination,
  Transport as ToneTransport
} from "tone";
import InstrumentContainer from "@/components/InstrumentContainer.vue";
import MidiDeviceContainer from "@/components/MidiDeviceContainer.vue";
import EffectsDeviceContainer from "@/components/EffectsContainer.vue";

@Component({
  components: {
    InstrumentContainer,
    MidiDeviceContainer,
    EffectsDeviceContainer
  }
})
export default class Session extends Vue {
  private bpm = 120;
  private transportRunning = false;
  private recording = false;

  $refs!: {
    midiDeviceContainer: MidiDeviceContainer;
    instrumentContainer: InstrumentContainer;
    effectsDeviceContainer: EffectsDeviceContainer;
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
    this.$refs.instrumentContainer.device.output.connect( // relies on internal dispose method for disconnection
      this.$refs.effectsDeviceContainer.device.input
    );
    this.$refs.midiDeviceContainer.device.connect(
      this.$refs.instrumentContainer.device
    );
  }

  newMidiDeviceMounted() {
    this.$refs.midiDeviceContainer.device.connect( // relies on internal dispose method for disconnection
      this.$refs.instrumentContainer.device
    );
  }

  newEffectsDeviceMounted() {
    // todo: do we need to disconnect the input before destroy?

    this.$refs.effectsDeviceContainer.device.output.connect(ToneDestination); // relies on internal dispose method for disconnection
    this.$refs.instrumentContainer.device.output.connect( // relies on internal dispose method for disconnection
      this.$refs.effectsDeviceContainer.device.input
    ); 
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
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: 10px;
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
