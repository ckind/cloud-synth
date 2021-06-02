<template>
  <v-menu
    v-model="showMenu"
    :close-on-content-click="false"
    dark
    bottom
    offset-y
    nudge-top="10"
  >
    <template v-slot:activator="{ on }">
      <v-text-field
        dense
        dark
        v-on="on"
        readonly
        :value="selectedPreset.name"
        :label="label"
      />
    </template>
    <v-list>
      <v-divider></v-divider>
      <span v-for="category in bank.categories" :key="category.category">
        <v-list-item link>
          <v-menu
            dark
            bottom
            offset-x
            close-on-click
            open-on-hover
            nudge-top="12"
          >
            <template v-slot:activator="{ on }">
              <v-list-item v-on="on">{{ category.category }}</v-list-item>
            </template>
            <v-list>
              <v-list-item
                v-for="preset in category.presets"
                :key="preset.name"
                @click="presetSelected(preset)"
                link
              >
                {{ preset.name }}
              </v-list-item>
            </v-list>
          </v-menu>
        </v-list-item>
        <v-divider></v-divider>
      </span>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { IPresetBank } from "@/shared/interfaces/presets/IPresetBank";
import { IPreset } from "@/shared/interfaces/presets/IPreset";

@Component({})
export default class PresetDropdown extends Vue {
  @Prop({ required: true })
  public bank!: IPresetBank;

  @Prop({ required: true })
  public selectedPreset!: IPreset;

  @Prop({ required: true })
  public label!: string;

  private showMenu = false;

  constructor() {
    super();
  }

  presetSelected(p: IPreset) {
    this.showMenu = false;
    this.$emit("presetSelected", p);
  }
}
</script>
