<script lang="ts" setup>
import type { PropType } from 'vue';

import type { ArtistResponse } from '@/types/api/music/artist';

import MusicCard from '@/components/Cards/MusicCard.vue';
import TabFrame from './TabFrame.vue';
import { currentSong } from '@/store/audioPlayer';

defineProps({
	data: {
		type: Object as PropType<ArtistResponse>,
		required: true,
	},
	activeTab: {
		type: String,
		required: true,
	},
});
</script>

<template>
	<div
		class="flex flex-1 basis-0 items-start justify-start gap-8 self-stretch p-8"
	>
		<TabFrame :data="data" :active-tab="activeTab">
			<div
				class="z-0 w-available h-available w-full h-fit grid gap-4 pl-4 pr-4 pt-4 pb-4 music-showing:pb-0 grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-7 3xl:grid-cols-9 4xl:grid-cols-9 5xl:grid-cols-[repeat(14,minmax(0,1fr))] tv:grid-cols-6 scroll-smooth"
				:class="{
					'pb-4 sm:pb-4': currentSong,
				}"
				style="opacity: 1"
			>
				<template v-if="Array.isArray(data.playlists)">
					<template v-for="item in data.playlists" :key="item.id">
						<MusicCard :data="item" />
					</template>
				</template>
			</div>
		</TabFrame>
	</div>
</template>
