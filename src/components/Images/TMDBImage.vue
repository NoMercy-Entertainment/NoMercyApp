<script lang="ts" setup>
import type { PropType } from 'vue';
import { computed, onMounted, ref, watch } from 'vue';

import type { PaletteColors } from '@/types/api/shared';

import { isDarkMode } from '@/config/global';
import { getImageBrightness } from '@/lib/colorHelper';
import { currentServer } from '@/store/currentServer';
import { useAutoThemeColors } from '@/store/preferences';
import AppLogoSquare from '@/components/Images/icons/AppLogoSquare.vue';
import { getCommonSize } from '@/lib/stringArray.ts';

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
		default: 'var(--color-theme-8)',
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
	return `https://app.nomercy.tv/tmdb-images${props.path}?width=${props.size ? props.size * 2 : null}`;
});

const tmdbImageUrl = computed(() => {
	if (!props.path)
		return;
	// return `${tmdbImageBaseUrl}/original${props.path}`;
	return `https://media.themoviedb.org/t/p/${getCommonSize(props?.size ?? 'original')}${props.path}`;
});
const luminosityValue = computed(() => {
	return isDarkMode.value ? 0 : 20;
});

const style = computed(() => {
	return {
		'--c-1': 'var(--color-theme-8)',
		'--c-2': 'rgb(from var(--color-theme-8) r g b / 3%)',
		'--c-3': 'rgb(from var(--color-theme-8) r g b / 14%)',
		'--c-4': 'rgb(from var(--color-theme-8) r g b / 1%)',

		'backgroundImage':
        props.type === 'logo' || !useAutoThemeColors
        	? props.type === 'logo'
        		? ''
        		: `
                    radial-gradient(
                        farthest-corner at top left,
                                var(--color-theme-9),
                                hsl(0 0% 100% / 4%) 300px
                            ),
                            radial-gradient(
                                farthest-corner at top right,
                                var(--color-theme-2),
                                hsl(0 0% 100% / 4%) 300px
                            ),
                            radial-gradient(
                                farthest-corner at bottom left,
                                var(--color-theme-6),
                                hsl(0 0% 100% / 4%)
                            ),
                            radial-gradient(
                                farthest-corner at bottom right,
                                var(--color-theme-12),
                        hsl(0 0% 100% / 4%) 300px
                    )
                `
        	: `
				radial-gradient(
					farthest-corner at top left,
							${props.colorPalette?.lightVibrant ?? 'var(--c-1)'},
							hsl(0 0% 100% / 4%) 300px
						),
						radial-gradient(
							farthest-corner at top right,
							${props.colorPalette?.dominant ?? 'var(--c-2)'},
							hsl(0 0% 100% / 4%) 300px
						),
						radial-gradient(
							farthest-corner at bottom left,
							${props.colorPalette?.darkVibrant ?? 'var(--c-3)'},
							hsl(0 0% 100% / 4%)
						),
						radial-gradient(
							farthest-corner at bottom right,
							${props.colorPalette?.dominant ?? 'var(--c-4)'},
					hsl(0 0% 100% / 4%) 300px
				)
			`,
	};
});

const aspectRatio = computed(() => {
	return props.aspect === 'poster'
		? 3 / 2
		: props.aspect === 'backdrop'
			? 9 / 16
			: null;
});

const widthClass = computed(() => {
	return props.aspect === 'poster' || props.aspect === 'backdrop'
		? 'w-available'
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

function onError(e: Event) {
	(e.target as HTMLImageElement).onerror = null;
	error.value = true;
	opacity.value = 1;
}
</script>

<template>
	<div
		:class="{
			'aspect-poster': aspect === 'poster',
			'aspect-backdrop': aspect === 'backdrop',
		}"
		:style="style"
		class="transform-gpu pointer-events-none bottom-0 mx-auto flex select-none place-self-start max-w-available max-h-available w-available h-available"
	>
		<div
			v-if="opacity === 0 && type === 'image'"
			class="absolute inset-0 h-available w-available bg-black/30 dark:bg-black/50 shadow"
		/>
		<picture
			v-if="!error && path && !path?.includes?.('undefined')"
			:style="`opacity: ${opacity}; float: ${type === 'logo' ? 'right' : ''}`"
			class="pointer-events-none absolute inset-0 h-inherit flex select-none flex-col items-end justify-end tv:justify-start self-end transition-all duration-500 max-w-available max-h-available"
		>
			<source :srcset="`${serverImageUrl} 1x`">
			<!--      <source -->
			<!--          :srcset="`${serverImageUrl}?width=${size ? (size * 2) : null}&type=webp&aspect_ratio=${aspectRatio} 1x`" -->
			<!--          type="image/webp" -->
			<!--      /> -->
			<!--      <source :srcset="`${serverImageUrl}?width=${size ? (size * 2) : null}&type=png&aspect_ratio=${aspectRatio} 1x`" -->
			<!--              type="image/png"/> -->
			<img
				:alt="`tmdb image for ${title ?? 'image'}`"
				:class="{
					'aspect-poster w-available h-available': aspect === 'poster',
					'aspect-backdrop w-available h-available': aspect === 'backdrop',
					'w-auto !h-inherit': aspect === null,
					'object-fit w-auto h-available': type === 'logo',
					'object-cover object-top': type === 'image',
					'[filter:drop-shadow(0px_0px_6px_black)_drop-shadow(0px_0px_6px_black)_drop-shadow(0px_0px_6px_black)]': shouldDarken,
					[`${widthClass}`]: true,
					[`${className}`]: true,
				}"
				:fetchpriority="priority"
				:height="height"
				:loading="loading === 'eager' ? 'eager' : 'lazy'"
				:onerror="onError"
				:onload="onLoaded"
				:onloadstart="onLoadStart"
				:src="tmdbImageUrl"
				:style="`
              float: ${type === 'logo' ? 'right' : ''};
              filter: ${
					shouldLighten || shouldDarken
						? `drop-shadow(0px 0px 6px rgb(from ${shadow} r g b)) drop-shadow(0px 0px 6px rgb(from ${shadow} r g b))`
						: ''}
            object-fit: scale-down;
            object-position: bottom;
        `"
				:width="size"
				class="pointer-events-auto bg-bottom transition-all duration-500 max-h-available max-w-available"
				crossorigin="anonymous"
			>
		</picture>
		<div
			v-else-if="type === 'image'"
			:class="type === 'image' ? 'bg-surface-1' : ''"
			class="inset-0 grid aspect-video h-available w-available place-items-center place-center"
		>
			<div
				class="w-available h-available inset-0 grid place-items-center place-center bg-[rgb(from_var(--color-logo-dark)_r_g_b/20%)]"
			>
				<AppLogoSquare class="h-auto w-3/5 max-h-[60%] -translate-y-[5%]" />
			</div>
		</div>
	</div>
</template>
