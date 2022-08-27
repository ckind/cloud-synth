<template>
  <div class="device-window">
    <v-row class="device-header" v-show="!$vuetify.breakpoint.mobile">
      <v-col cols="2">
        <device-dropdown
          @deviceSelected="deviceSelected"
          :devices="availableDevices"
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
        v-if="currentDeviceName === 'Computer Keyboard'"
      />
      <external-midi-device
        ref="external"
        @deviceMounted="newDeviceMounted"
        v-if="currentDeviceName === 'External Midi Device'"
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
      :availableDevices="availableDevices"
      @deviceSelected="deviceSelected"
      v-model="showModal"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, Ref} from "vue";
import { useDeviceContainer } from "@/composables/useDeviceContainer";
import PresetDropdown from "./PresetDropdown.vue";
import DeviceDropdown from "./DeviceDropdown.vue";
import ComputerMidiKeyboard from "./ComputerMidiKeyboard.vue";
import ExternalMidiDevice from "./ExternalMidiDevice.vue";
import StepSequencer from "./StepSequencer.vue";
import { IMidiDevice } from "@/shared/interfaces/devices/IMidiDevice";
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
    const expanded = ref(true);
    const showModal = ref(false);

    const keypad = ref<IMidiDevice | null>(null);
    const stepSequencer = ref<IMidiDevice | null>(null);
    const external = ref<IMidiDevice | null>(null);
    const availableDevices = ref([
      "Computer Keyboard",
      "Step Sequencer",
      "External Midi Device"
    ]);

    const deviceRefs = [keypad, stepSequencer, external];

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
      presetSelected
    } = useDeviceContainer("Computer Keyboard", deviceRefs, context);

    return {
      deviceSelected,
      presetSelected,
      newDeviceMounted,
      availableDevices,
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
