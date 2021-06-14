<template>
  <div class="control-container" :style="cssVars">
    <div class="knob-row">
      <!-- default knob -->
      <span
        @mousedown="onKnobMouseDown"
        @touchstart="onKnobMouseDown"
        @dblclick="onKnobDblClick"
        class="knob-container"
        :class="[shadow ? 'knob-shadow' : '']"
        :style="`transform: rotate(${knobRotation}rad);`"
        :width="size"
        :height="size"
      >
        <slot>
          <svg
            :width="size"
            :height="size"
            viewBox="0 0 100 100"
          >
            <g>
              <g>
                <circle class="st0" cx="50%" cy="50%" r="50%" />
                <g transform="translate(-20 -20)">
                  <g transform="translate(0 -6)">
                    <path
                      d="M109.4,78.2c-2.3-2.5-4-5.6-4.6-9c-0.7-3.5-0.5-6.9,0.6-10.2c-2.2-4.6-5.3-8.6-9.2-11.9c-3.3,0.2-6.8-0.4-10-2
                      s-5.8-4-7.7-6.7c-5.1-1-10.2-1.1-15-0.2c-1.9,2.8-4.6,5.1-7.8,6.6s-6.7,2.1-10.1,1.7c-3.8,3.1-7.1,7.1-9.5,11.6
                      c0.9,3.2,1.1,6.7,0.4,10.2c-0.9,3.5-2.6,6.5-5,8.9c0.1,5.1,1.1,10.1,3.1,14.6c3.1,1.2,5.9,3.2,8.2,6.2c2.2,2.8,3.5,6.2,4,9.4
                      c4,3,8.4,5.3,13.5,6.7c2.9-1.6,6.3-2.6,9.9-2.6s6.9,1,9.9,2.8c4.8-1.1,9.5-3.3,13.6-6.4c0.6-3.3,1.9-6.5,4.2-9.3
                      c2.3-2.8,5.2-4.7,8.4-5.9c1-2.2,1.9-4.6,2.5-7.1C109.1,83.4,109.3,80.7,109.4,78.2z"
                    />
                  </g>
                  <ellipse
                    class="st1"
                    cx="70.4"
                    cy="70.4"
                    rx="26.7"
                    ry="26.7"
                  />
                  <g transform="translate(0 -8)">
                    <path
                      class="st2"
                      d="M71.5,28.5c-0.4,0-0.9,0-1.1,0c-0.3,0-0.9,0-1.1,0v31h2.5v-31H71.5z"
                    />
                  </g>
                </g>
              </g>
            </g>
          </svg>
        </slot>
      </span>
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
  CurvedRangeType,
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
      "--shadowColor": this.shadowColor,
    };
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
  margin-top: 4px;
  justify-content: center;
  display: flex;
}
.knob-row {
  justify-content: center;
  display: flex;
}
.knob-shadow {
  -webkit-box-shadow: 0 0 10px var(--shadowColor);
  box-shadow: 0 0 10px var(--shadowColor);
}
.knob-container {
  border-radius: 50%;
  line-height: 0px !important;
}
.test {
  width: 100%;
  height: 100%;
}



/* default knob styling */
.st0 {
  fill: #414042;
}
.st1 {
  fill: #939598;
}
.st2 {
  fill: #ffffff;
}
.st3 {
  fill: none;
  stroke: #ffffff;
  stroke-width: 1.7417;
  stroke-linecap: round;
  stroke-miterlimit: 10;
}
</style>
