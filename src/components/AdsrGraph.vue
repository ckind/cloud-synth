<template>
  <div class="component-container">
    <div
      :class="['graph-container', this.activeAnchorId !== '' ? 'dragging' : '']"
      @mousemove="onMouseMove"
      @mouseup="onMouseUp"
      @mouseleave="onMouseLeave"
      :width="containerWidth"
      :height="containerHeight"
    >
      <svg :width="containerWidth" :height="containerHeight">
        <rect
          :width="containerWidth"
          :height="containerHeight"
          :fill="backgroundColor"
        />
        <path
          id="envPath"
          :d="this.adsrPath"
          fill="transparent"
          :stroke="envelopeColor"
          stroke-width="2"
        />

        <!--
        <circle :cx="0" :cy="0" r="10" stroke="orange" fill="orange">
          <animate
            attributeName="cx"
            :dur="envTime / 1000"
            repeatCount="indefinite"
            :values="`${this.startX};${this.attackPeakX};${this.sustainEndX};${this.releaseEndX}`"
            :keyTimes="
              `${0};
              ${this.attack / envTime};
              ${(this.attack + this.decay) / envTime};
              ${(this.attack + this.decay + this.release) / envTime}`
            "
          />
          <animate
            attributeName="cy"
            :dur="envTime / 1000"
            repeatCount="indefinite"
            :values="`${this.startY};${this.attackPeakY};${this.sustainEndY};${this.releaseEndY}`"
            :keyTimes="
              `${0};
              ${this.attack / envTime};
              ${(this.attack + this.decay) / envTime};
              ${(this.attack + this.decay + this.release) / envTime}`
            "
          />
        </circle>
        -->

        <circle
          class="anchor"
          :cx="startX"
          :cy="startY"
          :r="anchorRadius"
          :stroke="anchorColor"
          :fill="anchorColor"
        />
        <circle
          class="anchor"
          id="attackAnchor"
          @mousedown="attackAnchorMouseDown"
          :cx="attackPeakX"
          :cy="attackPeakY"
          :r="anchorRadius"
          :stroke="anchorColor"
          :fill="anchorColor"
        />
        <circle
          class="anchor"
          id="decaySustainAnchor"
          @mousedown="decaySustainAnchorMouseDown"
          :cx="decayEndX"
          :cy="decayEndY"
          :r="anchorRadius"
          :stroke="anchorColor"
          :fill="anchorColor"
        />
        <circle
          class="anchor"
          id="releaseAnchor"
          @mousedown="releaseAnchorMouseDown"
          :cx="releaseEndX"
          :cy="releaseEndY"
          :r="anchorRadius"
          :stroke="anchorColor"
          :fill="anchorColor"
        />
      </svg>
      <div class="value-label-container">
        <div class="value-label">{{ Math.round(this.value.attack) }} ms</div>
        <div class="value-label">{{ Math.round(this.value.decay) }} ms</div>
        <div class="value-label">{{ this.value.sustain.toFixed(2) }}</div>
        <div class="value-label">{{ Math.round(this.value.release) }} ms</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

interface EnvSettings {
  attack: number;
  decay: number;
  sustain: number;
  release: number;
}

@Component({})
export default class AdsrGraph extends Vue {
  private backgroundColor = "black";
  private envelopeColor = "#70bfff";
  private anchorColor = "#70bfff";
  private anchorRadius = 4;

  private attackWidthRatio = 0.25;
  private decayWidthRatio = 0.4;
  private susatinWidthRatio = 0.1;
  private releaseWidthRatio = 0.25;

  private startX = 0;
  private startY = 0;

  private attackPeakX = 0;
  private attackPeakY = 0;

  private decayBezier1X = 0;
  private decayBezier1Y = 0;
  private decayBezier2X = 0;
  private decayBezier2Y = 0;

  private decayEndX = 0;
  private decayEndY = 0;

  private sustainEndX = 0;
  private sustainEndY = 0;

  private releaseBezier1X = 0;
  private releaseBezier1Y = 0;
  private releaseBezier2X = 0;
  private releaseBezier2Y = 0;

