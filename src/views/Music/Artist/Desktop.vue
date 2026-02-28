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

import BannerButton from '@/components/Buttons/BannerButton.vue';
import Home from './components/Home.vue';
import Albums from './components/Albums.vue';
import Playlists from './components/Playlists.vue';
import About from './components/About.vue';
import Tabs from './components/Tabs.vue';
import Tab from './components/Tab.vue';
import Header from './components/Header.vue';
import NotFound from '@/Layout/Desktop/components/NotFound.vue';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';

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

const displayList = ref<PlaylistItem[]>();
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

	if (value === '') {
		displayList.value = newList;
	}
	else {
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

const tabs = computed(() => {
	return [
		{
			name: 'Home',
		},
		{
			name: 'Albums',
		},
		{
			name: 'Featured',
		},
		{
			name: 'Playlists',
		},
		{
			name: 'About',
		},
	].filter((t) => {
		if (t.name === 'Albums' && data.value?.albums?.length === 0) {
			t.name = '';
		}
		if (t.name === 'Playlists' && data.value?.playlists?.length === 0) {
			t.name = '';
		}
		if (t.name === 'Playlists' && data.value?.featured?.length === 0) {
			t.name = '';
		}
		return true;
	});
});

const displayType = ref<'list' | 'card'>('list');
function setDisplayType(type: 'list' | 'card') {
	displayType.value = type;
}
</script>

<template>
	<NotFound v-if="isError && !data" />
	<ScrollContainer v-else :auto-hide="true" :static="true">
		<div
			v-if="data"
			class="inline-flex w-full flex-1 flex-col items-start justify-start overflow-clip rounded-2xl bg-surface-2/1"
		>
			<Header v-if="data" :data="data" />

			<Tabs :tabs="tabs" class="min-h-[calc(100vh-175px)] !flex-1">
				<template #extra="{ activeTab }">
					<div
						v-if="activeTab === tabs[0].name"
						class="absolute right-4 inline-flex items-center justify-start top-[9.65px] gap-2.5"
					>
						<BannerButton
							:is-active="displayType === 'list'"
							title="List"
							@click="setDisplayType('list')"
						>
							<MoooomIcon
								class-name="relative h-5 w-5"
								icon="bulletList"
							/>
						</BannerButton>
						<BannerButton
							:is-active="displayType === 'card'"
							title="Grid"
							@click="setDisplayType('card')"
						>
							<MoooomIcon
								class-name="relative h-5 w-5"
								icon="collection"
							/>
						</BannerButton>
					</div>
				</template>

				<template #default="{ activeTab }">
					<Tab :is-active="activeTab === tabs[0].name">
						<Home
							v-if="data"
							:active-tab="activeTab"
							:data="data"
							:display-type="displayType"
						/>
					</Tab>
					<Tab :is-active="activeTab === tabs[1].name">
						<Albums
							v-if="data"
							:active-tab="activeTab"
							:data="data"
							item="albums"
						/>
					</Tab>
					<Tab :is-active="activeTab === tabs[2].name">
						<Albums
							v-if="data"
							:active-tab="activeTab"
							:data="data"
							item="featured"
						/>
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
