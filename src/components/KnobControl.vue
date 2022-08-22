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
import { defineComponent, computed, ref, watch } from "vue";
import type { PropType } from "vue"
import { CurvedRangeFactory, CurvedRangeType } from "@/shared/factories/CurvedRangeFactory";

export default defineComponent({
  emits: ["input"],
  props: {
    value: { type: Number, required: true },
    minValue: { type: Number, required: true },
    maxValue: { type: Number, required: true },
    id: { type: String, required: true },
    scale: { type: String as PropType<CurvedRangeType>, required: false, default: "linear" },
    step: { type: Number, required: false, default: 0 },
    label: { type: String, required: false, default: "" },
    units: { type: String, required: false, default: "" },
    size: { type: Number, required: false, default: 100 },
    default: { type: Number, required: false },
    shadow: { type: Boolean, required: false },
    shadowColor: { type: String, required: false, default: "black"}
  },
  setup(props, context) {
    // reactive data
    const valueCurve = ref(CurvedRangeFactory.getCurvedRange(
      props.scale,
      props.minValue,
      props.maxValue
    ));
    const linearValue = ref(props.value);
    const curvedValue = ref(valueCurve.value.getCurvedValue(props.value));
    const unsteppedValue = ref(curvedValue.value);
    const prevY = ref(-1);
    const rotationMax = ref((3 * Math.PI) / 4);
    const dragRange = ref(70);

    // computed
    const cssVars = computed(() => {
      return {
        "--shadowColor": props.shadowColor,
      };
    });

    const valueRange = computed(() => {
      return props.maxValue - props.minValue;
    });

    const midValue = computed(() => {
      return props.minValue + valueRange.value / 2;
    });

    const knobRotation = computed(() => {
      const offset = linearValue.value - midValue.value;
      return (offset / (valueRange.value / 2)) * rotationMax.value;
    });

    // methods
    function roundToStep(x: number) {
      if (props.step === 0) {
        throw "step is zero or undefined";
      }

      const roundedValue = Math.round(x / props.step) * props.step;

      return roundedValue < props.minValue
        ? props.minValue
        : roundedValue > props.maxValue
          ? props.maxValue
          : roundedValue;
    }

    function onKnobDrag(currY: number) {
      if (prevY.value >= 0) {
        const diffY = prevY.value - currY;
        let knobValue = unsteppedValue.value + (diffY / dragRange.value) * (valueRange.value / 2);
        knobValue = knobValue > props.maxValue
            ? props.maxValue
            : knobValue < props.minValue
              ? props.minValue
              : knobValue;
        unsteppedValue.value = knobValue;
        const steppedValue =
          props.step === 0
            ? unsteppedValue.value
            : roundToStep(unsteppedValue.value);
        context.emit("input", valueCurve.value.getCurvedValue(steppedValue));
      }
    }

    function onKnobTouchDrag(e: TouchEvent) {
      onKnobDrag(e.touches[0].pageY);
      prevY.value = e.touches[0].pageY;
    }

    function onKnobMouseDrag(e: MouseEvent) {
      onKnobDrag(e.pageY);
      prevY.value = e.pageY;
    }

    function onDocumentMouseUp() {
      document.removeEventListener("mousemove", onKnobMouseDrag);
      document.removeEventListener("touchmove", onKnobTouchDrag);
      document.removeEventListener("mouseup", onDocumentMouseUp);
      document.removeEventListener("touchend", onDocumentMouseUp);
      prevY.value = -1;
    }

    function onKnobMouseDown(e: MouseEvent) {
      e.preventDefault ? e.preventDefault() : (e.returnValue = false);
      document.addEventListener("mousemove", onKnobMouseDrag);
      document.addEventListener("touchmove", onKnobTouchDrag);
      document.addEventListener("mouseup", onDocumentMouseUp);
      document.addEventListener("touchend", onDocumentMouseUp);
    }

    function onKnobDblClick() {
      const value = typeof props.default === "undefined"
        ? midValue.value
        : props.default;
      unsteppedValue.value = value;
      context.emit("input", valueCurve.value.getCurvedValue(value));
    }

    watch(() => props.value, function (newValue: number) {
      curvedValue.value = newValue;
      unsteppedValue.value = valueCurve.value.getLinearValue(curvedValue.value);
      linearValue.value =
        props.step === 0
          ? unsteppedValue.value
          : roundToStep(unsteppedValue.value);
    });

    return {
      knobRotation,
      cssVars,
      onKnobMouseDown,
      onKnobDblClick
    }
  }
});

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
