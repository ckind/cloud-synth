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
        v-if="currentDeviceName === 'External Instrument'"
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
import { defineComponent, ref } from "vue";
import { useDeviceContainer } from "@/composables/useDeviceContainer";
import { IInstrumentDevice } from "../shared/interfaces/devices/IInstrumentDevice";
import JvaSynth from "./JvaSynth.vue";
import PresetDropdown from "./PresetDropdown.vue";
import DeviceDropdown from "./DeviceDropdown.vue";
import ExternalInstrument from "./ExternalInstrument.vue";
import DeviceContainerModal from "./DeviceContainerModal.vue";
import Piano from "./Piano.vue";

export default defineComponent ({
  emits: ["newDeviceMounted"],
  components: {
    JvaSynth,
    ExternalInstrument,
    Piano,
    PresetDropdown,
    DeviceDropdown,
    DeviceContainerModal
  },
  setup(props, context) {
    const expanded = ref(true);
    const showModal = ref(false);

    const jvaPoly = ref<IInstrumentDevice | null>(null);
    const piano = ref<IInstrumentDevice | null>(null);
    const external = ref<IInstrumentDevice | null>(null);
    const availableDevices = ref([
      "Jva Poly",
      "Piano",
      "External Instrument"
    ]);

    const deviceRefs = [jvaPoly, piano, external];

    const {
      currentDeviceName,
      currentBank,
      currentPreset,
      device,
      loadFactoryPresets,
      deviceSelected,
      newDeviceMounted,
      downloadCurrentSettings,
      uploadSettings,
      applyCustomSettings,
      presetSelected
    } = useDeviceContainer("Jva Poly", deviceRefs, context);

    return {
      deviceSelected,
      presetSelected,
      newDeviceMounted,
      downloadCurrentSettings,
      uploadSettings,
      applyCustomSettings,
      availableDevices,
      currentDeviceName,
      currentBank,
      currentPreset,
      expanded,
      showModal,
      jvaPoly,
      piano,
      external
    }
  }
});

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
