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
import { defineComponent, ref } from "vue";
import { useDeviceContainer } from "@/composables/useDeviceContainer";
import EffectsRack from "@/components/EffectsRack.vue";

export default defineComponent({
  components: {
    EffectsRack
  },
  // todo: find a way to declare emits from within a composable
  // feels kind of icky to have delcare here and emit from within useDeviceContainer
  emits: ["newDeviceMounted"],
  setup(props, context) {
    const expanded = ref(true);
    const effectsRack = ref<EffectsRack | null>(null);

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
    } = useDeviceContainer("Effects Rack", [effectsRack], context);

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
