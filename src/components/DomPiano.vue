<template>
  <!-- todo: this is kind of messy...should generate keys in a loop -->
  <!-- prettier-ignore -->
  <div :class="['keyboard', disabled ? 'disabled' : '']">
    <div v-if="$vuetify.breakpoint.mdAndUp" class="octave-section">
      <div id="key24" class="key">
        <div id="key25" class="black-key"></div>
      </div>
      <div id="key26" class="key">
        <div id="key27" class="black-key"></div>
      </div>
      <div id="key28" class="key"></div>
      <div id="key29" class="key">
        <div id="key30" class="black-key"></div>
      </div>
      <div id="key31" class="key">
        <div id="key32" class="black-key"></div>
      </div>
      <div id="key33" class="key">
        <div id="key34" class="black-key"></div>
      </div>
      <div id="key35" class="key"></div>
    </div>

    <div v-if="$vuetify.breakpoint.smAndUp" class="octave-section">
      <div id="key36" class="key">
        <div id="key37" class="black-key"></div>
      </div>
      <div id="key38" class="key">
        <div id="key39" class="black-key"></div>
      </div>
      <div id="key40" class="key"></div>
      <div id="key41" class="key">
        <div id="key42" class="black-key"></div>
      </div>
      <div id="key43" class="key">
        <div id="key44" class="black-key"></div>
      </div>
      <div id="key45" class="key">
        <div id="key46" class="black-key"></div>
      </div>
      <div id="key47" class="key"></div>
    </div>

    <div class="octave-section">
      <div id="key48" class="key">
        <div id="key49" class="black-key"></div>
      </div>
      <div id="key50" class="key">
        <div id="key51" class="black-key"></div>
      </div>
      <div id="key52" class="key"></div>
      <div id="key53" class="key">
        <div id="key54" class="black-key"></div>
      </div>
      <div id="key55" class="key">
        <div id="key56" class="black-key"></div>
      </div>
      <div id="key57" class="key">
        <div id="key58" class="black-key"></div>
      </div>
      <div id="key59" class="key"></div>
    </div>

    <div v-if="$vuetify.breakpoint.lgAndUp" class="octave-section">
      <div id="key60" class="key">
        <div id="key61" class="black-key"></div>
      </div>
      <div id="key62" class="key">
        <div id="key63" class="black-key"></div>
      </div>
      <div id="key64" class="key"></div>
      <div id="key65" class="key">
        <div id="key66" class="black-key"></div>
      </div>
      <div id="key67" class="key">
        <div id="key68" class="black-key"></div>
      </div>
      <div id="key69" class="key">
        <div id="key70" class="black-key"></div>
      </div>
      <div id="key71" class="key"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted, watch, getCurrentInstance} from "vue";

export interface IDomPiano {
  displayKeyDown(keyNumber: number): void;
  displayKeyUp(keyNumber: number): void;
}

export default defineComponent({
  emits: ["keySlideOn", "keySlideOff", "keyMouseDown", "keyMouseUp"],
  props: {
    disabled: { type: Boolean, required: false, default: false },
  },
  setup(props, context) {
    const keyPressedColor = "#ff2929";
    const blackKeys = [1, 3, 6, 8, 10];

    function displayKeyDown(keyNumber: number) {
      const key: HTMLElement | null = document.querySelector(`#key${keyNumber}`);
      if (key != null) {
        key.style.background = keyPressedColor;
      }
    }

    function displayKeyUp(keyNumber: number) {
      const key: HTMLElement | null = document.querySelector(`#key${keyNumber}`);
      if (key != null) {
        key.style.background = blackKeys.includes(keyNumber % 12)
          ? "black"
          : "white";
      }
    }

    function getKeyNum(e: Event) {
      const el = e.target as HTMLElement;
      return parseInt(el.id.replace("key", ""));
    }

    function keySlideOn(e: Event) {
      e.stopPropagation();
      if (!props.disabled) {
        context.emit("keySlideOn", getKeyNum(e))
      }
    }

    function keySlideOff(e: Event) {
      e.stopPropagation();
      if (!props.disabled) {
        context.emit("keySlideOff", getKeyNum(e));
      }
    }

    function keyMouseDown(e: Event) {
      e.stopPropagation();
      if (!props.disabled) {
        context.emit("keyMouseDown", getKeyNum(e));
      }
    }

    function keyMouseUp(e: Event) {
      e.stopPropagation();
      if (!props.disabled) {
        context.emit("keyMouseUp", getKeyNum(e));
      }
    }

    function assignKeyboardListeners() {
      const keys = document.querySelectorAll(
        "div.keyboard div.key, div.keyboard div.black-key"
      );
      for (const key of keys) {
        key.addEventListener("mousedown", keyMouseDown);
        key.addEventListener("mouseup", keyMouseUp);
        key.addEventListener("mouseover", keySlideOn);
        key.addEventListener("mouseout", keySlideOff);
        key.addEventListener("touchstart", keyMouseDown);
        key.addEventListener("touchend", keyMouseUp);
        // todo: need to implement keySlideOn and keySlideOff for touch events - see: https://gist.github.com/VehpuS/6fd5dca2ea8cd0eb0471
      }
    }

    function clearKeyboardListeners() {
      const keys = document.querySelectorAll(
        "div.keyboard div.key, div.keyboard div.black-key"
      );
      for (const key of keys) {
        key.removeEventListener("mousedown", keyMouseDown);
        key.removeEventListener("mouseup", keyMouseUp);
        key.removeEventListener("mouseover", keySlideOn);
        key.removeEventListener("mouseout", keySlideOff);
        key.removeEventListener("touchstart", keyMouseDown);
        key.removeEventListener("touchend", keyMouseUp);
      }
    }

    function resetKeyboardListeners() {
      clearKeyboardListeners();
      assignKeyboardListeners();
      console.log("foo");
    }

    onMounted(() => {
      assignKeyboardListeners();
    });

    onBeforeUnmount(() => {
      clearKeyboardListeners();
    });

    // todo: need to fix this
    // watch(getCurrentInstance()?.proxy.$vuetify.breakpoint.name, () => {
    //   resetKeyboardListeners();
    // });

    return {
      displayKeyDown,
      displayKeyUp
    }
  },
});
</script>

<style scoped>
/* keyboard */
.keyboard {
  padding-left: 0px;
  border-radius: 5px; /* should be the same as .key */
  height: 140px;
}
.keyboard .key {
  position: relative;
  width: 30px;
  height: 130px;
  border: 1px solid black;
  border-right: none;
  background: #ffffff;
  border-radius: 5px;
  cursor: pointer;
  user-select: none;
  display: inline-block;
}
.keyboard.disabled .key {
  cursor: default;
}
.keyboard .black-key {
  position: absolute;
  top: -1px;
  left: 20px;
  width: 20px;
  height: 80px;
  background: black;
  border-radius: 5px;
  box-shadow: 0px 3px 5px #666;
  z-index: 2;
  user-select: none;
  display: inline-block;
}
.keyboard > .key:last-child {
  border-right: 1px solid black;
}
.octave-section {
  display: inline-block;
}
</style>