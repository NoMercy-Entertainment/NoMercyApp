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
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';
import BannerButton from '@/components/Buttons/BannerButton.vue';

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
	type: {
		type: String as PropType<'video' | 'music'>,
		required: false,
		default: 'music',
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
	<MusicButton v-if="type === 'music'"
		:no-background="noBackground"
		:onclick="handleLike"
		label="Favorite"
	>
		<MoooomIcon
			:class="{
				'heart text-focus ![color:var(--fill-color)]': liked,
				' ': !liked,
				className,
			}"
			:style="liked ? '--fill-color: rgb(from var(--color-theme-8, var(--color-red-8)) r g b)' : '--fill-color: transparent;'"
			class="absolute inset-2 transition-all duration-150"
			icon="heart"
		/>
	</MusicButton>

	<BannerButton v-else
		:no-background="noBackground"
		:title="liked ? 'Remove from liked' : 'Add to liked'"
		label="Favorite"
		@click="handleLike"
	>
		<MoooomIcon
			:class="{
				'heart ![color:var(--fill-color)]': liked,
				' ': !liked,
				className,
			}"
			:style="liked ? '--fill-color: rgb(from var(--color-theme-8, var(--color-red-8)) r g b)' : '--fill-color: transparent;'"
			class="absolute top-1.5 left-1.5 transition-all duration-150 w-7"
			icon="heart"
		/>
	</BannerButton>
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
