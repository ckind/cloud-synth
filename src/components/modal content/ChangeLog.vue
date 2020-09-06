<template>
  <v-dialog v-model="value" dark max-width="600">
    <v-card>
      <v-card-title class="headline">Change Log</v-card-title>

      <v-card-text>
        <ul>
          <li v-for="(message, index) in commitMessages" :key="index">{{ message }}</li>
        </ul>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="closeDialog">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Octokit } from "@octokit/rest";

@Component({})
export default class ChangeLog extends Vue {
  @Prop({ required: true })
  public value!: boolean;
  private commitMessages: string[];
  private title = "Change Log";

  constructor() {
    super();
    const octokit = new Octokit();
    this.commitMessages = [];
    octokit.repos
      .listCommits({
        owner: "ckind",
        repo: "JvaSynth"
      })
      .then(response => {
        response.data.forEach(c => {
          this.commitMessages.push(c.commit.message);
        });
      })
      .catch(() => {
        this.title = "Error Loading Commits";
      });
  }

  private closeDialog() {
    this.$emit("input", false);
  }
}
</script>
