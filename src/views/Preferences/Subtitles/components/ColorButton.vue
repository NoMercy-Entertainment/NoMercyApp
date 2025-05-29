<script setup lang="ts">
import {PropType} from 'vue';

defineProps({
  color: {
    type: Object as PropType<{ label: string, color: string }>,
    required: true,
  },
  currentColor: {
    required: true,
  },
  setCurrentColor: {
    type: Function as PropType<(color: string) => void>,
    required: true,
  },
});

</script>

<template>
  <button :title="color?.label"
          @click="setCurrentColor(color.color)"
          class="relative box-border flex h-7 w-7 min-w-7 min-h-7 transform cursor-pointer items-center justify-center rounded-full outline-none transition-transform hover:scale-105 hover:shadow-md "
          :style="`
              background: ${currentColor == color.color ? 'transparent' : color.color};
          `"
  >
    <span class="w-full h-full rounded-full overflow-clip"
          :style="`
            border: 2px solid ${color.color};
         `"
    >
      <div style="
          transition: height 100ms ease 0s, width 100ms ease 0s;
          transform-origin: left top;
        "
           class="rounded-full w-5 h-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
           :style="`
              background: ${color.color};
           `"
      >
      </div>
    </span>
  </button>
</template>
