<template>
  <v-dialog
    :value="value"
    @input="dialogInput"
    dark
    max-width="600"
  >
    <v-card>
      <v-card-title class="headline">Instrument</v-card-title>
      
      <br />

      <v-card-text>
        <device-dropdown
          @deviceSelected="deviceSelected"
          :selectedDeviceName="currentDeviceName"
          :devices="availableDevices"
          label="instruments"
        />

        <br />

        <preset-dropdown
          @presetSelected="presetSelected"
          :bank="currentPresetBank"
          :selectedPreset="currentPreset"
          label="presets"
        />
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="closeDialog">Ok</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { IPreset } from "../shared/interfaces/presets/IPreset";
import { IPresetBank } from "../shared/interfaces/presets/IPresetBank";
import PresetDropdown from "./PresetDropdown.vue";
import DeviceDropdown from "./DeviceDropdown.vue";

export default defineComponent({
  emits: ["input", "deviceSelected", "presetSelected"],
  components: {
    DeviceDropdown,
    PresetDropdown,
  },
  props: {
    value: { type: Boolean, required: true },
    currentPresetBank: { type: Object as PropType<IPresetBank>, required: true },
    currentPreset: { type: Object as PropType<IPreset>, required: true },
    currentDeviceName: { type: String, required: true },
    availableDevices: { type: Array<string>, required: true },
  },
  setup(prop, context) {
    function closeDialog() {
      context.emit("input", false);
    }

    function deviceSelected(d: string) {
      context.emit("deviceSelected", d);
    }

    function presetSelected(p: IPreset) {
      context.emit("presetSelected", p);
    }

    function dialogInput(val: any) {
      context.emit("input", val);
    }

    return {
      closeDialog,
      deviceSelected,
      presetSelected,
      dialogInput
    }
  }
});
</script>
