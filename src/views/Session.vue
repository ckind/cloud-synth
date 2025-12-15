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
    <v-footer dark app class="session-footer" style="background: black">
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
import { defineComponent, onBeforeUnmount, onMounted, ref, watch } from "vue";
import {
  context as ToneContext,
  Destination as ToneDestination,
  Transport as ToneTransport,
  Recorder as ToneRecorder
} from "tone";
import InstrumentContainer from "@/components/InstrumentContainer.vue";
import MidiDeviceContainer from "@/components/MidiDeviceContainer.vue";
import EffectsDeviceContainer from "@/components/EffectsContainer.vue";
import { IMidiDevice } from "@/shared/interfaces/devices/IMidiDevice";
import { IInstrumentDevice } from "@/shared/interfaces/devices/IInstrumentDevice";
import { IEffectsDevice } from "@/shared/interfaces/devices/IEffectsDevice";

export default defineComponent({
  components: {
    InstrumentContainer,
    MidiDeviceContainer,
    EffectsDeviceContainer,
  },
  setup(props, context) {
    // #region refs

    const recorderStreamDestination = ToneContext.createMediaStreamDestination();
    ToneDestination.connect(recorderStreamDestination);

    const bpm = ref(120);
    const transportRunning = ref(ToneTransport.state === "started");
    const recording = ref(false);
    const recorder = ref<MediaRecorder>(new MediaRecorder(recorderStreamDestination.stream, {mimeType: "audio/webm"}));
    const recorderChunks = ref<BlobPart[]>([]);
    const currentMidiDevice = ref<IMidiDevice>();
    const currentInstrumentDevice = ref<IInstrumentDevice>();
    const currentEffectsDevice = ref<IEffectsDevice>();

    recorderChunks.value = [] as BlobPart[];
    recorder.value.ondataavailable = (e) => {
      recorderChunks.value.push(e.data);
    }
    recorder.value.onstop = (e) => {
      // todo: wav download
      const recording = new Blob(recorderChunks.value, {"type": "audio/webm"});
      const url = (window.URL ? window.URL : window.webkitURL).createObjectURL(recording);
      const anchor = document.createElement("a");
      anchor.download = "cloudsynth.webm";
      anchor.href = url;
      anchor.click();
      recorderChunks.value = [];
    }

    ToneTransport.bpm.value = bpm.value;

    watch(bpm, (v: number) => {
      ToneTransport.bpm.value = v;
    });

    const midiDeviceContainer = ref<Vue>();
    const instrumentContainer = ref<typeof InstrumentContainer>();
    const effectsDeviceContainer = ref<typeof EffectsDeviceContainer>();

    // #endregion

    // hack for making sure audio context starts right away
    const resumeAudio = () => {
      if (ToneContext.state !== "running") {
        ToneContext.resume();
        console.log("context resumed!");
      }
    };

    onMounted(() => {
      document.documentElement.addEventListener("mousedown", resumeAudio);
      document.documentElement.addEventListener("touchstart", resumeAudio);
    });

    onBeforeUnmount(() => {
      document.documentElement.removeEventListener("mousedown", resumeAudio);
      document.documentElement.removeEventListener("touchstart", resumeAudio);
    });

    // #region Methods

    const reconnectDevices = function() {
      // todo: could connect same devices multiple times
      // for now this is ok since each device only has one input
      // https://developer.mozilla.org/en-US/docs/Web/API/AudioNode/connect

      if (currentMidiDevice.value && currentInstrumentDevice.value && currentEffectsDevice.value) {
        // throws exceptions if already disconnected
        
        // this.currentMidiDevice.disconnect(this.currentInstrumentDevice);
        currentMidiDevice.value.connect(currentInstrumentDevice.value);

        // this.currentInstrumentDevice.output.disconnect(this.currentEffectsDevice.input);
        currentInstrumentDevice.value.output.connect(currentEffectsDevice.value.input);

        // this.currentEffectsDevice.output.disconnect(ToneDestination);
        currentEffectsDevice.value.output.connect(ToneDestination);
      }
    }

    const newInstrumentDeviceMounted = function(device: IInstrumentDevice) {
      currentInstrumentDevice.value = device;
      reconnectDevices();
    }

    const newMidiDeviceMounted = function(device: IMidiDevice) {
      currentMidiDevice.value = device;
      reconnectDevices();
    }

    const newEffectsDeviceMounted = function(device: IEffectsDevice) {
      currentEffectsDevice.value = device;
      reconnectDevices();
    }

    const startStopTransport = function() {
      if (ToneTransport.state === "started") {
        ToneTransport.stop();
        transportRunning.value = false;
      } else {
        ToneTransport.start();
        transportRunning.value = true;
      }
    }

    const startStopRecording = async function() {
      if (recording.value) {
        recorder.value.stop();
        recording.value = false;
      } else {
        recorder.value.start();
        recording.value = true;
      }
    }

    // #endregion

  
    return {
      bpm,
      transportRunning,
      recording,
      recorderChunks,
      currentMidiDevice,
      currentInstrumentDevice,
      currentEffectsDevice,
      midiDeviceContainer,
      instrumentContainer,
      effectsDeviceContainer,
      newInstrumentDeviceMounted,
      newMidiDeviceMounted,
      newEffectsDeviceMounted,
      startStopTransport,
      startStopRecording,
    };
  },
});

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
