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
          class="delay-container"
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
            v-model="settings.delayTime"
            :minValue="0.001"
            :maxValue="1"
            label="Time"
            id="time"
            :size="50"
            :shadowColor="'#5e5e5e'"
          ></knob-control>
          <knob-control
            v-model="settings.feedback"
            :minValue="0"
            :maxValue="0.99"
            label="Feedback"
            id="feedback"
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
import { FeedbackDelay as ToneFeedbackDelay, Signal as ToneSignal } from "tone";

type IDigitalDelaySettings = {
  mix: number;
  delayTime: number;
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
      useEffectsDevice<IDigitalDelaySettings>("Digital Delay", { mix: 0.5, delayTime: 0.2, feedback: 0.5 });

    const toneDelay = new ToneFeedbackDelay();
    const dryWetSignal = new ToneSignal(settings.mix);
    const delayTimeSignal = new ToneSignal(settings.delayTime);
    const feedbackSignal = new ToneSignal(settings.feedback);

    delayTimeSignal.connect(toneDelay.delayTime);
    dryWetSignal.connect(toneDelay.wet);
    feedbackSignal.connect(toneDelay.feedback);

    function applySettings(newSettings: IDigitalDelaySettings) {
      settings.mix = newSettings.mix;
      settings.delayTime = newSettings.delayTime;
      settings.feedback = newSettings.feedback;
    }

    function dispose() {
      input.disconnect(toneDelay);
      toneDelay.disconnect();
      dryWetSignal.disconnect();
      feedbackSignal.disconnect();
      delayTimeSignal.disconnect();

      input.dispose();
      output.dispose();
      toneDelay.dispose();
      dryWetSignal.dispose();
      feedbackSignal.dispose();
      delayTimeSignal.dispose();
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
      dryWetSignal.value = value;
    });

    watch(() => settings.delayTime, (value) => {
      delayTimeSignal.linearRampTo(value, 0.1);
    });

    watch(() => settings.feedback, (value) => {
      feedbackSignal.value = value;
    });

    onBeforeUnmount(() => dispose());

    input.connect(toneDelay);
    toneDelay.connect(output);

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
.delay-container {
  background-image: url("../../assets/metal-1.png");
  background-repeat: repeat;
  display: inline-block;
  font-size: 10pt;
  padding: 10px;
  border: 1px solid black;
}
</style>
