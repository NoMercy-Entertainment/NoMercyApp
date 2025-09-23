<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { IonContent, IonPage, onIonViewWillEnter, onIonViewWillLeave } from '@ionic/vue';

import type { DisplayList } from '@/types/api/music/musicPlayer';
import type { PlaylistItem, SortOrder, SortType } from '@/types/musicPlayer';

import { isNative } from '@/config/global';
import useServerClient from '@/lib/clients/useServerClient';
import { setTitle, sortByType } from '@/lib/stringArray';
import { setBackground, setColorPalette, setSortOrder, sortOrder, sortType } from '@/store/ui';
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

const main = ref<HTMLDivElement | null>(null);

const displayList = ref<PlaylistItem[]>();
const filter = ref('');

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

onIonViewWillEnter(() => {
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

onIonViewWillLeave(() => {
	if (document.getElementById('navbar')) {
		document.getElementById('navbar')!.style.display = 'flex';
	}
	setColorPalette(null);
	setBackground(null);
});

const sortHeader = ref<VueDivElement>();

function onScroll() {
	// Skip if the browser supports native sticky top.
	if (window.CSS.supports('container-type', 'scroll-state'))
		return;

	const sortHeaderTop = 67;

	if (
		Math.ceil(sortHeader.value?.$el?.getBoundingClientRect()?.top ?? 500)
		<= sortHeaderTop
	) {
		sortHeader.value?.$el?.classList.add('!bg-focus');
		sortHeader.value?.$el?.firstChild?.classList.add('!bg-black/50');
	}
	else {
		sortHeader.value?.$el?.classList.remove('!bg-focus');
		sortHeader.value?.$el?.firstChild?.classList.remove('!bg-black/50');
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
							<template
								v-for="(item, index) in displayList"
								:key="item.id + item?.favorite"
							>
								<TrackRow
									:data="item"
									:display-list="displayList"
									:index="index"
								/>
							</template>
						</div>
					</div>
				</div>
			</ScrollContainer>
		</IonContent>
	</IonPage>
</template>
