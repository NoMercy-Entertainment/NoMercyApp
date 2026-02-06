<script lang="ts" setup>
import type { PropType } from 'vue';
import { useRoute } from 'vue-router';
import type { PlaylistItem } from '@/types/musicPlayer';
import { audioPlayer, currentSong, isPlaying, musicSize } from '@/store/audioPlayer';

import DropdownMenu from '@/Layout/Desktop/components/Menus/DropdownMenu.vue';

import EqSpinner from '@/components/Images/EqSpinner.vue';
import CoverImage from '@/components/MusicPlayer/components/CoverImage.vue';
import MediaLikeButton from '@/components/Buttons/MediaLikeButton.vue';
import BannerButton from '@/components/Buttons/BannerButton.vue';
import TrackLinks from '@/views/Music/List/components/TrackLinks.vue';
import { onTrackRowRightClick } from '@/store/contextMenuItems';
import PlayerIcon from '@/components/Images/icons/PlayerIcon.vue';
import { musicSocketConnection } from '@/store/musicSocket';
import { user } from '@/store/user';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';

const props = defineProps({
	data: {
		type: Object as PropType<PlaylistItem>,
		required: true,
	},
	index: {
		type: Number as PropType<number>,
		required: true,
	},
	displayList: {
		type: Array as PropType<PlaylistItem[] | undefined>,
		required: true,
	},
	isAlbumRoute: {
		type: Boolean,
		default: false,
	},
	isFavoritesRoute: {
		type: Boolean,
		default: false,
	},
});

const route = useRoute();

function handleClick() {
	if (!user.value.features?.nomercyConnect) {
		audioPlayer.playTrack(props.data, props.displayList);
		return;
	}

	musicSocketConnection.value?.invoke(
		'StartPlaybackCommand',
		props.isAlbumRoute ? 'album' : 'artist',
		props.isAlbumRoute
			? props.data?.album_track.at(0)?.id
			: props.data?.artist_track.at(0)?.id,
		props.data.id,
	);
}
</script>

<template>
	<button
		:data-track-id="data?.id"
		class="grid w-full justify-start items-center self-stretch pr-3 sm:px-3 rounded-lg hover:bg-surface-6/8 group/track text-sm font-medium py-2 z-0 group/track home-grid gap-2"
		data-target="track"
		tabindex="0"
		@click="handleClick()"
		@contextmenu="onTrackRowRightClick($event, route, data)"
	>
		<span class="flex w-10 justify-center text-center min-w-10">
			<span
				v-if="currentSong?.id !== data.id"
				class="group-focus-visible/track:sm:hidden group-hover/track:sm:hidden"
			>
				{{ index + 1 }}
			</span>
			<EqSpinner
				v-if="currentSong?.id === data.id"
				:playing="isPlaying"
				class="hidden group-focus-visible/track:sm:!hidden group-hover/track:sm:!hidden"
				color="var(--color-theme-8)"
			/>

			<PlayerIcon
				v-if="currentSong?.id === data.id && isPlaying"
				class="hidden h-6 w-6 group-focus-visible/track:sm:block group-hover/track:sm:block"
				icon="nmPause"
			/>
			<PlayerIcon
				v-else
				class="hidden h-6 w-6 group-focus-visible/track:sm:block group-hover/track:sm:block"
				icon="nmPlay"
			/>
		</span>

		<span
			class="flex h-12 items-center gap-2 overflow-hidden w-available sm:gap-4"
		>
			<CoverImage
				v-if="isAlbumRoute"
				:data="data"
				:size="100"
				class-name="relative hidden h-12 w-12 overflow-hidden min-w-[3rem] sm:block"
				loading="eager"
			/>
			<span class="flex h-full flex-col justify-evenly overflow-clip w-inherit">
				<span
					class="flex h-5 flex-nowrap overflow-clip text-left font-bold line-clamp-1 w-inherit"
				>
					{{ data.name }}
				</span>
				<span
					v-if="isFavoritesRoute"
					:data-size="musicSize"
					class="inline-flex h-5 w-fit gap-1 overflow-hidden whitespace-nowrap text-surface-9 line-clamp-1 text-2xs hover:animate-pause"
				>
					<TrackLinks
						v-if="data"
						:id="data.id"
						:data="data.artist_track"
						:onclick="(e: MouseEvent) => e.stopPropagation()"
						data-target="artist"
						type="artists"
					/>
				</span>
			</span>
		</span>

		<template v-if="data">
			<span
				v-for="item in data.album_track"
				:key="item.id"
				class="max-w-sm items-center overflow-clip pr-2 line-clamp-2 h-inherit w-inherit"
			>
				<RouterLink
					:onclick="(e: MouseEvent) => e.stopPropagation()"
					:to="item?.link"
					class="flex items-center gap-1 whitespace-nowrap text-xs font-semibold line-clamp-1 hover:underline focus:underline dark:font-medium"
					data-target="album"
					tabindex="0"
				>
					<span class="flex whitespace-nowrap">
						{{ item.name }}
					</span>
				</RouterLink>
			</span>
		</template>
		<span
			class="flex items-center justify-between gap-2 text-end"
		>
			<MediaLikeButton
				:key="data.id"
				:data="data"
				:onclick="(e: MouseEvent) => e.stopPropagation()"
				class="hidden sm:flex"
				color="var(--color-theme-8)"
			/>
			<span class="mr-4 monospace sm:mr-0">
				{{ data.duration }}
			</span>
		</span>

		<DropdownMenu direction="down">
			<template #button>
				<BannerButton class="mx-3" title="">
					<MoooomIcon class-name="relative h-5 w-5" icon="menuDotsVertical" />
				</BannerButton>
			</template>
		</DropdownMenu>
	</button>
</template>
