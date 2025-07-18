<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useTranslation } from 'i18next-vue';
import { IonContent, IonModal } from '@ionic/vue';
import type { Swiper } from 'swiper';
import { Swiper as SwiperComponent } from 'swiper/vue';

import {
	audioPlayer,
	currentPlaylist,
	currentSong,
	fullPlayerModalOpen,
	queue,
	setFullPlayerModalOpen,
} from '@/store/audioPlayer';
import { useAutoThemeColors } from '@/store/preferences';
import type { PaletteColors } from '@/lib/colorHelper';
import { pickPaletteColor } from '@/lib/colorHelper';
import { colorPalette } from '@/store/ui';

import type { PlaylistItem } from '@/types/musicPlayer';

import LyricsOverlay from '@/Layout/Desktop/components/Overlays/LyricsOverlay.vue';

import MusicButton from '@/components/MusicPlayer/components/MusicButton.vue';
import ProgressBarContainer from '@/components/MusicPlayer/components/ProgressBarContainer.vue';
import CoverImage from '@/components/MusicPlayer/components/CoverImage.vue';
import OptimizedIcon from '@/components/OptimizedIcon.vue';
import ChristmasSnow from '@/components/Seasonal/Christmas/ChristmasSnow.vue';

import TopRow from '../mobile/TopRow.vue';
import TrackRow from '../mobile/TrackRow.vue';
import ButtonContainer from '../mobile/ButtonContainer.vue';

const { t } = useTranslation();

const lyricsSize = ref<'small' | 'full'>('small');
const content = ref<VueDivElement>();
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

const focusColor = computed(() => {
	if (!useAutoThemeColors.value)
		return 'var(--color-theme-7)';

	return pickPaletteColor(
		currentSong.value?.color_palette?.backdrop
		?? currentSong.value?.color_palette?.cover,
		20,
		160,
	)
		.replace(/,/gu, ' ')
		.replace('rgb(', '');
});

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
		// @ts-ignore
		content.value?.$el?.scrollToTop();
		setTimeout(() => {
			lyricsContainer.value!.style.height = '25rem';
		}, 500);
	}
	else {
		lyricsContainer.value!.style.height = `${window.innerHeight * 0.915}px`;
		setTimeout(() => {
			// @ts-ignore
			content.value.$el?.scrollToBottom();
		}, 0);
	}
}

async function onWillDismiss() {
	setFullPlayerModalOpen(false);
}
</script>

<template>
	<IonModal
		id="fullPlayer"
		key="fullPlayer"
		:is-open="fullPlayerModalOpen"
		:initial-breakpoint="1"
		:breakpoints="[0, 1]"
		@will-dismiss="onWillDismiss"
	>
		<IonContent
			ref="content"
			:fullscreen="true"
			:style="`--color-focus: ${focusColor}`"
		>
			<ChristmasSnow />

			<div
				class="relative z-0 flex h-screen min-h-screen flex-col items-center justify-between gap-2 w-inherit scrollbar-none text-slate-light-12 dark:text-slate-dark-12 overflow-clip"
			>
				<div
					class="pointer-events-none absolute inset-0 w-full bg-spotifyBottom bg-focus transition-all duration-500"
				/>

				<TopRow class="pt-safe px-6" />

				<SwiperComponent
					ref="swiper"
					:key="currentPlaylist!"
					:slides-per-view="1"
					:initial-slide="currentFullPlaylistItem"
					:loop="true"
					class="w-available swiper isolate z-0"
					@touch-end="handleSwiperChange"
				>
					<template v-for="(item, index) in fullPlaylist ?? []" :key="item.id">
						<swiper-slide class="h-full" :data-index="index" :data-id="item.id">
							<div
								class="frosting w-available max-w-2xl h-auto aspect-square shadow mx-6 relative items-center flex"
							>
								<CoverImage
									:key="item.id"
									:data="item"
									:loading="
										index === currentFullPlaylistItem ? 'eager' : loading
									"
									class-name="pointer-events-none relative aspect-square h-auto overflow-clip rounded-md w-inherit shadow"
								/>
							</div>
						</swiper-slide>
					</template>
				</SwiperComponent>

				<TrackRow class="px-6" />

				<ProgressBarContainer class="children:!mx-0 gap-4 px-6" />
				<ButtonContainer />
			</div>

			<div
				class="frosting relative mx-3 mb-4 -mt-10 rounded-2xl pt-10 w-available bg-focus/60 shadow"
			>
				<div
					class="absolute top-0 z-10 flex w-full items-center rounded-t-2xl pr-2 pl-4 font-semibold"
				>
					<span>{{ t("Lyrics") }}</span>
					<MusicButton label="expand" class="ml-auto" :onclick="handleExpand">
						<OptimizedIcon
							v-if="lyricsSize === 'full'"
							icon="arrowExitFullscreen"
							class="h-5 w-5"
						/>
						<OptimizedIcon v-else icon="arrowEnterFullscreen" class="h-5 w-5" />
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
		</IonContent>
	</IonModal>
</template>

<style scoped lang="scss">
ion-modal {
	--height: 100%;
	--ion-color-step-350: transparent;
	@apply absolute mt-0 -mb-safe-offset-16;
}

html.plt-mobileweb:has(#miniPlayer) ion-content::part(scroll) {
	--offset-bottom: -0rem !important;
}

ion-modal#fullPlayer ion-content::part(scroll) {
	--offset-bottom: -1rem;
	@apply absolute pt-0 mt-0 pb-0 #{!important};
}

ion-modal::part(content) {
	border-radius: 0;
}

ion-content::part(background) {
	@apply bg-slate-light-1 dark:bg-slate-dark-1;
}
</style>
