<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

import type { PlaylistItem } from '@/types/musicPlayer';

import serverClient from '@/lib/clients/serverClient';
import { setTitle } from '@/lib/stringArray';
import audioPlayer, { currentSong, musicSize, musicVisibility } from '@/store/audioPlayer';
import { currentServer } from '@/store/currentServer';
import sidebar from '@/store/sidebar';

import CoverImage from '@/components/MusicPlayer/components/CoverImage.vue';
import MediaLikeButton from '@/components/Buttons/MediaLikeButton.vue';

import DeviceButton from './components/DeviceButton.vue';
import NextButton from './components/NextButton.vue';
import PlaybackButton from './components/PlaybackButton.vue';
import PreviousButton from './components/PreviousButton.vue';
import ProgressBarContainer from './components/ProgressBarContainer.vue';
import QueueButton from './components/QueueButton.vue';
import RepeatButton from './components/RepeatButton.vue';
import ShuffleButton from './components/ShuffleButton.vue';
import StopButton from './components/StopButton.vue';
import TrackLinks from './components/TrackLinks.vue';
import VolumeContainer from './components/VolumeContainer.vue';
import LyricsButton from './components/LyricsButton.vue';
import Marquee from '@/components/Marquee.vue';
import EqButton from "@/components/MusicPlayer/components/EqButton.vue";
import {user} from "@/store/user";
const dataAttribute = ref<any>();
const shouldSubmitPlayback = ref(true);

const createMusicDatasetAttribute = (data: any) => {
  if (!data) return;
  return JSON.stringify({
    id: data?.id,
    Artist: data?.Artist,
    host: data.host,
    track: `${data.libraryId}${data.folder}${data.filename}`,
    type: data?.type,
    favorite_track: data?.favorite_track,
    Album: data?.Album,
    playlists: data?.playlists,
  });
};

onMounted(() => {
  if (!currentServer.value) return;

  audioPlayer.on?.('song', (item) => {
    shouldSubmitPlayback.value = true;

    if (item) {
      setTitle(`${item.name} - ${item.artist_track.at(0)?.name} - ${item.album_track.at(0)?.name}`);
    }

    dataAttribute.value = createMusicDatasetAttribute(
      Object.keys(item as object)
        .filter(key => key !== 'lyrics')
        .reduce((obj, key) => {
          // @ts-ignore
          obj[key] = item[key];
          return obj;
        }, {})
    );
  });

  audioPlayer.on?.('time', (data) => {
    if (Math.floor(data.percentage) == 50 && shouldSubmitPlayback.value) {
      shouldSubmitPlayback.value = false;

      if (!user.value.features?.nomercyConnect) {
        submitPlayback();
      }
    }
  });
});

const submitPlayback = async () => {
  if (!currentSong.value) return;

  await serverClient()
    .post<PlaylistItem>(`music/tracks/${currentSong.value?.id}/playback`);
};

const leftSize = computed(() => {
  if (sidebar.value == 'open') {
    return 100 / 4;
  }
  else if (sidebar.value == 'closed') {
    return 100 / 3.2;
  }
  return 100 / 3;
});
const centerSize = computed(() => {
  return 100 / 3;
});
const rightSize = computed(() => {
  if (sidebar.value == 'open') {
    return 100 / 2.9;
  }
  else if (sidebar.value == 'closed') {
    return 100 / 3;
  }
  return 100 / 3;
});

</script>

<template>
  <div id="fullPlayer"
    class="bg-slate-lightA-4 dark:bg-slate-darkA-4 hidden h-0 music-showing:h-20 flex-shrink-0 flex-grow-0 flex-row items-center justify-start gap-12 self-stretch pr-6 sidebar-closed:ml-20 sidebar-open:ml-64 rounded-lg m-2 mt-2 mb-4 pl-4 mx-5 transition-all duration-200 sm:flex 2xl:sidebar-open:ml-[16.3rem]"
       :inert="musicVisibility == 'hidden'"
    :data-music="musicVisibility" :data-sidebar="sidebar">
    <div v-if="currentSong"
      class="flex h-full w-full items-center gap-8 music-showing:transition-all music-showing:duration-75">
      <div id="left" class="flex flex-grow items-center justify-start transition-width duration-200 gap-2" :style="{
        width: `${leftSize}%`
      }" data-target="track">

        <CoverImage v-if="currentSong" :size="100"
          className="relative aspect-square h-auto w-16 cursor-pointer overflow-hidden rounded-md text-theme-4 min-w-[3rem]"
          :data="currentSong" />

        <div v-if="currentSong" class="mx-4 flex flex-col overflow-hidden gap-0.5 w-available hover-animate-pause">
          <Marquee :text="currentSong?.name" />
          <div :data-size="musicSize" :key="currentSong.id"
            class="inline-flex gap-1 overflow-hidden whitespace-nowrap text-xs w-available line-clamp-1 hover-animate-pause">
            <TrackLinks v-if="currentSong" :id="currentSong.id" :key="currentSong.id" :data="currentSong.artist_track"
              suffix="player" type="artists" />
          </div>
        </div>
        <MediaLikeButton :key="currentSong.id" :data="currentSong" color="var(--color-focus)" class="hidden sm:flex" />
      </div>
      <div id="center" class="flex w-full flex-grow flex-col items-center justify-start transition-width duration-200"
        :style="{
          width: `${centerSize}%`
        }">
        <div class="flex justify-center">
          <div class="flex flex-shrink-0 flex-grow-0 items-center justify-center gap-2">
            <ShuffleButton />
            <PreviousButton />
            <PlaybackButton class="children:h-10 h-12 children:w-10 w-12 !bg-white dark:!bg-slate-darkA-2" />
            <NextButton />
            <RepeatButton />
          </div>
        </div>
        <ProgressBarContainer />
      </div>
      <div id="right" class="relative flex flex-grow items-center justify-end gap-2 transition-width duration-200"
        :style="{
          width: `${rightSize}%`
        }" :data-size="musicSize">

        <StopButton />

        <LyricsButton />
        <QueueButton />
        <EqButton />
        <DeviceButton />

        <VolumeContainer />
      </div>
    </div>
  </div>
</template>
