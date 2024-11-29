<script setup lang="ts">
import {nextTick, onBeforeMount, onMounted, onUnmounted, ref, watch} from 'vue';

import type {Lyric} from '@/types/api/music/musicPlayer';
import {random_string} from '@/lib/stringArray';
import {scrollCenter} from '@/lib/utils';
import LyricItem from '@/Layout/Desktop/components/Overlays/LyricItem.vue';

import {user} from '@/store/user';
import {currentServer} from '@/store/currentServer';
import audioPlayer, {currentSong, currentTime, lyricsMenuOpen, setHasLyrics} from '@/store/audioPlayer';

const lyrics_container = ref<HTMLDivElement>();
const lyrics = ref<Lyric[] | undefined| null>(currentSong.value?.lyrics);
const id = ref(random_string(8));
const index = ref<number>(0);
const lastIndex = ref(-1);

const fetchLyrics = (id: string) => {
  if (!id || currentSong.value?.lyrics) return;

  const lyricsUrl = `${currentServer.value?.serverApiUrl}/music/tracks/${id}/lyrics`;

  fetch(lyricsUrl, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user.value.accessToken}`
    },
  })
      .then(response => response.json())
      .then((data) => {
        setHasLyrics(data.data?.length > 0);
        lyrics.value = data.data;
      });
};

const setScroll = () => {
  const element = document.querySelector<HTMLDivElement>(`[data-index="${index.value}"]`)!;
  const container = document.querySelector<HTMLDivElement>('#lyricsContainer');

  if (!element || !container) return;
  scrollCenter(element, container, {
    duration: 0,
  });
};

onBeforeMount(() => {
  lastIndex.value = -1;

  if (currentSong.value?.lyrics) {
    lyrics.value = currentSong.value.lyrics;
  } else if (currentSong.value?.id) {
    fetchLyrics(currentSong.value?.id);
  }
});

onMounted(() => {
  const container = document.querySelector<HTMLDivElement>('#lyricsContainer');
  if (!container) return;
  container.scrollTop = 0;

  const MobilePlayer = document.querySelector<HTMLDivElement>('#MobilePlayer');
  MobilePlayer?.addEventListener('scroll', setScroll);

  audioPlayer.value?.on('seeked', (data) => {
    const newIndex = (lyrics.value?.findIndex?.(l => l.time?.total >= data.position) ?? 0) - 1;

    const elements = Array.from(lyrics_container.value?.querySelectorAll<HTMLDivElement>('[data-lyric]') ?? []);

    console.log(newIndex, elements.length);

    if (newIndex === -1) {

      elements
          .forEach(el => {
            el.style.opacity = '1';
            el.style.color = 'black';
          });

      const currentLyric = lyrics_container.value?.querySelector<HTMLDivElement>(`[data-index='0']`);
      currentLyric?.animateVerticalIntoView(lyrics_container.value);

    }
    else if (newIndex === -2) {

      elements
          .filter(el => parseInt(el.dataset.index!, 10) < newIndex)
          .forEach(el => {
            el.style.opacity = '0.5';
            el.style.color = 'white';
          });

      const currentLyric = lyrics_container.value?.querySelector<HTMLDivElement>(`[data-index='${elements.length - 1}']`);
      currentLyric?.animateVerticalIntoView(lyrics_container.value);

    }
  });
});

onUnmounted(() => {
  const MobilePlayer = document.querySelector<HTMLDivElement>('#MobilePlayer');
  MobilePlayer?.removeEventListener('scroll', setScroll);
});

watch(currentTime, (value) => {
  if (!audioPlayer.value) return;

  value = value + 0.5;

  const newIndex = (lyrics.value?.findIndex?.(l => l.time?.total >= value) ?? 0) - 1;

  if (newIndex === -1 && value > 1) return;
  if (lastIndex.value === newIndex) return;

  lastIndex.value = newIndex;

  const elements = Array.from(lyrics_container.value?.querySelectorAll<HTMLDivElement>('[data-lyric]') ?? []);

  elements
      .filter(el => parseInt(el.dataset.index!, 10) < newIndex)
      .forEach(el => {
        el.style.opacity = '0.5';
        el.style.color = 'white';
      });

  const currentLyric = lyrics_container.value?.querySelector<HTMLDivElement>(`[data-index='${newIndex}']`);

  if (currentLyric) {
    currentLyric.animateVerticalIntoView(lyrics_container.value);
    currentLyric.style.opacity = '1';
    currentLyric.style.color = 'white';
  }

  elements
      .filter(el => parseInt(el.dataset.index!, 10) > newIndex)
      .forEach(el => {
        el.style.opacity = '1';
        el.style.color = 'black';
      });
});

watch(currentSong, (value) => {
  lastIndex.value = -1;

  if (value?.lyrics) {
    lyrics.value = value.lyrics;
  } else if (value?.id) {
    fetchLyrics(value?.id);
  }
});

watch(lyrics, (value) => {
  if (!value || !lyrics_container.value) return;

  const currentLyric = lyrics_container.value?.querySelector<HTMLDivElement>(`[data-index='0']`);
  if (currentLyric) {
    currentLyric.style.opacity = '1';
    currentLyric.style.color = 'white';
    currentLyric?.animateVerticalIntoView(lyrics_container.value);
  }
  const elements = Array.from(lyrics_container.value?.querySelectorAll<HTMLDivElement>('[data-lyric]'));

  nextTick(() => {
    elements.forEach(el => {
      el.style.opacity = '1';
      el.style.color = 'black';
    });
  });

  if (lyrics_container.value) {
    lyrics_container.value.style.opacity = '0';
    setTimeout(() => {
      if (lyrics_container.value) {
        lyrics_container.value.style.opacity = '1';
      }
    }, 1200);
  }
});

</script>

<template>
  <div :data-open="lyricsMenuOpen"
       id="lyricsContainer"
       class="absolute inset-0 h-inherit w-inherit sm:left-auto sm:right-4 sm:top-4 sm:bottom-4 sm:w-2/3 sm:max-w-3xl flex items-center justify-center rounded-xl transition-all duration-300 sm:data-[open='false']:translate-x-[150%] sm:overflow-clip z-[9999]">

    <div
        class="pointer-events-none absolute inset-0 z-0 flex items-center justify-center rounded-xl sm:bg-white/6 dark:sm:bg-black/30">
    </div>

    <div ref="lyrics_container" :id="`lyrics_container_${id}`"
         class="relative z-10 flex w-full flex-col overflow-auto scrollbar-none tv:overflow-clip p-4 children:transition-all duration-300 h-available font-bbc gap-4 sm:gap-4 sm:p-16 text-xl sm:text-2xl">

      <template v-if="!!lyrics">
        <div class="contents" v-if="Array.isArray(lyrics)">
          <template v-for="(lyric, index) in lyrics ?? []" :key="index">
            <LyricItem :lyric="lyric" :index="index"/>
          </template>

          <p class="mt-8 sm:mt-16 font-semibold text-2xs">
            {{ $t('Lyrics provided by Musixmatch') }}
          </p>
        </div>
      </template>

      <template v-if="!lyrics">
        <p class="text-lg font-semibold">
          {{ $t('No lyrics available') }}
        </p>
      </template>
    </div>
  </div>
</template>
