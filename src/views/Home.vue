<template>
  <div class="home">
    <session></session>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Session from "@/views/Session.vue";

export default defineComponent({
  components: {
    Session
  }
});
</script>

<style scoped></style>
