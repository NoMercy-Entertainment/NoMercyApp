<script setup lang="ts">

import {PlaylistItem} from "@/types/musicPlayer";

import audioPlayer, {
  currentPlaylist,
  currentSong,
  musicSize,
  queue,
  queueMenuOpen,
  setCurrentPlaylist
} from '@/store/audioPlayer';
import {musicSocketConnection} from "@/store/musicSocket";
import {user} from "@/store/user";
import {stopPropagation} from "@/lib/utils";

import {MoooomIcons} from "@Icons/icons";
import ScrollContainer from '@/Layout/Desktop/components/ScrollContainer.vue';
import CoverImage from '@/components/Images/CoverImage.vue';
import MoooomIcon from "@/components/Images/icons/MoooomIcon.vue";

const handleClick = (song: PlaylistItem) => {
  if (!queue.value) return;

  const playlistName = `${song.type?.replace(/s$/u, '')}/${song.id}`;

  if (!user.value.features?.nomercyConnect) {
    audioPlayer.addToBackLog(audioPlayer.currentSong);

    if (audioPlayer._queue?.length > 0) {
      let nexItem = audioPlayer._queue[0];

      if (audioPlayer._shuffle) {
        const index = Math.round(
            Math.random() * (audioPlayer._queue.length - 1)
        );
        nexItem = audioPlayer._queue[index];
      }

      audioPlayer.setCurrentSong(nexItem);
      audioPlayer.removeFromQueue(nexItem);
      return;
    }
  }

  musicSocketConnection.value?.invoke('StartPlaybackCommand',
      song.type.replace(/s$/u, ''),
      song.id,
      queue.value?.at(0)?.id,
  );
  if (currentPlaylist.value === playlistName) {
    audioPlayer.togglePlayback();
    return;
  }
  audioPlayer.playTrack(song, queue.value);
  setCurrentPlaylist(playlistName);
}

</script>

<template>
  <div :data-open="queueMenuOpen" :inert="!queueMenuOpen" :data-size="musicSize"
       class="absolute right-4 top-safe-offset-4 bottom-8 data-[open='true']:full:bottom-28 data-[open='true']:compact:bottom-16 sm:data-[open='true']:full:bottom-4 sm:data-[open='true']:compact:bottom-4 sm:bottom-4 overflow-clip w-available ml-4 sm:w-1/3 bg-slate-light-3 dark:bg-slate-dark-1 flex items-center justify-center rounded-lg transition-all duration-500 border-2 border-focus data-[open='false']:translate-x-[150%] z-[29999]">
    <div
        class="pointer-events-none absolute inset-0 flex items-center justify-center rounded-lg opacity-60 bg-auto-3/40">
    </div>

    <div id="queue_container" v-if="currentSong" class="flex w-full flex-col px-4 pt-4 pr-0 h-available overflow-clip">

      <div class="flex w-full items-center justify-between p-2 pr-6">
        <p class="text-lg font-semibold">
          {{ $t('Now Playing') }}
        </p>
        <RouterLink v-if="currentPlaylist" :to="'/music/' + currentPlaylist"
                    class="text-sm font-semibold flex gap-1 items-center hover:underline underline-offset-2">
          <span>{{ $t('View Playlist') }}</span>
          <MoooomIcon :icon="MoooomIcons.shareSquare" className="w-4 h-4"/>
        </RouterLink>
      </div>

      <div class="flex h-auto w-full items-center justify-start gap-2 rounded-lg px-2 py-2 hover:bg-auto-3/50">
        <div class="relative aspect-square h-auto w-14 cursor-pointer overflow-hidden rounded-md text-theme-4">
          <CoverImage v-if="currentSong" :data="currentSong"/>
        </div>
        <div class="relative flex flex-col items-start justify-start gap-1">
          <p class="w-full flex-shrink-0 font-semibold self-stretch-0 text-left">
            {{ currentSong?.name }}
          </p>
          <div
              class="mb-1 inline-flex h-6 gap-1 overflow-hidden whitespace-nowrap text-xs w-available line-clamp-1 hover-animate-pause">
            <div data-marquee="container" class="-ml-1 w-available">
              <div data-marquee="scroller"
                   class="ml-1 flex w-fit flex-nowrap gap-1 text-xs line-clamp-1 whitespace-break-spaces hover-animate-pause w-available h-available">
                <span class="flex w-fit flex-wrap gap-1 whitespace-wrap line-clamp-2 h-inherit">
                  <RouterLink :to="currentSong?.artist_track?.[0]?.link ?? '#'"
                              class="flex gap-1 whitespace-nowrap text-xs font-semibold line-clamp-2 h-inherit hover:underline focus:underline dark:font-medium"
                              tabindex="0" @click="stopPropagation($event)">
                    <span class="flex items-center gap-1 leading-none line-clamp-2">
                      {{ currentSong?.artist_track?.[0]?.name }}
                    </span>
                  </RouterLink>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-2 mb-1 flex w-full items-center justify-between px-2">
        <p class="text-lg font-semibold">
          {{ $t('Queue') }}
        </p>
      </div>
      <div class="flex w-full flex-col items-start justify-start gap-4 pb-4 relative overflow-hidden h-available">
        <ScrollContainer :autoHide="true" :static="false">
          <template v-for="song in queue" :key="song?.id">
            <button @click="handleClick(song)" v-if="song.id !== currentSong?.id"
                    class="flex h-auto w-full items-center justify-start gap-2 rounded-lg p-2 hover:bg-auto-3/50">
              <div class="relative aspect-square h-auto w-14 cursor-pointer overflow-hidden rounded-md text-theme-4">
                <CoverImage v-if="song" :data="song"/>
              </div>
              <div class="relative flex flex-col items-start justify-start gap-1">
                <p class="w-full flex-shrink-0 font-semibold self-stretch-0 text-left">
                  {{ song?.name }}
                </p>
                <div
                    class="mb-1 inline-flex h-6 gap-1 overflow-hidden whitespace-nowrap text-xs w-available line-clamp-1 hover-animate-pause">
                  <div data-marquee="container" class="-ml-1 w-available">
                    <div data-marquee="scroller"
                         class="ml-1 flex w-fit flex-nowrap gap-1 text-xs line-clamp-1 whitespace-break-spaces hover-animate-pause w-available h-available">
                      <span class="flex w-fit flex-wrap gap-1 whitespace-wrap line-clamp-2 h-inherit">
                        <RouterLink :to="song?.artist_track?.[0]?.link ?? '#'"
                                    class="flex gap-1 whitespace-nowrap text-xs font-semibold line-clamp-2 h-inherit hover:underline focus:underline dark:font-medium"
                                    tabindex="0" @click="stopPropagation($event)">
                          <span class="flex items-center gap-1 leading-none line-clamp-2"
                                v-text="song?.artist_track?.[0]?.name">
                          </span>
                        </RouterLink>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </button>
          </template>
        </ScrollContainer>
      </div>
    </div>
  </div>
</template>
