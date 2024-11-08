<script setup lang="ts">

import audioPlayer, {currentSong, queue, queueMenuOpen} from '@/store/audioPlayer';
import CoverImage from '@/components/Images/CoverImage.vue';
import router from '@/router';
</script>

<template>
  <div :data-open="queueMenuOpen"
       class="absolute right-4 top-4 bottom-8 sm:bottom-4 w-available ml-4 sm:w-1/3 bg-slate-light-3 dark:bg-slate-dark-1flex items-center justify-center rounded-lg transition-all duration-300 border-2 border-focus data-[open='false']:translate-x-[150%] z-[9999]">
    <div
        class="pointer-events-none absolute inset-0 flex items-center justify-center rounded-lg opacity-60 bg-auto-3/40">
    </div>

    <div id="queue_container" v-if="currentSong"
         class="flex w-full flex-col overflow-auto tv:overflow-clip px-4 pt-4 pr-0 h-available">

      <div class="flex w-full items-center justify-between p-2">
        <p class="text-lg font-semibold">
          {{ $t('Now Playing') }}
        </p>
      </div>

      <div
          class="flex h-auto w-full items-center justify-start gap-2 rounded-lg px-2 py-2 hover:bg-auto-3/50">
        <div class="relative aspect-square h-auto w-14 cursor-pointer overflow-hidden rounded-md text-theme-4">
          <CoverImage v-if="currentSong" :data="currentSong"/>
        </div>
        <div class="relative flex flex-col items-start justify-start gap-1">
          <p class="w-full flex-shrink-0 font-semibold self-stretch-0">
            {{ currentSong?.name }}
          </p>
          <div
              class="mb-1 inline-flex h-6 gap-1 overflow-hidden whitespace-nowrap text-xs w-available line-clamp-1 hover-animate-pause">
            <div data-marquee="container" class="-ml-1 w-available">
              <div data-marquee="scroller"
                   class="ml-1 flex w-fit flex-nowrap gap-1 text-xs line-clamp-1 whitespace-break-spaces hover-animate-pause w-available h-available">
                            <span class="flex w-fit flex-wrap gap-1 whitespace-wrap line-clamp-2 h-inherit">
                                <button
                                    class="flex gap-1 whitespace-nowrap text-xs font-semibold line-clamp-2 h-inherit hover:underline focus:underline dark:font-medium"
                                    tabindex="0"
                                    @click="e => {
                                     e.stopPropagation();
                                     router.push(`/music/artists/${currentSong?.artist_track?.[0]?.id ?? 'unknown'}`);
                                   }">
                                    <span class="flex items-center gap-1 leading-none line-clamp-2">
                                        {{ currentSong?.artist_track?.[0]?.name }}
                                    </span>
                                </button>
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
      <div
          class="flex h-auto w-full flex-col items-start justify-start gap-4 overflow-auto tv:overflow-clip pb-4">
        <template v-for="song in queue">
          <div @click="audioPlayer?.playTrack(song, queue)"
               class="flex h-auto w-full items-center justify-start gap-2 rounded-lg p-2 hover:bg-auto-3/50">
            <div
                class="relative aspect-square h-auto w-14 cursor-pointer overflow-hidden rounded-md text-theme-4">
              <CoverImage v-if="song" :data="song"/>
            </div>
            <div class="relative flex flex-col items-start justify-start gap-1">
              <p class="w-full flex-shrink-0 font-semibold self-stretch-0">
                {{ song?.name }}
              </p>
              <div
                  class="mb-1 inline-flex h-6 gap-1 overflow-hidden whitespace-nowrap text-xs w-available line-clamp-1 hover-animate-pause">
                <div data-marquee="container" class="-ml-1 w-available">
                  <div data-marquee="scroller"
                       class="ml-1 flex w-fit flex-nowrap gap-1 text-xs line-clamp-1 whitespace-break-spaces hover-animate-pause w-available h-available">
                                    <span class="flex w-fit flex-wrap gap-1 whitespace-wrap line-clamp-2 h-inherit">
                                        <button
                                            class="flex gap-1 whitespace-nowrap text-xs font-semibold line-clamp-2 h-inherit hover:underline focus:underline dark:font-medium"
                                            tabindex="0"
                                            @click="e => {
                                             e.stopPropagation();
                                              router.push(`/music/artists/${song?.artist_track?.[0]?.id ?? 'unknown'}`);
                                           }"
                                        >
                                            <span class="flex items-center gap-1 leading-none line-clamp-2"
                                                  v-text="song?.artist_track?.[0]?.name">
                                            </span>
                                        </button>
                                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
