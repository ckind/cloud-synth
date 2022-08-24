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
      <step-sequencer
        ref="stepSequencer"
        @deviceMounted="newDeviceMounted"
        v-if="currentDeviceName === 'Step Sequencer'"
      />
    </div>
    <device-container-modal
      :currentPresetBank="currentBank"
      :currentPreset="currentPreset"
      @presetSelected="presetSelected"
      :currentDeviceName="currentDeviceName"
      :availableDevices="availableMidiDevices"
      @deviceSelected="deviceSelected"
      v-model="showModal"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from "vue";
import { IPreset } from "../shared/interfaces/presets/IPreset";
import { getDefaultKeypadBank } from "@/services/OfflinePresetService";
import PresetDropdown from "./PresetDropdown.vue";
import DeviceDropdown from "./DeviceDropdown.vue";
import ComputerMidiKeyboard from "./ComputerMidiKeyboard.vue";
import ExternalMidiDevice from "./ExternalMidiDevice.vue";
import StepSequencer from "./StepSequencer.vue";
import { IMidiDevice } from "@/shared/interfaces/devices/IMidiDevice";
import { PresetServiceFactory } from "@/shared/factories/PresetServiceFactory";
import DeviceContainerModal from "./DeviceContainerModal.vue";

export default defineComponent({
  emits: ["newDeviceMounted"],
  components: {
    PresetDropdown,
    DeviceDropdown,
    ComputerMidiKeyboard,
    ExternalMidiDevice,
    StepSequencer,
    DeviceContainerModal,
  },
  setup(props, context) {
    const availableMidiDevices = ref(["Keypad", "Step Sequencer", "External"]);
    const currentDeviceName = ref(availableMidiDevices.value[0]);
    const currentBank = ref(getDefaultKeypadBank()); // todo: load from local json file);
    const currentPreset = ref(currentBank.value.categories[0].presets[0]);
    const expanded = ref(true);
    const showModal = ref(false);

    const presetService = PresetServiceFactory.getPresetService(currentDeviceName.value);

    const keypad = ref<IMidiDevice | null>(null)
    const stepSequencer = ref<IMidiDevice | null>(null)
    const external = ref<IMidiDevice | null>(null)

    const device = computed(() => {
      let currentDevice: IMidiDevice | null;
      switch (currentDeviceName.value) {
        case "Keypad":
          currentDevice = keypad.value;
          break;
        case "Step Sequencer":
          currentDevice = stepSequencer.value;
          break;
        case "External":
          currentDevice = external.value;
          break;
        default:
          throw `Invalid Device Name ${currentDeviceName.value}`;
      }
      return currentDevice;
    });

    onMounted(() => {
      device.value?.applySettings(currentPreset.value.settings);
    });

    async function loadFactoryPresets() {
      currentBank.value = await presetService.getFactoryBank();
      currentPreset.value = currentBank.value.categories[0].presets[0];
      device.value?.applySettings(currentPreset.value.settings);
    }

    function presetSelected(p: IPreset) {
      // todo: apply settings to midi device
    }

    function deviceSelected(deviceName: string) {
      if (currentDeviceName.value != deviceName) {
        currentDeviceName.value = deviceName;
      }
    }

    function newDeviceMounted() {
      loadFactoryPresets().then(() => {
        // console.log(`loaded ${device?.value?.name} preset bank ${currentBank.value._id}`)
      });
      context.emit("newDeviceMounted", device.value);
      console.log(`mounted device ${device?.value?.name}`);
    }

    return {
      deviceSelected,
      presetSelected,
      newDeviceMounted,
      availableMidiDevices,
      currentDeviceName,
      currentBank,
      currentPreset,
      expanded,
      showModal,
      keypad,
      stepSequencer,
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
.expand-icon {
  float: right;
}
.modal-link:active {
  opacity: 0.5;
}
</style>
