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
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({})
export default class PresetDropdown extends Vue {
  private selectedOption = 0;

  @Prop({ required: true })
  public options!: any[];

  @Prop({ required: false, default: false })
  public dark!: boolean;

  @Prop({ required: false, default: false })
  public slim!: boolean;

  constructor() {
    super();
  }

  mounted() {
    this.pageSelected(this.options[0], 0);
  }

  pageSelected(option: any, i: number) {
    this.selectedOption = i;
    this.$forceUpdate();
    this.$emit("pageSelected", option);
  }
}
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
