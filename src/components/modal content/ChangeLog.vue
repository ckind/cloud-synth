<template>
  <v-dialog
    :value="value"
    @input="onInput"
    dark
    max-width="600"
  >
    <v-card>
      <v-card-title class="headline">{{ title }}</v-card-title>

      <v-card-text>
        <ul class="change-list">
          <li v-for="(message, index) in commitMessages" :key="index">
            {{ message }}
          </li>
        </ul>
        <a href="https://github.com/ckind/JvaSynth" target="_blank"
          >view source</a
        >
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="closeDialog">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { Octokit } from "@octokit/rest";

export default defineComponent({
  emits: ["input"],
  props: {
    value: { type: Boolean, required: true }
  },
  setup(props, context) {
    const commitMessages = ref(new Array<string>());
    const title = ref("Change Log");

    function closeDialog() {
      context.emit("input", false);
    }

    function onInput(val: boolean) {
      context.emit("input", val);
    }

    onMounted(() => {
      const octokit = new Octokit();
      octokit.repos
        .listCommits({
          owner: "ckind",
          repo: "JvaSynth",
        })
        .then((response) => {
          response.data.forEach((c) => {
            commitMessages.value.push(c.commit.message);
          });
        })
        .catch(() => {
          title.value = "Error Loading Commits";
        });
    });

    return {
      commitMessages,
      title,
      closeDialog,
      onInput
    }
  }
});

</script>

<style scoped>
.change-list {
  overflow-y: scroll;
  max-height: 50vh;
}
</style>
