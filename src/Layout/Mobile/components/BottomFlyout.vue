<script setup lang="ts">
import {computed, ref, watch} from 'vue';
import {useSwipe} from '@vueuse/core';
import {closeMenu, menuOpen} from '@/store/profileMenu';

const target = ref<HTMLElement | null>(null);
const container = ref<HTMLElement | null>(null);
const containerHeight = computed(() => container.value?.offsetHeight);
const bottom = ref('-125%');

watch(menuOpen, (value) => {
  value
      ? bottom.value = '0'
      : bottom.value = '-125%';
});

const {isSwiping, lengthY} = useSwipe(
    target,
    {
      passive: true,
      onSwipe() {
        if (containerHeight.value) {
          if (lengthY.value < 0) {
            const length = -(Math.abs(lengthY.value));
            bottom.value = `${length}px`;
          } else {
            bottom.value = '0';
          }
        }
      },
      onSwipeEnd(e: TouchEvent) {
        if (lengthY.value < 0 && containerHeight.value && (Math.abs(lengthY.value) / containerHeight.value) >= 0.25) {
          bottom.value = '-125%';
          closeMenu();
        } else {
          bottom.value = '0';
        }
      },
    },
);

</script>

<template>

  <div
      class="fixed flex w-full flex-shrink-0 flex-grow-0 select-none bg-slate-light-1 dark:bg-slate-dark-2 flex-col items-center justify-end gap-3 overflow-hidden rounded-t-3xl rounded-tl-lg rounded-tr-lg p-2 -bottom-[125%]"
      ref="target"
      :style="{ bottom }"
      :class="{
            'transition-bottom duration-300 ease-in-out ': !isSwiping,
      }"
  >
    <div class="h-1 w-8 flex-shrink-0 flex-grow-0 bg-black/25 rounded-[360px] dark:bg-white/25"></div>
    <div ref="container"
         class="flex flex-shrink-0 flex-grow-0 flex-col items-start justify-start self-stretch overflow-hidden text-slate-dark-1 dark:text-slate-light-1"
    >
      <slot/>
    </div>
  </div>
</template>
