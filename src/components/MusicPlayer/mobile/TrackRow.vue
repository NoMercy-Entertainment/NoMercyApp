<script lang="ts" setup>
import { SizeState } from '@/types/musicPlayer';

import { currentSong, musicSize, setMusicSize } from '@/store/audioPlayer';

import TrackLinks from '@/components/MusicPlayer/components/TrackLinks.vue';
import MediaLikeButton from '@/components/Buttons/MediaLikeButton.vue';

function togglePlayerSize() {
	if (musicSize.value === SizeState.compact) {
		setMusicSize(SizeState.full);
	}
	else {
		setMusicSize(SizeState.compact);
	}
}
</script>

<template>
	<div class="flex w-full flex-col justify-end gap-8">
		<div class="my-1 flex w-full items-center">
			<div class="z-10 flex w-full flex-col gap-2 overflow-clip">
				<h6 class="w-full overflow-clip text-xl font-semibold line-clamp-1">
					<span class="overflow-hidden leading-none w-inherit line-clamp-1">
						{{ currentSong?.name }}
					</span>
				</h6>
				<div
					:data-size="musicSize"
					class="mb-1 inline-flex w-fit gap-1 overflow-hidden whitespace-nowrap text-xs line-clamp-1 hover:animate-pause"
				>
					<TrackLinks
						v-if="currentSong"
						:id="currentSong.id"
						:data="currentSong.artist_track"
						:onclick="togglePlayerSize"
						type="artists"
					/>
				</div>
			</div>

			<MediaLikeButton
				v-if="currentSong"
				:key="currentSong?.id + currentSong?.favorite"
				:data="currentSong"
				class="flex"
				color="var(--color-theme-8)"
			/>
		</div>
	</div>
</template>
