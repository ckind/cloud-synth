<template>
  <div class="device-window">
    <v-row class="device-header" v-show="!$vuetify.breakpoint.mobile">
      <v-col cols="2">
        <!-- <preset-dropdown
          @presetSelected="presetSelected"
          :bank="currentBank"
          :selectedPreset="currentPreset"
          label="presets"
        /> -->
      </v-col>
      <v-col cols="2">
        <!-- <preset-dropdown
          @presetSelected="presetSelected"
          :bank="currentBank"
          :selectedPreset="currentPreset"
          label="presets"
        /> -->
      </v-col>
      <v-col cols="2">
        <!-- <preset-dropdown
          @presetSelected="presetSelected"
          :bank="currentBank"
          :selectedPreset="currentPreset"
          label="presets"
        /> -->
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
        <v-icon dark> mdi-swap-horizontal </v-icon>
        {{ currentDeviceName }}
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
      <effects-rack ref="effectsRack" @deviceMounted="newDeviceMounted" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { IEffectsContainer } from "../shared/interfaces/containers/IEffectsContainer";
import { IPreset } from "../shared/interfaces/presets/IPreset";
import { IPresetBank } from "../shared/interfaces/presets/IPresetBank";
import { IPresetService } from "../shared/interfaces/presets/IPresetService";
import { PresetServiceFactory } from "@/shared/factories/PresetServiceFactory";
import EffectsRack from "@/components/EffectsRack.vue";

@Component({
  components: {
    EffectsRack,
  },
})
export default class EffectsDeviceContainer
  extends Vue
  implements IEffectsContainer {
  currentPreset: IPreset;
  currentBank: IPresetBank;
  currentDeviceName: string;
  presetService: IPresetService;

  private expanded = true;

  $refs!: {
    effectsRack: EffectsRack;
  };

  public constructor() {
    super();
    this.currentDeviceName = "Effects Chain";
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
    return this.$refs.effectsRack;
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
      console.log(
        // `loaded ${this.device.name} preset bank ${this.currentBank._id}`
      );
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
</style>
