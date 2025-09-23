<script lang="ts" setup>
import type { PropType } from 'vue';
import { ref, watch } from 'vue';

import type { InfoResponse } from '@/types/api/base/info';
import type { PlaylistItem } from '@/types/musicPlayer';
import type { Collection, CollectionResponse } from '@/types/api/base/collection';
import type { ContinueWatching, HomeItem } from '@/types/api/base/home';
import type { LibraryResponse, StatusResponse } from '@/types/api/base/library';
import type { ArtistResponse } from '@/types/api/music/artist';
import type { DisplayList } from '@/types/api/music/musicPlayer';

import serverClient from '@/lib/clients/serverClient';

import MusicButton from '@/components/MusicPlayer/components/MusicButton.vue';
import OptimizedIcon from '@/components/OptimizedIcon.vue';

const props = defineProps({
	data: {
		type: Object as PropType<
			| LibraryResponse
			| InfoResponse
			| HomeItem
			| ContinueWatching
			| Collection
			| PlaylistItem
			| DisplayList
			| CollectionResponse
			| ArtistResponse
			| undefined
		>,
		required: true,
	},
	color: {
		type: String,
		required: false,
		default: 'var(--color-green-500)',
	},
	className: {
		type: String,
		required: false,
	},
	noBackground: {
		type: Boolean,
		required: false,
		default: false,
	},
});

const liked = ref(props.data?.favorite);

watch(props, (prop) => {
	liked.value = prop.data?.favorite;
});

function handleLike(e?: MouseEvent) {
	e?.stopPropagation();
	serverClient()
		.post<StatusResponse<string>>(`${props.data?.link}/like`, {
			value: !liked.value,
		})
		.then(({ data }) => {
			liked.value = data.args?.[0] === 'liked' || data.args?.[1] === 'liked';
		});
}
</script>

<template>
	<MusicButton :no-background="noBackground" :onclick="handleLike" label="Favorite">
		<OptimizedIcon
			:class="{
				'heart': liked,
				'opacity-0 ': !liked,
				className,
			}"
			class="ease-in-out transition-all duration-150"
			icon="heart"
			style="
        --fill-color: rgb(from var(--color-theme-8, var(--color-red-8)) r g b);
        color: rgb(from var(--color-theme-8, var(--color-red-8)) r g b);
			"
		/>
		<OptimizedIcon
			v-if="!liked"
			:class="{ className }"
			class="absolute inset-2 transition-all duration-150"
			icon="heart"
		/>
	</MusicButton>
</template>

<style lang="scss" scoped>
.heart {
	font-size: 150px;
	color: #e00;
	animation: beat 0.25s infinite alternate;
	animation-iteration-count: 4;
	animation-fill-mode: forwards;
	transform-origin: center;
}

/* Heart beat animation */
@keyframes beat {
	from {
		transform: scale(1.4);
	}
	50% {
		transform: scale(1.2);
	}
	to {
		transform: scale(1);
	}
}
</style>
