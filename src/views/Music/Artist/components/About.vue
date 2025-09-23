<script lang="ts" setup>
import { computed } from 'vue';
import type { PropType } from 'vue';

import type { Artist, ArtistResponse } from '@/types/api/music/artist';

import type { HomeDataItem, MusicHomeResponseItem } from '@/types/api/music';
import type { PlaylistItem } from '@/types/musicPlayer';

import MusicCarousel from '@/components/Carousel/MusicCarousel.vue';
import TabFrame from '@/views/Music/Artist/components/TabFrame.vue';
import GenresCard from '@/views/Music/Artist/components/GenresCard.vue';

const props = defineProps({
	data: {
		type: Object as PropType<ArtistResponse>,
		required: true,
	},
	activeTab: {
		type: String,
		required: true,
	},
});

const artists = computed(() => {
	const artists: any = {};

	props.data?.tracks?.forEach((track: PlaylistItem) => {
		track.artist_track?.forEach((artist) => {
			if (artist.id === props.data.id || !artist.cover)
				return;
			artists[artist.id as any] = artist;
		});
	});

	return Object.values(artists) as Artist[];
});

const artistCarousel = computed(() => {
	return [
		{
			title: 'Featuring artists',
			moreLink: '',
			children: artists.value as unknown as any,
		},
	];
});
</script>

<template>
	<div
		v-if="activeTab"
		class="flex flex-1 basis-0 items-start justify-start self-stretch overflow-clip px-8 py-8 w-available"
	>
		<TabFrame :data="data" :active-tab="activeTab">
			<div class="flex flex-col gap-2 overflow-clip w-available max-w-[75ch]">
				<div
					v-for="line in (data.description ?? '')?.split('\n') ?? []"
					:key="line"
					class="flex flex-col gap-1"
				>
					<template v-for="sentence in line.split('\n')" :key="sentence">
						<span
							class="bionic-text font-semibold !text-base"
							v-html="sentence"
						/>
					</template>
				</div>
			</div>

			<GenresCard :data="data" />

			<div class="max-w-available">
				<template
					v-for="carousel in artistCarousel ?? []"
					:key="carousel.title"
				>
					<MusicCarousel
						:data="carousel as unknown as MusicHomeResponseItem<HomeDataItem>"
						class="-mx-3"
						:limit-card-count-by="2"
					/>
				</template>
			</div>
		</TabFrame>
	</div>
</template>
