<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { IonContent, IonPage, onIonViewDidEnter } from '@ionic/vue';
import { isNative } from '@/config/global';
import { currentSong } from '@/store/audioPlayer';

import type { LibraryResponse } from '@/types/api/base/library';
import type { PeopleResponse, PersonResponseItem } from '@/types/api/base/person';
import type { GenreResponse } from '@/types/api/base/genre';

import useInfiniteServerClient from '@/lib/clients/useInfiniteServerClient';
import { showBackdrops } from '@/store/preferences';
import { setBackground, setColorPalette } from '@/store/ui';
import router from '@/router';
import { setTitle } from '@/lib/utils/string';

import MediaCard from '@/components/NMCard.vue';
import PersonCard from '@/components/Cards/PersonCard.vue';
import GenreCard from '@/components/Cards/GenreCard.vue';
import EmptyCard from '@/components/Cards/EmptyCard.vue';
import ScrollContainer from '@/Layout/Desktop/components/ScrollContainer.vue';
import { useRoute } from 'vue-router';
import NotFound from '@/Layout/Desktop/components/NotFound.vue';

const route = useRoute();

const { data, fetchNextPage, hasNextPage, isError } = useInfiniteServerClient<{
	data: Array<LibraryResponse | GenreResponse | PeopleResponse>;
}>({
	queryKey: ['libraries', route?.params.id ?? route.name],
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

	if (hasNextPage.value && (data?.value?.pages?.length ?? 0) < 10) {
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

	if (hasNextPage.value && value?.pages?.length < 10) {
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
		<IonContent :fullscreen="true">
			<NotFound v-if="isError && !data?.pages" />
			<ScrollContainer
				v-else
				:id="router.currentRoute.value.fullPath"
				:auto-hide="true"
				:static="true"
			>
				<div
					:key="router.currentRoute.value.params?.id as string"
					:class="{
						'pb-24': isNative && !currentSong,
						'pb-40': isNative && currentSong,
						'children:pb-4 sm:children:pb-3': !isNative && currentSong,
					}"
					class="z-0 flex flex-col gap-4 rounded-3xl border-0 p-4 w-available scrollbar-none border-surface-3 transform-gpu will-change-auto"
				>
					<div
						:class="`grid w-full gap-4 scroll-smooth music-showing:pb-0 whitespace-pre ${
							useBackdropStyle ? backdropStyle : posterStyle
						}`"
					>
						<template v-for="(group, index) in data?.pages ?? []" :key="index">
							<template v-if="group.data.length > 0">
								<template v-for="(item, index2) in group.data ?? []">
									<MediaCard
										v-if="
											item?.media_type === 'tv'
												|| item?.media_type === 'movie'
												|| item?.media_type === 'collection'
												|| item?.media_type === 'specials'
										"
										:key="item.id"
										:data="item as LibraryResponse"
										:index="index2"
										@context-menu="onRightClick($event, item)"
									/>
									<PersonCard
										v-else-if="item?.media_type === 'person'"
										:key="`${item.id}_person`"
										:data="item as PersonResponseItem"
										:index="index2"
										@context-menu="onRightClick($event, item)"
									/>
									<GenreCard
										v-else-if="item?.media_type === 'genres'"
										:key="`${item.id}_genres`"
										:data="item as GenreResponse"
										:index="index2"
										@context-menu="onRightClick($event, item)"
									/>
								</template>
							</template>
							<template v-else-if="data?.pages?.[0]?.data?.length === 0">
								<EmptyCard />
							</template>
						</template>
					</div>
				</div>
			</ScrollContainer>
		</IonContent>
	</IonPage>
</template>
