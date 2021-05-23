<template>
  <div class="analyser-container" :style="cssVars">
    <canvas ref="analyserCanvas" :height="height" :width="width" class="analyser-canvas"> </canvas>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { IEffectsDevice } from "@/shared/interfaces/devices/IEffectsDevice";
import {
  ToneAudioNode,
  Gain as ToneGain,
  context as ToneContext,
} from "tone";

@Component({})
export default class Visualizer extends Vue implements IEffectsDevice {
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
    analyserCanvas: HTMLCanvasElement
  };

	@Prop({ required: false, default: 240 })
  public width!: number;

  @Prop({ required: false, default: 150 })
  public height!: number;

	get cssVars() {
		return {
			"--shadowColor": "#3f3f3f"
		}
	}

  constructor() {
    super();

    this.output = new ToneGain(1);
    this.input = new ToneGain(1);
    this.name = "Visualizer";
    this.settings = {};

    this.analyser = ToneContext.createAnalyser();
		this.bufferLength = this.analyser.frequencyBinCount;
		this.dataArray = new Float32Array(this.bufferLength);

    this.input.chain(this.analyser, this.output);
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

	mounted() {
		this.canvasContext = this.$refs.analyserCanvas.getContext("2d")!;
		window.requestAnimationFrame(this.draw);
	}

  beforeDestroy() {
		this.continueDrawing = false;
    this.dispose();
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
  padding: 20px;
  border: 1px solid black;
}
.analyser-canvas {
  border: 1px solid grey;
}
.center-x {
  display: flex;
  justify-content: center;
}
.center-y {
  display: flex;
  align-items: center;
}
</style>