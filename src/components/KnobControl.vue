<template>
  <div class="control-container" :style="cssVars">
    <div class="knob-row">
      <img
        :src="require(`../assets/knob-2.svg`)"
        :width="size"
        :height="size"
        :style="`transform: rotate(${knobRotation}rad);`"
        class="knob-img"
        :class="[shadow ? 'knob-shadow' : '']"
        @mousedown="onKnobMouseDown"
        @touchstart="onKnobMouseDown"
        @dblclick="onKnobDblClick"
      />
    </div>
    <div class="label-row">
      <div>
        <span v-if="label != ''"> {{ label }} </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { CurvedRange } from "@/shared/interfaces/utility/CurvedRange";
import {
  CurvedRangeFactory,
  CurvedRangeType
} from "@/shared/factories/CurvedRangeFactory";

@Component({})
export default class KnobControl extends Vue {
  private curvedValue: number;
  private linearValue: number;
  private unsteppedValue: number;
  private rotationMax = (3 * Math.PI) / 4;
  private dragRange = 70;
  private prevY = -1;
  private valueCurve: CurvedRange;

  // for some reason vue complains about this if its required
  // even if you have v-model
  @Prop({ required: false })
  public value!: number;

  @Prop({ required: true })
  public minValue!: number;

  @Prop({ required: true })
  public maxValue!: number;

  @Prop({ required: true })
  public id!: string;

  @Prop({ required: false, default: "linear" })
  public scale!: CurvedRangeType;

  @Prop({ required: false, default: 0 })
  public step!: number;

  @Prop({ required: false, default: "" })
  public label!: string;

  @Prop({ required: false, default: "" })
  public units!: string;

  @Prop({ required: false, default: 100 })
  public size!: number;

  @Prop({ required: false })
  public default?: number;

  @Prop({ required: false, default: true })
  public shadow!: boolean;

  @Prop({ required: false, default: "black" })
  public shadowColor!: string;

  get cssVars() {
    return {
      "--shadowColor": this.shadowColor
    }
  }

  public constructor() {
    super();
    this.valueCurve = CurvedRangeFactory.getCurvedRange(
      this.scale,
      this.minValue,
      this.maxValue
    );
    this.linearValue = this.value;
    this.curvedValue = this.valueCurve.getCurvedValue(this.value);
    this.unsteppedValue = this.curvedValue;
  }

  private onKnobMouseDown(e: MouseEvent) {
    e.preventDefault ? e.preventDefault() : (e.returnValue = false);
    document.addEventListener("mousemove", this.onKnobMouseDrag);
    document.addEventListener("touchmove", this.onKnobTouchDrag);
    document.addEventListener("mouseup", this.onDocumentMouseUp);
    document.addEventListener("touchend", this.onDocumentMouseUp);
  }

  private onDocumentMouseUp() {
    document.removeEventListener("mousemove", this.onKnobMouseDrag);
    document.removeEventListener("touchmove", this.onKnobTouchDrag);
    document.removeEventListener("mouseup", this.onDocumentMouseUp);
    document.removeEventListener("touchend", this.onDocumentMouseUp);
    this.prevY = -1;
  }

  private onKnobDblClick() {
    const value =
      typeof this.default === "undefined" ? this.midValue : this.default;
    this.unsteppedValue = value;
    this.$emit("input", this.valueCurve.getCurvedValue(value));
  }

  private roundToStep(x: number) {
    if (this.step === 0) {
      throw "step is zero or undefined";
    }
    const roundedValue = Math.round(x / this.step) * this.step;
    return roundedValue < this.minValue
      ? this.minValue
      : roundedValue > this.maxValue
      ? this.maxValue
      : roundedValue;
  }

  private onKnobDrag(currY: number) {
    if (this.prevY >= 0) {
      const diffY = this.prevY - currY;
      let knobValue =
        this.unsteppedValue + (diffY / this.dragRange) * (this.valueRange / 2);
      knobValue =
        knobValue > this.maxValue
          ? this.maxValue
          : knobValue < this.minValue
          ? this.minValue
          : knobValue;
      this.unsteppedValue = knobValue;
      const steppedValue =
        this.step === 0
          ? this.unsteppedValue
          : this.roundToStep(this.unsteppedValue);
      this.$emit("input", this.valueCurve.getCurvedValue(steppedValue));
    }
  }

  private onKnobTouchDrag(e: TouchEvent) {
    this.onKnobDrag(e.touches[0].pageY);
    this.prevY = e.touches[0].pageY;
  }

  private onKnobMouseDrag(e: MouseEvent) {
    this.onKnobDrag(e.pageY);
    this.prevY = e.pageY;
  }

  get knobRotation() {
    const offset = this.linearValue - this.midValue;
    return (offset / (this.valueRange / 2)) * this.rotationMax;
  }

  get midValue() {
    return this.minValue + this.valueRange / 2;
  }

  get valueRange() {
    return this.maxValue - this.minValue;
  }

  @Watch("value")
  onValueChanged(value: number) {
    this.curvedValue = value;
    this.unsteppedValue = this.valueCurve.getLinearValue(this.curvedValue);
    this.linearValue =
      this.step === 0
        ? this.unsteppedValue
        : this.roundToStep(this.unsteppedValue);
  }
}
</script>

<style scoped>
.label-row {
  justify-content: center;
  display: flex;
}
.knob-row {
  justify-content: center;
  display: flex;
}
.knob-img {
  -webkit-border-radius: 50%;
  -moz-border-radius: 50%;
  -khtml-border-radius: 50%;
  border-radius: 50%;
  user-select: none;
}
.knob-shadow {
  -webkit-box-shadow: 0 0 10px var(--shadowColor);
  box-shadow: 0 0 10px var(--shadowColor);
}
</style>
