<script lang="ts" setup>
import type { PropType } from 'vue';
import { computed, onMounted, ref, watch } from 'vue';
import { useTranslation } from 'i18next-vue';
import { isPlatform } from '@ionic/vue';

import type { DisplayList } from '@/types/api/music/musicPlayer';

import { convertToHumanReact, convertToSeconds } from '@/lib/dateTime';
import { breakTitle } from '@/lib/stringArray';
import audioPlayer from '@/store/audioPlayer';

import FavoriteImage from '@/components/Images/FavoriteImage.vue';
import CoverImage from '@/components/MusicPlayer/components/CoverImage.vue';
import { pickPaletteColor, tooLight } from '@/lib/colorHelper.ts';
import { colorPalette } from '@/store/ui.ts';
import ClickUploadModal from '@/components/ClickUploadModal.vue';

const props = defineProps({
	data: {
		type: Object as PropType<DisplayList | undefined>,
		required: false,
	},
});

const { t } = useTranslation();

const duration = ref<string | undefined>('');

const canvas = ref<HTMLCanvasElement>();
const audioColor = ref<HTMLDivElement>();

function calculateDuration(value?: typeof props.data) {
	if (!value)
		return;
	return convertToHumanReact(
		t,
		value?.tracks
			?.map(t => convertToSeconds(t.duration))
			.reduce((prev, curr) => prev + curr, 0) ?? 0,
	);
}

watch(props, (value) => {
	if (!value)
		return;
	duration.value = calculateDuration(value.data);
});

onMounted(() => {
	duration.value = calculateDuration(props.data);
});

watch(canvas, (value) => {
	if (!value)
		return;
	const context = value.getContext('2d', {
		willReadFrequently: true,
		desynchronized: true,
	});

	const draw = () => {
		const sourceCanvas = audioPlayer._audioElement1?.motion?.canvas;
		if (sourceCanvas && audioColor.value) {
			if (audioPlayer._audioElement1.isPlaying()) {
				audioPlayer._audioElement1?.motion!.registerGradient('theme', {
					bgColor: 'transparent',
					dir: 'h',
					colorStops: [getComputedStyle(audioColor.value).backgroundColor],
				});

				audioPlayer._audioElement1!.motion!.gradient = 'theme';

				value.width = sourceCanvas.width;
				value.height = sourceCanvas.height;
				context!.clearRect(0, 0, value.width, value.height);
				context!.drawImage(sourceCanvas, 0, 0, value.width, value.height);
			}
			else if (audioPlayer._audioElement2.isPlaying()) {
				audioPlayer._audioElement2?.motion!.registerGradient('theme', {
					bgColor: 'transparent',
					dir: 'h',
					colorStops: [getComputedStyle(audioColor.value).backgroundColor],
				});

				audioPlayer._audioElement2!.motion!.gradient = 'theme';

				value.width = sourceCanvas.width;
				value.height = sourceCanvas.height;
				context!.clearRect(0, 0, value.width, value.height);
				context!.drawImage(sourceCanvas, 0, 0, value.width, value.height);
			}
		}
		requestAnimationFrame(draw);
	};

	draw();
});

watch(audioColor, (value) => {
	if (
		!value
		|| !audioPlayer._audioElement1?.motion
		|| !audioPlayer._audioElement2?.motion
	) {
		return;
	}
	audioPlayer._audioElement1?.motion!.registerGradient('theme', {
		bgColor: 'transparent',
		dir: 'h',
		colorStops: [getComputedStyle(value).backgroundColor],
	});

	audioPlayer._audioElement1!.motion!.gradient = 'theme';

	audioPlayer._audioElement2?.motion!.registerGradient('theme', {
		bgColor: 'transparent',
		dir: 'h',
		colorStops: [getComputedStyle(value).backgroundColor],
	});

	audioPlayer._audioElement2!.motion!.gradient = 'theme';
});

const light = computed(() => tooLight(pickPaletteColor(colorPalette.value), 150));
</script>

