<script setup lang="ts">
import {RouterLink} from "vue-router";

import OptimizedIcon from "@/components/OptimizedIcon.vue";
import type {PropType} from "vue";
import type {MoooomIcons} from "@Icons/icons";

defineProps({
  to: {
    type: String,
    required: false,
  },
  click: {
    type: Function as PropType<() => void>,
    required: false,
  },
  name: {
    type: String,
    required: true,
  },
  icon: {
    type: String as PropType<keyof typeof MoooomIcons>,
    required: true,
  },
  className: {
    type: String,
    required: false,
  },
});

const classes = "flex justify-center items-center self-stretch h-10 relative py-2.5 px-1 rounded-md border border-transparent hover:border-focus/4 active:!bg-focus/11 dark:active:!bg-focus/8 active:border-focus/4 active:hover:border-focus/4 focus:bg-focus-9 hover:!bg-focus/10 disabled:!bg-focus/2 disabled:!border-focus/2 transition-colors duration-200 hover:text-auto-12";

</script>

<template>

  <RouterLink v-if="to" :to="to"
              :class="classes"
              :data-nav-title="name"
              :name="name">
            <span
                class="relative flex w-full flex-grow items-center justify-center gap-2 px-2 text-lg font-medium text-left">
              <OptimizedIcon :className="className" :icon="icon"/>
              <span class="relative flex flex-grow items-center justify-center gap-2 pl-2">
                <span class="w-full flex-grow text-lg font-medium">
                  {{ $t(name) }}
                </span>
              </span>
            </span>
  </RouterLink>

  <button v-else-if="click"
          :class="classes"
          :data-nav-title="name"
          :name="name"
          @click="click">
            <span
                class="relative flex w-full flex-grow items-center justify-center gap-2 px-2 text-lg font-medium text-left">
              <OptimizedIcon :className="className" :icon="icon"/>
              <span class="relative flex flex-grow items-center justify-center gap-2 pl-2">
                <span class="w-full flex-grow text-lg font-medium">
                  {{ $t(name) }}
                </span>
              </span>
            </span>
  </button>

</template>

<style scoped>

</style>