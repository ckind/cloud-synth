<template>
  <div class="device-window">
    <v-row class="device-header">
      <v-col cols="2">
        <device-dropdown
          @deviceSelected="deviceSelected"
          :devices="availableMidiDevices"
          :selectedDeviceName="currentDeviceName"
          label="midi devices"
        />
      </v-col>
      <v-col cols="2">
        <preset-dropdown
          @presetSelected="presetSelected"
          :bank="currentBank"
          :selectedPreset="currentPreset"
          label="presets"
        />
      </v-col>
    </v-row>
    <div ref="deviceContainer" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { IVueMidiDeviceContainer } from "../shared/interfaces/containers/IVueMidiDeviceContainer";
import { IVueMidiDevice } from "../shared/interfaces/devices/IVueMidiDevice";
import { IPreset } from "../shared/interfaces/presets/IPreset";
import { IPresetBank } from "../shared/interfaces/presets/IPresetBank";
import { IPresetService } from "../shared/interfaces/presets/IPresetService";
import { getDefaultComputerMidiKeyboardBank } from "@/services/LocalDefaults";
import JvaSynth from "./JvaSynth.vue";
import PresetDropdown from "./PresetDropdown.vue";
import DeviceDropdown from "./DeviceDropdown.vue";

@Component({
  components: {
    JvaSynth,
    PresetDropdown,
    DeviceDropdown
  }
})
export default class MidiDeviceContainer extends Vue
  implements IVueMidiDeviceContainer {
  currentPreset: IPreset;
  currentBank: IPresetBank;
  currentDeviceName: string;
  availableMidiDevices: string[];

  $refs!: {
    deviceContainer: Element;
  };
  @Prop({ required: true })
  public device!: IVueMidiDevice;

  @Prop({ required: true })
  public presetService!: IPresetService;

  public constructor() {
    super();
    this.currentBank = getDefaultComputerMidiKeyboardBank(); // todo: need default bank for midi device
    this.currentPreset = this.currentBank.categories[0].presets[0];
    this.device.settings = this.currentPreset.settings;
    this.availableMidiDevices = ["Keypad", "Step Sequencer", "External"];
    this.currentDeviceName = this.availableMidiDevices[0];
  }

  // Lifecycle Hooks

  mounted() {
    // todo: this goes against the standard lifecycle (children mount before parent) - maybe rethink design?
    this.device.$mount(this.$refs.deviceContainer);
    this.loadFactoryPresets().then(() => {
      console.log(`loaded preset bank ${this.currentBank._id}`);
    });
  }

  // Methods

  async loadFactoryPresets() {
    this.currentBank = await this.presetService.getFactoryBank();
    this.currentPreset = this.currentBank.categories[0].presets[0];
    this.device.settings = this.currentPreset.settings;
  }

  presetSelected(p: IPreset) {
    // todo: apply settings to midi device
  }

  deviceSelected(deviceName: string) {
    this.currentDeviceName = deviceName;
    // todo: actually change device
  }
}
</script>

<style scoped>
.device-header {
  background-color: black;
  color: white;
}
.device-window {
  border: 12px solid black;
  border-radius: 12px;
}
</style>
