<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { IonContent, IonPage } from '@ionic/vue';
import { useVirtualizer } from '@tanstack/vue-virtual';

import type { DisplayList } from '@/types/api/music/musicPlayer';
import type { PlaylistItem, SortOrder, SortType } from '@/types/musicPlayer';

import { isNative } from '@/config/global';
import useServerClient from '@/lib/clients/useServerClient';
import { setTitle } from '@/lib/utils/string';
import { sortByType } from '@/lib/utils/array';
import { scrollContainerElement, setBackground, setColorPalette, setSortOrder, sortOrder, sortType } from '@/store/ui';
import { currentSong } from '@/store/audioPlayer';

import ControlHeader from '@/views/Music/List/components/ControlHeader.vue';
import ArtistHeader from '@/views/Music/List/components/ArtistHeader.vue';
import SortHeader from '@/views/Music/List/components/SortHeader.vue';
import TrackRow from '@/views/Music/List/components/TrackRow.vue';
import ScrollContainer from '@/Layout/Desktop/components/ScrollContainer.vue';
import NotFound from '@/Layout/Desktop/components/NotFound.vue';

const route = useRoute();

const { data, isError } = useServerClient<DisplayList>({
	path: route.fullPath,
});

const displayList = ref<PlaylistItem[]>([]);
const filter = ref('');

// Virtual scrolling setup
const virtualizer = computed(() => useVirtualizer({
	count: displayList.value?.length ?? 0,
	getScrollElement: () => scrollContainerElement.value ?? null,
	estimateSize: () => 64,
	overscan: 10,
}));

watch(data, (value) => {
	if (!value)
		return;

	setTitle(value?.name ?? null);

	sort(value?.tracks ?? [], sortType.value, sortOrder.value, filter.value);

	setColorPalette(value?.color_palette?.cover);
});

watch(sortOrder, (value) => {
	sort(data.value?.tracks ?? [], sortType.value, value, filter.value);
});
watch(sortType, (value) => {
	sort(data.value?.tracks ?? [], value, sortOrder.value, filter.value);
});
watch(filter, (value) => {
	sort(data.value?.tracks ?? [], sortType.value, sortOrder.value, value);
});

function sort(songs: PlaylistItem[], sortType: SortType, sortOrder: SortOrder, value: string) {
	const newList = sortByType<PlaylistItem>(
		songs ?? [],
		sortType,
		sortOrder,
		setSortOrder,
	);

	if (value === '') {
		displayList.value = newList;
	}
	else {
		// @ts-ignore
		displayList.value
			= newList?.filter(
				t =>
					t.name?.toLowerCase().includes(value?.toLowerCase?.())
					|| t.artist_track?.some(a =>
						a.name.toLowerCase().includes(value?.toLowerCase?.()),
					)
					|| t.album_track?.[0]?.name
						.toLowerCase()
						.includes(value?.toLowerCase?.()),
			) ?? [];
	}
}

onMounted(() => {
	if (data?.value?.tracks) {
		sort(
			data?.value?.tracks ?? [],
			sortType.value,
			sortOrder.value,
			filter.value,
		);
	}

	if (data.value?.color_palette?.cover) {
		setColorPalette(data.value?.color_palette?.cover);
	}
});

onUnmounted(() => {
	if (document.getElementById('navbar')) {
		document.getElementById('navbar')!.style.display = 'flex';
	}
	setColorPalette(null);
	setBackground(null);
});

const sortHeader = ref<VueDivElement>();

function onScroll() {
	const sortHeaderTop = 67;
	const headerElement = sortHeader.value?.$el;
	const childElement = headerElement?.firstChild as HTMLElement;

	if (!headerElement || !childElement)
		return;

	const top = Math.ceil(headerElement.getBoundingClientRect()?.top ?? 500);

	if (top <= sortHeaderTop) {
		// Apply theme color background to the child span
		childElement.style.background = 'var(--color-theme-8)';
		headerElement.style.color = 'white';
	}
	else {
		childElement.style.background = '';
		headerElement.style.color = '';
	}
}
</script>

<template>
	<IonPage>
		<IonContent :fullscreen="true" class="flex">
			<NotFound v-if="isError && !data" />
			<ScrollContainer
				v-else
				:auto-hide="true"
				:static="true"
				@scroll="onScroll"
			>
				<div
					v-if="
						!route.params.id || (route.params.id && data?.id === route.params.id)
					"
					ref="main"
					class="flex flex-col w-available h-available sm:rounded-2xl"
				>
					<ArtistHeader :data="data" />
					<div
						class="relative z-0 flex h-auto flex-shrink-0 flex-grow flex-col items-start justify-start self-stretch"
					>
						<div
							class="pointer-events-none absolute z-0 h-96 w-full bg-spotifyBottom"
						/>

						<ControlHeader
							:key="data?.id"
							:data="data"
							:filter="filter"
							@filter-change="(e: string) => filter = e"
						/>

						<div
							:class="{
								'pb-24': isNative && !currentSong,
								'pb-40': isNative && currentSong,
								'pb-4 sm:pb-4': !isNative && currentSong,
							}"
							class="flex flex-1 flex-shrink-0 flex-col items-start justify-start self-stretch bg-surface-3 flex-grow-1 gap-0.5 sm:p-4"
						>
							<SortHeader :key="data?.id" ref="sortHeader" />

							<!-- Virtual list container -->
							<div
								:style="{
									height: `${virtualizer.value.getTotalSize()}px`,
									width: '100%',
									position: 'relative',
								}"
							>
								<!-- Only render visible items -->
								<div
									v-for="virtualRow in virtualizer.value.getVirtualItems()"
									:key="displayList[virtualRow.index]?.id + displayList[virtualRow.index]?.favorite"
									:style="{
										position: 'absolute',
										top: 0,
										left: 0,
										width: '100%',
										height: `${virtualRow.size}px`,
										transform: `translateY(${virtualRow.start}px)`,
									}"
								>
									<TrackRow
										:data="displayList[virtualRow.index]"
										:display-list="displayList"
										:index="virtualRow.index"
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</ScrollContainer>
		</IonContent>
	</IonPage>
</template>
