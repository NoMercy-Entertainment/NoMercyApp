<script setup lang="ts">
import {computed, PropType} from 'vue';

import {isNative} from "@/config/global";
import type { Component } from '@/lib/routerHelper';
import {showBackdrops} from "@/store/preferences";
import {currentSong} from "@/store/audioPlayer";
import router from "@/router";

const props = defineProps({
  items: {
    type: Object as PropType<Component<any>[]> | undefined,
    required: true,
  },
});

const backdropStyle = 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 3xl:grid-cols-5 4xl:grid-cols-5 5xl:grid-cols-9 tv:grid-cols-6';

const posterStyle = 'grid-cols-2 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-7 3xl:grid-cols-9 4xl:grid-cols-10 5xl:grid-cols-[repeat(14,minmax(0,1fr))] tv:grid-cols-6';

const useBackdropStyle = computed(() => {
  const firstItem = props.items.at(0) as any;
  return (
      firstItem &&
      showBackdrops.value &&
      firstItem?.media_type !== 'person' &&
      firstItem?.media_type !== 'genres'
  );
});

</script>

<template>
  <div
      ref="containerRef"
      class="z-0 flex flex-col gap-4 rounded-3xl border-0 p-4 w-available scrollbar-none border-auto-3 transform-gpu will-change-auto"
      :class="{
            'pb-24': isNative && !currentSong,
            'pb-40': isNative && currentSong,
            'children:pb-4 sm:children:pb-3': !isNative && currentSong
          }"
      :key="router.currentRoute.value.params?.id as string"
  >
    <div
        :class="`grid w-full gap-4 scroll-smooth music-showing:pb-0 whitespace-pre ${
              useBackdropStyle ? backdropStyle : posterStyle
            }`"
    >
      <component v-for="(render, index) in items ?? []" :index="index" :key="render.id" :is="render.component"
        v-bind="render.props" />
    </div>
  </div>
</template>

<style scoped></style>
