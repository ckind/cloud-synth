<template>
  <div class="home">
    <session></session>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Session from "@/views/Session.vue";

@Component({
  components: {
    Session
  }
})
export default class Home extends Vue {
  public constructor() {
    super();
  }

  // Lifecycle Hooks

  // Computed

  // Methods

  // Watches
}
</script>

<style scoped></style>
