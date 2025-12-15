<template>
  <div
    class="flex"
    draggable
    @dragstart="componentDragstart"
    @dragend="componentDragend"
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
          class="dist-container"
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
            v-model="settings.drive"
            :minValue="0.001"
            :maxValue="1"
            label="Drive"
            id="Drive"
            :size="50"
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
import { Distortion as ToneDistortion } from "tone";

type TDistortionSettings = {
  mix: number;
  drive: number;
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
      useEffectsDevice<TDistortionSettings>(
        "Distortion",
        { mix: 1.0, drive: 0.4 }
      );

    const toneDistortion = new ToneDistortion(0.4);
    toneDistortion.wet.value = settings.mix;
    toneDistortion.distortion = settings.drive;

    function applySettings(newSettings: TDistortionSettings) {
      settings.drive = newSettings.drive;
      settings.mix = newSettings.mix;
    }

    function dispose() {
      input.disconnect(toneDistortion);
      toneDistortion.disconnect(output);

      input.dispose();
      output.dispose();
      toneDistortion.dispose();
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
      });

    watch(() => settings.mix, (value) => {
      toneDistortion.wet.value = value;
    })

    watch(() => settings.drive, (value) => {
      toneDistortion.distortion = value;
    })
    
    onBeforeUnmount(() => dispose());

    input.connect(toneDistortion);
    toneDistortion.connect(output);

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
    }
  }
});

</script>

<style scoped>
.dist-container {
  background-image: url("../../assets/metal-1.png");
  background-repeat: repeat;
  display: inline-block;
  font-size: 10pt;
  padding: 10px;
  border: 1px solid black;
}
</style>
