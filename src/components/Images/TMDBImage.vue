<script setup lang="ts">
import type { PropType } from 'vue';
import { computed, onMounted, ref, watch } from 'vue';

import type { PaletteColors } from '@/types/api/shared';

import { isDarkMode } from '@/config/global';
import { getImageBrightness, hexLighter } from '@/lib/colorHelper';
import { currentServer } from '@/store/currentServer';
import { useAutoThemeColors } from '@/store/preferences';
import AppLogoSquare from '@/components/Images/icons/AppLogoSquare.vue';

const props = defineProps({
	path: {
		type: String as PropType<string | null | undefined>,
		required: false,
	},
	colorPalette: {
		type: Object as PropType<PaletteColors | undefined>,
		required: false,
	},
	title: {
		type: String as PropType<string | null | undefined>,
		required: false,
	},
	className: {
		type: String as PropType<string | undefined>,
		required: false,
	},
	size: {
		type: Number as PropType<number>,
		required: false,
	},
	aspect: {
		type: String as PropType<'poster' | 'backdrop'>,
		required: false,
	},
	type: {
		type: String as PropType<'image' | 'logo'>,
		required: false,
		default: 'image',
	},
	autoShadow: {
		type: Boolean as PropType<boolean>,
		required: false,
		default: false,
	},
	loading: {
		type: String as PropType<'lazy' | 'eager'>,
		required: false,
		default: 'lazy',
	},
	priority: {
		type: String as PropType<'high' | 'low' | 'auto'>,
		required: false,
		default: 'low',
	},
	shadow: {
		type: String,
		required: false,
		default: 'white',
	},
	onload: {
		type: Function as PropType<
			(data: Event & { target: HTMLImageElement }) => void
		>,
		required: false,
	},
});

const opacity = ref(0);
const error = ref(false);
const shouldLighten = ref(false);
const shouldDarken = ref(false);
const brightness = ref(0);

const serverImageUrl = computed(() => {
	if (!props.path || !currentServer.value)
		return;
	// return `${currentServer.value?.serverBaseUrl}/images/original${props.path}`;
	return `https://app.nomercy.tv/tmdb-images${props.path}`;
});

const tmdbImageUrl = computed(() => {
	if (!props.path)
		return;
	// return `${tmdbImageBaseUrl}/original${props.path}`;
	return `https://media.themoviedb.org/t/p/original${props.path}`;
});
const luminosityValue = computed(() => {
	return isDarkMode.value ? 0 : 20;
});

const style = computed(() => {
	return {
		'--c-1': 'rgb(var(--color-focus))',
		'--c-2': 'rgb(var(--color-focus) / 3%)',
		'--c-3': 'rgb(var(--color-focus) / 14%)',
		'--c-4': 'rgb(var(--color-focus) / 1%)',

		'backgroundImage':
      props.type === 'logo' || !useAutoThemeColors
      	? props.type === 'logo'
      		? ''
      		: `
                    radial-gradient(
                        farthest-corner at top left,
                                rgb(var(--color-theme-9)),
                                hsl(0 0% 100% / 4%) 300px
                            ),
                            radial-gradient(
                                farthest-corner at top right,
                                rgb(var(--color-theme-2)),
                                hsl(0 0% 100% / 4%) 300px
                            ),
                            radial-gradient(
                                farthest-corner at bottom left,
                                rgb(var(--color-theme-6)),
                                hsl(0 0% 100% / 4%)
                            ),
                            radial-gradient(
                                farthest-corner at bottom right,
                                rgb(var(--color-theme-12)),
                        hsl(0 0% 100% / 4%) 300px
                    )
                `
      	: `
				radial-gradient(
					farthest-corner at top left,
							${
								hexLighter(
									props.colorPalette?.lightVibrant,
									luminosityValue.value,
								) ?? 'var(--c-1)'
							},
							hsl(0 0% 100% / 4%) 300px
						),
						radial-gradient(
							farthest-corner at top right,
							${
								hexLighter(
									props.colorPalette?.dominant,
									luminosityValue.value,
								) ?? 'var(--c-2)'
							},
							hsl(0 0% 100% / 4%) 300px
						),
						radial-gradient(
							farthest-corner at bottom left,
							${
								hexLighter(
									props.colorPalette?.darkVibrant,
									luminosityValue.value,
								) ?? 'var(--c-3)'
							},
							hsl(0 0% 100% / 4%)
						),
						radial-gradient(
							farthest-corner at bottom right,
							${
								hexLighter(
									props.colorPalette?.dominant,
									luminosityValue.value,
								) ?? 'var(--c-4)'
							},
					hsl(0 0% 100% / 4%) 300px
				)
			`,
	};
});

function remove(e: ErrorEvent) {
	if ((e.target as HTMLImageElement)?.parentNode?.children?.length ?? 0 > 1) {
		(e.target as HTMLImageElement)?.parentNode?.children[0].remove();
	}
	(
		e.target as HTMLImageElement
	).src = `https://image.tmdb.org/t/p/original${props.path}`;
}

