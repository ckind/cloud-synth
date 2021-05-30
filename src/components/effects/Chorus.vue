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
            size="50"
            :shadowColor="'#5e5e5e'"
          ></knob-control>
          <knob-control
            v-model="settings.frequency"
            :minValue="0.1"
            :maxValue="20"
            label="Frequency"
            id="frequency"
            size="50"
						scale="exponential"
            :shadowColor="'#5e5e5e'"
          ></knob-control>
          <knob-control
            v-model="settings.depth"
            :minValue="0.01"
            :maxValue="1.0"
            label="Depth"
            id="depth"
            size="50"
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
import { Component, Vue, Watch } from "vue-property-decorator";
import { IEffectsDevice } from "@/shared/interfaces/devices/IEffectsDevice";
import KnobControl from "@/components/KnobControl.vue";
import { v4 as uuidv4 } from "uuid";
import { ToneAudioNode, Gain as ToneGain, Chorus as ToneChorus } from "tone";

interface IPhaserSettings {
  mix: number;
  frequency: number;
  delayTime: number;
  depth: number;
	feedback: number
}

@Component({
  components: {
    KnobControl,
  },
})
export default class Chorus extends Vue implements IEffectsDevice {
	// todo: this effects sounds kinda crappy - write our own?
  public guid: string;
  public input!: ToneAudioNode;
  public output!: ToneAudioNode;
  public name: string;
  public settings: IPhaserSettings;

  private toneChorus!: ToneChorus;

  constructor() {
    super();

    this.guid = uuidv4();
    this.name = "Chorus";
    this.settings = {
      mix: 0.5,
      frequency: 2,
      delayTime: 10,
      depth: 0.2,
			feedback: 0.5
    };
  }

  // Lifecycle hooks

  created() {
    this.output = new ToneGain(1);
    this.input = new ToneGain(1);
    this.toneChorus = new ToneChorus();

    this.onMixChange(this.settings.mix);
    this.onFrequencyChange(this.settings.frequency);
    this.onDelayTimeChange(this.settings.delayTime);
    this.onDepthChange(this.settings.depth);
		this.onFeedbackChange(this.settings.feedback);

    this.input.chain(this.toneChorus, this.output);
  }

  beforeDestroy() {
    this.dispose();
  }

  // Methods

  deleteComponent() {
    this.$emit("deleteComponent", this);
  }

  componentDragstart() {
    this.$emit("componentDragstart", this);
  }

  componentDragend() {
    this.$emit("componentDragend", this);
  }

  elementDropped() {
    this.$emit("elementDropped", this);
  }

  applySettings(settings: IPhaserSettings) {
    this.settings = settings;
  }

  dispose() {
    this.input.disconnect();
    this.toneChorus.disconnect();

    this.input.dispose();
    this.output.dispose();
    this.toneChorus.dispose();
  }

  @Watch("settings.mix")
  private onMixChange(value: number) {
    this.toneChorus.wet.value = value;
  }

  @Watch("settings.frequency")
  private onFrequencyChange(value: number) {
    this.toneChorus.frequency.value = value;
  }

  @Watch("settings.delayTime")
  private onDelayTimeChange(value: number) {
    this.toneChorus.delayTime = value;
  }

	@Watch("settings.feedback")
  private onFeedbackChange(value: number) {
    this.toneChorus.feedback.value = value;
  }

  @Watch("settings.depth")
  private onDepthChange(value: number) {
    this.toneChorus.depth = value;
  }
}
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
