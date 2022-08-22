<template>
  <div
    class="bar-graph-container"
    ref="graphContainer"
    :style="cssVars"
    draggable="false"
  >
    <div
      v-for="col in columns"
      :key="col.index"
      class="bar-column"
      :class="[activeStep >= 0 && activeStep == col.index ? 'active' : '']"
      @mousedown="BarColumnMouseDown"
      @mousemove="BarColumnMouseMove($event, col)"
      @click="BarColumnClick($event, col)"
      draggable="false"
    >
      <div
        class="bar"
        :style="{
          height: `${col.height}px`,
        }"
        draggable="false"
      ></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from "vue";

interface GraphColumn {
  index: number;
  height: number;
  width: number;
  margin: number;
  value: number;
}

export default defineComponent({
  emits: ["update"],
  props: {
    valueSteps: { type: Number, required: true },
    numColumns: { type: Number, required: true },
    activeStep: { type: Number, required: false, default: -1 },
    graphWidth: { type: Number, required: false, default: 768 }
  },
  setup(props, context) {
    const maxHeight = 160;
    const barColor = "#70bfff";
    const activeBackgroundColor = "#243b4e";
    const barMargin = 2;
    let leftClickDown = false;

    const columns = ref(new Array<GraphColumn>(props.numColumns));

    for (let i = 0; i < props.numColumns; i++) {
      columns.value[i] = {
        index: i,
        margin: 2,
        height: 0,
        width: props.graphWidth / props.numColumns - 4, // subtract margin
        value: 0,
      };
    }

    const stepSize = computed(() => {
      return maxHeight / props.valueSteps;
    });

    const cssVars = computed(() => {
      return {
        "--maxHeight": `${maxHeight}px`,
        "--graphWidth": `${props.graphWidth}px`,
        "--barMargin": `${barMargin}px`,
        "--numColumns": `${props.numColumns}px`,
        "--barColor": barColor,
        "--activeBackgroundColor": activeBackgroundColor,
      }; 
    });

    function RefreshGraph() {
      // re-assign array for reactivity
      columns.value = [...columns.value];
    }

    function SnapToStep(input: number): number {
      const stepDeviation = input % stepSize.value;
      const inputFloor = Math.floor(input / stepSize.value);
      const value = stepDeviation > stepSize.value / 2
        ? inputFloor + 1
        : inputFloor;

      return value;
    }

    function randomize() {
      columns.value.forEach((col) => {
        col.value = SnapToStep(Math.floor(Math.random() * maxHeight));
        col.height = col.value * stepSize.value;
        context.emit("update", col.index, col.value);
      });

      RefreshGraph();
    }

    function setColumnValue(e: MouseEvent, col: GraphColumn) {
      if (e.currentTarget instanceof HTMLElement) {
        const rect = e.currentTarget.getBoundingClientRect();
        const clickY = maxHeight - (e.clientY - rect.top); // flip it so y-axis goes from bottom to top
        const steppedValue = SnapToStep(clickY);

        col.value = steppedValue;
        col.height = col.value * stepSize.value;

        context.emit("update", col.index, col.value);

        RefreshGraph();
      }
    }

    function BarColumnMouseMove(e: MouseEvent, col: GraphColumn) {
      e.stopPropagation();
      if (leftClickDown) {
        setColumnValue(e, col);
      }
    }

    function DocumentMouseUp() {
      leftClickDown = false;
      document.removeEventListener("mouseup", DocumentMouseUp);
    }

    function BarColumnMouseDown() {
      leftClickDown = true;
      document.addEventListener("mouseup", DocumentMouseUp);
    }

    function BarColumnClick(e: MouseEvent, col: GraphColumn) {
      e.stopPropagation();
      setColumnValue(e, col);
    }

    onMounted(() => randomize());

    return {
      cssVars,
      columns,
      BarColumnMouseDown,
      BarColumnMouseMove,
      BarColumnClick
    }
  }
});

</script>

<style scoped>
.bar-graph-container {
  background: black;
  height: calc(var(--maxHeight) + 2 * (var(--barMargin)));
  display: flex;
  cursor: url("../assets/edit-icon.png"), auto;
}
.bar-column {
  height: calc(var(--maxHeight) + 2 * (var(--barMargin)));
  display: flex;
  align-items: flex-end;
  cursor: pointer;
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
}
.bar-column.active {
  background: var(--activeBackgroundColor);
}
.bar {
  background: var(--barColor);
  margin: var(--barMargin);
  width: calc(((var(--graphWidth) - 4px) / 12) - 2 * (var(--barMargin)));
  display: inline-block;
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
}
</style>