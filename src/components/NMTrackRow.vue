<script setup lang="ts">
import { PropType } from 'vue';
import { useRoute } from 'vue-router';

import type { PlaylistItem } from '@/types/musicPlayer';

import { audioPlayer, currentSong, isPlaying, musicSize, setCurrentPlaylist } from '@/store/audioPlayer';

import DropdownMenu from '@/Layout/Desktop/components/Menus/DropdownMenu.vue';

import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';
import EqSpinner from '@/components/Images/EqSpinner.vue';
import CoverImage from '@/components/MusicPlayer/components/CoverImage.vue';
import MediaLikeButton from '@/components/Buttons/MediaLikeButton.vue';
import BannerButton from '@/components/Buttons/BannerButton.vue';
import TrackLinks from '@/views/Music/List/components/TrackLinks.vue';
import { isMusicSearchRoute } from '@/store/routeState';
import { onTrackRowRightClick } from '@/store/contextMenuItems';

const props = defineProps({
  data: {
    type: Object as PropType<PlaylistItem>,
    required: true,
  },
  index: {
    type: Number as PropType<number>,
    required: true,
  },
  displayList: {
    type: Array as PropType<PlaylistItem[] | undefined>,
    required: true,
  },
});

const router = useRoute();
const setCurrentList = () => {
  setCurrentPlaylist(router.fullPath);
};

const handleClick = () => {
  if (!currentSong.value) {
    setCurrentList();
  }

  audioPlayer.playTrack(props.data, props.displayList);
};

</script>

<template>
  <button tabindex="0" @click="handleClick()" @contextmenu="onTrackRowRightClick($event, data)"
    :data-track-id="data?.id" data-target="track"
    class="grid justify-start items-center self-stretch rounded-lg hover:bg-slate-lightA-6 dark:hover:bg-slate-darkA-6 text-auto-12 group/track text-sm font-medium z-0 px-2 sm:py-1 group/track home-grid gap-2">
    <span class="flex w-10 h-10 justify-center text-center min-w-10 relative">

      <CoverImage v-if="isMusicSearchRoute" :data="data" :size="100"
        class="absolute inset-0 group-hover/track:brightness-[25%] transition-all duration-150" :class="{
          'brightness-[25%]': isPlaying && currentSong?.id == data.id,
        }" className="relative hidden h-10 w-10 overflow-hidden min-w-[2.5rem] sm:block"
        loading="eager" />

      <span class="grid place-content-center w-10 h-10 justify-center text-center min-w-10 absolute items-center">
        <span v-if="currentSong?.id != data.id" class="group-focus-visible/track:sm:hidden group-hover/track:sm:hidden">
          {{ index + 1 }}
        </span>

        <EqSpinner v-if="currentSong?.id == data.id" :playing="isPlaying"
          class="hidden group-focus-visible/track:sm:!hidden group-hover/track:sm:!hidden"
          color="rgb(var(--color-focus))" />

        <MoooomIcon v-if="currentSong?.id == data.id && isPlaying"
          class="hidden h-6 w-6 group-focus-visible/track:sm:block group-hover/track:sm:block" icon="pause" />
        <MoooomIcon v-else class="hidden h-6 w-6 group-focus-visible/track:sm:block group-hover/track:sm:block"
          icon="play" />

      </span>
    </span>

    <span class="flex sm:h-12 items-center gap-4 overflow-hidden w-available">
      <CoverImage v-if="!isMusicSearchRoute" :data="data" :size="100"
        className="relative hidden h-10 w-10 overflow-hidden min-w-[2.5rem] sm:block" loading="eager" />
      <span class="flex h-full flex-col justify-center overflow-clip w-inherit items-start">

        <span
          class="flex h-6 leading-3 flex-nowrap overflow-clip text-left font-bold line-clamp-1 w-inherit items-center">
          {{ data.name }}
        </span>

        <span :data-size="musicSize"
          class="flex h-4 sm:h-5 leading-none w-fit gap-1 overflow-hidden whitespace-nowrap text-auto-9 line-clamp-1 text-2xs hover:animate-pause items-center"
          @click="e => e.stopPropagation()">

          <TrackLinks v-if="data" :id="data.id" :data="data.artist_track"
            :onclick="(e: MouseEvent) => e.stopPropagation()" data-target="artist"
            class="children:children:children:leading-none" type="artists" />
        </span>
      </span>
    </span>

    <TrackLinks type="albums" :data="data.album_track"
      class="hidden sm:flex items-center justify-between gap-2 text-end" />

    <!--    <template v-if="data">-->
    <!--      <span v-for="item in data.album_track"-->
    <!--            :key="item.id"-->
    <!--            class="max-w-sm items-center overflow-clip pr-2 line-clamp-2 h-inherit w-inherit"-->
    <!--            @click="e => e.stopPropagation()">-->
    <!--             <RouterLink-->
    <!--                 :to="item?.link"-->
    <!--                 class="flex items-center gap-1 whitespace-nowrap text-xs font-semibold line-clamp-1 hover:underline focus:underline dark:font-medium"-->
    <!--                 data-target="album"-->
    <!--                 tabindex="0">-->
    <!--                 <span class="flex whitespace-nowrap">-->
    <!--                     {{ item.name }}-->
    <!--                 </span>-->
    <!--             </RouterLink>-->
    <!--       </span>-->
    <!--    </template>-->
    <span class="hidden sm:flex items-center justify-between gap-2 text-end" @click="e => e.stopPropagation()">
      <MediaLikeButton :key="data.id" :data="data" class="hidden sm:flex" color="var(--color-focus)" />
      <span class="mr-4 monospace sm:mr-0">
        {{ data.duration }}
      </span>
    </span>

    <DropdownMenu direction="down">
      <template v-slot:button>
        <BannerButton class="mx-3" title="">
          <MoooomIcon className="relative h-5 w-5" icon="menuDotsVertical" />
        </BannerButton>
      </template>
      Hellooo
    </DropdownMenu>
  </button>
</template>

<style scoped></style>
