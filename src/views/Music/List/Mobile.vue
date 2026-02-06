<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { IonContent, IonPage, isPlatform, onIonViewWillEnter } from '@ionic/vue';
import { useVirtualizer } from '@tanstack/vue-virtual';

import type { DisplayList } from '@/types/api/music/musicPlayer';

import type { PlaylistItem, SortOrder, SortType } from '@/types/musicPlayer';

import useServerClient from '@/lib/clients/useServerClient';
import { setTitle } from '@/lib/utils/string';
import { sortByType } from '@/lib/utils/array';
import { setColorPalette, setSortOrder, sortOrder, sortType } from '@/store/ui';
import router from '@/router';

import ControlHeader from '@/views/Music/List/components/ControlHeader.vue';
import ArtistHeader from '@/views/Music/List/components/ArtistHeader.vue';
import SortHeader from '@/views/Music/List/components/SortHeader.vue';
import TrackRow from '@/views/Music/List/components/TrackRow.vue';
import NotFound from '@/Layout/Desktop/components/NotFound.vue';
import Marquee from '@/components/Marquee.vue';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';

const route = useRoute();

const { data, isError } = useServerClient<DisplayList>({
	path: route.fullPath,
});

const main = ref<HTMLDivElement | null>(null);

const displayList = ref<PlaylistItem[]>([]);
const filter = ref('');

watch(data, (value) => {
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
	sort(
		data?.value?.tracks ?? [],
		sortType.value,
		sortOrder.value,
		filter.value,
	);
	if (data.value?.color_palette?.cover) {
		setColorPalette(data.value?.color_palette?.cover);
	}
});

onIonViewWillEnter(() => {
	sort(
		data?.value?.tracks ?? [],
		sortType.value,
		sortOrder.value,
		filter.value,
	);
	if (data.value?.color_palette?.cover) {
		setColorPalette(data.value?.color_palette?.cover);
	}
});

function handleBack() {
	router.back();
}

const showScrollHeader = ref(false);
const showScrollHeaderText = ref(false);
const sortHeader = ref<VueDivElement>();
const container = ref<VueDivElement>();

// Virtual scrolling setup
const virtualizer = computed(() => useVirtualizer({
	count: displayList.value?.length ?? 0,
	getScrollElement: () => container.value?.$el as HTMLElement ?? null,
	estimateSize: () => 56, // Estimated height of each TrackRow
	overscan: 10, // Render 10 extra items above/below viewport
}));

function onScroll() {
	const headerScrollTop = 170;
	const headerScrollTextTop = 160;
	const sortHeaderTop = isPlatform('capacitor') ? 88 : 64;

	const headerElement = sortHeader.value?.$el;
	const childElement = headerElement?.firstChild as HTMLElement;

	if (!headerElement || !childElement)
		return;

	const top = headerElement.getBoundingClientRect().top;

	showScrollHeader.value = top <= headerScrollTop;
	showScrollHeaderText.value = top <= headerScrollTextTop;

	if (top <= sortHeaderTop) {
		// Apply theme color background to the child span
		const isDark = document.documentElement.classList.contains('scheme-dark');
		if (isDark) {
			// For dark mode, use a darker version of the theme color
			childElement.style.background = 'hsl(from var(--color-theme-8) h s 23%)';
		}
		else {
			childElement.style.background = 'var(--color-theme-8)';
			headerElement.style.color = 'white';
		}
	}
	else {
		childElement.style.background = '';
		headerElement.style.color = '';
	}
}
</script>

<template>
	<IonPage>
		<IonContent ref="container" :scroll-events="true" @ion-scroll="onScroll">
			<NotFound v-if="isError && !data" />
			<div
				v-else-if="
					!route.params.id || (route.params.id && data?.id === route.params.id)
				"
				ref="main"
				class="flex flex-col h-auto overflow-x-clip w-available sm:rounded-2xl -mt-6 text-surface-12"
			>
				<ArtistHeader :data="data" />

				<div
					class="relative z-0 flex h-auto flex-shrink-0 flex-grow flex-col items-start justify-start self-stretch"
				>
					<div
						class="pointer-events-none absolute z-0 h-96 w-full bg-spotifyBottom"
					/>

					<div
						id="navbar"
						:class="{
							'opacity-0 pointer-events-none': !showScrollHeader,
							'opacity-100 pointer-events-auto': showScrollHeader,
						}"
						class="fixed z-1099 -mx-2 flex gap-4 p-2 px-4 w-available sm:hidden bg-surface-11 dark:bg-surface-1 top-0 pt-4 transition-all duration-200"
					>
						<div
							id="navBg"
							class="z-20 absolute flex items-center inset-0 w-available h-full bg-focus/12 dark:bg-focus transition-all duration-200 bg-spotifyTop opacity-50 pointer-events-none"
						/>

						<button
							class="z-30 flex h-10 w-11 items-center justify-center rounded-md"
							@click="handleBack"
						>
							<MoooomIcon icon="arrowLeft" />
						</button>

						<div
							id="navText"
							:class="{
								'opacity-0 pointer-events-none': !showScrollHeader,
								'opacity-100 pointer-events-auto': showScrollHeader,
							}"
							class="pointer-events-none whitespace-pre text-left relative z-20 line-clamp-1 h-auto self-center font-bold leading-none transition-all duration-200 w-[70%] overflow-clip text-xl"
						>
							<Marquee :text="data?.name" />
						</div>
					</div>

					<ControlHeader
						:key="data?.id"
						:data="data"
						:filter="filter"
						@filter-change="(e: string) => filter = e"
					/>

					<div
						class="flex flex-1 flex-shrink-0 flex-col items-start justify-start self-stretch bg-surface-12 dark:bg-transparent flex-grow-1 gap-0.5 sm:p-4"
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
		</IonContent>
	</IonPage>
</template>
