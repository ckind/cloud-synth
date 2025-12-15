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
          class="reverb-container"
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
            v-model="settings.decay"
            :minValue="0"
            :maxValue="20"
            label="Decay"
            id="dryWet"
            :size="50"
            :shadowColor="'#5e5e5e'"
          ></knob-control>
          <knob-control
            v-model="settings.filterCutoff"
            :minValue="500"
            :maxValue="20000"
            label="Filter"
            id="filter"
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
import KnobControl from "@/components/KnobControl.vue";
import { useEffectsDevice } from "@/composables/useEffectsDevice";
import { useEffectsRackComponent } from "@/composables/useEffectsRackComponent";
import { DryWetMixer } from "@/shared/classes/utility/DryWetMixer";
import { Reverb as ToneReverb, Signal as ToneSignal, Filter as ToneFilter, Gain as ToneGain } from "tone";

type IReverbSettings = {
  mix: number;
  decay: number;
  filterCutoff: number;
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
      useEffectsDevice<IReverbSettings>("Reverb", { mix: 0.5, decay: 4, filterCutoff: 4000 });

    const toneReverb = new ToneReverb(2);
    toneReverb.wet.value = 1;
    const filter = new ToneFilter(4000, "lowpass");
    const filterCutoffSignal = new ToneSignal(4000);
    const drySignal = new ToneGain(1);
    const wetSignal = new ToneGain(1);
    const dryWetMixer = new DryWetMixer(drySignal, wetSignal);

    input.chain(drySignal);
    input.chain(toneReverb, filter, wetSignal);
    filterCutoffSignal.connect(filter.frequency);
    dryWetMixer.output.connect(output);

    function applySettings(newSettings: IReverbSettings) {
      settings.mix = newSettings.mix;
      settings.decay = newSettings.decay;
      settings.filterCutoff = newSettings.filterCutoff;
    }

    function dispose() {
      input.disconnect(drySignal);
      input.disconnect(toneReverb);
      toneReverb.disconnect(filter);
      filter.disconnect(wetSignal);
      filterCutoffSignal.disconnect(filter.frequency);
      dryWetMixer.output.disconnect(output);

      filterCutoffSignal.dispose();
      dryWetMixer.dispose();
      toneReverb.dispose();
      filter.dispose();
      input.dispose();
      output.dispose();
      drySignal.dispose();
      wetSignal.dispose();
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
      dryWetMixer.wetness = value;
    });

    watch(() => settings.decay, (value) => {
      toneReverb.decay = value;
    });

    watch(() => settings.filterCutoff, (value) => {
      filterCutoffSignal.value = value;
    });

    onBeforeUnmount(() => dispose());

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
.reverb-container {
  background-image: url("../../assets/metal-1.png");
  background-repeat: repeat;
  display: inline-block;
  font-size: 10pt;
  padding: 10px;
  border: 1px solid black;
}
</style>
