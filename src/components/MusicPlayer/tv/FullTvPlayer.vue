<script setup lang="ts">
import { PropType, onMounted, onUnmounted, ref, watch } from 'vue';

import type { DisplayList } from '@/types/api/music/musicPlayer';
import { SizeState } from '@/types/musicPlayer';

import audioPlayer, {
  currentSong, fullPlayerModalOpen,
  hasLyrics,
  lyricsMenuOpen,
  musicSize,
  setMusicSize
} from '@/store/audioPlayer';

import LyricsOverlay from "@/Layout/Desktop/components/Overlays/LyricsOverlay.vue";

import TrackLinks from '@/components/MusicPlayer/components/TrackLinks.vue';
import ProgressBarContainer from '@/components/MusicPlayer/components/ProgressBarContainer.vue';
import CoverImage from '@/components/MusicPlayer/components/CoverImage.vue';

import ButtonContainer from './ButtonContainer.vue';

defineProps({
  data: {
    type: Object as PropType<DisplayList>,
    required: false,
  },
});

const togglePlayerSize = () => {
  if (musicSize.value === SizeState.compact) {
    setMusicSize(SizeState.full);
  } else {
    setMusicSize(SizeState.compact);
  }
};

watch(hasLyrics, () => {
  setTimeout(() => {
    document.querySelector<HTMLDivElement>('#lyricsContainer')?.scrollTo({
      top: 140,
      behavior: 'smooth',
    });
  }, 500);
});

const timeout = ref<NodeJS.Timeout>();
const controls = ref<HTMLDivElement>();
const item = ref<HTMLDivElement>();
const backdrop = ref<HTMLDivElement>();

const canvas = ref<HTMLCanvasElement>();

const showControls = () => {
  if (!item.value || !controls.value || !backdrop.value || !fullPlayerModalOpen.value) return;

  controls.value.classList.add('delay-300');

  setTimeout(() => {
    if (!controls.value) return;
    controls.value.style.translate = '0 0';
  }, 50);

  backdrop.value.style.setProperty('--backdrop-opacity', '0.6');

  item.value.style.translate = '0 0';
};

const hideControls = () => {
  if (!controls.value || !backdrop.value || !item.value) return;

  controls.value.classList.remove('delay-300');
  setTimeout(() => {
    if (!controls.value) return;
    controls.value.style.translate = '0 100%';
  }, 50);

  backdrop.value.style.setProperty('--backdrop-opacity', '0.4');

  item.value.style.translate = lyricsMenuOpen.value
    ? '0 0'
    : '0 115%';
};

const dynamicControls = () => {
  clearTimeout(timeout.value);
  showControls();

  timeout.value = setTimeout(() => {
    if (!audioPlayer.isPlaying) return;
    hideControls();
  }, 10000);
};

const backButton = () => {
  if (musicSize.value === SizeState.full) {
    setMusicSize(SizeState.compact);
  } else {
    window.history.back();
  }
};

onMounted(() => {
  dynamicControls();

  document.addEventListener('keydown', dynamicControls);
  document.addEventListener('mousemove', dynamicControls);
  document.addEventListener('backbutton', backButton);

  audioPlayer.on('pause', () => {
    showControls();
  });
  audioPlayer.on('play', () => {
    dynamicControls();
  });
  audioPlayer.on('song', () => {
    dynamicControls();
  });

});

watch(canvas, (value) => {
  if (!value) return;
  const context = value.getContext('2d', {
    willReadFrequently: true,
    desynchronized: true,
  });

  const draw = () => {
    const sourceCanvas = audioPlayer._audioElement1?.motion?.canvas;
    if (sourceCanvas) {
      value.width = sourceCanvas.width;
      value.height = sourceCanvas.height;
      context!.clearRect(0, 0, value.width, value.height);
      context!.drawImage(sourceCanvas, 0, 0, value.width, value.height);
    }
    requestAnimationFrame(draw);
  };

  draw();
});

onUnmounted(() => {
  document.removeEventListener('keydown', dynamicControls);
  document.removeEventListener('mousemove', dynamicControls);
  document.removeEventListener('backbutton', backButton);
});

const isDarkMode = ref(false);

const toggleDarkMode = (e?: MouseEvent) => {
  e?.stopPropagation();
  isDarkMode.value = !isDarkMode.value;
};

const onKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'ArrowUp') {
    e.preventDefault();
  }
  if (e.key === 'ArrowDown') {
    e.preventDefault();

    const el = document.querySelector<HTMLDivElement>('#FullTvPlayer #playback-button');
    if (el) {
      el.focus();
    }
  }
};

