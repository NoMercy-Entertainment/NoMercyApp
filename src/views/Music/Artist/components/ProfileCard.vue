<script setup lang="ts">
import { onMounted, onUnmounted, type PropType } from 'vue';

import type { ArtistResponse } from "@/types/api/music/artist";

import { limitSentenceByCharacters } from "@/lib/stringArray";

import CoverImage from "@/components/MusicPlayer/components/CoverImage.vue";
import { setColorPalette } from '@/store/ui';

const props = defineProps({
  data: {
    type: Object as PropType<ArtistResponse>,
    required: true,
  },
});

onMounted(() => {
  if (props.data?.color_palette) {
    setColorPalette(props.data?.color_palette?.cover);
  }
});

onUnmounted(() => {
  setColorPalette(null);
});

</script>

<template>
  <div class="flex w-full flex-col items-start justify-start gap-4">
    <div v-if="data.cover" class="flex flex-col items-start justify-start self-stretch overflow-clip rounded-lg">
      <CoverImage :data="data" :size="500" class="aspect-square h-auto w-full" />
    </div>
    <div class="w-full whitespace-pre-line font-semibold leading-normal text-auto-12">
      {{ data.disambiguation ?? data.description ? limitSentenceByCharacters(data.description!, 150) : '' }}
    </div>
  </div>
</template>
