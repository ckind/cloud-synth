<template>
  <div class="session-container">
    <instrument-container
      :device="currentInstrument"
      :presetService="instrumentPresets"
    >
    </instrument-container>
    <midi-device-container
      :device="currentMidiDevice"
      :presetService="midiDevicePresets"
    >
    </midi-device-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { context as ToneContext } from "tone";
import { JvaPresetService } from "@/services/JvaPresetService";
import { ComputerMidiKeyboardPresetService } from "@/services/ComputerMidiKeyboardPresetService";
import { IPresetService } from "@/shared/interfaces/presets/IPresetService";
import { IVueInstrumentDevice } from "@/shared/interfaces/devices/IVueInstrumentDevice";
import { IVueMidiDevice } from "@/shared/interfaces/devices/IVueMidiDevice";
import InstrumentContainer from "@/components/InstrumentContainer.vue";
import MidiDeviceContainer from "@/components/MidiDeviceContainer.vue";
import JvaSynth from "@/components/JvaSynth.vue";
import ComputerMidiKeyboard from "@/components/ComputerMidiKeyboard.vue";

@Component({
  components: {
    InstrumentContainer,
    MidiDeviceContainer,
    JvaSynth,
    ComputerMidiKeyboard
  }
})
export default class Session extends Vue {
  private instrumentPresets: IPresetService;
  private midiDevicePresets: IPresetService;
  private currentInstrument: IVueInstrumentDevice;
  private currentMidiDevice: IVueMidiDevice;

  public constructor() {
    super();
    this.currentInstrument = new JvaSynth();
    this.currentMidiDevice = new ComputerMidiKeyboard();
    this.instrumentPresets = new JvaPresetService();
    this.midiDevicePresets = new ComputerMidiKeyboardPresetService();

    this.currentMidiDevice.connect(this.currentInstrument);

    // hack for making sure audio context starts right away
    document.documentElement.addEventListener("mousedown", function() {
      if (ToneContext.state !== "running") {
        ToneContext.resume();
        console.log("context resumed!");
      }
    });
  }

  // Lifecycle Hooks

  // Computed
}
</script>

<style scoped>
.session-container {
  padding: 10px;
}
</style>
