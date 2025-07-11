<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { IonContent, IonPage, onIonViewDidEnter } from '@ionic/vue';

import type { LibraryResponse } from '@/types/api/base/library';
import type {
	PeopleResponse,
	PersonResponseItem,
} from '@/types/api/base/person';
import type { GenreResponse } from '@/types/api/base/genre';

import { isNative } from '@/config/global';
import { currentSong } from '@/store/audioPlayer';
import useInfiniteServerClient from '@/lib/clients/useInfiniteServerClient';
import { showBackdrops } from '@/store/preferences';
import { setBackground, setColorPalette } from '@/store/ui';
import router from '@/router';
import { setTitle } from '@/lib/stringArray';

import Indexer from '@/Layout/Indexer.vue';

import MediaCard from '@/components/NMCard.vue';
import PersonCard from '@/components/Cards/PersonCard.vue';
import GenreCard from '@/components/Cards/GenreCard.vue';
import EmptyCard from '@/components/Cards/EmptyCard.vue';

const route = useRoute();

const { data, fetchNextPage, hasNextPage, isError } = useInfiniteServerClient<{
	data: Array<LibraryResponse | GenreResponse | PeopleResponse>;
}>({
	queryKey: [
		'libraries',
		((route.params.id ?? route.name) as string)?.split('&').at(0),
	],
	limit: 20,
	keepForever: true,
});

onMounted(() => {
	setTitle();
	setBackground(null);
	setColorPalette(null);
	document.dispatchEvent(new Event('sidebar'));
	setTimeout(() => {
		document.dispatchEvent(new Event('indexer'));
	}, 1000);
});

watch(data, (value) => {
	if (!value)
		return;
	setTimeout(() => {
		document.dispatchEvent(new Event('indexer'));
	}, 1000);
});

const backdropStyle
  = 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 3xl:grid-cols-5 4xl:grid-cols-5 5xl:grid-cols-9 tv:grid-cols-6';

const posterStyle
  = 'grid-cols-2 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-7 3xl:grid-cols-9 4xl:grid-cols-10 5xl:grid-cols-[repeat(14,minmax(0,1fr))] tv:grid-cols-6';

const useBackdropStyle = computed(() => {
	const firstItem = data.value?.pages?.[0]?.data?.[0];
	return (
		firstItem
		&& showBackdrops.value
		&& firstItem.media_type !== 'person'
		&& firstItem.media_type !== 'genres'
	);
});

onUnmounted(() => {
	stop();
	setBackground(null);
});

const lib = ref<HTMLDivElement>();
const id = ref();

onMounted(() => {
	id.value = route.params.id ?? (route.name as string);

	if (hasNextPage.value && (data?.value?.pages?.length ?? 0) < 50) {
		fetchNextPage();
	}

	document.addEventListener('scrollToDiv', (e: Event) => {
		lib.value?.scrollTo({
			// @ts-ignore
			top: e.detail.top - 100,
			behavior: 'smooth',
		});
	});
});

onIonViewDidEnter(() => {
	document.dispatchEvent(new Event('indexer'));
});

watch(data, (value) => {
	if (!value)
		return;

	if (hasNextPage.value && value?.pages?.length < 50) {
		fetchNextPage();
	}
});

const selectedCard = ref<LibraryResponse | GenreResponse | PeopleResponse>();
const cardMenu = ref();

function onRightClick(event: Event, data: LibraryResponse | GenreResponse | PeopleResponse) {
	selectedCard.value = data;
	cardMenu.value.show(event);
}
</script>

<template>
	<IonPage>
		<IonContent
			:fullscreen="true"
			class="ion-padding"
			style="--padding-bottom: 0"
		>
			<div
				class="fixed top-0 pt-safe w-full bg-slate-light-1 dark:bg-slate-dark-3 z-1199"
			/>
			<div
				ref="lib"
				class="pt-safe-offset-9 flex h-auto w-full pr-8 overflow-auto scroll-container"
			>
				<div
					:key="router.currentRoute.value.params?.id as string"
					class="z-0 flex flex-col gap-4 rounded-3xl border-0 w-available scrollbar-none border-auto-3"
					:class="{
						'pb-2': isNative && currentSong,
						'children:pb-4 sm:children:pb-3': !isNative && currentSong,
					}"
				>
					<div
						:class="`grid w-full gap-4 scroll-smooth music-showing:pb-0 pl-1 py-4 ${
							useBackdropStyle ? backdropStyle : posterStyle
						}`"
					>
						<!--        <ContextMenu ref="cardMenu" :model="items"/> -->
						<template v-if="data">
							<template v-for="(group, index) in data.pages ?? []" :key="index">
								<template v-if="group.data.length > 0">
									<template v-for="(data, index2) in group.data ?? []">
										<MediaCard
											v-if="
												data?.media_type === 'tv'
													|| data?.media_type === 'movie'
													|| data?.media_type === 'collection'
													|| data?.media_type === 'specials'
											"
											:key="data.id"
											:data="data as LibraryResponse"
											:index="index2"
											@context-menu="onRightClick($event, data)"
										/>
										<PersonCard
											v-else-if="data?.media_type === 'person'"
											:key="`${data.id}_person`"
											:data="data as PersonResponseItem"
											:index="index2"
											@context-menu="onRightClick($event, data)"
										/>
										<GenreCard
											v-else-if="data?.media_type === 'genres'"
											:key="`${data.id}_genres`"
											:data="data as GenreResponse"
											:index="index2"
											@context-menu="onRightClick($event, data)"
										/>
									</template>
								</template>
								<template v-else-if="data.pages?.[0]?.data?.length === 0">
									<EmptyCard />
								</template>
							</template>
						</template>
					</div>
				</div>
				<Indexer
					:id="id"
					class="w-8 fixed right-0 bg-slate-light-1 dark:bg-slate-dark-3 transition-all duration-200"
					:class="{
						'h-available': !isNative,
						'h-inherit top-24': isNative,
						'-mt-4 pt-4 pb-4 mb-0': !currentSong,
						'-mt-4 pt-4 pb-4 mb-14': currentSong,
					}"
				/>
			</div>
		</IonContent>
	</IonPage>
</template>

<!-- <style scoped> -->

<!-- @media screen and (max-width: 800px) { -->
<!--  ion-content::part(scroll) { -->
<!--    &#45;&#45;offset-top: -4.5rem; -->
<!--  } -->

<!--  *:has(ion-toolbar:first-child:nth-last-child(2) ~ *) ion-content::part(scroll) { -->
<!--    &#45;&#45;offset-top: -8.5rem; -->
<!--  } -->
<!-- } -->
<!-- </style> -->
