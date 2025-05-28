<script setup lang="ts">
import { type PropType } from 'vue';
import type { MoooomIcons } from '@Icons/icons';

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
  <RouterLink :to="href" tabindex="1"
    class="flex justify-center items-center relative first:children:mt-0.5 gap-2 pl-2 pr-3 h-8 rounded-3xl focus:outline-none focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline"
    :class="{
      'bg-focus/80': active,
      'bg-white/10': !active,
    }">
    <MoooomIcon :icon="icon" className="size-5 relative" />
    <p class="flex-grow-0 flex-shrink-0 text-xs text-left leading-none text-white mt-0.5">
      {{ $t(name) }}
    </p>
  </RouterLink>
</template>

<style scoped></style>
