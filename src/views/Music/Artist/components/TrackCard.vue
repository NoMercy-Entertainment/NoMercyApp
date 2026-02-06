<script lang="ts" setup>
import type { PropType } from 'vue';
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';

import type { PlaylistItem } from '@/types/musicPlayer';

import TrackRow from './TrackRow.vue';

const INITIAL_LIMIT = 20;

const props = defineProps({
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

const expanded = ref(false);
const visibleData = computed(() => {
	if (!props.data) return [];
	if (expanded.value || props.data.length <= INITIAL_LIMIT) return props.data;
	return props.data.slice(0, INITIAL_LIMIT);
});
const hasMore = computed(() => (props.data?.length ?? 0) > INITIAL_LIMIT);
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
			<template v-for="(item, index) in visibleData" :key="item.id + item?.favorite">
				<TrackRow :data="item" :display-list="data" :index="index" :is-album-route="isAlbumRoute" :is-favorites-route="isFavoritesRoute" />
			</template>
		</div>
		<button
			v-if="hasMore && !expanded"
			class="self-stretch py-3 text-sm font-medium text-surface-12/11 hover:text-surface-12 transition-colors"
			@click="expanded = true"
		>
			{{ $t('Show all {0} songs', [data?.length]) }}
		</button>
	</div>
</template>
