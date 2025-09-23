<script lang="ts" setup>
import { nextTick, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { IonContent, IonPage, onIonViewDidEnter } from '@ionic/vue';

import type { MusicCardPageResponse } from '@/types/musicPlayer';

import useServerClient from '@/lib/clients/useServerClient';
import { isNative } from '@/config/global';
import { currentSong } from '@/store/audioPlayer';
import { setBackground, setColorPalette } from '@/store/ui';

import Indexer from '@/Layout/Indexer.vue';
import NotFound from '@/Layout/Desktop/components/NotFound.vue';

const show = ref(false);

const route = useRoute();
const { data, isError } = useServerClient<MusicCardPageResponse['data']>({
	path: route.fullPath,
	keepForever: true,
});

watch(data, () => {
	show.value = true;
});

onIonViewDidEnter(() => {
	show.value = true;
	setColorPalette(null);
	setBackground(null);
	nextTick(() => {
		document.dispatchEvent(new Event('indexer'));
	});
});
</script>

<template>
	<IonPage>
		<IonContent :fullscreen="true">
			<NotFound v-if="isError && !data" />
			<div v-else class="pt-safe flex w-full pr-8 h-inherit">
				<div
					v-if="show"
					:class="{
						'pb-24': isNative && !currentSong,
						'pb-40': isNative && currentSong,
						'children:pb-4 sm:children:pb-3': !isNative && currentSong,
					}"
					class="z-0 w-available overflow-x-clip w-full h-auto grid gap-4 pl-4 pr-4 sm:pt-4 music-showing:pb-0 grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-7 3xl:grid-cols-9 4xl:grid-cols-9 5xl:grid-cols-[repeat(14,minmax(0,1fr))] tv:grid-cols-6 scroll-smooth"
					style="opacity: 1"
				>
					<template v-if="Array.isArray(data)">
						<template v-for="item in data" :key="item.id">
							<NMMusicCard :data="item" />
						</template>
					</template>
					<Indexer
						:class="{
							'h-available': !isNative,
							'h-full top-0': isNative,
						}"
						class="w-8 fixed right-0 bg-surface-1"
					/>
				</div>
			</div>
		</IonContent>
	</IonPage>
</template>
