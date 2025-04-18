<script setup lang="ts">
import {computed, type PropType} from 'vue';

import type { ColorPalettes } from '@/types/api/shared';
import type { Artist } from '@/types/api/music/artist';

import CoverImage from '@/components/MusicPlayer/components/CoverImage.vue';
import TrackLinks from '@/views/Music/List/components/TrackLinks.vue';
import BigPlayButton from '@/components/Buttons/BigPlayButton.vue';
import audioPlayer, {currentPlaylist, isPlaying} from "@/store/audioPlayer";
import {PlaylistItem} from "@/types/musicPlayer";
import {useRoute} from "vue-router";

const props = defineProps({
  title: {
    type: String,
    required: false,
    default: 'Card Title',
  },
  data: {
    type: Object as PropType<{
      title: string;
      artists: Artist[];
      cover: string;
      colorPalette: ColorPalettes;
      type: string;
      width: string;
      track: PlaylistItem | null;
    }>,
    required: true,
  },
});

const route = useRoute();

const isCurrentPlaylist = computed(() => {
  return currentPlaylist.value == route.path;
});

const handleClick = () => {
  if (props.data?.track) {
    if (isCurrentPlaylist.value) {
      if (isPlaying.value && isCurrentPlaylist.value) {
        audioPlayer.pause();
      } else {
        audioPlayer.play();
      }
    } else {
      audioPlayer.setQueue([]);
      audioPlayer.setBackLog([]);

      currentPlaylist.value = route.path;
      audioPlayer.playTrack(props.data.track, []);
    }
  }
};

</script>

<template>
  <div v-if="data"
    class="frosting mt-4 mb-3 flex flex-col w-auto flex-shrink-0 flex-grow-1 items-start justify-start gap-2 self-stretch will-change-auto text-left"
    :class="{
      'sm:w-[33.3333%]': data.width,
    }">

    <h3 v-if="title" class="text-[20px] font-bold text-auto-12 mr-2 ml-1 sm:ml-3 text-slate-dark-1 dark:text-slate-light-1">
      {{ title }}
    </h3>

    <div class="relative bg-slate-lightA-6 dark:bg-slate-darkA-6 rounded-md p-2 sm:p-4 isolate w-full flex sm:flex-col gap-4">
      <CoverImage :data="data" :colorPalette="data.colorPalette" class="w-24 rounded-md" />
      <div class="w-full flex flex-col gap-2">
        <div class="text-2xl font-semibold">{{ data.title }}</div>
        <div class="flex text-left text-base items-center gap-2">
          <span class="leading-none text-sm">{{ data.type }}</span>
          <p class="text-left text-sm font-medium text-white">•</p>
          <TrackLinks :data="data.artists" :id="data.title" type="artists" class="text-base" />
        </div>
      </div>

      <BigPlayButton @click="handleClick()" :data="data" class="w-12 h-12 !absolute bottom-4 right-4" />
    </div>

  </div>
</template>

<style scoped lang="scss"></style>
