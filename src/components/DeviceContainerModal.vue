<template>
  <v-dialog
    :value="value"
    @input="(val) => $emit('input', val)"
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
import { Component, Vue, Prop } from "vue-property-decorator";
import { IPreset } from "../shared/interfaces/presets/IPreset";
import { IPresetBank } from "../shared/interfaces/presets/IPresetBank";
import PresetDropdown from "./PresetDropdown.vue";
import DeviceDropdown from "./DeviceDropdown.vue";

@Component({
  components: {
    DeviceDropdown,
    PresetDropdown,
  },
})
export default class DeviceContainerModal extends Vue {
  @Prop({ required: true })
  public value!: boolean;

  @Prop({ required: true })
  public currentPresetBank!: IPresetBank;

  @Prop({ required: true })
  public currentPreset!: IPreset;

  @Prop({ required: true })
  public currentDeviceName!: string;

  @Prop({ required: true })
  public availableDevices!: string[];

  constructor() {
    super();
  }

  private closeDialog() {
    this.$emit("input", false);
  }

  private deviceSelected(d: string) {
    this.$emit("deviceSelected", d);
  }

  private presetSelected(p: IPreset) {
    this.$emit("presetSelected", p);
  }
}
</script>
