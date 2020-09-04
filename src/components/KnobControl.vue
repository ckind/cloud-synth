<template>
  <div class="control-container">
    <div class="row knob-row">
      <img
        :src="require(`../assets/knob-2.svg`)"
        :width="size"
        :style="`transform: rotate(${rotation}rad);`"
        @mousedown="onKnobMouseDown"
        @dblclick="onKnobDblClick"
      />
    </div>
    <div class="row label-row">
      <div>
        <span v-if="label != ''"> {{ label }} </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

@Component({})
export default class KnobControl extends Vue {
  private scaledValue: number;
  private localValue: number;
  private rotationMax = (3 * Math.PI) / 4;
  private rotationMin = (-3 * Math.PI) / 4;
  private dragRange = 70;
  private prevY = -1;

  @Prop({ required: true })
  public value!: number;

  @Prop({ required: true })
  public minValue!: number;

  @Prop({ required: true })
  public maxValue!: number;

  @Prop({ required: true })
  public id!: string;

  @Prop({ required: false, default: "linear" })
  public scale!: string;

  @Prop({ required: false, default: 1 })
  public step!: number;

  @Prop({ required: false, default: "" })
  public label!: string;

  @Prop({ required: false, default: "" })
  public units!: string;

  @Prop({ required: false, default: 100 })
  public size!: number;

  @Prop({ required: false })
  public default?: string;

  public constructor() {
    super();
    this.localValue = this.value;
    this.scaledValue = this.scaleInput(this.value);
  }

  private onKnobMouseDown(e: MouseEvent) {
    e.preventDefault ? e.preventDefault() : (e.returnValue = false);
    document.addEventListener("mousemove", this.knobDrag);
    document.addEventListener("mouseup", this.onDocumentMouseUp);
  }

  private onKnobDblClick() {
    const val =
      typeof this.default === "undefined"
        ? this.scaleOutput(this.scaledMid)
        : this.default;
    this.$emit("input", val);
  }

  private onDocumentMouseUp() {
    document.removeEventListener("mousemove", this.knobDrag);
    document.removeEventListener("mouseup", this.onDocumentMouseUp);
    this.prevY = -1;
  }

  private knobDrag(e: MouseEvent) {
    if (this.prevY >= 0) {
      const diffY = this.prevY - e.pageY;
      const calcValue =
        this.scaledValue + (diffY / this.dragRange) * (this.scaledRange / 2);
      this.scaledValue =
        calcValue > this.scaledMax
          ? this.scaledMax
          : calcValue < this.scaledMin
          ? this.scaledMin
          : calcValue;
      this.localValue = this.scaleOutput(this.scaledValue);
      this.$emit("input", this.localValue);
    }
    this.prevY = e.pageY;
  }

  get rotation() {
    const offset = this.scaledValue - this.scaledMid;
    const halfRange = this.scaledRange / 2;
    return (offset / halfRange) * this.rotationMax;
  }

  get midValue() {
    return this.minValue + this.valueRange / 2;
  }

  get valueRange() {
    return this.maxValue - this.minValue;
  }

  get scaledRange() {
    return this.scaledMax - this.scaledMin;
  }

  get scaledMax() {
    return this.scaleInput(this.maxValue);
  }

  get scaledMin() {
    return this.scaleInput(this.minValue);
  }

  get scaledMid() {
    return this.scaledMin + this.scaledRange / 2;
  }

  /* eslint-disable */ 
  get scaledStep() {
    const numSteps = Math.round((this.maxValue - this.minValue) / this.step);
    return (this.scaleInput(this.maxValue) - this.scaleInput(this.minValue)) / numSteps;
  }
  /* eslint-enable */

  private roundToStep(x: number) {
    return this.step * Math.round(x / this.step);
  }

  private roundToScaledStep(x: number) {
    return this.step * Math.round(x / this.scaledStep);
  }

  private scaleInput(x: number) {
    let y: number;
    switch (this.scale) {
      case "linear":
        y = x;
        break;
      case "log2":
        y = Math.log(x) / Math.log(2);
        break;
      default:
        throw `unrecognized scale argument ${this.scale}`;
    }
    return y;
  }

  private scaleOutput(x: number) {
    let y: number;
    switch (this.scale) {
      case "linear":
        y = x;
        break;
      case "log2":
        y = Math.pow(2, x);
        break;
      default:
        throw `unrecognized scale argument ${this.scale}`;
    }
    return y;
  }

  @Watch("value")
  onValueChanged(value: number) {
    this.localValue = value;
    this.scaledValue = this.scaleInput(value);
  }
}
</script>

<style scoped>
.label-row {
  justify-content: center;
}
.knob-row {
  justify-content: center;
}
</style>