  private releaseEndX = 0;
  private releaseEndY = 0;

  private padding = 10;

  private activeAnchorId = "";
  private prevPageX = -1;
  private prevPageY = -1;

  private envActive = false;

  // Props

  // for some reason vue complains about this if its required
  // even if you have v-model
  @Prop({ required: false })
  public value!: EnvSettings;

  @Prop({ required: false, default: 1000 })
  public attackMax!: number;

  @Prop({ required: false, default: 1000 })
  public decayMax!: number;

  @Prop({ required: false, default: 1000 })
  public releaseMax!: number;

  @Prop({ required: false, default: 200 })
  public width!: number;

  @Prop({ required: false, default: 0 })
  public height!: number;

  public constructor() {
    super();
  }

  // Methods

  private attackAnchorMouseDown(e: MouseEvent) {
    e.preventDefault ? e.preventDefault() : (e.returnValue = false);
    this.activeAnchorId = "attackAnchor";
  }

  private decaySustainAnchorMouseDown(e: MouseEvent) {
    e.preventDefault ? e.preventDefault() : (e.returnValue = false);
    this.activeAnchorId = "decaySustainAnchor";
  }

  private releaseAnchorMouseDown(e: MouseEvent) {
    e.preventDefault ? e.preventDefault() : (e.returnValue = false);
    this.activeAnchorId = "releaseAnchor";
  }

  private onMouseUp() {
    this.activeAnchorId = "";
  }

  private onMouseLeave() {
    this.activeAnchorId = "";
  }

  private onMouseMove(e: MouseEvent) {
    let diffX, diffY: number;
    let diffAttack = 0;
    let diffDecay = 0;
    let diffSustain = 0;
    let diffRelease = 0;

    if (this.activeAnchorId != "") {
      switch (this.activeAnchorId) {
        case "attackAnchor":
          diffX = e.pageX - this.prevPageX;
          diffAttack = (diffX / this.attackTotalWidth) * this.attackMax;
          diffAttack =
            this.value.attack + diffAttack >= this.attackMax && diffAttack > 0
              ? this.attackMax - this.value.attack
              : this.value.attack + diffAttack <= 0 && diffAttack < 0
              ? 0
              : diffAttack;
          break;
        case "decaySustainAnchor":
          diffX = e.pageX - this.prevPageX;
          diffDecay = (diffX / this.decayTotalWidth) * this.decayMax;
          diffDecay =
            this.value.decay + diffDecay >= this.decayMax && diffDecay > 0
              ? this.decayMax - this.value.decay
              : this.value.decay + diffDecay <= 0 && diffDecay < 0
              ? 0
              : diffDecay;
          diffY = e.pageY - this.prevPageY;
          diffSustain = -(diffY / this.graphHeight);
          diffSustain =
            this.value.sustain + diffSustain >= 1.0 && diffSustain > 0
              ? 1.0 - this.value.sustain
              : this.value.sustain + diffSustain <= 0 && diffSustain < 0
              ? 0
              : diffSustain;
          break;
        case "releaseAnchor":
          diffX = e.pageX - this.prevPageX;
          diffRelease = (diffX / this.releaseTotalWidth) * this.releaseMax;
          diffRelease =
            this.value.release + diffRelease >= this.releaseMax && diffRelease > 0
              ? this.releaseMax - this.value.release
              : this.value.release + diffRelease <= 0 && diffRelease < 0
              ? 0
              : diffRelease;
          break;
      }
      this.$emit("input", {
        attack: this.value.attack + diffAttack,
        decay: this.value.decay + diffDecay,
        sustain: this.value.sustain + diffSustain,
        release: this.value.release + diffRelease
      });
    }

    this.prevPageX = e.pageX;
    this.prevPageY = e.pageY;
  }

  // Computed

  get envTime() {
    return this.value.attack + this.value.decay + this.value.release;
  }

  get containerWidth() {
    return this.width;
  }

  get containerHeight() {
    return this.height > 0 ? this.height : this.width / 2.5;
  }

