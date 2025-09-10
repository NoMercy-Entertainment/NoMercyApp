<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import type { PropType } from 'vue';

import type { HomeDataItem } from '@/types/api/music';
import type {
	Artist,
	ArtistResponse,
	Featured,
} from '@/types/api/music/artist';
import type { Album, AlbumResponse } from '@/types/api/music/album';
import type {
	DisplayList,
	MusicCardPageResponseData,
} from '@/types/api/music/musicPlayer';
import type { PlaylistItem } from '@/types/musicPlayer';

import { currentServer } from '@/store/currentServer';

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
			| ArtistResponse
			| Featured
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
});

const source = ref<string | null>(null);

function image() {
	const suffix = location.hostname.includes('dev') ? '-dev' : '';

	if (
		props.data?.cover?.includes('https://')
		&& props.data?.cover?.includes('fanart.tv')
	) {
		source.value = props.data?.cover
			?.replace('https://', `https://api${suffix}.nomercy.tv/cors?url=https://`)
			?.replace(
				'https://',
				`https://api${suffix}.nomercy.tv/cors?url=https://`,
			);
		return;
	}
	if (props.data?.cover?.includes('https://')) {
		source.value = props.data?.cover;
		return;
	}

	if (props.data?.cover?.startsWith('/')) {
		source.value = encodeURI(
			`${currentServer.value?.serverBaseUrl}${props.data?.cover}`,
		);
		return;
	}

	source.value = null;
}

onMounted(() => {
	image();
});

watch(props, () => {
	image();
});

function onError() {
	image();
}

function onClick() {
	// console.log('click');
}
</script>

<template>
	<div
		v-if="data"
		:class="`${className} aspect-square relative z-0 overflow-clip`"
		:style="{
			backgroundImage: `
            radial-gradient(
                farthest-corner at top left,
                    ${data.color_palette?.cover?.lightVibrant},
                    hsl(0 0% 100% / 4%) 300px
                ),
                radial-gradient(
                    farthest-corner at top right,
                    ${data.color_palette?.cover?.lightMuted},
                    hsl(0 0% 100% / 4%) 300px
                ),
                radial-gradient(
                    farthest-corner at bottom left,
                    ${data.color_palette?.cover?.primary},
                    hsl(0 0% 100% / 4%)
                ),
                radial-gradient(
                    farthest-corner at bottom right,
                    ${data.color_palette?.cover?.darkMuted},
                hsl(0 0% 100% / 4%) 300px
            )`,
			...style,
		}"
	>
		<picture
			v-if="source"
			class="aspect-square !absolute inset-0 overflow-clip z-10 h-available w-available object-cover"
		>
			<source
				:srcset="`${source}?width=${size ?? 500}&type=avif 1x`"
				type="image/avif"
			>
			<source
				:srcset="`${source}?width=${size ?? 500}&type=webp 1x`"
				type="image/webp"
				crossorigin="anonymous"
			>
			<source
				:srcset="`${source}?width=${size ?? 500}&type=jpg 1x`"
				type="image/jpeg"
				crossorigin="anonymous"
			>
			<img
				:id="id"
				:src="`${source}`"
				:alt="`tmdb image for ${data.name ?? 'image'}`"
				class="aspect-square !absolute inset-0 overflow-clip z-10 h-available w-available object-cover"
				:loading="loading"
				tabindex="-1"
				crossorigin="anonymous"
				:data-id="data?.id"
				:onclick="onClick"
				:onfocus="handleFocus"
				:onload="onload"
				:onerror="onError"
			>
		</picture>
		<AppLogoSquare
			v-else
			class="z-0 overflow-clip bg-black p-[15%] h-available w-available"
		/>
	</div>
</template>
