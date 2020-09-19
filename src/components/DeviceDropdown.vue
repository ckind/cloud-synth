<template>
  <v-menu :close-on-content-click="false" dark bottom offset-y nudge-top="12">
    <template v-slot:activator="{ on }">
      <v-text-field
        dense
        dark
        v-on="on"
        readonly
        :value="selectedDeviceName"
        :label="label"
      />
    </template>
    <v-list>
      <v-divider></v-divider>
      <span v-for="device in devices" :key="device">
        <v-list-item link @click="deviceSelected(device)">
          {{ device }}
        </v-list-item>
        <v-divider></v-divider>
      </span>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { IDevice } from "@/shared/interfaces/devices/IDevice";

@Component({})
export default class DeviceDropdown extends Vue {
  @Prop({ required: true })
  public devices!: string[];

  @Prop({ required: true })
  public selectedDeviceName!: string[];

  @Prop({ required: true })
  public label!: string;

  constructor() {
    super();
  }

  deviceSelected(deviceName: string) {
    this.$emit("deviceSelected", deviceName);
  }
}
</script>