const aspectRatio = computed(() => {
	return props.aspect === 'poster'
		? 3 / 2
		: props.aspect === 'backdrop'
			? 9 / 16
			: null;
});

const widthClass = computed(() => {
	return props.aspect === 'poster' || props.aspect === 'backdrop'
		? 'w-full'
		: 'w-auto';
});

const height = computed(() => {
	if (!props.size || !aspectRatio.value)
		return 0;
	return props.size * aspectRatio.value;
});

onMounted(() => {
	if (props?.type !== 'logo' || serverImageUrl.value?.includes('undefined'))
		return;

	getImageBrightness(
		`${serverImageUrl.value}`,
		({ nonTransparentBrightness }) => {
			brightness.value = nonTransparentBrightness;
			shouldLighten.value = nonTransparentBrightness < 20;
			shouldDarken.value = nonTransparentBrightness > 80;
		},
	);
});

watch(serverImageUrl, (value) => {
	if (!value)
		return;

	if (props?.type === 'logo' || serverImageUrl.value?.includes('undefined'))
		return;

	getImageBrightness(`${value}`, ({ nonTransparentBrightness }) => {
		brightness.value = nonTransparentBrightness;
		shouldLighten.value = nonTransparentBrightness < 20;
		shouldDarken.value = nonTransparentBrightness > 80;
	});

	error.value = false;
});

function onLoaded(e: Event) {
	opacity.value = 1;
	props.onload?.(e as Event & { target: HTMLImageElement });
}

function onLoadStart() {
	opacity.value = 0;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function onError(e: Event) {
	(e.target as HTMLImageElement).onerror = null;
	error.value = true;
	opacity.value = 1;
}
</script>

<template>
	<div
		class="pointer-events-none bottom-0 mx-auto flex w-full select-none place-self-start h-available overflow-clip"
		:class="{
			'aspect-poster  w-available h-auto': aspect === 'poster',
			'aspect-backdrop  w-available h-auto': aspect === 'backdrop',
			'w-auto h-available': aspect === null,
		}"
		:style="style"
	>
		<div
			v-if="opacity === 0 && type === 'image'"
			class="absolute inset-0 h-full w-full bg-black/30 dark:bg-black/50 shadow"
		/>
		<picture
			v-if="!error && path && !path?.includes?.('undefined')"
			class="pointer-events-none absolute inset-0 h-inherit flex select-none flex-col items-end justify-end self-end transition-all duration-500 max-h-inherit overflow-hidden"
			:style="`opacity: ${opacity}; float: ${type === 'logo' ? 'right' : ''}`"
		>
			<source :srcset="`${serverImageUrl} 1x`" type="image/avif">
			<!--      <source -->
			<!--          :srcset="`${serverImageUrl}?width=${size ? (size * 2) : null}&type=webp&aspect_ratio=${aspectRatio} 1x`" -->
			<!--          type="image/webp" -->
			<!--      /> -->
			<!--      <source :srcset="`${serverImageUrl}?width=${size ? (size * 2) : null}&type=png&aspect_ratio=${aspectRatio} 1x`" -->
			<!--              type="image/png"/> -->
			<img
				:src="tmdbImageUrl"
				:width="size"
				:height="height"
				:fetchpriority="priority"
				:loading="loading === 'eager' ? 'eager' : 'lazy'"
				:alt="`tmdb image for ${title ?? 'image'}`"
				:onload="onLoaded"
				:onloadstart="onLoadStart"
				:onerror="onError"
				crossorigin="anonymous"
				class="pointer-events-auto inset-0 bg-top transition-all duration-500 max-h-inherit"
				:class="{
					'aspect-poster w-available h-auto': aspect === 'poster',
					'aspect-backdrop w-available h-auto': aspect === 'backdrop',
					'w-available h-available': aspect === null,
					'object-contain w-auto h-inherit': type === 'logo',
					'object-cover object-top': type === 'image',
					'[filter:drop-shadow(0px_0px_6px_black)_drop-shadow(0px_0px_6px_black)_drop-shadow(0px_0px_6px_black)]':
						shouldDarken,
					[`${widthClass}`]: true,
					[`${className}`]: true,
				}"
				:style="`
              float: ${type === 'logo' ? 'right' : ''};
              filter: ${
					shouldLighten || shouldDarken
						? `drop-shadow(0px 0px 6px rgb(${shadow})) drop-shadow(0px 0px 6px rgb(${shadow}))`
						: ''
				}`"
			>
		</picture>
		<div
			v-else-if="type === 'image'"
			class="inset-0 grid aspect-video h-full w-full place-items-center place-center"
			:class="type === 'image' ? 'bg-auto-1' : ''"
		>
			<div
				class="w-full h-full inset-0 grid place-items-center place-center bg-[rgb(var(--color-logo-dark)/20%)]"
			>
				<AppLogoSquare class="h-auto w-3/5 max-h-[60%] -translate-y-[5%]" />
			</div>
		</div>
	</div>
</template>
