<template>
  <v-app class="cloudSynth-app" style="background: rgba(0, 0, 0, 0)">
    <v-app-bar class="cloudSynth-app-bar" color="black" dark app>
      <h2 class="menu-link">
        <span class="nav-link" to="/">CloudSynth</span>
      </h2>

      <p>v0.1.3</p>

      <v-spacer></v-spacer>

      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
    </v-app-bar>

    <quick-start v-model="showQuickStart" />
    <change-log v-model="showChangeLog" />

    <v-navigation-drawer v-model="drawer" dark app>
      <v-list nav>
        <v-list-item-group active-class="text--accent-4">
          <v-list-item
            @click="
              () => {
                showQuickStart = true;
                drawer = false;
              }
            "
          >
            <v-list-item-title>Quick Start</v-list-item-title>
          </v-list-item>

          <v-list-item
            @click="
              () => {
                showChangeLog = true;
                drawer = false;
              }
            "
          >
            <v-list-item-title>Change Log</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import QuickStart from "@/components/modal content/QuickStart.vue";
import ChangeLog from "@/components/modal content/ChangeLog.vue";

export default defineComponent({
  name: "App",
  components: {
    QuickStart,
    ChangeLog,
  },
  setup() {
    const showQuickStart = ref(true);
    const showChangeLog = ref(false);
    const drawer = ref(false);

    return {
      showQuickStart,
      showChangeLog,
      drawer,
    };
  },
});
</script>

<style>
body {
  background-image: url("./assets/space-2.jpg") !important;
  background-size: 100%;
  background-repeat: repeat-y;
}
</style>

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
