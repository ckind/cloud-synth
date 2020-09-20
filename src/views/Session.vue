<template>
  <div class="session-container">
    <instrument-container
      ref="instrumentContainer"
      :device="currentInstrument"
      :presetService="instrumentPresets"
      @deviceChanged="onInstrumentDeviceChanged"
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
import { context as ToneContext } from "tone";
import { IPresetService } from "@/shared/interfaces/presets/IPresetService";
import { IVueInstrumentDevice } from "@/shared/interfaces/devices/IVueInstrumentDevice";
import { PresetServiceFactory } from "@/shared/factories/PresetServiceFactory";
import { VueInstrumentDeviceFactory } from "@/shared/factories/VueInstrumentDeviceFactory";
import InstrumentContainer from "@/components/InstrumentContainer.vue";
import MidiDeviceContainer from "@/components/MidiDeviceContainer.vue";

@Component({
  components: {
    InstrumentContainer,
    MidiDeviceContainer
  }
})
export default class Session extends Vue {
  private currentInstrument: IVueInstrumentDevice;
  private instrumentPresets: IPresetService;
  private midiDevicePresets: IPresetService;

  $refs!: {
    midiDeviceContainer: MidiDeviceContainer;
    instrumentContainer: InstrumentContainer;
  };

  public constructor() {
    super();
    this.currentInstrument = VueInstrumentDeviceFactory.getInstrumentDevice("Jva Poly");
    this.instrumentPresets = PresetServiceFactory.getPresetService("Jva Poly");
    this.midiDevicePresets = PresetServiceFactory.getPresetService("External");

    // hack for making sure audio context starts right away
    document.documentElement.addEventListener("mousedown", function() {
      if (ToneContext.state !== "running") {
        ToneContext.resume();
        console.log("context resumed!");
      }
    });
  }

  // Methods

  onInstrumentDeviceChanged(deviceName: string) {
    console.log(deviceName);
  }

  newMidiDeviceMounted() {
    this.$refs.midiDeviceContainer.device.connect(this.currentInstrument);
    // don't worry about disconnect - this is cleaned up in the beforeDestroy hook for midi devices
  }
}
</script>

<style scoped>
.session-container {
  padding: 10px;
}
</style>
