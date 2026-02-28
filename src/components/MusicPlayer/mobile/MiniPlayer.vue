2
<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useSwipe } from '@vueuse/core';

import { pickPaletteColor } from '@/lib/colorHelper';
import audioPlayer, { currentSong, openFullPlayer, percentage } from '@/store/audioPlayer';
import { useAutoThemeColors } from '@/store/preferences';
import { menuOpen } from '@/store/profileMenu';

import CoverImage from '@/components/MusicPlayer/components/CoverImage.vue';
import MediaLikeButton from '@/components/Buttons/MediaLikeButton.vue';

import DeviceButton from '../components/DeviceButton.vue';
import PlaybackButton from '../components/PlaybackButton.vue';
import TrackLinks from '../components/TrackLinks.vue';

const focusColor = computed(() => {
	if (!useAutoThemeColors.value)
		return 'var(--color-theme-7)';

	return pickPaletteColor(currentSong.value?.color_palette?.cover, 20, 160);
	// .replace(/,/gu, ' ')
	// .replace('rgb(', '');
});

const target = ref<HTMLElement | null>(null);
const container = ref<HTMLElement | null>(null);
const containerWidth = computed(() => container.value?.offsetWidth);
const left = ref('0');
const opacity = ref(1);

function reset() {
	left.value = '0';
	opacity.value = 1;
}

const { isSwiping, lengthX } = useSwipe(target, {
	passive: true,
	onSwipe() {
		if (containerWidth.value) {
			const length = Math.abs(lengthX.value);
			opacity.value = 1.1 - length / containerWidth.value;
			if (lengthX.value < 0) {
				left.value = `${length}px`;
			}
			else {
				left.value = `-${length}px`;
			}
		}
	},
	onSwipeEnd() {
		if (
			containerWidth.value
			&& ((lengthX.value < 0
				&& Math.abs(lengthX.value) / containerWidth.value >= 0.5)
			|| (lengthX.value > 100
				&& Math.abs(lengthX.value) / containerWidth.value >= 0.5))
		) {
			left.value = '100%';
			opacity.value = 0;
			audioPlayer.stop();
			reset();
		}
		else {
			left.value = '0';
			opacity.value = 1;
		}
	},
});
</script>

<template>
	<div
		v-if="!menuOpen && currentSong"
		id="miniPlayer"
		ref="container"
		:style="`--color-theme-8: ${focusColor}`"
		class="flex absolute w-available justify-between items-center self-stretch bottom-safe-offset-[60px] h-14 overflow-hidden p-2 bg-surface-1 mt-auto z-10"
		@click="openFullPlayer()"
	>
		<div
			class="absolute inset-0 h-full w-full bg-gradient-to-b to-black/40 from-focus/40"
		/>
		<div
			class="flex flex-grow items-center justify-start gap-2.5 overflow-clip w-[65%]"
		>
			<div
				class="frosting relative flex w-10 min-w-10 items-start justify-start gap-2 overflow-hidden rounded"
			>
				<CoverImage
					v-if="currentSong"
					:data="currentSong"
					:size="100"
					class-name="relative aspect-square h-10 w-10 cursor-pointer overflow-hidden rounded-sm text-focus00 min-w-[2.5rem] min-h-[2.5rem]"
				/>
			</div>
			<div
				ref="target"
				:class="{ animated: !isSwiping }"
				:style="{ left, opacity }"
				class="relative flex h-full flex-grow flex-col items-start justify-evenly overflow-clip w-inherit"
			>
				<p
					class="w-auto self-stretch text-left text-sm font-medium leading-6 line-clamp-1"
				>
					{{ currentSong?.name }}
				</p>
				<p
					class="children:children:children:children:children:leading-6 w-auto self-stretch text-left text-sm"
				>
					<TrackLinks
						v-if="currentSong"
						:id="currentSong.id"
						:data="currentSong.artist_track"
						type="artists"
					/>
				</p>
			</div>
		</div>
		<div class="flex items-center justify-end gap-1">
			<DeviceButton no-name />
			<MediaLikeButton
				:key="currentSong?.id + currentSong?.favorite"
				:data="currentSong"
				color="var(--color-theme-8)"
			/>
			<PlaybackButton class="children:h-7 children:w-7" />
		</div>
		<div class="absolute left-0 w-full h-0.5 top-[54px] blur-[1px]">
			<div
				class="absolute w-full h-0.5 left-[-1px] top-[-1px] bg-black/[0.22]"
			/>
			<div
				:style="`width: ${percentage}%;`"
				class="w-0 h-0.5 absolute left-[-1px] top-[-1px] rounded-sm bg-gradient-to-r from-black/5 to-[var(--color-theme-8)] z-10"
			/>
			<div
				:style="`left: ${percentage}%;`"
				class="w-1 h-0.5 absolute top-[-1px] rounded-sm bg-[#f1EEFE] -translate-x-[2px] z-0"
			/>
		</div>
	</div>
</template>
