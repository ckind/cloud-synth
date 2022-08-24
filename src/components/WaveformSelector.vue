<template>
  <div class="waveform-selector-container">
    <div v-if="value === 'sine'" @click="changeType(0)">
      <svg
        width="30px"
        height="30px"
        viewBox="0 0 51.136906 45.564983"
        version="1.1"
        id="sine-svg"
        sodipodi:docname="sine-wave.svg"
      >
        <g id="layer1" transform="translate(-49.837797,-51.347893)">
          <path
            style="
              fill: none;
              stroke: #ffffff;
              stroke-width: 4;
              stroke-linecap: round;
              stroke-linejoin: miter;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
            d="m 50.837797,74.650295 c 7.908478,-29.640687 16.169566,-29.832234 23.623512,10e-7 8.169287,28.714074 18.53051,27.733924 25.513393,0.755954"
            id="path841"
            sodipodi:nodetypes="ccc"
          />
        </g>
      </svg>
    </div>
    <div v-if="value === 'triangle'" @click="changeType(1)">
      <svg
        width="30px"
        height="30px"
        viewBox="0 0 51.892857 53.321285"
        version="1.1"
        id="svg8"
        inkscape:version="1.0.2-2 (e86c870879, 2021-01-15)"
        sodipodi:docname="triangle-wave.svg"
      >
        <g
          inkscape:label="Layer 1"
          inkscape:groupmode="layer"
          id="layer1"
          transform="translate(-49.270833,-47.275439)"
        >
          <path
            style="
              fill: none;
              stroke: #FFFFFF;
              stroke-width: 4;
              stroke-linecap: round;
              stroke-linejoin: miter;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
            d="M 50.270833,99.407736 75.406249,49.51488 100.16369,99.596726"
            id="path841"
            sodipodi:nodetypes="ccc"
          />
        </g>
      </svg>
    </div>
    <div v-if="value === 'sawtooth'" @click="changeType(2)">
      <svg
        width="30px"
        height="30px"
        viewBox="0 0 51.892857 53.697987"
        version="1.1"
        id="saw-svg"
        sodipodi:docname="saw-wave.svg"
      >
        <g
          inkscape:label="Layer 1"
          inkscape:groupmode="layer"
          id="layer1"
          transform="translate(-49.270833,-47.276712)"
        >
          <path
            style="
              fill: none;
              stroke: #ffffff;
              stroke-width: 4;
              stroke-linecap: round;
              stroke-linejoin: miter;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
            d="M 50.270833,99.9747 100.16369,49.703868 v 50.081846"
            id="path841"
          />
        </g>
      </svg>
    </div>
    <div v-if="value === 'square'" @click="changeType(3)">
      <svg
        width="30px"
        height="30px"
        viewBox="0 0 51.325893 50.947918"
        version="1.1"
        id="svg8"
        sodipodi:docname="square-wave.svg"
      >
        <g
          inkscape:label="Layer 1"
          inkscape:groupmode="layer"
          id="layer1"
          transform="translate(-48.703868,-49.459819)"
        >
          <path
            style="
              fill: none;
              stroke: #ffffff;
              stroke-width: 4;
              stroke-linecap: round;
              stroke-linejoin: miter;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
            d="m 49.703868,50.459819 24.568452,0.188989 0.188989,48.75893 h 24.568453"
            id="path841"
            sodipodi:nodetypes="ccc"
          />
        </g>
      </svg>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { ToneOscillatorType } from "tone";

export default defineComponent({
  emits: ["input"],
  props: {
    value: { type: String as PropType<ToneOscillatorType>, required: true }
  },
  setup(props, context) {
    const waveforms: Array<ToneOscillatorType> = [
      "sine",
      "triangle",
      "sawtooth",
      "square"
    ];

    function changeType(i: number) {
      context.emit("input", waveforms[(i + 1) % waveforms.length]);
    }

    return {
      changeType
    }
  }
});

</script>

<style scoped>
.waveform-selector-container {
  background: black;
  padding: 5px;
  border: 1px solid white;
}
.waveform-selector-container:hover {
  cursor: pointer;
}
.waveform-selector-container:active {
  opacity: 0.5;
}
</style>
