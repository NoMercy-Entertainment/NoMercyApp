<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import type { Swiper } from 'swiper';
import { Swiper as SwiperComponent, SwiperSlide } from 'swiper/vue';
import 'swiper/css';

import {
	audioPlayer,
	currentPlaylist,
	currentSong,
	fullPlayerModalOpen,
	queue,
	setFullPlayerModalOpen,
} from '@/store/audioPlayer';
import type { PaletteColors } from '@/lib/colorHelper';
import { pickPaletteColor } from '@/lib/colorHelper';
import { colorPalette } from '@/store/ui';

import type { PlaylistItem } from '@/types/musicPlayer';

import LyricsOverlay from '@/Layout/Desktop/components/Overlays/LyricsOverlay.vue';

import MusicButton from '@/components/MusicPlayer/components/MusicButton.vue';
import ProgressBarContainer from '@/components/MusicPlayer/components/ProgressBarContainer.vue';
import CoverImage from '@/components/MusicPlayer/components/CoverImage.vue';
import ChristmasSnow from '@/components/Seasonal/Christmas/ChristmasSnow.vue';

import TopRow from '../mobile/TopRow.vue';
import TrackRow from '../mobile/TrackRow.vue';
import ButtonContainer from '../mobile/ButtonContainer.vue';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';

const lyricsSize = ref<'small' | 'full'>('small');
const content = ref<HTMLElement>();
const lyricsContainer = ref<HTMLElement>();
const oldColorPalette = ref<PaletteColors | null | undefined>();
const currentFullPlaylistItem = ref(0);
const swiper = ref<VueSwiperElement>();
const loading = ref<'lazy' | 'eager'>('lazy');
const fullPlaylist = ref<PlaylistItem[]>([
	currentSong.value!,
	...Object.values(queue.value!),
]);

watch(
	lyricsSize,
	() => {
		setTimeout(() => {
			if (lyricsSize.value === 'small') {
				document.querySelector<HTMLDivElement>('#MobilePlayer')?.scrollTo({
					top: window.innerHeight / 2,
					behavior: 'smooth',
				});
			}
			else {
				document.querySelector<HTMLDivElement>('#MobilePlayer')?.scrollTo({
					top: 999990,
					behavior: 'smooth',
				});
			}
		}, 200);
	},
	{ immediate: true },
);

watch(fullPlayerModalOpen, (value) => {
	if (value) {
		oldColorPalette.value = colorPalette.value;
		setTimeout(() => {
			loading.value = 'eager';
		}, 50);
	}
});

watch(currentSong, (value) => {
	if (!value)
		return;

	const current = fullPlaylist.value.findIndex(item => item.id === value.id);

	currentFullPlaylistItem.value = current;

	swiper.value?.$el?.swiper.slideTo(current);
});

const focusColor = computed(() => pickPaletteColor(currentSong.value?.color_palette?.cover, 20, 160));

function handleSwiperChange(swiper: Swiper) {
	if (swiper.touches.diff === 0)
		return;
	if (
		swiper.touches.startX > swiper.touches.currentX
		&& swiper.touches.diff < -100
	) {
		audioPlayer.next();
	}
	else if (
		swiper.touches.startX < swiper.touches.currentX
		&& swiper.touches.diff > 100
	) {
		audioPlayer.previous();
	}
}

function handleExpand() {
	if (!lyricsContainer.value)
		return;

	lyricsSize.value = lyricsSize.value === 'small' ? 'full' : 'small';

	if (lyricsSize.value === 'small') {
		content.value?.scrollTo({ top: 0, behavior: 'smooth' });
		setTimeout(() => {
			lyricsContainer.value!.style.height = '25rem';
		}, 500);
	}
	else {
		lyricsContainer.value!.style.height = `${window.innerHeight * 0.915}px`;
		setTimeout(() => {
			content.value?.scrollTo({ top: content.value.scrollHeight, behavior: 'smooth' });
		}, 0);
	}
}

function handleDismiss() {
	setFullPlayerModalOpen(false);
}
</script>

