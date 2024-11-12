<script setup lang="ts">
import {onMounted, watch} from 'vue';

import {shouldMarquee} from '@/lib/utils';

const props = defineProps({
  text: {
    type: String,
    required: true,
  },
});

watch(props, () => {
  const el = document.querySelector<HTMLElement>(`#fullPlayer [data-marquee="container"]`);
  if (el) {
    shouldMarquee(el);
  }
});

onMounted(() => {
  const el = document.querySelector<HTMLElement>(`#fullPlayer [data-marquee="container"]`);
  if (el) {
    shouldMarquee(el);
  }
});
</script>

<template>
  <div class="relative flex flex-grow flex-col items-start justify-start gap-2" data-marquee="container">
    <div class="flex-shrink-0 flex-grow-0 self-stretch font-semibold line-clamp-1 w-fit whitespace-nowrap"
         data-marquee="scroller">
      {{ text }}
    </div>
  </div>
</template>
