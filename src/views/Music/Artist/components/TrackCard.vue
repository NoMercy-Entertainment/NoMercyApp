<script lang="ts" setup>
import type { PropType } from 'vue';
import { computed, nextTick, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useVirtualizer } from '@tanstack/vue-virtual';

import type { PlaylistItem } from '@/types/musicPlayer';
import { scrollContainerElement } from '@/store/ui';

import TrackRow from './TrackRow.vue';

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

const virtualContainerRef = ref<HTMLDivElement>();
const scrollMargin = ref(0);

function measureScrollMargin() {
	if (!virtualContainerRef.value || !scrollContainerElement.value)
		return;
	const containerRect = virtualContainerRef.value.getBoundingClientRect();
	const scrollRect = scrollContainerElement.value.getBoundingClientRect();
	scrollMargin.value = containerRect.top - scrollRect.top + scrollContainerElement.value.scrollTop;
}

watch(() => props.data, () => {
	nextTick(measureScrollMargin);
});

const virtualizer = computed(() => useVirtualizer({
	count: props.data?.length ?? 0,
	getScrollElement: () => scrollContainerElement.value ?? null,
	estimateSize: () => 64,
	overscan: 10,
	scrollMargin: scrollMargin.value,
}));
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
		<!-- Virtual list container -->
		<div
			ref="virtualContainerRef"
			:style="{
				height: `${virtualizer.value.getTotalSize()}px`,
				width: '100%',
				position: 'relative',
			}"
		>
			<div
				v-for="virtualRow in virtualizer.value.getVirtualItems()"
				:key="data[virtualRow.index]?.id + data[virtualRow.index]?.favorite"
				:style="{
					position: 'absolute',
					top: 0,
					left: 0,
					width: '100%',
					height: `${virtualRow.size}px`,
					transform: `translateY(${virtualRow.start - scrollMargin}px)`,
				}"
			>
				<TrackRow
					:data="data[virtualRow.index]"
					:display-list="data"
					:index="virtualRow.index"
					:is-album-route="isAlbumRoute"
					:is-favorites-route="isFavoritesRoute"
				/>
			</div>
		</div>
	</div>
</template>
