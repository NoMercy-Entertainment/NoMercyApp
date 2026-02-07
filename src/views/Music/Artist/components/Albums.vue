<script lang="ts" setup>
import type { PropType } from 'vue';

import type { ArtistResponse } from '@/types/api/music/artist';

import { currentSong } from '@/store/audioPlayer';

import TabFrame from '@/views/Music/Artist/components/TabFrame.vue';
import NMMusicCard from '@/components/NMMusicCard.vue';

defineProps({
	data: {
		type: Object as PropType<ArtistResponse>,
		required: true,
	},
	item: {
		type: String as PropType<keyof ArtistResponse>,
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
		class="flex flex-1 basis-0 items-start justify-start gap-8 self-stretch p-8 pb-0"
	>
		<TabFrame :active-tab="activeTab" :data="data">
			<div
				:class="{
					'pb-4 sm:pb-4': !currentSong,
				}"
				class="z-0 w-full h-available h-fit grid gap-4 music-showing:pb-0 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 3xl:grid-cols-7 4xl:grid-cols-7 5xl:grid-cols-[repeat(8,minmax(0,1fr))] tv:grid-cols-6 scroll-smooth items-start"
				style="opacity: 1"
			>
				<template v-if="Array.isArray(data?.[item])">
					<template v-for="i in data[item] as any" :key="i?.id">
						<NMMusicCard v-if="i" :data="i" />
					</template>
				</template>
			</div>
		</TabFrame>
	</div>
</template>
