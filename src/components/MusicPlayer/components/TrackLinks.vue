<script setup lang="ts">
import {onMounted, PropType, watch} from 'vue';

import {Artist} from '@/types/api/music/artist';
import {Album} from '@/types/api/music/album';
import {musicSize} from '@/store/audioPlayer';
import {shouldMarquee} from '@/lib/utils';
import router from '@/router';

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
       class="-ml-1 w-available">

    <div :data-size="musicSize"
         data-marquee="scroller"
         class="mb-1 ml-1 flex w-fit flex-nowrap gap-1 overflow-clip text-xs text-contrast line-clamp-2 whitespace-break-spaces hover-animate-pause w-available sm:my-0.5">
				<span v-if="title" class="flex-nowrap gap-1 whitespace-nowrap lex line-clamp-2 h-inherit">
					{{ title ? `${title} - ` : '' }}
				</span>

      <span class="flex w-fit flex-wrap gap-1 whitespace-wrap line-clamp-2 h-inherit"
            v-for="(item, index) in data">
        <button
               @click="onclick ?? router.push(`/music/${type}/${item.id}`)"
               :onkeyup="onkeyup"
               :key="item.id"
               tabindex="0"
               data-target="album"
               class="pointer-events-auto flex gap-1 whitespace-nowrap text-xs font-semibold line-clamp-2 h-inherit hover:underline focus:underline dark:font-medium">
            <span class="flex whitespace-nowrap leading-6">
              {{ item.name }}{{ index < data.length - 1 ? ',' : '' }}
            </span>
        </button>
      </span>
    </div>
  </div>
</template>