  get graphWidth() {
    return this.containerWidth - this.padding * 2;
  }

  get graphHeight() {
    return this.containerHeight - this.padding * 2;
  }

  get envHeight() {
    return this.graphHeight * 1.0;
  }

  get attackTotalWidth() {
    return this.attackWidthRatio * this.graphWidth;
  }

  get attackWidth() {
    return this.attackTotalWidth * (this.value.attack / this.attackMax);
  }

  get decayTotalWidth() {
    return this.decayWidthRatio * this.graphWidth;
  }

  get decayWidth() {
    return this.decayTotalWidth * (this.value.decay / this.decayMax);
  }

  get sustainTotalWidth() {
    return this.susatinWidthRatio * this.graphWidth;
  }

  get releaseTotalWidth() {
    return this.releaseWidthRatio * this.graphWidth;
  }

  get releaseWidth() {
    return this.releaseTotalWidth * (this.value.release / this.releaseMax);
  }

  /* eslint-disable */
  get adsrPath() {
    this.startX = this.padding;
    this.startY = this.graphHeight + this.padding;

    this.attackPeakX = this.attackWidth + this.padding;
    this.attackPeakY = this.padding;

    this.decayBezier1X = this.attackWidth + this.decayWidth/4 + this.padding;
    this.decayBezier1Y = (this.graphHeight - this.graphHeight * this.value.sustain)/2 + this.padding;
    this.decayBezier2X = this.attackWidth + this.decayWidth/2 + this.padding;
    this.decayBezier2Y = this.graphHeight - this.graphHeight * this.value.sustain + this.padding;

    this.decayEndX = this.attackWidth + this.decayWidth + this.padding;
    this.decayEndY = this.graphHeight - this.graphHeight * this.value.sustain + this.padding;

    this.sustainEndX = this.attackTotalWidth + this.decayTotalWidth + this.sustainTotalWidth;
    this.sustainEndY = this.graphHeight - this.graphHeight * this.value.sustain + this.padding;

    this.releaseBezier1X = this.attackTotalWidth + this.decayTotalWidth +
      this.sustainTotalWidth + this.releaseWidth/4;
    this.releaseBezier1Y = this.graphHeight - this.graphHeight * this.value.sustain/2 + this.padding;
    this.releaseBezier2X = this.attackTotalWidth + this.decayTotalWidth +
      this.sustainTotalWidth + this.releaseWidth/2;
    this.releaseBezier2Y = this.graphHeight + this.padding;

    this.releaseEndX = this.sustainEndX + this.releaseWidth;
    this.releaseEndY = this.graphHeight + this.padding;

    const start = `M ${this.startX} ${this.startY} `;
    const attackCurve = `L ${this.attackPeakX} ${this.attackPeakY} `;
    const decayCurve = `C ${this.decayBezier1X} ${this.decayBezier1Y}
      ${this.decayBezier2X} ${this.decayBezier2Y} ${this.decayEndX} ${this.decayEndY}`;
    const sustainCurve = `L ${this.sustainEndX} ${this.sustainEndY}`;
    const releaseCurve = `C  ${this.releaseBezier1X} ${this.releaseBezier1Y} 
      ${this.releaseBezier2X} ${this.releaseBezier2Y} ${this.releaseEndX} ${this.releaseEndY}`
    return start + attackCurve + decayCurve + sustainCurve + releaseCurve;
  }
  /* eslint-enable */
}
</script>

<style scoped>
.graph-container {
  display: inline-block;
  margin: auto;
  width: -webkit-fit-content;
  width: fit-content;
  border: 2px solid gray;
}
svg {
  display: block;
}
#attackAnchor {
  cursor: e-resize;
}
#decaySustainAnchor {
  cursor: move;
}
#releaseAnchor {
  cursor: e-resize;
}
.dragging {
  cursor: none;
}
.value-label {
  display: block;
  float: left;
  padding: 0 10px 0 10px;
}
.component-container {
  justify-content: center;
  display: flex;
}
</style>
