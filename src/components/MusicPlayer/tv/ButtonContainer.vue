<script setup lang="ts">
import { PropType, watch } from 'vue';


import NextButton from '../components/NextButton.vue';
import PlaybackButton from '../components/PlaybackButton.vue';
import PreviousButton from '../components/PreviousButton.vue';
import RepeatButton from '../components/RepeatButton.vue';
import ShuffleButton from '../components/ShuffleButton.vue';
import FavoriteButton from '../components/FavoriteButton.vue';
import MusicButton from '../components/MusicButton.vue';
import {currentSong, musicSize, setMusicSize} from '@/store/audioPlayer';
import {SizeState} from '@/types/musicPlayer';
import LyricsButton from '@/components/MusicPlayer/components/LyricsButton.vue';

defineProps({
	color: {
		type: String,
		required: true,
	},
	toggleDarkMode: {
		type: Function as PropType<(e?: MouseEvent) => void>,
		required: true,
	},
	isDarkMode: {
		type: Boolean,
		required: true,
	},
});

watch(musicSize, () => {
	if (musicSize.value === SizeState.full) {
		setTimeout(() => {
			const el = document.querySelector<HTMLDivElement>('#playback-button');
			if (el) {
				el.focus();
			}
		}, 100);
	}
});

const handleQueue = (e?: MouseEvent) => {
	e?.preventDefault();
	e?.stopPropagation();
	setMusicSize(SizeState.compact);
};

</script>

<template>
    <div v-if="currentSong" class="relative flex w-full items-center justify-between">
        <div class="flex gap-4">
            <FavoriteButton :data="currentSong" :color="color" className="children:h-7 h-10 children:w-7 w-10" />
        </div>

        <div class="fixed left-1/2 mx-auto flex w-fit -translate-x-1/2 items-center justify-center gap-4 rounded-xl bg-black/30 px-4 py-3"
            :data-size="musicSize">
            <ShuffleButton class="h-10 w-10" />
            <PreviousButton class="h-10 w-10" />
            <PlaybackButton class="h-12 w-12"
                id="playback-button"
                :class="color == 'white'
                    ? 'children:fill-auto-300 children:w-9 children:h-9 !bg-auto-950 active:ring-2 ring-offset-4 focus:outline active:outline outline-4 outline-auto-300'
                    : ''
                "
                :style="`background-color: ${color};`" />
            <NextButton class="h-10 w-10" />
            <RepeatButton class="h-10 w-10" />
        </div>

        <div class="flex gap-4">
            <div class="w-10">
                <LyricsButton class="h-11 w-11 children:w-7 children:h-7 children:!fill-white" />
            </div>

            <MusicButton label="Queue" :onclick="handleQueue" class="h-11 w-11 children:w-7 children:h-7 children:!fill-white">
<!--                <QueueMusicOutlined class="h-11 w-11" />-->
            </MusicButton>

            <MusicButton label="Dark mode" :onclick="toggleDarkMode" class="h-11 w-11 children:w-7 children:h-7 children:!fill-white">

<!--                <LightModeOutlined v-if="isDarkMode" class="h-11 w-11" />-->

<!--                <DarkModeOutlined v-else class="h-11 w-11" />-->
            </MusicButton>
        </div>
    </div>
</template>
