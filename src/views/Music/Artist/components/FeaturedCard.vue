<script setup lang="ts">
import { computed, type PropType } from "vue";

import type { ArtistResponse } from "@/types/api/music/artist";
import type { PlaylistItem } from "@/types/musicPlayer";

import CoverImage from "@/components/MusicPlayer/components/CoverImage.vue";
import { Artist } from "@/types/api/music/artist";

const props = defineProps({
	data: {
		type: Object as PropType<ArtistResponse>,
		required: true,
	}
});


const artists = computed(() => {
	const artists: any = {}

	props.data?.tracks?.forEach((track: PlaylistItem) => {
		track.artist_track?.forEach((artist) => {
			if (artist.id == props.data.id || !artist.cover) return;
			artists[artist.id as any] = {
				id: artist.id,
				name: artist.name,
				cover: artist.cover,
			};
		});
	});

	return Object.values(artists) as Artist[];
});

</script>

<template>
	<div v-if="artists.length > 0" class="flex w-full flex-col items-start justify-start gap-4">
		<div class="text-xl font-bold leading-loose text-auto-11">
			{{ $t('Featured Artists') }}
		</div>
		<div class="grid grid-cols-2 gap-4">

			<template v-for="artist in artists as Artist[]" :key="artist.id">
				<RouterLink :to="artist.link"
					class="inline-flex items-center justify-start gap-4 underline-offset-4 hover:underline">
					<div class="flex h-16 w-16 items-center justify-center rounded px-px py-px">
						<CoverImage :data="artist" :size="60" class="h-14 w-14 rounded-lg" />
					</div>
					<div class="flex items-center justify-start gap-2.5">
						<div class="text-sm font-semibold text-auto-8 text-balance line-clamp-2">
							{{ artist.name }}
						</div>
					</div>
				</RouterLink>
			</template>
		</div>
	</div>
</template>
