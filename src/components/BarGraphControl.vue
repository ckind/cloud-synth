<template>
  <div class="bar-graph-container">
    <div
      v-for="col in columns"
      :key="col.index"
      class="bar-column"
      :class="[activeStep >= 0 && activeStep == col.index ? 'active' : '']"
      @mousedown="BarColumnMouseDown"
      @mouseover="BarColumnMouseOver($event, col)"
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
  value: number;
}

@Component({})
export default class KnobControl extends Vue {
  private barHeight = 160;
  private barWidth = 25;
  private barColor = "#70bfff";
  private columns: GraphColumn[];
  private leftClickDown = false;

  public constructor() {
    super();

    this.columns = new Array<GraphColumn>(this.numColumns);
    for (let i = 0; i < this.numColumns; i++) {
      this.columns[i] = {
        index: i,
        height: 0,
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

  // Lifecycle Hooks

  mounted() {
    this.randomize();
  }

  // Computed

  get stepSize() {
    return this.barHeight / this.valueSteps;
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
      col.value = this.SnapToStep(Math.floor(Math.random() * this.barHeight));
      col.height = col.value * this.stepSize;
			this.$emit("update", col.index, col.value);
    });
  }

  BarColumnMouseOver(e: MouseEvent, col: GraphColumn) {
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
      const clickY = this.barHeight - (e.clientY - rect.top); // flip it so y-axis goes from bottom to top
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
  height: 160px;
  display: flex;
}
.bar-column {
  height: 160px;
  width: 60px;
  display: flex;
  align-items: flex-end;
  cursor: pointer;
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
}
.bar-column.active {
  background: rgb(36, 59, 78);
}
.bar {
  background: #70bfff;
  width: 100%;
  margin: 2px;
  display: inline-block;
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
}
</style>