<template>
  <div class="noise-type-selector-container">
    <div v-if="myValue === 'white'" @click="changeType(0)">
			<div class="noise-type-option white"></div>
		</div>
    <div v-if="myValue === 'pink'" @click="changeType(1)">
			<div class="noise-type-option pink"></div>
		</div>
    <div v-if="myValue === 'brown'" @click="changeType(2)">
			<div class="noise-type-option brown"></div>
		</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { NoiseType as ToneNoiseType } from "tone";

@Component({})
export default class NoiseTypeSelector extends Vue {
  private noiseTypes: Array<ToneNoiseType>;
  private myValue: ToneNoiseType;

  // for some reason vue complains about this if its required
  // even if you have v-model
  @Prop({ required: false })
  public value!: ToneNoiseType;

  constructor() {
    super();

    this.myValue = "white";

    this.noiseTypes = new Array<ToneNoiseType>(3);
    this.noiseTypes[0] = "white";
    this.noiseTypes[1] = "pink";
    this.noiseTypes[2] = "brown";
  }

  changeType(i: number) {
    this.myValue = this.noiseTypes[(i + 1) % this.noiseTypes.length];
    this.$emit("input", this.myValue);
  }

  @Watch("value")
  onValueChanged(incomingValue: ToneNoiseType) {
    this.myValue = incomingValue;
  }
}
</script>

<style scoped>
.noise-type-selector-container {
  background: black;
  padding: 5px;
  border: 1px solid white;
}
.noise-type-selector-container:hover {
  cursor: pointer;
}
.noise-type-selector-container:active {
  opacity: 0.5;
}

.noise-type-option {
	height: 30px;
	width: 30px;
  padding: 5px;
}
.noise-type-option.white {
	background: white;
}
.noise-type-option.pink {
	background: pink;
}
.noise-type-option.brown {
	background: brown;
}
</style>
