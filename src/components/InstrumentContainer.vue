<template>
  <div class="device-window">
    <v-row class="device-header">
      <v-col cols="2">
        <device-dropdown
          @deviceSelected="instrumentSelected"
          :selectedDeviceName="currentInstrumentName"
          :devices="availableInstruments"
          label="instruments"
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
      <v-col cols="2">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <div class="preset-icon">
              <v-icon dark v-on="on" @click="downloadCurrentSettings">
                save
              </v-icon>
            </div>
          </template>
          <p>Export Current Settings</p>
          <p>
            Please note that CloudSynth is under active development and there is
            no guaranteed support for legacy presets at this time.
          </p>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <div class="preset-icon">
              <v-icon dark v-on="on" @click="uploadSettings">
                file_upload
              </v-icon>
            </div>
          </template>
          <span>Import Custom Settings</span>
        </v-tooltip>
        <input
          @change="applyCustomSettings"
          type="file"
          id="uploadSettingsInput"
          style="display:none"
        />
      </v-col>
    </v-row>
    <div ref="deviceContainer" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { IVueInstrumentContainer } from "../shared/interfaces/containers/IVueInstrumentContainer";
import { IVueInstrumentDevice } from "../shared/interfaces/devices/IVueInstrumentDevice";
import { IPreset } from "../shared/interfaces/presets/IPreset";
import { IPresetBank } from "../shared/interfaces/presets/IPresetBank";
import { IPresetService } from "../shared/interfaces/presets/IPresetService";
import { getDefaultJvaBank } from "@/services/LocalDefaults";
import { Master as ToneMaster } from "tone";
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
export default class InstrumentContainer extends Vue
  implements IVueInstrumentContainer {
  currentPreset: IPreset;
  currentBank: IPresetBank;
  availableInstruments: string[];
  currentInstrumentName: string;

  $refs!: {
    deviceContainer: Element;
  };
  @Prop({ required: true })
  public device!: IVueInstrumentDevice;

  @Prop({ required: true })
  public presetService!: IPresetService;

  public constructor() {
    super();
    this.availableInstruments = ["Jva Poly", "Jva Drummachine"];
    this.currentInstrumentName = this.availableInstruments[0];
    this.currentBank = getDefaultJvaBank();
    this.currentPreset = this.currentBank.categories[0].presets[0];
    this.device.applySettings(this.currentPreset.settings);
    this.device.output.connect(ToneMaster);
  }

  // Lifecycle Hooks

  mounted() {
    this.device.$mount(this.$refs.deviceContainer);
    this.loadFactoryPresets().then(() => {
      console.log(`loaded preset bank ${this.currentBank._id}`);
    });
  }

  // Methods

  async loadFactoryPresets() {
    this.currentBank = await this.presetService.getFactoryBank();
    this.currentPreset = this.currentBank.categories[0].presets[0];
    this.device.applySettings(this.currentPreset.settings);
  }

  instrumentSelected(instrumentName: string) {
    if (instrumentName != this.currentInstrumentName) {
      this.currentInstrumentName = instrumentName;
      this.$emit("deviceChanged", instrumentName);
    }
  }

  downloadCurrentSettings() {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(this.device.settings));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "savedPreset.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

  uploadSettings() {
    const input = document.querySelector("#uploadSettingsInput") as HTMLElement;
    input.click();
  }

  applyCustomSettings(e: Event) {
    const input = e.target as HTMLInputElement;
    if (!input.files) return;
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = e => {
      const jsonSettings = e.target!.result as string;
      this.device.applySettings(JSON.parse(jsonSettings));
      this.currentPreset = {
        name: file.name,
        version: 0,
        private: true,
        settings: this.device.settings
      };
    };
    reader.readAsText(file);
  }

  presetSelected(p: IPreset) {
    this.currentPreset = p;
    this.device.applySettings(p.settings);
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
.cursor-pointer {
  cursor: pointer;
}
.preset-icon {
  padding-right: 10px;
  display: inline;
}
</style>
