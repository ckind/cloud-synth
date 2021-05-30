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
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

interface GraphColumn {
  index: number;
  height: number;
  width: number;
  margin: number;
  value: number;
}

@Component({})
export default class BarGraphControl extends Vue {
  private maxHeight = 160;
  private barColor = "#70bfff";
  private activeBackgroundColor = "#243b4e";
  private barMargin = 2;
  private columns: GraphColumn[];
  private leftClickDown = false;
  private prevY: number | undefined;

  public constructor() {
    super();

    this.columns = new Array<GraphColumn>(this.numColumns);
    for (let i = 0; i < this.numColumns; i++) {
      this.columns[i] = {
        index: i,
        margin: 2,
        height: 0,
        width: this.graphWidth / this.numColumns - 4, // subtract margin
        value: 0,
      };
    }
  }

  @Prop({ required: true })
  public valueSteps!: number;

  @Prop({ required: true })
  public numColumns!: number;

  @Prop({ required: false, default: -1 })
  public activeStep!: number;

  @Prop({ required: false, default: 768 })
  public graphWidth!: number;

  // Lifecycle Hooks

  mounted() {
    this.randomize();
  }

  // Computed

  get stepSize() {
    return this.maxHeight / this.valueSteps;
  }

  get cssVars() {
    return {
      "--maxHeight": `${this.maxHeight}px`,
      "--graphWidth": `${this.graphWidth}px`,
      "--barMargin": `${this.barMargin}px`,
      "--numColumns": `${this.numColumns}px`,
      "--barColor": this.barColor,
      "--activeBackgroundColor": this.activeBackgroundColor,
    };
  }

  // Methods

  private SnapToStep(input: number): number {
    const stepDeviation = input % this.stepSize;
    const inputFloor = Math.floor(input / this.stepSize);
    const value =
      stepDeviation > this.stepSize / 2 ? inputFloor + 1 : inputFloor;

    return value;
  }

  randomize() {
    this.columns.forEach((col) => {
      col.value = this.SnapToStep(Math.floor(Math.random() * this.maxHeight));
      col.height = col.value * this.stepSize;
      this.$emit("update", col.index, col.value);
    });
  }

  BarColumnMouseMove(e: MouseEvent, col: GraphColumn) {
    e.stopPropagation();
    if (this.leftClickDown) {
      this.setColumnValue(e, col);
    }
  }

  BarColumnMouseDown() {
    this.leftClickDown = true;
    document.addEventListener("mouseup", this.DocumentMouseUp);
  }

  DocumentMouseUp() {
    this.leftClickDown = false;
    document.removeEventListener("mouseup", this.DocumentMouseUp);
  }

  private setColumnValue(e: MouseEvent, col: GraphColumn) {
    if (e.currentTarget instanceof HTMLElement) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickY = this.maxHeight - (e.clientY - rect.top); // flip it so y-axis goes from bottom to top
      const steppedValue = this.SnapToStep(clickY);

      col.value = steppedValue;
      col.height = col.value * this.stepSize;

      this.$emit("update", col.index, col.value);
    }
  }

  private BarColumnClick(e: MouseEvent, col: GraphColumn) {
    e.stopPropagation();
    this.setColumnValue(e, col);
  }
}
</script>

<style scoped>
.bar-graph-container {
  background: black;
  height: calc(var(--maxHeight) + 2 * (var(--barMargin)));
  display: flex;
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