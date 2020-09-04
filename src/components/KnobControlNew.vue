<template>
  <div class="control-container">
    <div class="row knob-row">
      <img
        :src="require(`../assets/knob-2.svg`)"
        :width="size"
        :style="`transform: rotate(${knobRotation}rad);`"
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
import { CurvedRange } from "@/shared/interfaces/utility/CurvedRange";
import {
  CurvedRangeFactory,
  CurvedRangeType
} from "@/shared/factories/CurvedRangeFactory";

@Component({})
export default class KnobControlNew extends Vue {
  private curvedValue: number;
  private linearValue: number;
  private rotationMax = (3 * Math.PI) / 4;
  private dragRange = 70;
  private prevY = -1;
  private valueCurve: CurvedRange;

  @Prop({ required: true })
  public value!: number;

  @Prop({ required: true })
  public minValue!: number;

  @Prop({ required: true })
  public maxValue!: number;

  @Prop({ required: true })
  public id!: string;

  @Prop({ required: false, default: "linear" })
  public scale!: CurvedRangeType;

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
    this.valueCurve = CurvedRangeFactory.getCurvedRange(
      this.scale,
      this.minValue,
      this.maxValue
    );
    this.linearValue = this.value;
    this.curvedValue = this.valueCurve.getCurvedValue(this.value);
  }

  private onKnobMouseDown(e: MouseEvent) {
    e.preventDefault ? e.preventDefault() : (e.returnValue = false);
    document.addEventListener("mousemove", this.onKnobDrag);
    document.addEventListener("mouseup", this.onDocumentMouseUp);
  }

  private onDocumentMouseUp() {
    document.removeEventListener("mousemove", this.onKnobDrag);
    document.removeEventListener("mouseup", this.onDocumentMouseUp);
    this.prevY = -1;
  }

  private onKnobDblClick() {
    const val =
      typeof this.default === "undefined" ? this.midValue : this.default;
    this.$emit("input", val);
  }

  private onKnobDrag(e: MouseEvent) {
    if (this.prevY >= 0) {
      const diffY = this.prevY - e.pageY;
      let calcValue =
        this.linearValue + (diffY / this.dragRange) * (this.valueRange / 2);
      calcValue =
        calcValue > this.maxValue
          ? this.maxValue
          : calcValue < this.minValue
          ? this.minValue
          : calcValue;
      this.$emit("input", this.valueCurve.getCurvedValue(calcValue));
    }
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

  // private roundToStep(x: number) {
  //   return -1; // implement
  // }

  @Watch("value")
  onValueChanged(value: number) {
    this.curvedValue = value;
    this.linearValue = this.valueCurve.getLinearValue(this.curvedValue);
    console.log(
      `linearValue ${this.linearValue} curvedValue ${this.curvedValue}`
    );
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
