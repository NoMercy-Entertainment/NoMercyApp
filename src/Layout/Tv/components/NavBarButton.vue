<script setup lang="ts">
import {type PropType} from 'vue';
import type {MoooomIcons} from '@Icons/icons';

import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';

defineProps({
  icon: {
    type: String as PropType<keyof typeof MoooomIcons>,
    required: true,
  },
  href: {
    type: String,
    required: false,
    default: '/',
  },
  name: {
    type: String,
    required: false,
    default: '',
  },
  active: {
    type: Boolean,
    required: false,
    default: false,
  },
});

</script>

<template>
  <RouterLink
      :to="href"
      class="flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-2 pl-1.5 pr-4 py-1 rounded-3xl pointer-events-auto focus:outline-none focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline"
      :class="{
        'bg-focus/80': active,
        'bg-white/10': !active,
      }"
  >
    <MoooomIcon :icon="icon" class="w-6 h-6 relative"/>
    <p class="flex-grow-0 flex-shrink-0 text-xs text-left text-white">
      {{ name }}
    </p>
  </RouterLink>
</template>

<style scoped>

</style>
