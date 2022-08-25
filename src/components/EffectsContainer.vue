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
import { defineComponent, ref, onMounted, computed } from "vue";
import { IPreset } from "../shared/interfaces/presets/IPreset";
import { PresetServiceFactory } from "@/shared/factories/PresetServiceFactory";
import EffectsRack from "@/components/EffectsRack.vue";

export default defineComponent({
  components: {
    EffectsRack
  },
  emits: ["newDeviceMounted"],
  setup(props, context) {
    const currentDeviceName = ref("Effects Chain");
    let presetService = PresetServiceFactory.getPresetService(
      currentDeviceName.value
    );

    const currentBank = ref(presetService.getLocalBank());
    const currentPreset = ref(currentBank.value.categories[0].presets[0]);
    const expanded = ref(true);
    const effectsRack = ref(null as EffectsRack?);

    const device = computed(() => {
      return effectsRack.value;
    });

    async function loadFactoryPresets() {
      currentBank.value = await presetService.getFactoryBank();
      currentPreset.value = currentBank.value.categories[0].presets[0];
      device.value?.applySettings(currentPreset.value.settings);
    }

    function deviceSelected(deviceName: string) {
      if (currentDeviceName.value != deviceName) {
        currentDeviceName.value = deviceName;
        presetService = PresetServiceFactory.getPresetService(
          currentDeviceName.value
        );
        currentBank.value = presetService.getLocalBank();
        currentPreset.value = currentBank.value.categories[0].presets[0];
      }
    }

    function newDeviceMounted() {
      loadFactoryPresets().then(() => {
        console.log(
          // `loaded ${this.device.name} preset bank ${this.currentBank._id}`
        );
      });
      context.emit("newDeviceMounted", device.value);
      console.log(`mounted device ${device.value?.name}`);
    }

    function downloadCurrentSettings() {
      const dataStr =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(device.value?.settings));
      const downloadAnchorNode = document.createElement("a");
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", "savedPreset.json");
      document.body.appendChild(downloadAnchorNode); // required for firefox
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    }

    function uploadSettings() {
      const input = document.querySelector("#uploadSettingsInput") as HTMLElement;
      input.click();
    }

    function presetSelected(p: IPreset) {
      currentPreset.value = p;
      device.value?.applySettings(p.settings);
    }

    onMounted(() => {
      device.value?.applySettings(currentPreset.value.settings);
    });

    return {
      currentDeviceName,
      currentBank,
      currentPreset,
      expanded,
      effectsRack,
      deviceSelected,
      newDeviceMounted,
      downloadCurrentSettings,
      uploadSettings,
      presetSelected
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
</style>
