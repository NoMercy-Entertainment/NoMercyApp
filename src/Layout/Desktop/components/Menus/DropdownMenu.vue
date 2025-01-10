<script setup lang="ts">
import {type PropType, ref} from 'vue';

import {onClickOutside} from '@vueuse/core';
import {twMerge} from 'tailwind-merge';
import router from '@/router';
import {deviceMenuOpen, equalizerMenuOpen, lyricsMenuOpen, queueMenuOpen} from "@/store/audioPlayer";

defineProps({
  className: {
    type: String,
    required: false,
  },
  direction: {
    type: String as PropType<'up' | 'down'>,
    required: false,
    default: 'down',
  },
  translate: {
    type: String,
    required: false,
    default: ' -translate-x-full',
  }
});

const open = ref(false);
const menu = ref(null);

onClickOutside(menu, () => open.value = false);

const id = ref('');

const handleClick = (e: MouseEvent) => {
  equalizerMenuOpen.value = false;
  lyricsMenuOpen.value = false;
  queueMenuOpen.value = false;
  deviceMenuOpen.value = false;
  e.stopPropagation();
  open.value = !open.value;
};

router.beforeEach(() => {
  open.value = false;
});

</script>

<template>
  <div ref="menu"
       class="relative flex h-auto items-center gap-2 z-1099 group"
  >
    <div
        :class="twMerge('flex justify-start items-start relative gap-2 bg-transparent focus:bg-auto-2 hover:text-auto-12 transition-colors duration-300', className)"
        @click="handleClick"
    >
      <slot :open="open" name="button"/>
    </div>

    <div
        :id="`_dropdown_menu_${id}`"
         :tabindex="open ? 0 : -1"
         class="absolute w-max ml-[100%] sm:ml-[100%] mb-1 sm:mt-1 border grid transition-all duration-300 rounded-xl shadow-2xl overflow-clip grid-rows-[0fr] border-transparent right-0"
        :class="{
             'grid-rows-[1fr] border-[#e2f0fd]/4' : open,
             'grid-rows-[0fr] border-transparent': !open,
              'bottom-auto origin-top top-full' : direction == 'down',
              'top-auto origin-bottom bottom-full':  direction == 'up',
             translate,
        }"
    >
      <div class="overflow-hidden">
        <div class="flex w-full flex-col items-start justify-start rounded-xl overflow-clip children:rounded-xl children:overflow-clip border-1 bg-slate-light-1 dark:bg-slate-dark-1 border-slate-light-7 dark:border-slate-dark-4">
          <slot :open="open"/>
        </div>
      </div>
    </div>
  </div>
</template>
