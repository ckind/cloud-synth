<template>
  <div class="device-window">
    <v-row class="device-header" v-show="!$vuetify.breakpoint.mobile">
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
      <v-col cols="8">
        <v-icon v-if="expanded" dark class="expand-icon" @click="expanded = false">
          mdi-chevron-down
        </v-icon>
        <v-icon v-else dark class="expand-icon" @click="expanded = true">
          mdi-chevron-left
        </v-icon>
      </v-col>
    </v-row>
    <v-row class="device-header" v-show="$vuetify.breakpoint.mobile">
      <v-col cols="12">
        <v-icon dark>
          mdi-swap-horizontal
        </v-icon>
        {{ currentDeviceName }}
        <v-icon v-if="expanded" dark class="expand-icon" @click="expanded = false">
          mdi-chevron-down
        </v-icon>
        <v-icon v-else dark class="expand-icon" @click="expanded = true">
          mdi-chevron-left
        </v-icon>
      </v-col>
    </v-row>
    <div v-show="expanded">
      <computer-midi-keyboard
        ref="keypad"
        @deviceMounted="newDeviceMounted"
        v-if="currentDeviceName === 'Keypad'"
      />
      <external-midi-device
        ref="external"
        @deviceMounted="newDeviceMounted"
        v-if="currentDeviceName === 'External'"
      />
      <step-sequencer-v-2
        ref="stepSequencer"
        @deviceMounted="newDeviceMounted"
        v-if="currentDeviceName === 'Step Sequencer'"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { IMidiDeviceContainer } from "../shared/interfaces/containers/IMidiDeviceContainer";
import { IPreset } from "../shared/interfaces/presets/IPreset";
import { IPresetBank } from "../shared/interfaces/presets/IPresetBank";
import { IPresetService } from "../shared/interfaces/presets/IPresetService";
import { getDefaultKeypadBank } from "@/services/OfflinePresetService";
import PresetDropdown from "./PresetDropdown.vue";
import DeviceDropdown from "./DeviceDropdown.vue";
import ComputerMidiKeyboard from "./ComputerMidiKeyboard.vue";
import ExternalMidiDevice from "./ExternalMidiDevice.vue";
import StepSequencerV2 from "./StepSequencer.vue";
import { IMidiDevice } from "@/shared/interfaces/devices/IMidiDevice";
import { PresetServiceFactory } from "@/shared/factories/PresetServiceFactory";

@Component({
  components: {
    PresetDropdown,
    DeviceDropdown,
    ComputerMidiKeyboard,
    ExternalMidiDevice,
    StepSequencerV2
  }
})
export default class MidiDeviceContainer extends Vue
  implements IMidiDeviceContainer {
  private presetService: IPresetService;
  private currentPreset: IPreset;
  private currentBank: IPresetBank;
  private currentDeviceName: string;
  private availableMidiDevices = ["Keypad", "Step Sequencer", "External"];

  private expanded = true;

  $refs!: {
    keypad: ComputerMidiKeyboard;
    external: ExternalMidiDevice;
    stepSequencer: StepSequencerV2;
  };

  public constructor() {
    super();
    this.currentDeviceName = this.availableMidiDevices[1];
    this.presetService = PresetServiceFactory.getPresetService(
      this.currentDeviceName
    );
    this.currentBank = getDefaultKeypadBank(); // todo: load from local json file
    this.currentPreset = this.currentBank.categories[0].presets[0];
  }

  // Lifecycle Hooks

  mounted() {
    this.device.applySettings(this.currentPreset.settings);
  }

  // Computed

  get device() {
    // todo: better implementation than switch?
    let currentDevice: IMidiDevice;
    switch (this.currentDeviceName) {
      case "Keypad":
        currentDevice = this.$refs.keypad;
        break;
      case "Step Sequencer":
        currentDevice = this.$refs.stepSequencer;
        break;
      case "External":
        currentDevice = this.$refs.external;
        break;
      default:
        throw `Invalid Device Name ${this.currentDeviceName}`;
    }
    return currentDevice;
  }

  // Methods

  async loadFactoryPresets() {
    this.currentBank = await this.presetService.getFactoryBank();
    this.currentPreset = this.currentBank.categories[0].presets[0];
    this.device.applySettings(this.currentPreset.settings);
  }

  presetSelected(p: IPreset) {
    // todo: apply settings to midi device
  }

  deviceSelected(deviceName: string) {
    if (this.currentDeviceName != deviceName) {
      this.currentDeviceName = deviceName;
    }
  }

  newDeviceMounted() {
    this.loadFactoryPresets().then(() => {
      console.log(
        `loaded ${this.device.name} preset bank ${this.currentBank._id}`
      );
    });
    this.$emit("newDeviceMounted");
    console.log(`mounted device ${this.device.name}`);
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
  width: 100%;
  max-width: 1400px;
}
.expand-icon {
  float: right;
}
</style>
