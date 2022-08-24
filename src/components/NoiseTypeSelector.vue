<template>
  <div class="noise-type-selector-container">
    <div v-if="value === 'white'" @click="changeType(0)">
			<div class="noise-type-option white"></div>
		</div>
    <div v-if="value === 'pink'" @click="changeType(1)">
			<div class="noise-type-option pink"></div>
		</div>
    <div v-if="value === 'brown'" @click="changeType(2)">
			<div class="noise-type-option brown"></div>
		</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { NoiseType as ToneNoiseType } from "tone";

export default defineComponent({
  emits: ["input"],
  props: {
    value: { type: String as PropType<ToneNoiseType>, required: true }
  },
  setup(props, context) {
    const noiseTypes: Array<ToneNoiseType> = [
      "white", "pink", "brown"
    ];

    function changeType(i: number) {
      context.emit("input", noiseTypes[(i + 1) % noiseTypes.length]);
    }

    return {
      changeType
    }
  }
});

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
