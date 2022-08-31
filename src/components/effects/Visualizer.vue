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
          class="analyser-container"
          :style="cssVars"
          @contextmenu="
            (e) => {
              e.preventDefault();
              on.click(e);
            }
          "
        >
          <h3 class="center-x mb-2">{{ name }}</h3>
          <canvas
            ref="analyserCanvas"
            :height="height"
            :width="width"
            class="analyser-canvas"
          >
          </canvas>
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
import { defineComponent, computed, onMounted, onUnmounted, ref } from "vue";
import { useEffectsDevice } from "@/composables/useEffectsDevice";
import { useEffectsRackComponent } from "@/composables/useEffectsRackComponent";
import { context as ToneContext } from "tone";

type TVisualizerSettings = {};

export default defineComponent({
  emits: [
    "deleteComponent",
    "componentDragstart",
    "componentDragend",
    "elementDropped",
    "effectsDeviceMounted"
  ],
  props: {
    width: { type: Number, required: false, default: 208 },
    height: { type: Number, required: false, default: 130 },
  },
  setup(props, context) {
    const { guid, name, settings, output, input } =
      useEffectsDevice<TVisualizerSettings>("Visualizer", {});

    const analyser = ToneContext.createAnalyser()
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Float32Array(bufferLength);
    const nyquistFrequency = ToneContext.sampleRate / 2;
    const fftSize = 1024;
    const fillColor = "#70bfff";
    const analyserCanvas = ref(null as HTMLCanvasElement | null);

    const cssVars = computed(() => {
      return {
        "--shadowColor": "#5e5e5e"
      };
    });

    let canvasContext: CanvasRenderingContext2D;
    let continueDrawing = true;

    function applySettings(settings: TVisualizerSettings) {
      // nothing to do yet
    }

    function dispose() {
      input.dispose();
      output.dispose();
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

    function drawTimeDomain() {
      analyser.getFloatTimeDomainData(dataArray);

      canvasContext.fillStyle = "black";
      canvasContext.fillRect(0, 0, props.width, props.height);

      canvasContext.lineWidth = 2.5;
      canvasContext.strokeStyle = fillColor;

      canvasContext.beginPath();

      const sliceWidth = props.width / bufferLength;

      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] * props.height * 0.8;
        const y = props.height / 2 + v;

        if (i === 0) {
          canvasContext.moveTo(x, y);
        } else {
          canvasContext.lineTo(x, y);
        }

        x += sliceWidth;
      }

      canvasContext.lineTo(props.width, props.height / 2);
      canvasContext.stroke();

      if (continueDrawing) {
        window.requestAnimationFrame(drawTimeDomain);
      }
    }

    function drawFrequencyDomain() {
      analyser.getFloatFrequencyData(dataArray);

      canvasContext.fillStyle = "black";
      canvasContext.fillRect(0, 0, props.width, props.height);

      for (let i = 0; i < bufferLength; i++) {
        const freq = i * (nyquistFrequency / fftSize);

        const x = i * (props.width/bufferLength);
        const barWidth = 1;
        const barHeight = dataArray[i] + 140;

        canvasContext.fillStyle = fillColor;
        canvasContext.fillRect(
          x,
          props.height - barHeight,
          barWidth,
          barHeight
        );
      }

      if (continueDrawing) {
        window.requestAnimationFrame(drawFrequencyDomain);
      }
    }

    onMounted(() => {
      canvasContext = analyserCanvas.value?.getContext("2d")!;
      // window.requestAnimationFrame(drawFrequencyDomain);
      window.requestAnimationFrame(drawTimeDomain);
    });
    
    onUnmounted(() => {
      continueDrawing = false;
      dispose();   
    });

    input.chain(analyser, output);

    return {
      guid,
      name,
      settings,
      input,
      output,
      cssVars,
      analyserCanvas,
      applySettings,
      dispose,
      deleteComponent,
      componentDragstart,
      componentDragend,
      elementDropped
    }
  }

});

</script>

<style scoped>
.analyser-container {
  background-image: url("../../assets/metal-1.png");
  background-repeat: repeat;
  display: inline-block;
  font-size: 10pt;
  padding: 10px;
  border: 1px solid black;
}
.analyser-canvas {
  margin: 10px;
  border: 1px solid grey;
}
</style>