<template>
  <div class="device-window">
    <v-row class="device-header">
      <v-col cols="2">
        <!-- todo: move this to DeviceDropdown.vue -->
        <v-menu :close-on-content-click="false" dark bottom offset-y nudge-top="12">
          <template v-slot:activator="{ on }">
            <v-text-field dense dark v-on="on" readonly value="Jva Poly" label="instrument" />
          </template>
          <v-list>
            <v-divider></v-divider>
            <span v-for="instrument in availableInstruments" :key="instrument">
              <v-list-item link>
                {{ instrument }}
              </v-list-item>
              <v-divider></v-divider>
            </span>
          </v-list>
        </v-menu>
      </v-col>
      <v-col cols="2">
        <!-- todo: move this to PresetDropdown.vue -->
        <v-menu :close-on-content-click="false" dark bottom offset-y nudge-top="10">
          <!-- confusing syntax -- check this thread https://github.com/vuetifyjs/vuetify/issues/6866 -->
          <template v-slot:activator="{ on }">
            <v-text-field dense dark v-on="on" readonly value="Default" label="preset" />
          </template>
          <v-list>
            <v-divider></v-divider>
            <span v-for="category in currentBank.categories" :key="category.category">
              <v-list-item link>
                <v-menu :close-on-content-click="false" dark bottom offset-x open-on-hover nudge-top="12">
                  <template v-slot:activator="{ on }">
                    <v-list-item v-on="on"> {{ category.category }} </v-list-item>
                  </template>
                  <v-list>
                    <v-list-item v-for="preset in category.presets" :key="preset.name" link>
                      {{ preset.name }}
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-list-item>
              <v-divider></v-divider>
            </span>
          </v-list>
        </v-menu>
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
  currentPreset: IPreset;
  currentBank: IPresetBank;
  availableInstruments: string[];

  $refs!: {
    deviceContainer: Element;
  };
  @Prop({ required: true })
  public device!: IVueInstrumentDevice;

  @Prop({ required: true })
  public presetService!: IPresetService;

  public constructor() {
    super();
    this.availableInstruments = ["Jva Poly", "Jva Drummachine"];
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
.cursor-pointer {
  cursor: pointer;
}
</style>
