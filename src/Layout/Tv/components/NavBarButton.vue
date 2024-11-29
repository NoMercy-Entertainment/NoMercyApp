<script setup lang="ts">
import {computed, type PropType} from 'vue';
import type {MoooomIcons} from '@Icons/icons';

import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';
import {useRoute} from 'vue-router';

const props = defineProps({
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
      class="flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-2 pl-1.5 pr-4 py-1 rounded-3xl focus-visible:ring-2 ring-inset focus-visible:ring-white pointer-events-auto"
      :class="{
        'bg-focus/40': active,
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
