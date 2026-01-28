<script lang="ts" setup>
import { SortType } from '@/types/musicPlayer';
import { computed } from 'vue';
import { isPlatform } from '@ionic/vue';

import SortButton from './SortButton.vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const isAlbumRoute = computed(() => route.path.startsWith('/music/album'));
const isArtistRoute = computed(() => route.path.startsWith('/music/artist'));
const isPlaylistsRoute = computed(() => route.path.startsWith('/music/playlists'));
const isFavoritesRoute = computed(() => route.path.startsWith('/music/tracks'));
const isGenresRoute = computed(() => route.path.startsWith('/music/genres'));
</script>

<template>
	<div
		id="sortHeaderElement"
		:class="{
			'top-safe-offset-[4rem]': isPlatform('capacitor'),
			'top-safe-offset-16': !isPlatform('capacitor'),
		}"
		class="sticky -mx-4 px-4 z-30 mt-4 block h-10 content-center items-center justify-start self-stretch bg-transparent text-sm font-medium transition-all duration-200 w-available group/track sm:w-available sm:-top-px"
	>
		<span
			id="sorterChild"
			class="absolute inset-0 h-10 sm:rounded-t-2xl overflow-clip w-full transition-all duration-200"
		/>
		<span
			:class="{
				'album-grid': isAlbumRoute || isPlaylistsRoute || isFavoritesRoute || isGenresRoute,
				'artist-grid': isArtistRoute,
			}"
			class="grid justify-start items-center self-stretch pr-3 sm:px-3 rounded-lg group/track text-sm font-medium py-2 z-0 group/track"
		>
			<SortButton
				id="sortIndex"
				:aria-label="$t('Sort by index')"
				:sorting-type="SortType.index"
				class="!flex justify-center"
				icon-spacer="absolute left-6"
				name="#"
			/>

			<SortButton
				:aria-label="$t('Sort by name')"
				:sorting-type="SortType.name"
				class="flex sm:flex"
				icon-spacer="w-6 h-6"
				name="Title"
			/>

			<SortButton
				:aria-label="$t('Sort by album')"
				:class="{
					'opacity-0': isAlbumRoute,
				}"
				:sorting-type="SortType.album"
				class="!hidden sm:!flex"
				icon-spacer="w-6 h-6"
				name="Album"
			/>
			<!-- routeIs('app.music.tracks') ? 'Date added' : -->
			<SortButton
				:aria-label="$t('Sort by date')"
				:sorting-type="SortType.date"
				class="!hidden sm:!flex"
				icon-spacer="w-6 h-6"
				name="Release date"
			/>

			<SortButton
				:aria-label="$t('Sort by duration')"
				:sorting-type="SortType.duration"
				class="!hidden sm:!flex gap-2 flex-row-reverse pr-[4.5rem]"
				icon-spacer="w-6 h-6"
				name="Duration"
			/>
		</span>
	</div>
</template>

<style scoped>
.sticky {
	container-type: scroll-state;

	> *:first-child {
		@container scroll-state(stuck: top) {
			background: var(--color-theme-8);
			color: white;
		}
	}
}
.scheme-dark .sticky > *:first-child {
	@container scroll-state(stuck: top) {
		background: hsl(from var(--color-theme-8) h s 23%);
		color: white;
	}
}
</style>
