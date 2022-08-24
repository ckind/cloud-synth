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
import { defineComponent } from "vue";

export default defineComponent({
  emits: ["deviceSelected"],
  props: {
    devices: { type: Array<string>, required: true },
    selectedDeviceName: { type: String, required: true },
    label: { type: String, required: true }
  },
  setup(props, context) {
    function deviceSelected(deviceName: string) {
      context.emit("deviceSelected", deviceName);
    }

    return {
      deviceSelected
    }
  }
});

</script>
