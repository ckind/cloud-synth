<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />
      </div>

      <h2 class="menu-link">
        <span class="nav-link" to="/">CloudSynth.io</span>
      </h2>

      <h4 class="menu-link">
        <span class="menu-option" @click="showQuickStart = true">Quick Start</span>
      </h4>

      <h4 class="menu-link">
        <span class="menu-option" @click="showChangeLog = true">Change Log</span>
      </h4>

      <v-spacer></v-spacer>

      <v-btn href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank" text>
        <span class="mr-2">More Info</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

    <quick-start v-model="showQuickStart" />
    <presets v-model="showPresets" />
    <midi-settings v-model="showMidiSettings" />
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

export default Vue.extend({
  name: "App",

  components: {
    QuickStart,
    ChangeLog
  },

  data: () => ({
    showQuickStart: true,
    showChangeLog: false
  })
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
</style>
