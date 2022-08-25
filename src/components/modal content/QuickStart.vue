<template>
  <v-dialog
    :value="value"
    @input="onInput"
    dark
    max-width="600"
  >
    <v-card>
      <v-card-title class="headline">Quick Start</v-card-title>

      <v-card-text>
        <div v-if="$vuetify.breakpoint.mobile">
          <p>
            Please ensure that the ringer and/or volume on your device is
            unmuted for the best possible experience.
          </p>
          <p>Tap the keyboard to play notes.</p>
          <p>
            Touch and drag the Knobs and Envelope Anchors to discover new
            sounds!
          </p>
        </div>

        <div v-else>
          <p>
            Use the A, W, S, E, D, F, T, G, Y, H, U, J, K, O, L keys or click
            the piano keys to play notes.
          </p>
          <p>
            Use the Z and X keys to change octave and the C and V keys to
            transpose (default is Key A = C3).
          </p>
          <p>
            Click and drag the Knobs and Envelope Anchors to discover new
            sounds!
          </p>
        </div>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="closeDialog"> Got it! </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  emits: ["input"],
  props: { 
    value: { type: Boolean, required: true }
  },
  setup(props, context) {

    function onInput(val: boolean) {
      context.emit("input", val);
    }

    function closeDialog() {
      context.emit("input", false);
    }

    return {
      onInput,
      closeDialog
    }
  }
});

</script>
