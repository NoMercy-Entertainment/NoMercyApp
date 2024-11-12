<script setup lang="ts">
import {onMounted, PropType, watch} from 'vue';

import type {Album} from '@/types/api/music/album';
import type {Artist} from '@/types/api/music/artist';

import {shouldMarquee} from '@/lib/utils';
import {musicSize} from '@/store/audioPlayer';

const props = defineProps({
  data: {
    type: Array as PropType<Array<Artist | Album>>,
    required: true,
  },
  type: {
    type: String as PropType<'artists' | 'albums'>,
    required: true,
  },
  id: {
    type: String as PropType<string>,
    required: true,
  },
  onclick: {
    type: Function as PropType<(e: MouseEvent) => void>,
    required: false,
  },
  onkeyup: {
    type: Function as PropType<(e: KeyboardEvent) => void>,
    required: false,
  },
  title: {
    type: String,
    required: false,
  },
  suffix: {
    type: String,
    required: false,
  },
});


watch(props, () => {
  const el = document.querySelector<HTMLElement>(`#trackLink-${props.type}-${props.id}-${props.suffix}`);
  if (el) {
    shouldMarquee(el);
  }
});

onMounted(() => {
  const el = document.querySelector<HTMLElement>(`#trackLink-${props.type}-${props.id}-${props.suffix}`);
  if (el) {
    shouldMarquee(el);
  }
});

</script>

<template>
  <div data-marquee="container"
       :id="`trackLink-${type}-${id}-${suffix}`"
       @click="e => e.stopPropagation()"
       class="-ml-1 h-auto w-available">

    <div :data-size="musicSize"
         data-marquee="scroller"
         class="mb-1 ml-1 flex w-fit flex-nowrap items-center gap-1 overflow-clip text-xs text-contrast line-clamp-2 whitespace-break-spaces hover-animate-pause w-available sm:my-0.5">

            <span v-if="title" class="flex flex-nowrap items-center gap-1 whitespace-nowrap line-clamp-2">
                {{ title ? `${title} - ` : '' }}
            </span>

      <template v-for="(item, index) in data"
                :key="item.id">

        <RouterLink :to="`/music/${type}/${item.id}`"
                    :onkeyup="onkeyup"
                    :onclick="onclick"
                    tabindex="0"
                    data-target="album"
                    class="flex items-center gap-1 whitespace-nowrap text-xs font-semibold line-clamp-1 hover:underline focus:underline dark:font-medium">

           <span class="flex whitespace-nowrap leading-6">
             {{ item.name }}{{ index < data.length - 1 ? ',' : '' }}
           </span>
        </RouterLink>

      </template>
    </div>
  </div>
</template>
