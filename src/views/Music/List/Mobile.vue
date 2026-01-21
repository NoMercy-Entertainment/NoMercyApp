<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { IonContent, IonPage, isPlatform, onIonViewWillEnter } from '@ionic/vue';

import type { DisplayList } from '@/types/api/music/musicPlayer';

import type { PlaylistItem, SortOrder, SortType } from '@/types/musicPlayer';

import useServerClient from '@/lib/clients/useServerClient';
import { setTitle, sortByType } from '@/lib/stringArray';
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
	data: {
		version: 'lolomo',
	},
});

const main = ref<HTMLDivElement | null>(null);

const displayList = ref<PlaylistItem[]>();
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

function onScroll() {
	// if(window.CSS.supports('container-type', 'scroll-state')) return;

	const headerScrollTop = 170;
	const headerScrollTextTop = 160;
	const sortHeaderTop = isPlatform('capacitor') ? 88 : 64;

	const top = sortHeader.value?.$el?.getBoundingClientRect().top;
	if (!top) {
		requestAnimationFrame(onScroll);
		return;
	}

	showScrollHeader.value = top <= headerScrollTop;
	showScrollHeaderText.value = top <= headerScrollTextTop;

	if (window.CSS.supports('container-type', 'scroll-state')) {
		requestAnimationFrame(onScroll);
		return;
	}

	if (top === sortHeaderTop) {
		sortHeader.value?.$el?.classList.add('!bg-focus');
		sortHeader.value?.$el?.firstChild?.classList.add(
			'!bg-surface-10/11',
			'dark:!bg-[rgb(var(--background-auto)/79%)]',
		);
	}
	else {
		sortHeader.value?.$el?.classList.remove('!bg-focus');
		sortHeader.value?.$el?.firstChild?.classList.remove(
			'!bg-surface-10/11',
			'dark:!bg-[rgb(var(--background-auto)/79%)]',
		);
	}

	requestAnimationFrame(onScroll);
}

watch(container, () => {
	requestAnimationFrame(onScroll);
});
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
		</IonContent>
	</IonPage>
</template>
