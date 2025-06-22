<script setup lang="ts">
import type { PropType } from 'vue';
import { watch } from 'vue';

import { SizeState } from '@/types/musicPlayer';

import { closeFullPlayer, currentSong, musicSize } from '@/store/audioPlayer';

import LyricsButton from '@/components/MusicPlayer/components/LyricsButton.vue';
import MediaLikeButton from '@/components/Buttons/MediaLikeButton.vue';
import OptimizedIcon from '@/components/OptimizedIcon.vue';

import NextButton from '../components/NextButton.vue';
import PlaybackButton from '../components/PlaybackButton.vue';
import PreviousButton from '../components/PreviousButton.vue';
import RepeatButton from '../components/RepeatButton.vue';
import ShuffleButton from '../components/ShuffleButton.vue';
import MusicButton from '../components/MusicButton.vue';

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
			const el = document.querySelector<HTMLDivElement>(
				'#FullTvPlayer #playback-button',
			);
			if (el) {
				el.focus();
			}
		}, 100);
	}
});

function handleQueue(e?: MouseEvent) {
	e?.preventDefault();
	e?.stopPropagation();
	closeFullPlayer();
}
</script>

<template>
	<div
		v-if="currentSong"
		class="relative flex w-full items-center justify-between"
	>
		<div class="flex gap-4">
			<MediaLikeButton
				:data="currentSong"
				:color="color"
				class-name="children:h-7 h-10 children:w-7 w-10"
			/>
		</div>

		<div
			class="fixed left-1/2 mx-auto flex w-fit -translate-x-1/2 items-center justify-center gap-4 rounded-xl bg-black/20 text-white px-4 py-3"
			:data-size="musicSize"
		>
			<ShuffleButton class="h-10 w-10" />
			<PreviousButton class="h-10 w-10" />

			<PlaybackButton
				id="playback-button"
				class="h-12 w-12 !rounded-full"
				:class="
					color === 'white'
						? 'children:fill-auto-300 children:w-9 children:h-9 active:ring-2 ring-offset-4 focus:outline active:outline outline-4 outline-auto-300 text-black !rounded-full'
						: 'text-black'
				"
				:style="`background-color: ${color};`"
			/>

			<NextButton class="h-10 w-10" />
			<RepeatButton class="h-10 w-10" />
		</div>

		<div class="flex gap-4">
			<LyricsButton
				class="h-11 w-11 children:w-7 children:h-7 children:!fill-white"
			/>

			<MusicButton
				label="Queue"
				:onclick="handleQueue"
				class="h-11 w-11 children:w-7 children:h-7 children:!fill-white"
			>
				<OptimizedIcon icon="currentPlaylist" class="h-11 w-11" />
			</MusicButton>

			<MusicButton
				label="Dark mode"
				:onclick="toggleDarkMode"
				class="h-11 w-11 children:w-7 children:h-7 children:!fill-white"
			>
				<OptimizedIcon v-if="isDarkMode" icon="moon" class="h-11 w-11" />

				<OptimizedIcon v-else icon="sun" class="h-11 w-11" />
			</MusicButton>
		</div>
	</div>
</template>
