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
          <v-row class="py-0 my-0">
            <v-col class="col-6 py-0 my-0">
              <knob-control
                v-model="settings.mix"
                :minValue="0"
                :maxValue="1"
                label="Mix"
                id="dryWet"
                :size="50"
                :shadowColor="'#5e5e5e'"
              ></knob-control>
            </v-col>
            <v-col class="col-6 py-0 my-0">
              <knob-control
                v-model="settings.modRate"
                :minValue="minDelayTimeModRate"
                :maxValue="maxDelayTimeModRate"
                label="Mod"
                id="modRate"
                :size="50"
                :shadowColor="'#5e5e5e'"
              ></knob-control>
            </v-col>
          </v-row>
          <v-row class="py-0 my-0">
            <v-col class="col-6 py-0 my-0">
              <knob-control
                v-show="settings.sync"
                v-model="settings.delayTimeSynced"
                :minValue="0.25"
                :maxValue="2"
                label="Time"
                id="syncedTime"
                :size="50"
                :step="0.25"
                :shadowColor="'#5e5e5e'"
              ></knob-control>
              <knob-control
                v-show="!settings.sync"
                v-model="settings.delayTime"
                :minValue="minDelayTime"
                :maxValue="maxDelayTime"
                label="Time"
                id="time"
                :size="50"
                :shadowColor="'#5e5e5e'"
              ></knob-control>
            </v-col>
            <v-col class="col-6 py-0 my-0">
              <knob-control
                v-model="settings.modAmount"
                :minValue="minDelayTimeModAmount"
                :maxValue="maxDelayTimeModAmount"
                label="Depth"
                id="modAmount"
                :size="50"
                :shadowColor="'#5e5e5e'"
              ></knob-control>
            </v-col>
          </v-row>
          <v-row class="py-0 my-0">
            <v-col class="col-6 py-0 my-0">
              <knob-control
                v-model="settings.feedback"
                :minValue="0"
                :maxValue="1.1"
                label="Feedback"
                id="feedback"
                :size="50"
                :shadowColor="'#5e5e5e'"
              ></knob-control>
            </v-col>
            <v-col class="col-6 py-0 my-0">
              <v-row class="py-0 my-0 justify-center">
                <v-switch v-model="settings.sync" hide-details></v-switch>
              </v-row>
              <v-row class="py-0 my-0 justify-center">
                <span>Sync</span>
              </v-row>
            </v-col>
          </v-row>
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
import { defineComponent, onBeforeUnmount, watch, computed } from "vue";
import { useEffectsDevice } from "@/composables/useEffectsDevice";
import { useEffectsRackComponent } from "@/composables/useEffectsRackComponent";
import { DryWetMixer } from "@/shared/classes/utility/DryWetMixer";
import KnobControl from "@/components/KnobControl.vue";
import {
  Delay as ToneDelay,
  Signal as ToneSignal,
  Filter as ToneFilter,
  Distortion as ToneDistortion,
  Transport as ToneTransport,
  LFO as ToneLFO,
  Gain as ToneGain
} from "tone";

type IBBDelaySettings = {
  mix: number;
  sync: boolean;
  delayTime: number;
  delayTimeSynced: number;
  modRate: number;
  modAmount: number;
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
    const minDelayTime = 0.001;
    const maxDelayTime = 1;
    const minDelayTimeModAmount = 0;
    const maxDelayTimeModAmount = 0.01;
    const minDelayTimeModRate = 0.01;
    const maxDelayTimeModRate = 10;

    const { guid, name, settings, output, input } =
      useEffectsDevice<IBBDelaySettings>("Analog Delay", {
        mix: 0.5,
        sync: false,
        delayTime: 0.2,
        delayTimeSynced: 0.75,
        modRate: 2,
        modAmount: 0.001,
        feedback: 0.5
      });

    const toneDelay = new ToneDelay();
    const feedbackSignal = new ToneGain(settings.feedback);
    const delayTimeSignal = new ToneSignal(settings.delayTime);
    const distortion = new ToneDistortion(0.05);
    const drySignal = new ToneGain(1);
    const wetSignal = new ToneGain(1);
    const dryWetMixer = new DryWetMixer(drySignal, wetSignal);
    const filter = new ToneFilter(4000, "lowpass");
    const delayTimeLFO = new ToneLFO(settings.modRate, minDelayTime, maxDelayTime);
    const delayTimeLFOGain = new ToneGain(settings.modAmount);

    delayTimeSignal.connect(toneDelay.delayTime);
    input.chain(
      toneDelay,
      distortion,
      filter,
      feedbackSignal,
      toneDelay,
      wetSignal
    );
    delayTimeLFO.chain(delayTimeLFOGain, toneDelay.delayTime);
    input.chain(drySignal);
    dryWetMixer.output.connect(output);

    function applySettings(newSettings: IBBDelaySettings) {
      settings.mix = newSettings.mix;
      settings.sync = newSettings.sync;
      settings.delayTime = newSettings.delayTime;
      settings.delayTimeSynced = newSettings.delayTimeSynced;
      settings.modRate = newSettings.modRate;
      settings.modAmount = newSettings.modAmount;
      settings.feedback = newSettings.feedback;
    }

    function dispose() {
      delayTimeLFO.stop();

      input.disconnect();
      toneDelay.disconnect();
      distortion.disconnect();
      filter.disconnect();
      feedbackSignal.disconnect();
      toneDelay.disconnect();
      wetSignal.disconnect();
      drySignal.disconnect();
      dryWetMixer.output.disconnect();
      delayTimeLFO.disconnect();
      delayTimeLFOGain.disconnect();

      input.dispose();
      toneDelay.dispose();
      distortion.dispose();
      filter.dispose();
      feedbackSignal.dispose();
      toneDelay.dispose();
      wetSignal.dispose();
      drySignal.dispose();
      output.dispose();
      delayTimeLFO.dispose();
      delayTimeLFOGain.dispose();
    }

    const bpmInterval = computed(() => 60 / ToneTransport.bpm.value);

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

    watch(() => settings.feedback, (value) => {
      feedbackSignal.gain.value = value;
    });

    watch(() => settings.sync, (value) => {
      if (value) {
        // set synced time
        delayTimeSignal.linearRampTo(settings.delayTimeSynced * bpmInterval.value, 0.3);
      } else {
        delayTimeSignal.linearRampTo(settings.delayTime, 0.05);
      }
    });

    watch(() => settings.delayTime, (value) => {
      if (!settings.sync) {
        delayTimeSignal.linearRampTo(value, 0.05);
      }
    });

    watch(() => settings.delayTimeSynced, (value) => {
      if (settings.sync) {
        delayTimeSignal.linearRampTo(value * bpmInterval.value, 0.3);
      }
    });

    watch(() => settings.modRate, (value) => {
      delayTimeLFO.frequency.value = value;
    });

    watch(() => settings.modAmount, (value) => {
      delayTimeLFOGain.gain.value = value;
    });

    delayTimeLFO.start();

    onBeforeUnmount(() => dispose());

    input.connect(toneDelay);
    toneDelay.connect(output);

    return {
      input,
      output,
      guid,
      name,
      settings,
      minDelayTime,
      maxDelayTime,
      minDelayTimeModAmount,
      maxDelayTimeModAmount,
      minDelayTimeModRate,
      maxDelayTimeModRate,
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
  padding: 10px;
  font-size: 10pt;
  border: 1px solid black;
}
</style>
