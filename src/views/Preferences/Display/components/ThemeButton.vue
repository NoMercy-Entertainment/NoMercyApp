<script setup lang="ts">
import {PropType} from 'vue';

import {themeColors} from '@/lib/colorHelper';
import {colorTheme, setColorTheme} from "@/store/colorTheme";

defineProps({
  theme: {
    type: Object as PropType<typeof themeColors[0]>,
    required: true,
  },
});

</script>

<template>
  <button :title="theme?.title"
       @click="setColorTheme(theme.title)"
       class="relative box-border flex h-7 w-7 min-w-7 min-h-7 transform cursor-pointer items-center justify-center rounded-full outline-none transition-transform p-[3px] hover:scale-105 hover:shadow-md"
       :style="`
          background: ${theme.color};
       `"
  >
    <div style="
        --circle-point-background-color: #fff;
        transition: height 100ms ease 0s, width 100ms ease 0s;
        scale: 1.4;
        transform-origin: left top;
      "
     class="rounded-full bg-[var(--circle-point-background-color)]"
     :class="theme.title == colorTheme ? 'w-available h-available absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' : 'w-0 h-0'">
    </div>
  </button>
</template>
