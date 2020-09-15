<template>
  <div class="device-window">
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
import { IVueInstrumentContainer } from "../shared/interfaces/containers/IVueInstrumentContainer";
import { IVueInstrumentDevice } from "../shared/interfaces/devices/IVueInstrumentDevice";
import { IPreset } from "../shared/interfaces/presets/IPreset";
import { IPresetBank } from "../shared/interfaces/presets/IPresetBank";
import { IPresetService } from "../shared/interfaces/presets/IPresetService";
import { getDefaultJvaBank } from "../assets/presets/LocalDefaults";
import { Master as ToneMaster } from "tone";
import JvaSynth from "./JvaSynth.vue";

@Component({
  components: {
    JvaSynth
  }
})
export default class InstrumentContainer extends Vue
  implements IVueInstrumentContainer {
  currentPreset: IPreset; // gets set asynchronously
  currentBank: IPresetBank; // gets set asynchronously

  $refs!: {
    deviceContainer: Element;
  };
  @Prop({ required: true })
  public device!: IVueInstrumentDevice;

  @Prop({ required: true })
  public presetService!: IPresetService;

  public constructor() {
    super();
    this.currentBank = getDefaultJvaBank();
    this.currentPreset = this.currentBank.categories[0].presets[0];
    this.device.settings = this.currentPreset.settings;
    this.device.output.connect(ToneMaster);
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
.device-window {
  border: 12px solid black;
  border-radius: 12px;
}
</style>
