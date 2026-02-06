<script lang="ts" setup>
import type { PropType } from 'vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import type { PlaylistItem } from '@/types/musicPlayer';

import TrackRow from './TrackRow.vue';

defineProps({
	data: {
		type: Array as PropType<PlaylistItem[] | null>,
		required: true,
	},
	title: {
		type: String,
		required: true,
	},
});

const route = useRoute();
const isAlbumRoute = computed(() => route.path.startsWith('/music/album'));
const isFavoritesRoute = computed(() => route.path.startsWith('/music/playlists'));
</script>

<template>
	<div
		v-if="data && data?.length > 0"
		class="flex w-full flex-col items-start justify-start gap-4 self-stretch"
	>
		<div class="self-stretch text-xl font-bold leading-loose">
			{{ $t(title) }}
		</div>
		<div class="flex flex-col items-start justify-start gap-1 self-stretch">
			<div
				class="z-10 grid items-center justify-start gap-4 self-stretch py-2 pr-3 text-sm font-medium home-grid sm:px-3"
			>
				<div class="w-10 text-center text-sm leading-tight text-surface-12/11">
					#
				</div>
				<div class="shrink grow basis-0 text-sm leading-tight text-surface-12/11">
					{{ $t("Title") }}
				</div>
				<div class="shrink grow basis-0 text-sm leading-tight text-surface-12/11">
					{{ $t("Album") }}
				</div>
				<div
					class="shrink grow basis-0 text-right text-sm leading-tight text-surface-12/11"
				>
					{{ $t("Duration") }}
				</div>
			</div>
		</div>
		<div class="flex flex-col items-start justify-start gap-1 self-stretch">
			<template v-for="(item, index) in data" :key="item.id + item?.favorite">
				<TrackRow :data="item" :display-list="data" :index="index" :is-album-route="isAlbumRoute" :is-favorites-route="isFavoritesRoute" />
			</template>
		</div>
	</div>
</template>