<template>
	<Teleport to="body">
		<Transition name="slide-up">
			<div
				v-if="fullPlayerModalOpen"
				class="fixed inset-0 z-[9999] flex flex-col"
			>
				<!-- Backdrop -->
				<div
					class="absolute inset-0 bg-black/50"
					@click="handleDismiss"
				/>

				<!-- Modal content -->
				<div
					ref="content"
					:class="{ 'is-open': lyricsSize === 'full' }"
					:style="focusColor
						? `--color-theme-8: ${focusColor};`
						: ''"
					class="relative flex flex-col h-full w-full overflow-y-auto overflow-x-hidden"
					style="background: linear-gradient(to bottom, hsl(from var(--color-theme-8) h s 16%), hsl(from var(--color-theme-8) h s 0%));"
				>
					<ChristmasSnow />

					<div
						class="relative z-0 flex h-screen min-h-screen flex-col items-center justify-between gap-2 w-inherit scrollbar-none text-surface-12 overflow-clip"
					>
						<div
							class="pointer-events-none absolute inset-0 w-full transition-all duration-500"
							style="background: linear-gradient(to bottom, hsl(from var(--color-theme-8) h s 30%), hsl(from var(--color-theme-8) h s 5%));"
						/>

						<TopRow class="pt-safe px-6" />

						<SwiperComponent
							:key="currentPlaylist!"
							ref="swiper"
							:initial-slide="currentFullPlaylistItem"
							:loop="true"
							:slides-per-view="1"
							class="w-available swiper isolate z-0 mb-4"
							@touch-end="handleSwiperChange"
						>
							<template v-for="(item, index) in fullPlaylist ?? []" :key="item.id">
								<SwiperSlide :data-id="item.id" :data-index="index" class="h-full">
									<div
										class="frosting w-available max-w-2xl h-auto aspect-square shadow mx-6 relative items-center flex"
									>
										<CoverImage
											:key="item.id"
											:data="item"
											:loading="
												index === currentFullPlaylistItem ? 'eager' : loading
											"
											:size="500"
											class-name="pointer-events-none relative aspect-square h-auto overflow-clip rounded-md w-inherit shadow"
										/>
									</div>
								</SwiperSlide>
							</template>
						</SwiperComponent>

						<TrackRow class="px-6" />

						<ProgressBarContainer class="children:!mx-0 gap-4 px-6" />
						<ButtonContainer />
					</div>

					<div
						class="frosting relative mx-3 mb-0 -mt-8 rounded-2xl pt-10 w-available bg-focus/60 shadow text-surface-12"
					>
						<div
							class="absolute top-0 z-10 flex w-full items-center rounded-t-2xl pr-2 pl-4 font-semibold"
						>
							<span>{{ $t("Lyrics") }}</span>
							<MusicButton :onclick="handleExpand" class="ml-auto" label="expand">
								<MoooomIcon
									v-if="lyricsSize === 'full'"
									class="h-5 w-5"
									icon="arrowExitFullscreen"
								/>
								<MoooomIcon v-else class="h-5 w-5" icon="arrowEnterFullscreen" />
							</MusicButton>
						</div>
						<div
							class="pointer-events-none absolute inset-0 flex items-center justify-center rounded-xl bg-black opacity-3"
						/>

						<div
							ref="lyricsContainer"
							class="relative w-full mb-0 flex-col overflow-auto scroll-smooth rounded-b-2xl p-4 transition-transform duration-150 h-[25rem]"
						>
							<LyricsOverlay class="sm:hidden" />
						</div>
					</div>
				</div>
			</div>
		</Transition>
	</Teleport>
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
	transition: transform 0.3s ease;
}
.slide-up-enter-from {
	transform: translateY(100%);
}
.slide-up-leave-to {
	transform: translateY(100%);
}

.is-open {
	background: linear-gradient(to bottom, hsl(from var(--color-theme-8) h s 6%), hsl(from var(--color-theme-8) h s 0%));
}
</style>
