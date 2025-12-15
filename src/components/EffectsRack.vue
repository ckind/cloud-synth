<template>
  <div class="effects-rack-container">
    <!-- new effects will be mounted here -->
    <div class="effects-rack" id="effectsRack">
      <component
        v-for="(effectsComponent, index) in effectsComponents"
        :key="effectsComponent.id"
        :is="effectsComponent.componentName"
        @effectsDeviceMounted="effectsDeviceMounted"
        @deleteComponent="(device) => removeEffect(device, index)"
        @elementDropped="(device) => moveEffect(device, index)"
        @componentDragstart="(device) => setDragSource(device, index)"
      />
    </div>

    <div class="add-new center-y center-x">
      <v-menu top :offset-x="true">
        <template v-slot:activator="{ on, attrs }">
          <v-icon
            large
            dark
            v-bind="attrs"
            v-on="on"
            @contextmenu="
              (e) => {
                e.preventDefault();
                on.click(e);
              }
            "
          >
            mdi-plus
          </v-icon>
        </template>

        <v-list dark>
          <v-list-item
            link
            v-for="(item, index) in effectsOptions"
            :key="index"
            @click="addEffect(item)"
          >
            <v-list-item-title class="effects-option">{{
              item.type
            }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </div>
</template>

<script lang="ts">
import { IEffectsDevice } from "@/shared/interfaces/devices/IEffectsDevice";
import EffectsChain from "@/shared/classes/effects/EffectsChain";
import Reverb from "@/components/effects/Reverb.vue";
import DigitalDelay from "@/components/effects/DigitalDelay.vue";
import BBDelay from "@/components/effects/BBDelay.vue";
import Visualizer from "@/components/effects/Visualizer.vue";
import Distortion from "@/components/effects/Distortion.vue";
import Phaser from "@/components/effects/Phaser.vue";
import Chorus from "@/components/effects/Chorus.vue";
import { v4 as uuidv4 } from "uuid";
import { defineComponent, onBeforeUnmount, onMounted, ref } from "vue";
import { useEffectsDevice } from "@/composables/useEffectsDevice";

type TEffectsComponentType =
  | "Digital Delay"
  | "Analog Delay"
  | "Visualizer"
  | "Reverb"
  | "Distortion"
  | "Phaser"
  | "Chorus";

type TEffectsComponentOption = {
  type: TEffectsComponentType;
  componentName: string;
};

type TEffectsComponent = {
  componentName: string;
  id: string;
};

export default defineComponent({
  emits: ["deviceMounted"],
  components: {
    Reverb,
    DigitalDelay,
    BBDelay,
    Visualizer,
    Distortion,
    Phaser,
    Chorus,
  },
  setup(props, context) {
    const { guid, name, settings, output, input } = useEffectsDevice<any>(
      "Effects Rack",
      {}
    );

    // #region refs

    const chain = new EffectsChain();
    const effectsOptions = ref([
      { type: "Digital Delay", componentName: "DigitalDelay" },
      { type: "Analog Delay", componentName: "BBDelay" },
      { type: "Visualizer", componentName: "Visualizer" },
      { type: "Reverb", componentName: "Reverb" },
      { type: "Distortion", componentName: "Distortion" },
      { type: "Phaser", componentName: "Phaser" },
      // "Chorus" - commenting this out for now because it sounds kinda crappy
    ]);
    const effectsComponents = ref<TEffectsComponent[]>([]);
    const dragSourceIndex = ref<number | undefined>(0);
    const dragSourceDevice = ref<IEffectsDevice | undefined>(undefined);

    // #endregion

    input.connect(chain.input);
    chain.output.connect(output);

    // #region methods

    function effectsDeviceMounted(effectsDevice: IEffectsDevice) {
      chain.addComponent(effectsDevice, chain.components.length);
    }
    
    function addEffect(option: TEffectsComponentOption) {
      effectsComponents.value.push({
        componentName: option.componentName,
        id: uuidv4(),
      });
    }

    function removeEffect(device: IEffectsDevice, index: number) {
      chain.removeComponent(device);
      effectsComponents.value.splice(index, 1).map((c) => c.id);
    }

    function setDragSource(device: IEffectsDevice, sourceIndex: number) {
      dragSourceDevice.value = device;
      dragSourceIndex.value = sourceIndex;
    }

    function moveEffect(
      destinationDevice: IEffectsDevice,
      dragDestinationIndex: number
    ) {
      if (
        dragSourceDevice.value === undefined ||
        dragSourceIndex.value === undefined
      )
        return;

      if (dragSourceIndex.value != dragDestinationIndex) {
        chain.removeComponentByIndex(dragSourceIndex.value);

        const effectsComponent = effectsComponents.value.splice(
          dragSourceIndex.value,
          1
        )[0];

        effectsComponents.value.splice(
          dragDestinationIndex,
          0,
          effectsComponent
        );

        chain.addComponent(
          dragSourceDevice.value as IEffectsDevice,
          dragDestinationIndex
        );
      }

      // todo: will stay defined if the drag ends somewhere else
      dragSourceDevice.value = undefined;
      dragSourceIndex.value = undefined;
    }

    function applySettings(settings: any): void {
      // todo: settings?
    }

    function dispose() {
      chain.dispose();
    }

    // #endregion

    // #region lifecycle hooks

    onBeforeUnmount(() => dispose());

    onMounted(() => {
      addEffect({ type: "Visualizer", componentName: "Visualizer" });
      context.emit("deviceMounted");
    });

    // #endregion

    return {
      guid,
      name,
      settings,
      output,
      input,
      effectsComponents,
      effectsOptions,
      effectsDeviceMounted,
      addEffect,
      removeEffect,
      setDragSource,
      moveEffect,
      applySettings,
      dispose,
    };
  },
});
</script>

<style scoped>
.effects-rack-container {
  display: flex;
  justify-content: stretch;
  flex-wrap: wrap;
}

.effects-rack {
  display: flex;
  flex-wrap: wrap;
}

.effects-option {
  cursor: pointer;
}

.add-new {
  background: rgba(0, 0, 0, 0.5);
  padding: 6px;
}
</style>

<style>
.center-x {
  display: flex;
  justify-content: center;
}
.center-y {
  display: flex;
  align-items: center;
}
.flex {
  display: flex;
}
</style>
