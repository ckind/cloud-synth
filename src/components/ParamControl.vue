<template>
  <div class="control-container">
    <div class="row">
      <div class="col-2">
        <span v-if="label != ''"> {{ label }} </span>
      </div>
      <div class="col-4">
        <input
          type="range"
          class="slider"
          v-model="scaledValue"
          :id="id"
          :min="scaleInput(minValue)"
          :max="scaleInput(maxValue)"
          :step="scaleStepSize(step)"
          @input="onRangeInput"
        />
      </div>
      <div class="col-4">
        <input
          type="number"
          v-model="localValue"
          :id="id"
          :min="minValue"
          :max="maxValue"
          :step="step"
          @change="onNumberChange"
        />
      </div>
      <div class="col-2">
        <span>{{ units }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

@Component({})
export default class ParamControl extends Vue {
  private scaledValue: number;
  private numDecimals: number;
  private localValue: number;

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

  public constructor() {
    super();
    this.localValue = this.value;
    this.scaledValue = this.scaleInput(this.value);
    const strStep = this.step.toString();
    this.numDecimals = strStep.includes(".") ? strStep.split(".")[1].length : 0;
  }

  private roundToStep(x: number) {
    return parseFloat(
      (this.step * Math.round(x / this.step)).toFixed(this.numDecimals)
    );
  }

  private onRangeInput() {
    this.localValue = this.roundToStep(this.scaleOutput(this.scaledValue));
    this.$emit("paramchange", this.localValue, this.id);
  }

  private onNumberChange() {
    let tempVal: number;
    if (this.localValue > this.maxValue) {
      tempVal = this.maxValue;
    } else if (this.localValue < this.minValue) {
      tempVal = this.minValue;
    } else {
      tempVal = this.localValue;
    }
    this.scaledValue = this.scaleInput(tempVal);
    this.$emit("paramchange", this.localValue, this.id);
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

  /* eslint-disable */ 
  private scaleStepSize(x: number) {
    const numSteps = Math.round((this.maxValue - this.minValue) / this.step);
    return (this.scaleInput(this.maxValue) - this.scaleInput(this.minValue)) / numSteps;
  }
  /* eslint-enable */

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

<style scoped></style>
