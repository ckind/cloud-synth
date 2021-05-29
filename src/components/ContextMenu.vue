<template>
  <div class="context-menu-container">
    <v-list :dark="dark">
			<v-list-item v-for="(option, i) in options" :key ="i" link @click="optionSelected(option)">
				{{ option }}
			</v-list-item>
    </v-list>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

@Component({})
export default class ContextMenu extends Vue {
	private showMenu: boolean;

	@Prop({ required: true })
  public x!: number;

	@Prop({ required: true })
  public y!: number;

	@Prop({ required: true })
  public value!: boolean;

	@Prop({ required: true })
  public options!: string[];

	@Prop({ required: false, default: true })
  public dark!: boolean;

	get cssVars() {
		return {
			"--x": ""
		}
	}

  constructor() {
    super();

		this.showMenu = this.value;
  }

	private optionClicked(option: string) {
		this.$emit('optionSelected', option);
	}

	@Watch("showMenu")
  private showMenuChanged(newValue: boolean) {
    this.$emit("input", newValue);
  }
}
</script>

<style scoped>
.context-menu-container {
	position: absolute;
}
</style>