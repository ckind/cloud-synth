<template>
  <v-app class="cloudSynth-app">
    <v-app-bar class="cloudSynth-app-bar" app color="black" dark>
      <h2 class="menu-link">
        <span class="nav-link" to="/">CloudSynth</span>
      </h2>
       <p>v0.1.3</p>

      <h4 class="menu-link">
        <span class="menu-option" @click="showQuickStart = true">Quick Start</span>
      </h4>

      <h4 class="menu-link">
        <span class="menu-option" @click="showChangeLog = true">Change Log</span>
      </h4>

      <h4 class="menu-link">
        <span class="menu-option" @click="test">Tutorials</span>
      </h4>

      <v-spacer></v-spacer>

      <v-btn href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank" text>
        <span class="mr-2">More Info</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

    <quick-start v-model="showQuickStart" />
    <change-log v-model="showChangeLog" />

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import QuickStart from "./components/modal content/QuickStart.vue";
import ChangeLog from "./components/modal content/ChangeLog.vue";
import { Filter, Signal } from "tone";
import { VANoiseSynth } from "@/shared/classes/synth/VANoiseSynth";

export default Vue.extend({
  name: "App",

  components: {
    QuickStart,
    ChangeLog
  },

  data: () => ({
    showQuickStart: true,
    showChangeLog: false
  }),

  methods: {
    test: () => {
      // const s = new Signal<"frequency">(1000);
      // const f = new Filter();
      // s.connect(f.frequency);
      // s.disconnect(f.frequency);
      // s.dispose();
      // f.dispose();
      const n = new VANoiseSynth("white");
      n.dispose();
    }
  }
});
</script>

<style scoped>
.nav-link {
  padding: 0px 10px 0px 10px;
  color: white;
  text-decoration: none;
  user-select: none;
}
.menu-option {
  padding: 0px 10px 0px 10px;
  color: white;
  text-decoration: none;
  cursor: pointer;
}
.menu-option:active {
  opacity: 0.7;
}
.cloudSynth-app-bar {
  font-family: "Courier";
}
.cloudSynth-app {
  /* global styles here */
}
</style>
