<template>
  <v-dialog
    :value="value"
    @input="(val) => $emit('input', val)"
    dark
    max-width="600"
  >
    <v-card>
      <v-card-title class="headline">Instrument</v-card-title>

      <v-card-text>
        <!-- <device-dropdown
        :selectedDeviceName="'test'"
        :devices="[]"
        label="instruments"
      /> -->

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

@Component({
  components: {
    PresetDropdown,
  },
})
export default class InstrumentContainerModal extends Vue {
  @Prop({ required: true })
  public value!: boolean;

  @Prop({ required: true })
  public currentPresetBank!: IPresetBank;

  @Prop({ required: true })
  public currentPreset!: IPreset;

  constructor() {
    super();
  }

  private closeDialog() {
    this.$emit("input", false);
  }

  private presetSelected(p: IPreset) {
    this.$emit("presetSelected", p);
  }
}
</script>