const ontransitionend = (e: TransitionEvent) => {
  if (e.propertyName === 'translate') {
    const btn = document.querySelector<HTMLDivElement>('#FullTvPlayer #playback-button');
    btn?.focus();
  }
};


</script>

<template>
  <div id="FullTvPlayer"
    class="top-0 grid grid-cols-1 transform-gpu grid-rows-1 left-0 h-screen w-screen overflow-hidden transition-transform will-change-transform duration-500 z-[1299] bg-slate-dark-1"
    :class="{
      'translate-y-0 duration-500': fullPlayerModalOpen,
      'translate-y-full': !fullPlayerModalOpen,
    }" @click="togglePlayerSize">
    <img v-if="data?.backdrop" :src="data?.backdrop" alt=""
      class="transform-gpu pointer-events-none inset-0 h-full w-screen transition-opacity col-span-1 row-span-1" :class="{
        'opacity-0': isDarkMode,
        'opacity-100': !isDarkMode,
      }">

    <canvas ref="canvas" id="audio-visualizer"
      class="absolute top-0 left-0 my-24 mx-6 h-available w-available overflow-clip"></canvas>
    <div id="audio-color" ref="backdrop"
      class="transform-gpu col-span-1 row-span-1 inset-0 w-full h-screen pointer-events-none bg-[var(--background)] opacity-[var(--backdrop-opacity)] transition-colors duration-1000"
      :class="{
        '!opacity-70': lyricsMenuOpen,
      }" :style="`
                --backdrop-opacity: 0.6;
                --select-background: rgb(var(--color-focus));
                --select-background2: black;
                --background: ${isDarkMode
            ? 'var(--select-background2)'
            : 'var(--select-background)'
          };
            `">
    </div>

    <div class="container flex w-full h-full inset-0 col-span-1 row-span-1 p-12 pb-0">

      <div :data-show-lyrics="lyricsMenuOpen"
        class="flex-col absolute inset-0 w-screen flex pb-16 duration-300 delay:500 h-available overflow-clip pointer-events-none z-0">

        <div :data-show-lyrics="true" class="w-full px-12 pb-12 h-full overflow-hidden">
          <div id="lyricsContainer"
            class="z-0 flex h-full w-full flex-col overflow-y-auto overflow-x-hidden scroll-smooth scrollbar-none font-bbc">
            <div class="relative mt-6 whitespace-pre-wrap font-bold h-available">
              <LyricsOverlay :key="currentSong?.id" />
            </div>
          </div>
        </div>
      </div>

      <div id="item" ref="item" class="absolute flex items-end gap-4 z-10 transform-gpu transition-all duration-500"
        :class="{
          'top-12': lyricsMenuOpen,
          'top-64 delay-300': !lyricsMenuOpen
        }">
        <div :data-size="musicSize" class="" :class="{
          'w-14': lyricsMenuOpen,
          'w-28 delay-300': !lyricsMenuOpen
        }">
          <CoverImage :data="currentSong" :size="320"
            className="pointer-events-none relative aspect-square h-auto rounded-md w-inherit" />
        </div>

        <div class="pointer-events-none relative flex flex-col gap-1 font-bold">
          <span class="" :class="{
            'text-xl': lyricsMenuOpen,
            'text-3xl delay-300': !lyricsMenuOpen
          }">
            {{ currentSong?.name }}
          </span>
          <TrackLinks v-if="currentSong" :id="currentSong.id" :data="currentSong.artist_track" tabindex="-1" noLink
            :class="{
              'children:children:children:text-md': lyricsMenuOpen,
              'children:children:children:text-lg children:children:children:delay-500': !lyricsMenuOpen,
              'children:children:children:!no-underline': true
            }" class="children:children:children:font-bold" type="artists" />
        </div>
      </div>

      <div id="controls" ref="controls" :ontransitionend="ontransitionend"
        class="absolute bottom-0 left-0 flex flex-col w-available h-40 items-center px-16 pt-4 mt-4 gap-4 delay-300 transform-gpu transition-all duration-500">

        <ProgressBarContainer v-if="fullPlayerModalOpen"
          class="children:!mx-0 gap-4 children:!pointer-events-none !pointer-events-none" color="white"
          :onKeyDown="onKeyDown" variant="stacked" />

        <ButtonContainer color="white" :data="currentSong" :toggleDarkMode="toggleDarkMode" :isDarkMode="isDarkMode" />

      </div>
    </div>
  </div>
</template>

<style>
@media screen and (min-width: 1024px) {

  #item:has(+ #controls:hover),
  #item:has(+ #controls:focus) {
    translate: 0 0 !important;
  }
}
</style>
