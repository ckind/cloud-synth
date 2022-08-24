<template>
  <div class="component-container">
    <div
      :class="['graph-container', activeAnchorId !== '' ? 'dragging' : '']"
      @mousemove="onMouseMove"
      @touchmove="onTouchMove"
      @mouseup="onMouseUp"
      @touchend="onMouseUp"
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
          :d="adsrPath"
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
        <!-- Attack -->
        <circle
          class="anchor"
          id="attackAnchorGhost"
          @mousedown="attackAnchorMouseDown"
          @touchstart="attackAnchorMouseDown"
          :cx="attackPeakX"
          :cy="attackPeakY"
          :r="ghostAnchorRadius"
          :stroke="'rgba(0, 0, 0, 0)'"
          :fill="'rgba(0, 0, 0, 0)'"
        />
        <circle
          class="anchor"
          id="attackAnchor"
          @mousedown="attackAnchorMouseDown"
          @touchstart="attackAnchorMouseDown"
          :cx="attackPeakX"
          :cy="attackPeakY"
          :r="anchorRadius"
          :stroke="anchorColor"
          :fill="anchorColor"
        />
        <!-- Decay/Sustain -->
        <circle
          class="anchor"
          id="decaySustainAnchorGhost"
          @mousedown="decaySustainAnchorMouseDown"
          @touchstart="decaySustainAnchorMouseDown"
          :cx="decayEndX"
          :cy="decayEndY"
          :r="ghostAnchorRadius"
          :stroke="'rgba(0, 0, 0, 0)'"
          :fill="'rgba(0, 0, 0, 0)'"
        />
        <circle
          class="anchor"
          id="decaySustainAnchor"
          @mousedown="decaySustainAnchorMouseDown"
          @touchstart="decaySustainAnchorMouseDown"
          :cx="decayEndX"
          :cy="decayEndY"
          :r="anchorRadius"
          :stroke="anchorColor"
          :fill="anchorColor"
        />
        <!-- Release -->
        <circle
          class="anchor"
          id="releaseAnchorGhost"
          @mousedown="releaseAnchorMouseDown"
          @touchstart="releaseAnchorMouseDown"
          :cx="releaseEndX"
          :cy="releaseEndY"
          :r="ghostAnchorRadius"
          :stroke="'rgba(0, 0, 0, 0)'"
          :fill="'rgba(0, 0, 0, 0)'"
        />
        <circle
          class="anchor"
          id="releaseAnchor"
          @mousedown="releaseAnchorMouseDown"
          @touchstart="releaseAnchorMouseDown"
          :cx="releaseEndX"
          :cy="releaseEndY"
          :r="anchorRadius"
          :stroke="anchorColor"
          :fill="anchorColor"
        />
      </svg>
      <div class="value-label-container">
        <div class="value-label">{{ Math.round(value.attack) }} ms</div>
        <div class="value-label">{{ Math.round(value.decay) }} ms</div>
        <div class="value-label">{{ value.sustain.toFixed(2) }}</div>
        <div class="value-label">{{ Math.round(value.release) }} ms</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, PropType } from "vue";

interface EnvSettings {
  attack: number;
  decay: number;
  sustain: number;
  release: number;
}

