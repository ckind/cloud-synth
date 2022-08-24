<template>
  <div class="page-container">
    <div
      v-for="(option, i) in options"
      :key="i"
      :class="[
        'page',
        i === 0 ? 'first-page' : '',
        i === options.length - 1 ? 'last-page' : '',
        slim ? 'slim' : 'standard',
        selectedOption === i ? (dark ? 'selected-dark' : 'selected-light') : ''
      ]"
      @click="pageSelected(option, i)"
    >
      {{ option.label ? option.label : "" }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, PropType } from "vue";

export default defineComponent({
  emits: ["pageSelected"],
  props: {
    options: { type: Array as PropType<Array<any>>, required: true },
    dark: { type: Boolean, required: false, default: false },
    slim: { type: Boolean, required: false, default: false }
  },
  setup(props, context) {
    const selectedOption = ref(0);

    function pageSelected(option: any, i: number) {
      selectedOption.value = i;
      // this.$forceUpdate(); // todo: how to do this?
      context.emit("pageSelected", option);
    }

    onMounted(() => {
      pageSelected(props.options[0], 0);
    });

    return {
      selectedOption,
      pageSelected
    }
  }
});
</script>

<style scoped>
.page-container {
  display: flex;
}
.page {
  display: inline-block;
  border-left: 1px solid gray;
  border-top: 1px solid gray;
  border-bottom: 1px solid gray;
  background-color: white;
  cursor: pointer;
  color: gray;
  text-align: center;
}
.page:active {
  opacity: 0.7;
}
.selected-light {
  background-color: #2196f3;
  color: white;
}
.selected-dark {
  background-color: #323232;
  color: white;
}
.first-page {
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
}
.last-page {
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  border-right: 1px solid gray;
}
.standard {
  width: 16px;
  height: 22px;
  line-height: 22px;
}
.slim {
  width: 14px;
  height: 12px;
  line-height: 12px;
}
</style>
