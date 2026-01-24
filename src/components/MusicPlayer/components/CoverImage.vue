<script lang="ts" setup>
import type { PropType, VNodeRef } from 'vue';
import { onMounted, ref, watch } from 'vue';

import type { HomeDataItem } from '@/types/api/music';
import type { Artist, ArtistResponse, Featured } from '@/types/api/music/artist';
import type { Album, AlbumResponse } from '@/types/api/music/album';
import type { DisplayList, MusicCardPageResponseData } from '@/types/api/music/musicPlayer';
import type { PlaylistItem } from '@/types/musicPlayer';

import { currentServer } from '@/store/currentServer';

import AppLogoSquare from '@/components/Images/icons/AppLogoSquare.vue';
import { twMerge } from 'tailwind-merge';

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
	imageRef: {
		type: Object as PropType<VNodeRef | undefined>,
		required: false,
		default: null,
	},
});

const source = ref<string | null>(null);

function image() {
	if (!props.data?.cover) {
		source.value = null;
		return;
	}

	const suffix = location.hostname.includes('dev') ? '-dev' : '';

	if (props.data?.cover?.startsWith('blob:')) {
		source.value = props.data?.cover;
		return;
	}

	if (props.data?.cover?.startsWith('data:')) {
		source.value = props.data?.cover;
		return;
	}

	if (
		props.data?.cover?.startsWith('https://')
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

	if (props.data?.cover?.startsWith('https://')) {
		source.value = props.data?.cover;
		return;
	}

	if (props.data?.cover?.startsWith('/')) {
		source.value = encodeURI(
			`${currentServer.value?.serverBaseUrl.replace(/\/$/, '')}${props.data?.cover}`,
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

const error = ref(false);
function onError(e: Event) {
	// (e.target as HTMLImageElement).onerror = null;
	// error.value = true;
}

function onClick() {
	// console.log('click');
}

function makeQuery(format: string, size: number) {
	if (props.data?.cover?.startsWith('blob:'))
		return '';
	if (props.data?.cover?.startsWith('data:'))
		return '';

	return `?width=${size}&type=${format} 1x`;
}
</script>

<template>
	<div
		v-if="data?.cover && !error"
		:class="className"
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
		class="aspect-square relative z-0 overflow-clip"
	>
		<picture
			v-if="source"
			class="aspect-square !absolute inset-0 overflow-clip z-10 h-available w-available object-cover"
		>
			<source
				:srcset="`${source}${makeQuery('avif', size ?? 500)}`"
				type="image/avif"
			>
			<source
				:srcset="`${source}${makeQuery('webp', size ?? 500)}`"
				crossorigin="anonymous"
				type="image/webp"
			>
			<source
				:srcset="`${source}${makeQuery('jpeg', size ?? 500)}`"
				crossorigin="anonymous"
				type="image/jpeg"
			>
			<img
				:id="id"
				:ref="imageRef"
				:alt="`cover image for ${data.name ?? 'image'}`"
				:data-id="data?.id"
				:loading="loading"
				:onclick="onClick"
				:onerror="onError"
				:onfocus="handleFocus"
				:onload="onload"
				:src="`${source}`"
				class="aspect-square !absolute inset-0 overflow-clip z-10 h-available w-available object-cover"
				crossorigin="anonymous"
				tabindex="-1"
			>
		</picture>
		<AppLogoSquare
			v-else
			:class="twMerge('z-0 overflow-clip bg-black p-[15%] h-full w-full', className)"
		/>
	</div>
	<AppLogoSquare
		v-else
		:class="twMerge('z-0 overflow-clip bg-black h-full w-full aspect-square relative p-4', className)"
	/>
</template>
