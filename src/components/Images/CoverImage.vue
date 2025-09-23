<script lang="ts" setup>
import type { PropType } from 'vue';
import { computed, ref } from 'vue';

import type { HomeDataItem } from '@/types/api/music';
import type { PaletteColors } from '@/types/api/shared';
import type { DisplayList, MusicCardPageResponseData } from '@/types/api/music/musicPlayer';
import type { Album, AlbumResponse } from '@/types/api/music/album';
import type { Artist } from '@/types/api/music/artist';
import type { PlaylistItem } from '@/types/musicPlayer';

import { hexLighter } from '@/lib/colorHelper';
import { currentServer } from '@/store/currentServer';
import { useAutoThemeColors } from '@/store/preferences';
import AppLogoSquare from '@/components/Images/icons/AppLogoSquare.vue';

const props = defineProps({
	data: {
		type: Object as PropType<
			| HomeDataItem
			| PlaylistItem
			| Artist
			| Album
			| DisplayList
			| MusicCardPageResponseData
			| AlbumResponse
			| undefined
			| null
		>,
		required: false,
	},
	className: {
		type: String,
		required: false,
		default: '',
	},
	disableGradient: {
		type: Boolean as PropType<boolean>,
		required: false,
		default: false,
	},
	style: {
		type: Object as PropType<Record<string, string>>,
		required: false,
		default: () => ({}),
	},
	id: {
		type: String,
		required: false,
		default: '',
	},
	loading: {
		type: String as PropType<'lazy' | 'eager' | undefined>,
		required: false,
		default: 'lazy',
	},
	onload: {
		type: Function as PropType<
			(data: Event & { target: HTMLImageElement }) => void
		>,
		required: false,
	},
	handleFocus: {
		type: Function as PropType<(e: FocusEvent, track: PlaylistItem) => void>,
		required: false,
	},
	size: {
		type: Number as PropType<number | undefined>,
		required: false,
		default: 500,
	},
	colorPalette: {
		type: Object as PropType<PaletteColors | undefined>,
		required: false,
	},
});

const error = ref(false);
const opacity = ref(0);

const baseImageUrl = computed(() => {
	return `${currentServer.value?.serverBaseUrl}${props.data?.cover}`;
});

function remove(e: ErrorEvent) {
	(e.target as HTMLImageElement)?.parentNode?.children[0].remove();
	error.value = true;
}

function onLoad() {
	opacity.value = 1;
}

function onLoadStart() {
	opacity.value = 0;
}

const style = computed(() => {
	return {
		'--c-1': 'var(--color-theme-8)',
		'--c-2': 'rgb(var(--color-theme-8) / 3%)',
		'--c-3': 'rgb(var(--color-theme-8) / 14%)',
		'--c-4': 'rgb(var(--color-theme-8) / 1%)',

		'backgroundImage':
      props.disableGradient || !useAutoThemeColors
      	? props.disableGradient
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
							${hexLighter(props.colorPalette?.lightVibrant, 30) ?? 'var(--c-1)'},
							hsl(0 0% 100% / 4%) 300px
						),
						radial-gradient(
							farthest-corner at top right,
							${hexLighter(props.colorPalette?.lightMuted, 30) ?? 'var(--c-2)'},
							hsl(0 0% 100% / 4%) 300px
						),
						radial-gradient(
							farthest-corner at bottom left,
							${hexLighter(props.colorPalette?.primary, 30) ?? 'var(--c-3)'},
							hsl(0 0% 100% / 4%)
						),
						radial-gradient(
							farthest-corner at bottom right,
							${hexLighter(props.colorPalette?.darkMuted, 30) ?? 'var(--c-4)'},
					hsl(0 0% 100% / 4%) 300px
				)
			`,
	};
});
</script>

<template>
	<div :class="`${className} aspect-square`" :style="style">
		<picture
			v-if="data?.cover"
			:style="`opacity: ${opacity};`"
			class="aspect-square inset-0 !absolute top-0 overflow-clip z-10 h-available w-available object-cover transition-all duration-200"
		>
			<source
				:srcset="`${baseImageUrl}?width=300&type=avif 1x`"
				type="image/avif"
			>
			<source
				:srcset="`${baseImageUrl}?width=${size ?? 500}&type=webp 1x`"
				type="image/webp"
			>
			<source
				:srcset="`${baseImageUrl}?width=${size ?? 500}&type=jpg 1x`"
				type="image/jpeg"
			>
			<img
				:id="id"
				:alt="`cover image for ${data?.name ?? 'image'}`"
				:data-id="data?.id"
				:loading="loading"
				:onerror="remove"
				:onfocus="handleFocus"
				:onload="onLoad"
				:onloadstart="onLoadStart"
				:src="baseImageUrl"
				class="aspect-square !absolute top-0 z-10 h-available w-available object-cover"
				crossorigin="anonymous"
			>
		</picture>
		<div
			v-else
			class="inset-0 grid aspect-video h-full w-full place-items-center bg-black p-2 place-center"
		>
			<div
				class="w-full h-full inset-0 grid place-items-center place-center bg-[rgb(var(--color-logo-dark)/20%)]"
			>
				<AppLogoSquare class="h-auto w-3/5" />
			</div>
		</div>
	</div>
</template>
