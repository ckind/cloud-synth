<template>
  <v-dialog v-model="value" dark max-width="600">
    <v-card>
      <v-card-title class="headline">Presets</v-card-title>

      <v-card-text>
        <p>
          Use the A, W, S, E, D, F, T, G, Y, H, U, J, K, O, L keys to play
          notes.
        </p>
        <p>
          Use the Z and X keys to change octave and the C and V keys to
          transpose (default is Key A = C3).
        </p>
        <p>
          If you're unfamiliar with the controls try browsing the
          <a>presets</a> to discover new sounds.
        </p>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="closeDialog">
          Got it!
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({})
export default class QuickStart extends Vue {
  @Prop({ required: true })
  public value!: boolean;

  constructor() {
    super();
  }

  private closeDialog() {
    this.$emit("input", false);
  }
}
</script>
