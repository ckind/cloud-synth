<template>
  <div class="device-window">
    <v-row class="device-header" v-show="!$vuetify.breakpoint.mobile">
      <v-col cols="2">
        <device-dropdown
          @deviceSelected="deviceSelected"
          :selectedDeviceName="currentDeviceName"
          :devices="availableDevices"
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
          style="display: none"
        />
      </v-col>
      <v-col cols="6">
        <v-icon
          v-if="expanded"
          dark
          class="expand-icon"
          @click="expanded = false"
        >
          mdi-chevron-down
        </v-icon>
        <v-icon v-else dark class="expand-icon" @click="expanded = true">
          mdi-chevron-left
        </v-icon>
      </v-col>
    </v-row>
    <v-row class="device-header" v-show="$vuetify.breakpoint.mobile">
      <v-col cols="12">
        <span class="modal-link" @click="(e) => (showModal = true)">
          <v-icon dark> mdi-swap-horizontal </v-icon>
          {{ currentDeviceName }}
        </span>
        <v-icon
          v-if="expanded"
          dark
          class="expand-icon"
          @click="expanded = false"
        >
          mdi-chevron-down
        </v-icon>
        <v-icon v-else dark class="expand-icon" @click="expanded = true">
          mdi-chevron-left
        </v-icon>
      </v-col>
    </v-row>
    <div v-show="expanded">
      <jva-synth
        ref="jvaPoly"
        @deviceMounted="newDeviceMounted"
        v-if="currentDeviceName === 'Jva Poly'"
      />
      <piano
        ref="piano"
        @deviceMounted="newDeviceMounted"
        v-if="currentDeviceName === 'Piano'"
      />
      <external-instrument
        ref="external"
        @deviceMounted="newDeviceMounted"
        v-if="currentDeviceName === 'External'"
      />
    </div>
    <device-container-modal
      :currentPresetBank="currentBank"
      :currentPreset="currentPreset"
      @presetSelected="presetSelected"
      :currentDeviceName="currentDeviceName"
      :availableDevices="availableDevices"
      @deviceSelected="deviceSelected"
      v-model="showModal"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { IInstrumentContainer } from "../shared/interfaces/containers/IInstrumentContainer";
import { IInstrumentDevice } from "../shared/interfaces/devices/IInstrumentDevice";
import { IPreset } from "../shared/interfaces/presets/IPreset";
import { IPresetBank } from "../shared/interfaces/presets/IPresetBank";
import { IPresetService } from "../shared/interfaces/presets/IPresetService";
import { PresetServiceFactory } from "@/shared/factories/PresetServiceFactory";
import JvaSynth from "./JvaSynth.vue";
import PresetDropdown from "./PresetDropdown.vue";
import DeviceDropdown from "./DeviceDropdown.vue";
import ExternalInstrument from "./ExternalInstrument.vue";
import DeviceContainerModal from "./DeviceContainerModal.vue";
import Piano from "./Piano.vue";

@Component({
  components: {
    JvaSynth,
    ExternalInstrument,
    Piano,
    PresetDropdown,
    DeviceDropdown,
    DeviceContainerModal,
  },
})
export default class InstrumentContainer
  extends Vue
  implements IInstrumentContainer {
  currentPreset: IPreset;
  currentBank: IPresetBank;
  presetService: IPresetService;
  availableDevices: string[];
  currentDeviceName: string;

  private expanded = true;
  private showModal = false;

  $refs!: {
    jvaPoly: JvaSynth;
    external: ExternalInstrument;
    piano: Piano;
  };

  public constructor() {
    super();
    this.availableDevices = ["Jva Poly", "Piano", "External"];
    this.currentDeviceName = this.availableDevices[0];
    this.presetService = PresetServiceFactory.getPresetService(
      this.currentDeviceName
    );
    this.currentBank = this.presetService.getLocalBank();
    this.currentPreset = this.currentBank.categories[0].presets[0];
  }

  // Lifecycle Hooks

  mounted() {
    this.device.applySettings(this.currentPreset.settings);
  }

  // Computed

  get device() {
    // todo: better implementation than switch?
    let currentDevice: IInstrumentDevice;
    switch (this.currentDeviceName) {
      case "Jva Poly":
        currentDevice = this.$refs.jvaPoly;
        break;
      case "External":
        currentDevice = this.$refs.external; 
        break;
      case "Piano":
        currentDevice = this.$refs.piano;
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

  deviceSelected(deviceName: string) {
    if (this.currentDeviceName != deviceName) {
      this.currentDeviceName = deviceName;
      this.presetService = PresetServiceFactory.getPresetService(
        this.currentDeviceName
      );
      this.currentBank = this.presetService.getLocalBank();
      this.currentPreset = this.currentBank.categories[0].presets[0];
    }
  }

  newDeviceMounted() {
    this.loadFactoryPresets().then(() => {
      // console.log(
      //   `loaded ${this.device.name} preset bank ${this.currentBank._id}`
      // );
    });
    this.$emit("newDeviceMounted", this.device);
    console.log(`mounted device ${this.device.name}`);
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
    reader.onload = (e) => {
      const jsonSettings = e.target!.result as string;
      this.device.applySettings(JSON.parse(jsonSettings));
      this.currentPreset = {
        name: file.name,
        version: 0,
        private: true,
        settings: this.device.settings,
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
  width: 100%;
  max-width: 1400px;
}
.cursor-pointer {
  cursor: pointer;
}
.preset-icon {
  padding-right: 10px;
  display: inline;
}
.expand-icon {
  float: right;
}
.modal-link:active {
  opacity: 0.5;
}
</style>
