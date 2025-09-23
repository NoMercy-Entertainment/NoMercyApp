<script lang="ts" setup>
import type { PropType } from 'vue';
import { watch } from 'vue';

import type { PlaylistItem } from '@/types/musicPlayer';

import {
	isPlaying,
	musicSize,
	musicVisibility,
	setMusicSize,
} from '@/store/audioPlayer';
import sidebar from '@/store/sidebar';
import { SizeState } from '@/types/musicPlayer';
import CoverImage from '@/components/MusicPlayer/components/CoverImage.vue';
import EqSpinner from '@/components/Images/EqSpinner.vue';
import OptimizedIcon from '@/components/OptimizedIcon.vue';
import TrackLinks from '@/components/MusicPlayer/components/TrackLinks.vue';

defineProps({
	currentSong: {
		type: Object as PropType<PlaylistItem | null>,
		required: false,
	},
});

function togglePlayerSize() {
	if (musicSize.value === SizeState.compact) {
		setMusicSize(SizeState.full);
	}
	else {
		setMusicSize(SizeState.compact);
	}
}

// const hasBeenActive = ref(false);

// const handleKeyUp = (e: KeyboardEvent & { target: HTMLDivElement }) => {
// 	if (e.key === 'ArrowLeft') {
//
// 		if (e.target!.id !== 'MiniTvPlayer' && hasBeenActive.value) {
// 			const el = document.querySelector<HTMLButtonElement>('#sidebar')
// 				?.querySelector('a');
//
// 			hasBeenActive.value = false;
// 			// console.log(el);
// 			if (el) {
// 				el.focus();
// 			}
// 		} else {
// 			const el = document.querySelector<HTMLButtonElement>('#MiniTvPlayer');
// 			// console.log(el);
// 			if (el) {
// 				el.focus();
// 				hasBeenActive.value = true;
// 			}
// 		}
//
// 	} else if (e.key === 'ArrowRight') {
// 		const el = window.lastFocusElement;
// 		// console.log(el);
// 		if (el) {
// 			el.focus();
// 			hasBeenActive.value = false;
// 		}
// 	}
// };

watch(musicSize, () => {
	if (musicSize.value === SizeState.compact) {
		setTimeout(() => {
			const el = document.querySelector<HTMLDivElement>('#MiniTvPlayer');
			if (el) {
				el.focus();
			}
		}, 100);
	}
});
</script>

<template>
	<div
		v-if="musicSize === SizeState.compact"
		id="MiniTvPlayer"
		:data-music="musicVisibility"
		:data-sidebar="sidebar"
		:data-size="musicSize"
		:onclick="() => togglePlayerSize()"
		:tabindex="musicSize === SizeState.compact ? 1 : -1"
		class="absolute music-showing:flex hidden h-16 flex-col overflow-hidden rounded-lg bg-white/5 outline-white w-available focus-visible:outline active:outline"
	>
		<div class="flex h-full items-center justify-between pb-2 p-1.5">
			<div
				class="pointer-events-none flex h-full w-full items-center overflow-hidden"
			>
				<CoverImage
					v-if="currentSong"
					:data="currentSong"
					:size="180"
					class-name="relative aspect-square h-auto w-14 cursor-pointer overflow-hidden rounded-md text-focus00 min-w-[3rem]"
				/>

				<div
					v-if="currentSong"
					class="flex h-full flex-col overflow-hidden px-2 w-available"
				>
					<div class="flex w-full justify-between">
						<span class="text-xs">{{ $t("Now Playing") }}</span>

						<EqSpinner v-if="isPlaying" :playing="isPlaying" />

						<OptimizedIcon
							class="block h-6 w-6 group-hover:sm:block"
							icon="play"
						/>
					</div>

					<div :data-size="musicSize" class="overflow-hidden pr-2">
						<TrackLinks
							v-if="currentSong"
							:id="currentSong.id"
							:data="currentSong.artist_track"
							:title="currentSong?.name"
							type="artists"
						/>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