export default defineComponent ({
  emits: ["input"],
  props: {
    value: { type: Object as PropType<EnvSettings>, required: true },
    attackMax: { type: Number, required: false, default: 1000 },
    decayMax: { type: Number, required: false, default: 1000 },
    releaseMax: { type: Number, required: false, default: 1000 },
    width: { type: Number, required: false, default: 200 },
    height: { type: Number, required: false, default: 0 }
  },
  setup(props, context) {
    const backgroundColor = ref("black");
    const envelopeColor = ref("#70bfff");
    const anchorColor = ref("#70bfff");
    const anchorRadius = ref(4);
    const ghostAnchorRadius = ref(16);

    const attackWidthRatio = 0.25;
    const decayWidthRatio = 0.4;
    const susatinWidthRatio = 0.1;
    const releaseWidthRatio = 0.25;

    const startX = ref(0);
    const startY = ref(0);

    const attackPeakX = ref(0);
    const attackPeakY = ref(0);

    let decayBezier1X = 0;
    let decayBezier1Y = 0;
    let decayBezier2X = 0;
    let decayBezier2Y = 0;

    const decayEndX = ref(0);
    const decayEndY = ref(0);

    const sustainEndX = ref(0);
    const sustainEndY = ref(0);

    let releaseBezier1X = 0;
    let releaseBezier1Y = 0;
    let releaseBezier2X = 0;
    let releaseBezier2Y = 0;

    const releaseEndX = ref(0);
    const releaseEndY = ref(0);

    const padding = 10;

    const activeAnchorId = ref("");

    let prevPageX = -1;
    let prevPageY = -1;

    const envActive = false;

    const envTime = computed(() => {
      return props.value.attack + props.value.decay + props.value.release;
    });

    const containerWidth = computed(() => {
      return props.width;
    });

    const containerHeight = computed(() => {
      return props.height > 0 ? props.height : props.width / 2.5;
    });

    const graphWidth = computed(() => {
      return containerWidth.value - padding * 2;
    });

    const graphHeight = computed(() => {
      return containerHeight.value - padding * 2;
    });

    const envHeight = computed(() => {
      return graphHeight.value * 1.0;
    });

    const attackTotalWidth = computed(() => {
      return attackWidthRatio * graphWidth.value;
    });

    const attackWidth = computed(() => {
      return attackTotalWidth.value * (props.value.attack / props.attackMax);
    });

    const decayTotalWidth = computed(() => {
      return decayWidthRatio * graphWidth.value;
    });

    const decayWidth = computed(() => {
      return decayTotalWidth.value * (props.value.decay / props.decayMax);
    });

    const sustainTotalWidth = computed(() => {
      return susatinWidthRatio * graphWidth.value;
    });

    const releaseTotalWidth = computed(() => {
      return releaseWidthRatio * graphWidth.value;
    });

    const releaseWidth = computed(() => {
      return releaseTotalWidth.value * (props.value.release / props.releaseMax);
    });

    const adsrPath = computed(() => {
      startX.value = padding;
      startY.value = graphHeight.value + padding;

      attackPeakX.value = attackWidth.value + padding;
      attackPeakY.value = padding;

      decayBezier1X = attackWidth.value + decayWidth.value/4 + padding;
      decayBezier1Y = (graphHeight.value - graphHeight.value * props.value.sustain)/2 + padding;
      decayBezier2X = attackWidth.value + decayWidth.value/2 + padding;
      decayBezier2Y = graphHeight.value - graphHeight.value * props.value.sustain + padding;

      decayEndX.value = attackWidth.value + decayWidth.value + padding;
      decayEndY.value = graphHeight.value - graphHeight.value * props.value.sustain + padding;

      sustainEndX.value = attackTotalWidth.value + decayTotalWidth.value + sustainTotalWidth.value;
      sustainEndY.value = graphHeight.value - graphHeight.value * props.value.sustain + padding;

      releaseBezier1X = attackTotalWidth.value
        + decayTotalWidth.value
        + sustainTotalWidth.value
        + releaseWidth.value/4;
      releaseBezier1Y = graphHeight.value
        - graphHeight.value
        * props.value.sustain/2
        + padding;
      releaseBezier2X = attackTotalWidth.value
        + decayTotalWidth.value
        + sustainTotalWidth.value
        + releaseWidth.value/2;
      releaseBezier2Y = graphHeight.value + padding;

      releaseEndX.value = sustainEndX.value + releaseWidth.value;
      releaseEndY.value  = graphHeight.value + padding;

      const start = `M ${startX.value} ${startY.value} `;
      const attackCurve = `L ${attackPeakX.value} ${attackPeakY.value} `;
      const decayCurve = `C
        ${decayBezier1X}
        ${decayBezier1Y}
        ${decayBezier2X}
        ${decayBezier2Y}
        ${decayEndX.value}
        ${decayEndY.value}`;
      const sustainCurve = `L ${sustainEndX.value} ${sustainEndY.value}`;
      const releaseCurve = `C 
        ${releaseBezier1X}
        ${releaseBezier1Y} 
        ${releaseBezier2X}
        ${releaseBezier2Y}
        ${releaseEndX.value }
        ${releaseEndY.value }`
      
      return start + attackCurve + decayCurve + sustainCurve + releaseCurve;
    });


    function attackAnchorMouseDown(e: MouseEvent | TouchEvent) {
      e.preventDefault ? e.preventDefault() : (e.returnValue = false);
      activeAnchorId.value = "attackAnchor";
    }

    function decaySustainAnchorMouseDown(e: MouseEvent | TouchEvent) {
      e.preventDefault ? e.preventDefault() : (e.returnValue = false);
      activeAnchorId.value = "decaySustainAnchor";
    }

    function releaseAnchorMouseDown(e: MouseEvent | TouchEvent) {
      e.preventDefault ? e.preventDefault() : (e.returnValue = false);
      activeAnchorId.value = "releaseAnchor";
    }

    function onMove(pageX: number, pageY: number) {
      let diffX, diffY: number;
      let diffAttack = 0;
      let diffDecay = 0;
      let diffSustain = 0;
      let diffRelease = 0;

      if (activeAnchorId.value != "") {
        switch (activeAnchorId.value) {
          case "attackAnchor":
            diffX = pageX - prevPageX;
            diffAttack = (diffX / attackTotalWidth.value) * props.attackMax;
            diffAttack =
              props.value.attack + diffAttack >= props.attackMax && diffAttack > 0
                ? props.attackMax - props.value.attack
                : props.value.attack + diffAttack <= 0 && diffAttack < 0
                ? 0
                : diffAttack;
            break;
          case "decaySustainAnchor":
            diffX = pageX - prevPageX;
            diffDecay = (diffX / decayTotalWidth.value) * props.decayMax;
            diffDecay =
              props.value.decay + diffDecay >= props.decayMax && diffDecay > 0
                ? props.decayMax - props.value.decay
                : props.value.decay + diffDecay <= 0 && diffDecay < 0
                ? 0
                : diffDecay;
            diffY = pageY - prevPageY;
            diffSustain = -(diffY / graphHeight.value);
            diffSustain =
              props.value.sustain + diffSustain >= 1.0 && diffSustain > 0
                ? 1.0 - props.value.sustain
                : props.value.sustain + diffSustain <= 0 && diffSustain < 0
                ? 0
                : diffSustain;
            break;
          case "releaseAnchor":
            diffX = pageX - prevPageX;
            diffRelease = (diffX / releaseTotalWidth.value) * props.releaseMax;
            diffRelease =
              props.value.release + diffRelease >= props.releaseMax && diffRelease > 0
                ? props.releaseMax - props.value.release
                : props.value.release + diffRelease <= 0 && diffRelease < 0
                ? 0
                : diffRelease;
            break;
        }
        context.emit("input", {
          attack: props.value.attack + diffAttack,
          decay: props.value.decay + diffDecay,
          sustain: props.value.sustain + diffSustain,
          release: props.value.release + diffRelease
        });
      }

      prevPageX = pageX;
      prevPageY = pageY;
    }

    function onMouseMove(e: MouseEvent) {
      onMove(e.pageX, e.pageY);
    }

    function onTouchMove(e: TouchEvent) {
      onMove(e.touches[0].pageX, e.touches[0].pageY)
    }

    function onMouseUp() {
      activeAnchorId.value = "";
    }

    function onMouseLeave() {
      activeAnchorId.value = "";
    }

    return {
      backgroundColor,
      envelopeColor,
      anchorColor,
      anchorRadius,
      ghostAnchorRadius,
      activeAnchorId,
      startX,
      startY,
      attackPeakX,
      attackPeakY,
      decayEndX,
      decayEndY,
      releaseEndX,
      releaseEndY,
      envTime,
      containerWidth,
      containerHeight,
      graphWidth,
      graphHeight,
      envHeight,
      attackTotalWidth,
      attackWidth,
      decayTotalWidth,
      decayWidth,
      sustainTotalWidth,
      releaseTotalWidth,
      releaseWidth,
      adsrPath,
      attackAnchorMouseDown,
      decaySustainAnchorMouseDown,
      releaseAnchorMouseDown,
      onMouseUp,
      onMouseLeave,
      onMove,
      onMouseMove,
      onTouchMove
    }
  }
});

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
#attackAnchorGhost, #attackAnchor {
  cursor: ew-resize;
}
#decaySustainAnchorGhost, #decaySustainAnchor {
  cursor: move;
}
#releaseAnchorGhost, #releaseAnchor {
  cursor: ew-resize;
}
.dragging {
  cursor: none;
}
.value-label {
  display: block;
  float: left;
  padding: 0 10px 0 10px;
  user-select: none;
}
.component-container {
  justify-content: center;
  display: flex;
}
</style>
