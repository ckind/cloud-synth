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
import { Component, Vue, Prop } from "vue-property-decorator";
import { IEffectsDevice } from "@/shared/interfaces/devices/IEffectsDevice";
import { v4 as uuidv4 } from "uuid";
import { ToneAudioNode, Gain as ToneGain, context as ToneContext } from "tone";

@Component({})
export default class Visualizer extends Vue implements IEffectsDevice {
  public guid: string;
  public output: ToneAudioNode;
  public input: ToneAudioNode;
  public name: string;
  public settings: any;

  private analyser: AnalyserNode;
  private dataArray: Float32Array;
  private bufferLength: number;
  private canvasContext!: CanvasRenderingContext2D; // tell the typescript compiler to take a chill pill - we'll set it in mounted()
  private continueDrawing = true;

  $refs!: {
    analyserCanvas: HTMLCanvasElement;
  };

  @Prop({ required: false, default: 208 })
  public width!: number;

  @Prop({ required: false, default: 130 })
  public height!: number;

  get cssVars() {
    return {
      "--shadowColor": "#5e5e5e",
    };
  }

  constructor() {
    super();

    this.guid = uuidv4();
    this.output = new ToneGain(1);
    this.input = new ToneGain(1);
    this.name = "Visualizer";
    this.settings = {};

    this.analyser = ToneContext.createAnalyser();
    this.bufferLength = this.analyser.frequencyBinCount;
    this.dataArray = new Float32Array(this.bufferLength);

    this.input.chain(this.analyser, this.output);
  }

  // Lifecycle Hooks

  mounted() {
    this.canvasContext = this.$refs.analyserCanvas.getContext("2d")!;
    window.requestAnimationFrame(this.draw);

    this.$emit("effectsDeviceMounted", this.guid);
  }

  beforeDestroy() {
    this.continueDrawing = false;
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

  draw() {
    this.analyser.getFloatTimeDomainData(this.dataArray);

    this.canvasContext.fillStyle = "black";
    this.canvasContext.fillRect(0, 0, this.width, this.height);

    this.canvasContext.lineWidth = 2.5;
    this.canvasContext.strokeStyle = "#70bfff";

    this.canvasContext.beginPath();

    const sliceWidth = (this.width * 1.0) / this.bufferLength;
    let x = 0;

    for (let i = 0; i < this.bufferLength; i++) {
      const v = this.dataArray[i] * this.height * 0.8;
      const y = this.height / 2 + v;

      if (i === 0) {
        this.canvasContext.moveTo(x, y);
      } else {
        this.canvasContext.lineTo(x, y);
      }

      x += sliceWidth;
    }

    this.canvasContext.lineTo(this.width, this.height / 2);
    this.canvasContext.stroke();

    if (this.continueDrawing) {
      window.requestAnimationFrame(this.draw);
    }
  }

  applySettings(settings: any) {
    this.settings = settings;
  }

  dispose() {
    this.input.dispose();
    this.output.dispose();
  }
}
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