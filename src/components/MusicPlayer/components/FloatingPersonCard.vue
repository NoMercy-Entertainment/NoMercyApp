<script lang="ts" setup>
import { PropType, ref, watch } from 'vue';

import type { PersonResponseItem } from '@/types/api/base/person';
import TMDBImage from "@/components/Images/TMDBImage.vue";

const props = defineProps({
  data: {
    type: Object as PropType<PersonResponseItem | undefined>,
    required: false,
  },
});

const currentImage = ref(props.data?.images?.profiles?.[0]);

watch(props, (value) => {
  currentImage.value = value.data?.images?.profiles?.[0];
});

</script>

<template>
  <div
    class="flex flex-col justify-start h-[calc(100%-1rem)] items-start w-40 sm:w-48 2xl:w-80 mx-auto absolute left-4 sm:left-12 top-4 rounded-2xl">

    <div class="sticky top-14 flex h-auto w-full flex-col gap-4">
      <div :id="data?.id ?? 'x'" :class="data?.deathday ? 'outline outline-white' : ''"
        class="relative z-0 block w-auto select-none overflow-clip rounded-2xl transitioning aspect-poster">
        <div class="relative flex h-full w-full flex-col">
          <TMDBImage :path="currentImage?.src ?? data?.poster" :size="180" :colorPalette="data?.color_palette?.profile"
            className="pointer-events-none absolute inset-0 z-20 flex h-full w-full object-cover transition-transform duration-500 trickle-div" />
        </div>
      </div>
      <div class="relative grid grid-cols-4 gap-2 group/personCard">
        <div v-for="profile in data?.images?.profiles?.slice(0, 4)" :key="profile.src"
          @click="() => currentImage = profile"
          class="relative h-auto w-full cursor-pointer overflow-clip rounded-xl transition-all duration-200 aspect-poster focus-outline">

          <div :class="profile.src == currentImage?.src ? 'opacity-0' : 'opacity-100'"
            class="absolute inset-0 z-30 grid h-auto w-full items-center justify-center bg-black/60 group-hover/personCard:opacity-0 transition-all duration-200 aspect-poster">
          </div>

          <TMDBImage :path="profile.src" :colorPalette="data?.color_palette?.profile" :size="182"
            className="relative z-0 block h-auto w-full select-none transitioning aspect-poster" />
        </div>
      </div>
    </div>
  </div>
</template>
