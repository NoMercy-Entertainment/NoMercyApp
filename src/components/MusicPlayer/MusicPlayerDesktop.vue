<script setup lang="ts">
import {onMounted, ref, watch} from 'vue';

import type {Song} from '@/types/api/music/musicPlayer';

import {pickPaletteColor} from '@/lib/colorHelper';
import serverClient from '@/lib/clients/serverClient';

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
import {setTitle} from '@/lib/stringArray';
import currentServer from '@/store/currentServer';
import audioPlayer, {currentSong, musicSize, musicVisibility, setMusicVisibility} from '@/store/audioPlayer';
import {VisibilityState} from '@/types/musicPlayer';
import sidebar from '@/store/sidebar';
import CoverImage from '@/components/MusicPlayer/components/CoverImage.vue';
import MediaLikeButton from '@/components/Buttons/MediaLikeButton.vue';

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

  audioPlayer.value?.on?.('song', (item) => {
    shouldSubmitPlayback.value = true;

    if (item) {
      setMusicVisibility(VisibilityState.showing);
      // setMusicColor(pickPaletteColor(item?.color_palette?.cover));
      setTitle(`${item.name} - ${item.artist_track.at(0)?.name} - ${item.album_track.at(0)?.name}`);
    } else {
      setMusicVisibility(VisibilityState.hidden);
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

  audioPlayer.value?.on?.('time', (data) => {
    if (Math.floor(data.percentage) == 50 && shouldSubmitPlayback.value) {
      shouldSubmitPlayback.value = false;
      submitPlayback();
    }
  });
});

watch(audioPlayer, (value) => {
  value?.on?.('song', (item) => {
    shouldSubmitPlayback.value = true;

    if (item) {
      setMusicVisibility(VisibilityState.showing);
      // setMusicColor(pickPaletteColor(item?.color_palette?.cover));
    } else {
      setMusicVisibility(VisibilityState.hidden);
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

  value?.on?.('time', (data) => {
    if (Math.floor(data.percentage) == 50 && shouldSubmitPlayback.value) {
      shouldSubmitPlayback.value = false;
      submitPlayback();
    }
  });
});


const submitPlayback = async () => {
  if (!currentSong.value) return;

  await serverClient()
      .post<Song>(`music/tracks/${currentSong.value?.id}/playback`);
};

// watch(musicVisibility, (value) => {
// 	const container = document.querySelector<HTMLDivElement>('#container');
// 	container?.setAttribute('data-music', value);
// });

</script>

<template>
  <div id="container"
       class="-mt-2 mb-2 hidden h-0 music-showing:h-20 flex-shrink-0 flex-grow-0 flex-row items-center justify-start gap-12 self-stretch overflow-hidden music-showing:py-1 pr-6 sidebar-open:pl-6 sidebar-hidden:pl-8 sidebar-closed:pl-20 transition-transform duration-300 sm:flex 2xl:sidebar-open:pl-[17rem] 3xl:sidebar-open:pl-[17rem]"
       :data-music="musicVisibility"
       :data-sidebar="sidebar">
    <div v-if="currentSong"
         class="flex h-full w-full items-center gap-8 music-showing:transition-transform music-showing:delay-75 music-showing:duration-75">
      <div id="left"
           class="flex flex-grow items-center justify-start gap-2 min-w-[30%] max-w-[30%]"
           data-target="track">

        <CoverImage v-if="currentSong"
                    :size="100"
                    className="relative aspect-square h-auto w-16 cursor-pointer overflow-hidden rounded-md text-theme-4 min-w-[3rem]"
                    :data="currentSong"/>

        <div v-if="currentSong"
             class="mx-4 flex flex-col overflow-hidden gap-0.5 w-available hover-animate-pause">
          <div class="relative flex flex-grow flex-col items-start justify-start gap-2"
               :data-data="dataAttribute">
            <div class="w-full flex-shrink-0 flex-grow-0 self-stretch font-semibold">
              {{ currentSong?.name }}
            </div>
          </div>
          <div :data-size="musicSize"
               :key="currentSong.id"
               class="mb-1 inline-flex h-5 gap-1 overflow-hidden whitespace-nowrap text-xs w-available line-clamp-1 hover-animate-pause">
            <TrackLinks v-if="currentSong"
                        :id="currentSong.id"
                        :key="currentSong.id"
                        :data="currentSong.artist_track"
                        suffix="player"
                        type="artists"/>
          </div>
        </div>
        <MediaLikeButton :key="currentSong.id"
                         :data="currentSong"
                         type="music/tracks"
                         color="var(--color-focus)"
                         class="hidden sm:flex"
                         data-target="favorite"/>
      </div>
      <div id="center"
           class="flex w-full flex-grow flex-col items-center justify-start">
        <div class="flex justify-center">
          <div class="flex flex-shrink-0 flex-grow-0 items-center justify-center gap-2">
            <ShuffleButton/>
            <PreviousButton/>
            <PlaybackButton class="children:h-10 h-12 children:w-10 w-12"/>
            <NextButton/>
            <RepeatButton/>
          </div>
        </div>
        <ProgressBarContainer/>
      </div>
      <div id="right"
           class="relative flex flex-grow items-center justify-end gap-2 min-w-[30%] max-w-[30%]"
           :data-size="musicSize">

        <StopButton/>

        <LyricsButton/>

        <QueueButton/>
        <DeviceButton/>

        <VolumeContainer/>
      </div>
    </div>
  </div>
</template>