<template>
	<div
		id="artist-header"
		:class="{
			'pt-safe-offset-16 px-8 gap-4': isPlatform('capacitor'),
			'pt-24 px-6 gap-2 sm:gap-12': !isPlatform('capacitor'),
			'text-black/12': light,
			'text-white/12': !light,
		}"
		class="relative z-0 flex flex-col items-end justify-start sm:flex-row sm:gap-9 sm:pt-8 sm:pb-8 sm:px-8"
	>
		<div
			id="audio-color"
			ref="audioColor"
			class="absolute top-0 left-0 h-full w-full overflow-clip bg-focus"
			style="background: hsl(from var(--color-theme-8) h s 32%);"
		/>
		<div
			class="absolute top-0 left-0 h-full w-full overflow-clip"
		/>
		<canvas id="audio-visualizer" ref="canvas" class="absolute top-0 left-96 my-12 ml-6 mr-6 mt-full h-available w-available overflow-clip pointer-events-none" />
		<div
			:class="{
				'-mt-4': isPlatform('capacitor'),
				'': !isPlatform('capacitor'),
			}"
			class="frosting relative mx-auto flex aspect-square w-80 max-w-[90%] flex-col items-center justify-center rounded-xl bg-gradient-to-br min-w-64 bg-theme-6 from-theme-5 via-theme-6 to-theme-9 shadow"
		>
			<ClickUploadModal v-if="data" :data="data" :url="`${data.link}/cover`">
				<template #default="{ data: data2, ref: imgRef }">
					<CoverImage
						v-if="data?.cover"
						id="image"
						:data="data2"
						:img-ref="imgRef"
						:size="250"
						class-name="aspect-square rounded-xl w-full"
						loading="eager"
					/>
					<FavoriteImage
						v-else-if="data?.id"
						:id="data.id"
						:type="data.type"
						class="aspect-square rounded-xl w-full"
					/>
				</template>
			</ClickUploadModal>
		</div>

		<div
			v-if="data?.name"
			class="relative my-4 flex w-full flex-1 flex-shrink-0 flex-col items-start justify-start gap-4 flex-grow-1 sm:hidden"
		>
			<div
				class="w-full text-2xl font-semibold whitespace-pre-line"
				v-html="
					breakTitle(data?.name ?? 'Songs you like', 'text-sm line-clamp-1')
				"
			/>
		</div>

		<div
			class="relative hidden flex-1 flex-shrink-0 flex-col items-start justify-start gap-1 flex-grow-1 sm:flex"
		>
			<p class="text-left font-semibold uppercase">
				{{ data?.type?.replace(/s$/u, '') }}
			</p>
			<div
				class="w-full text-5xl font-semibold line-clamp-2 leading-[130%] whitespace-pre"
				v-html="
					breakTitle(data?.name ?? 'Songs you like', 'text-2xl line-clamp-1')
				"
			/>

			<div class="relative flex items-center justify-start gap-2">
				<div
					v-if="data?.artists?.length"
					class="flex items-center gap-4 text-sm font-medium"
				>
					<div
						v-if="data?.artists?.[0].cover"
						class="relative aspect-square h-12 w-12 overflow-clip rounded-full min-w-12"
					>
						<CoverImage
							id="image"
							:data="data?.artists?.[0]"
							:size="250"
							class-name="h-full w-full"
							loading="eager"
						/>
					</div>
					<RouterLink
						:to="data?.artists?.[0].link ?? '#'"
						class="text-sm empty:hidden"
					>
						{{ data?.artists?.[0]?.name ?? "Various artists" }}
					</RouterLink>
				</div>
				<p
					v-if="data?.tracks"
					class="text-left text-sm font-medium"
				>
					•
				</p>
				<p class="text-left text-sm font-medium">
					{{ data?.tracks?.length }}
					{{ data?.tracks?.length === 1 ? t('song') : t('songs') }}
				</p>
				<p v-if="duration" class="text-left text-sm font-medium">
					•
				</p>
				<p class="text-left text-sm font-medium">
					{{ duration }}
				</p>
			</div>
		</div>
	</div>
</template>
