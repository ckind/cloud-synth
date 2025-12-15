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
          class="chorus-container"
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
            id="mix"
            :size="50"
            :shadowColor="'#5e5e5e'"
          ></knob-control>
          <knob-control
            v-model="settings.frequency"
            :minValue="0.1"
            :maxValue="20"
            label="Frequency"
            id="frequency"
            :size="50"
						scale="exponential"
            :shadowColor="'#5e5e5e'"
          ></knob-control>
          <knob-control
            v-model="settings.depth"
            :minValue="0.01"
            :maxValue="1.0"
            label="Depth"
            id="depth"
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
import KnobControl from "@/components/KnobControl.vue";
import { useEffectsDevice } from "@/composables/useEffectsDevice";
import { useEffectsRackComponent } from "@/composables/useEffectsRackComponent";
import { Chorus as ToneChorus } from "tone";

type IChorusSettings = {
  mix: number;
  frequency: number;
  delayTime: number;
  depth: number;
  feedback: number;
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
      useEffectsDevice<IChorusSettings>(
        "Chorus",
        { mix: 0.5, frequency: 2, delayTime: 10, depth: 0.2, feedback: 0.5 }
      );

    const toneChorus = new ToneChorus();

    toneChorus.wet.value = settings.mix;
    toneChorus.frequency.value = settings.frequency;
    toneChorus.delayTime = settings.delayTime;
    toneChorus.depth = settings.depth;
    toneChorus.feedback.value = settings.feedback;

    function applySettings(newSettings: IChorusSettings) {
      settings.mix = newSettings.mix;
      settings.frequency = newSettings.frequency;
      settings.delayTime = newSettings.delayTime;
      settings.depth = newSettings.depth;
      settings.feedback = newSettings.feedback;
    }

    function dispose() {
      input.disconnect(toneChorus);
      toneChorus.disconnect(output);

      input.dispose();
      output.dispose();
      toneChorus.dispose();
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
      toneChorus.wet.value = value;
    });

    watch(() => settings.frequency, (value) => {
      toneChorus.frequency.value = value;
    });

    watch(() => settings.delayTime, (value) => {
      toneChorus.delayTime = value;
    });

    watch(() => settings.depth, (value) => {
      toneChorus.depth = value;
    });

    watch(() => settings.feedback, (value) => {
      toneChorus.feedback.value = value;
    });

    onBeforeUnmount(() => dispose());

    input.connect(toneChorus);
    toneChorus.connect(output);

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
.chorus-container {
  background-image: url("../../assets/metal-1.png");
  background-repeat: repeat;
  display: inline-block;
  font-size: 10pt;
  padding: 10px;
  border: 1px solid black;
}
</style>
