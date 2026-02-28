<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import type { ArtistResponse } from '@/types/api/music/artist';
import type { PlaylistItem, SortOrder, SortType } from '@/types/musicPlayer';

import useServerClient from '@/lib/clients/useServerClient';
import { setTitle } from '@/lib/utils/string';
import { sortByType } from '@/lib/utils/array';
import { setBackground, setColorPalette, setSortOrder, sortOrder, sortType } from '@/store/ui';

import ScrollContainer from '@/Layout/Desktop/components/ScrollContainer.vue';

import Home from './components/Home.vue';
import Albums from './components/Albums.vue';
import Playlists from './components/Playlists.vue';
import About from './components/About.vue';
import Tabs from './components/Tabs.vue';
import Tab from './components/Tab.vue';
import Header from './components/Header.vue';
import NotFound from '@/Layout/Desktop/components/NotFound.vue';

const route = useRoute();

const { data, isError } = useServerClient<ArtistResponse>({
	path: route.fullPath,
	keepForever: true,
});

onMounted(() => {
	document.dispatchEvent(new Event('sidebar'));
});

onUnmounted(() => {
	setColorPalette(null);
	setBackground(null);
});

const filter = ref('');

watch(sortOrder, (value) => {
	sort(data.value?.tracks ?? [], sortType.value, value, filter.value);
});
watch(sortType, (value) => {
	sort(data.value?.tracks ?? [], value, sortOrder.value, filter.value);
});
watch(filter, (value) => {
	sort(data.value?.tracks ?? [], sortType.value, sortOrder.value, value);
});

watch(data, (value) => {
	setTitle(value?.name ?? null);
});

function sort(songs: PlaylistItem[], sortType: SortType, sortOrder: SortOrder, value: string) {
	const newList = sortByType<PlaylistItem>(
		songs ?? [],
		sortType,
		sortOrder,
		setSortOrder,
	);

	// sort result available for sub-components via data prop if needed
	void newList;
}

const tabs = computed(() => {
	return [
		{ name: 'Home' },
		{ name: 'Albums' },
		{ name: 'Featured' },
		{ name: 'Playlists' },
		{ name: 'About' },
	].filter((t) => {
		if (t.name === 'Albums' && data.value?.albums?.length === 0) {
			t.name = '';
		}
		if (t.name === 'Featured' && data.value?.featured?.length === 0) {
			t.name = '';
		}
		if (t.name === 'Playlists' && data.value?.playlists?.length === 0) {
			t.name = '';
		}
		return true;
	});
});
</script>

<template>
	<NotFound v-if="isError && !data" />
	<ScrollContainer v-else :auto-hide="true" :static="true">
		<div
			v-if="data?.id === route.params.id"
			class="inline-flex w-full flex-1 flex-col items-start justify-start overflow-clip rounded-2xl bg-surface-2/1"
		>
			<Header v-if="data" :data="data" />

			<Tabs :tabs="tabs" class="min-h-[calc(100dvh-175px)] !flex-1">
				<template #default="{ activeTab }">
					<Tab :is-active="activeTab === tabs[0].name">
						<Home v-if="data" :active-tab="activeTab" :data="data" display-type="list" />
					</Tab>
					<Tab :is-active="activeTab === tabs[1].name">
						<Albums v-if="data" :active-tab="activeTab" :data="data" item="albums" />
					</Tab>
					<Tab :is-active="activeTab === tabs[2].name">
						<Albums v-if="data" :active-tab="activeTab" :data="data" item="featured" />
					</Tab>
					<Tab :is-active="activeTab === tabs[3].name">
						<Playlists v-if="data" :active-tab="activeTab" :data="data" />
					</Tab>
					<Tab :is-active="activeTab === tabs[4].name">
						<About v-if="data" :active-tab="activeTab" :data="data" />
					</Tab>
				</template>
			</Tabs>
		</div>
	</ScrollContainer>
</template>
