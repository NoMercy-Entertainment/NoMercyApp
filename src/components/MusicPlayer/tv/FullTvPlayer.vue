<script setup lang="ts">
import { PropType, onMounted, onUnmounted, ref, watch } from 'vue';

import type { DisplayList } from '@/types/api/music/musicPlayer';
import audioPlayer, {
  currentSong,
  hasLyrics,
  lyricsMenuOpen,
  musicSize,
  musicVisibility,
  setMusicSize
} from '@/store/audioPlayer';
import {SizeState} from '@/types/musicPlayer';
import sidebar from '@/store/sidebar';
import TrackLinks from '@/components/MusicPlayer/components/TrackLinks.vue';
import ProgressBarContainer from '@/components/MusicPlayer/components/ProgressBarContainer.vue';
import ButtonContainer from '@/components/MusicPlayer/mobile/ButtonContainer.vue';
import CoverImage from '@/components/MusicPlayer/components/CoverImage.vue';


defineProps({
	data: {
		type: Object as PropType<DisplayList>,
		required: false,
	},
});

// const margin = ref(2.2);

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

const showControls = () => {

	const controls = document.querySelector<HTMLDivElement>('#controls');
	const item = document.querySelector<HTMLDivElement>('#item');
	const backdrop = document.querySelector<HTMLDivElement>('#backdrop');

	if (!item || !controls || !backdrop) return;

	if (getComputedStyle(item).translate !== '0px') {
		setTimeout(() => {

			const btn = document.querySelector<HTMLDivElement>('#playback-button');

			btn?.focus();

			backdrop.style.setProperty('--backdrop-opacity', '0.6');

		}, 100);
	}

	controls.style.translate = '0 0';
	item.style.translate = '0 0';
};

const hideControls = () => {
	const controls = document.querySelector<HTMLDivElement>('#controls')!;
	const backdrop = document.querySelector<HTMLDivElement>('#backdrop')!;
	const item = document.querySelector<HTMLDivElement>('#item')!;
	if (!controls || !backdrop || !item) return;

	controls.style.translate = '0 100%';

	backdrop.style.setProperty('--backdrop-opacity', '0.4');

	item.style.translate = lyricsMenuOpen.value && hasLyrics.value
		? '0 0'
		: '0 115%';
};

const dynamicControls = () => {
	clearTimeout(timeout.value);
	showControls();

	timeout.value = setTimeout(() => {
		if (!audioPlayer.value?.isPlaying) return;
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

	audioPlayer.value?.on('pause', () => {
		showControls();
	});
	audioPlayer.value?.on('play', () => {
		dynamicControls();
	});
	audioPlayer.value?.on('song', () => {
		dynamicControls();
	});
});

onUnmounted(() => {
	document.removeEventListener('keydown', dynamicControls);
	document.removeEventListener('mousemove', dynamicControls);
	document.removeEventListener('backbutton', backButton);
});

const isDarkMode = ref(false);

const toggleDarkMode = (e: MouseEvent) => {
	e.stopPropagation();
	isDarkMode.value = !isDarkMode.value;
};

</script>

<template>
    <div v-if="!!currentSong"
            id="FullTvPlayer"
         class="fixed top-0 left-0 flex h-screen w-screen compact:translate-y-full flex-col gap-2 overflow-hidden p-12 pb-0 transition-transform compact:duration-500 duration-500 z-[1299] bg-auto-50"
         :data-size="musicSize"
         :data-music="musicVisibility"
         :onclick="togglePlayerSize"
         :data-sidebar="sidebar">
        <img v-if="data?.backdrop"
             :src="data?.backdrop"
             :class="isDarkMode ? 'opacity-0' : 'opacity-100'"
             alt=""
             class="pointer-events-none absolute inset-0 h-full w-full transition-transform">

        <div id="backdrop"
             class="absolute inset-0 w-screen h-screen pointer-events-none bg-[var(--background)] opacity-[var(--backdrop-opacity)] transition-transform duration-1000"
             :class="lyricsMenuOpen && hasLyrics ? '!opacity-70' : ''"
             :style="`
                --backdrop-opacity: 0.6;
                --select-background: ${(currentSong?.color_palette?.cover?.lightMuted)};
                --select-background2: black;
                --background: ${isDarkMode ? 'var(--select-background2)' : 'var(--select-background)'};
            `">
        </div>

        <div :data-show-lyrics="lyricsMenuOpen && hasLyrics"
             class="flex-col absolute inset-0 w-screen flex px-24 pt-28 pb-16 transition-transform duration-300 children:transition-opacity h-available overflow-clip opacity-0 data-[show-lyrics='true']:opacity-100 pointer-events-none data-[show-lyrics='true']:delay-500">

            <div :data-show-lyrics="true"
                 class="w-full px-12 h-full overflow-hidden sm:items-start translate-y-[200%] data-[show-lyrics='true']:translate-y-0 data-[show-lyrics='true']:delay-500 transition-transform !duration-500">
                <div id="lyricsContainer"
                     class="z-0 flex h-full w-full flex-col overflow-y-auto overflow-x-hidden scroll-smooth transition-transform children:transition-transform duration-500 children:duration-500 scrollbar-none font-bbc">
                    <div class="relative mt-6 whitespace-pre-wrap font-bold text-contrast">
<!--                        <LyricsOverlay :key="currentSong?.id"-->
<!--                                :margin="margin" />-->
                    </div>
                </div>
            </div>
        </div>

        <div id="item"
             class="fixed flex items-end gap-4 transition-transform duration-500"
             :class="lyricsMenuOpen && hasLyrics ? 'top-12' : 'top-64'">
            <div class="transition-transform duration-500"
                 :class="lyricsMenuOpen && hasLyrics ? 'w-14' : 'w-28'"
                 :data-size="musicSize">
                <CoverImage :data="currentSong"
							:size="320"
							className="pointer-events-none relative aspect-square h-auto rounded-md w-inherit" />
            </div>

            <div class="pointer-events-none relative flex flex-col gap-1 font-bold transition-transform duration-500">
                <span class="transition-transform duration-500"
                      :class="lyricsMenuOpen && hasLyrics
                          ? 'text-xl'
                          : 'text-3xl'
                          ">
                    {{ currentSong?.name }}
                </span>
                <TrackLinks v-if="currentSong"
                            :id="currentSong.id"
                            :data="currentSong.artist_track"
                            :class="lyricsMenuOpen && hasLyrics
                                ? 'children:children:children:text-md'
                                : 'children:children:children:text-lg'"
                            class="children:children:children:font-bold transition-transform duration-500"
                            type="artists" />
            </div>
        </div>

        <div id="controls"
             class="fixed bottom-0 left-0 flex flex-col w-available h-40 items-center px-16 pt-4 mt-4 gap-4 transition-transform duration-500 bg-black/10
             xl:hover:![translate:0px_0%]"
             :class="lyricsMenuOpen && hasLyrics ? 'backdrop-blur-sm' : 'backdrop-blur-0'">

            <ProgressBarContainer v-if="musicSize == SizeState.full"
                                  class="children:!mx-0 gap-4 children:!pointer-events-none !pointer-events-none"
                                  color="white"
                                  variant="stacked" />

            <ButtonContainer color="white"
                             :data="currentSong"
                             :toggleDarkMode="toggleDarkMode"
                             :isDarkMode="isDarkMode" />
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
