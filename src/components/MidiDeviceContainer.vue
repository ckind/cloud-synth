<template>
  <div>
    <v-row class="device-header">
      <v-col cols="12">
        <h4>{{ currentPreset.name }}</h4>
      </v-col>
    </v-row>
    <div ref="deviceContainer" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { IVueMidiDeviceContainer } from "../shared/interfaces/containers/IVueMidiDeviceContainer";
import { IVueMidiDevice } from "../shared/interfaces/devices/IVueMidiDevice";
import { IPreset } from "../shared/interfaces/presets/IPreset";
import { IPresetBank } from "../shared/interfaces/presets/IPresetBank";
import { IPresetService } from "../shared/interfaces/presets/IPresetService";
import { getDefaultJvaBank } from "../assets/presets/LocalDefaults";
import { MidiFunction } from "../shared/interfaces/midi/IMidiMessage";
import JvaSynth from "./JvaSynth.vue";

@Component({
  components: {
    JvaSynth
  }
})
export default class MidiDeviceContainer extends Vue
  implements IVueMidiDeviceContainer {
  currentPreset: IPreset;
  currentBank: IPresetBank;

  $refs!: {
    deviceContainer: Element;
  };
  @Prop({ required: true })
  public device!: IVueMidiDevice;

  @Prop({ required: true })
  public presetService!: IPresetService;

  public constructor() {
    super();
    this.currentBank = getDefaultJvaBank(); // todo: need default bank for midi device
    this.currentPreset = this.currentBank.categories[0].presets[0];
    this.device.settings = this.currentPreset.settings;
    // this.device.connect() -- todo: how to connect this to the instrument?
  }

  // Lifecycle Hooks

  mounted() {
    // todo: this goes against the standard lifecycle (children mount before parent) - maybe rethink design?
    this.device.$mount(this.$refs.deviceContainer);
    this.loadFactoryPresets().then(() => {
      console.log(`loaded preset bank ${this.currentBank._id}`);
    });
  }

  // Methods

  async loadFactoryPresets() {
    this.currentBank = await this.presetService.getFactoryBank();
    this.currentPreset = this.currentBank.categories[0].presets[0];
    this.device.settings = this.currentPreset.settings;
  }
}
</script>

<style scoped>
.device-header {
  background-color: black;
  color: white;
}
</style>
