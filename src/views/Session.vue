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
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { context as ToneContext, Master as ToneMaster } from "tone";
import InstrumentContainer from "@/components/InstrumentContainer.vue";
import MidiDeviceContainer from "@/components/MidiDeviceContainer.vue";

@Component({
  components: {
    InstrumentContainer,
    MidiDeviceContainer
  }
})
export default class Session extends Vue {
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
  }

  // Methods

  newInstrumentDeviceMounted() {
    this.$refs.instrumentContainer.device.output.connect(ToneMaster);
    // todo: disconnect?
  }

  newMidiDeviceMounted() {
    this.$refs.midiDeviceContainer.device.connect(
      this.$refs.instrumentContainer.device
    );
    // don't worry about disconnect - this is cleaned up in the beforeDestroy hook for midi devices
  }
}
</script>

<style scoped>
.session-container {
  padding: 10px;
}
</style>
