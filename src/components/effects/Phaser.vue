<template>
  <div
    class="flex"
    draggable
    @dragstart="this.componentDragstart"
    @dragend="this.componentDragend"
    @drop="elementDropped"
    @dragover="
      (e) => {
        e.preventDefault();
      }
    "
  >
    <v-menu>
      <template v-slot:activator="{ on }">
        <div
          class="phaser-container"
          @contextmenu="
            (e) => {
              e.preventDefault();
              on.click(e);
            }
          "
        >
          <h3 class="center-x mb-2">{{ name }}</h3>
          <knob-control
            v-model="settings.mix"
            :minValue="0"
            :maxValue="1"
            label="Mix"
            id="dryWet"
            :size="50"
            :shadowColor="'#5e5e5e'"
          ></knob-control>
          <knob-control
            v-model="settings.frequency"
            :minValue="0.1"
            :maxValue="8"
            label="Frequency"
            id="frequency"
            :size="50"
            :shadowColor="'#5e5e5e'"
          ></knob-control>
          <knob-control
            v-model="settings.octaves"
            :minValue="0.05"
            :maxValue="2"
            label="Range"
            id="octaves"
            :size="50"
            scale="exponential"
            :shadowColor="'#5e5e5e'"
          ></knob-control>
        </div>
      </template>

      <v-list dark>
        <v-list-item link @click.stop="deleteComponent">
          <v-list-item-title>delete</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, watch } from "vue";
import { useEffectsDevice } from "@/composables/useEffectsDevice";
import { useEffectsRackComponent } from "@/composables/useEffectsRackComponent";
import KnobControl from "@/components/KnobControl.vue";
import { Phaser as TonePhaser } from "tone";

type IPhaserSettings = {
  mix: number;
  frequency: number;
  baseFrequency: number;
  octaves: number;
}

export default defineComponent({
  emits: [
    "deleteComponent",
    "componentDragstart",
    "componentDragend",
    "elementDropped",
    "effectsDeviceMounted"
  ],
  components: {
    KnobControl
  },
  setup(props, context) {
    const { guid, name, settings, output, input } =
      useEffectsDevice<IPhaserSettings>(
        "Phaser",
        { mix: 0.5, frequency: 2, baseFrequency: 1200, octaves: 0.2 }
      );

    const tonePhaser = new TonePhaser(2);

    tonePhaser.wet.value = settings.mix;
    tonePhaser.frequency.value = settings.frequency;
    tonePhaser.baseFrequency = settings.baseFrequency;
    tonePhaser.octaves = settings.octaves;

    function applySettings(newSettings: IPhaserSettings) {
      settings.mix = newSettings.mix;
      settings.frequency = newSettings.frequency;
      settings.baseFrequency = newSettings.baseFrequency;
      settings.octaves = newSettings.octaves;
    }

    function dispose() {
      input.disconnect(tonePhaser);
      tonePhaser.disconnect(output);

      input.dispose();
      output.dispose();
      tonePhaser.dispose();
    }

    const {
      deleteComponent,
      componentDragstart,
      componentDragend,
      elementDropped
    } = useEffectsRackComponent(
      context,
      {
        guid,
        name,
        settings,
        input,
        output,
        applySettings,
        dispose
      }
    );

    watch(() => settings.mix, (value) => {
      tonePhaser.wet.value = value;
    });

    watch(() => settings.frequency, (value) => {
      tonePhaser.frequency.value = value;
    });

    watch(() => settings.baseFrequency, (value) => {
      tonePhaser.baseFrequency = value;
    });

    watch(() => settings.octaves, (value) => {
      tonePhaser.octaves = value;
    });

    onBeforeUnmount(() => dispose());

    input.connect(tonePhaser);
    tonePhaser.connect(output);

    return {
      input,
      output,
      guid,
      name,
      settings,
      deleteComponent,
      componentDragstart,
      componentDragend,
      elementDropped,
      applySettings
    };
  }
});
</script>

<style scoped>
.phaser-container {
  background-image: url("../../assets/metal-1.png");
  background-repeat: repeat;
  display: inline-block;
  font-size: 10pt;
  padding: 10px;
  border: 1px solid black;
}
</style>
