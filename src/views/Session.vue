<template>
  <div>
    <instrument-container
      :device="currentInstrument"
      :presetService="jvaPresets"
    >
    </instrument-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { context as ToneContext } from "tone";
import { JvaPresetService } from "@/services/JvaPresetService";
import { IPresetService } from "@/shared/interfaces/presets/IPresetService";
import { IVueInstrumentDevice } from "@/shared/interfaces/devices/IVueInstrumentDevice";
import InstrumentContainer from "@/components/InstrumentContainer.vue";
import JvaSynth from "@/components/JvaSynth.vue";

@Component({
  components: {
    InstrumentContainer,
    JvaSynth
  }
})
export default class Session extends Vue {
  private jvaPresets: IPresetService;
  private currentInstrument: IVueInstrumentDevice;

  public constructor() {
    super();
    this.jvaPresets = new JvaPresetService();
    this.currentInstrument = new JvaSynth();

    // hack for making sure audio context starts right away
    document.documentElement.addEventListener("mousedown", function() {
      if (ToneContext.state !== "running") {
        ToneContext.resume();
        console.log("context resumed!");
      }
    });

    // todo: how do we assign currentInstrument to the component instance? might need to rethink this bit...
    // read this - https://forum.vuejs.org/t/how-to-pass-and-use-component-as-a-prop/58475
    // actually you need this - https://stackoverflow.com/questions/42992579/is-it-possible-to-pass-a-component-as-props-and-use-it-in-a-child-component-in-v
  }

  // Lifecycle Hooks

  // Computed
}
</script>

<style scoped></style>
