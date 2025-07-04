<script lang="ts" setup>
import type { PropType } from 'vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import i18next from 'i18next';

import type { PlaylistItem } from '@/types/musicPlayer';

import { isMobile } from '@/config/global';
import { musicSocketConnection } from '@/store/musicSocket';
import {
	audioPlayer,
	currentSong,
	isPlaying,
	musicSize,
} from '@/store/audioPlayer';
import { onTrackRowRightClick } from '@/store/contextMenuItems';

import EqSpinner from '@/components/Images/EqSpinner.vue';
import OptimizedIcon from '@/components/OptimizedIcon.vue';
import CoverImage from '@/components/MusicPlayer/components/CoverImage.vue';
import TrackLinks from '@/views/Music/List/components/TrackLinks.vue';
import MediaLikeButton from '@/components/Buttons/MediaLikeButton.vue';
import DropdownMenu from '@/Layout/Desktop/components/Menus/DropdownMenu.vue';
import BannerButton from '@/components/Buttons/BannerButton.vue';
import PlayerIcon from '@/components/Images/icons/PlayerIcon.vue';
import Marquee from '@/components/Marquee.vue';
import { user } from '@/store/user';

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
});

const route = useRoute();

const isAlbumRoute = computed(() => route.path.startsWith('/music/album'));
const isArtistRoute = computed(() => route.path.startsWith('/music/artist'));

function handleClick() {
	if (!user.value.features?.nomercyConnect) {
		audioPlayer.playTrack(props.data, props.displayList);
		return;
	}
	musicSocketConnection.value?.invoke(
		'StartPlaybackCommand',
		isAlbumRoute.value ? 'album' : 'artist',
		isAlbumRoute.value
			? props.data?.album_track.at(0)?.id
			: props.data?.artist_track.at(0)?.id,
		props.data.id,
	);
}
</script>

<template>
	<button
		:data-track-id="data?.id"
		:onclick="handleClick"
		class="grid justify-start children:pointer-events-none items-center self-stretch text-auto-12 pr-3 sm:px-3 rounded-lg sm:hover:bg-slate-lightA-6 dark:sm:hover:bg-slate-darkA-6 group/track text-sm font-medium py-2 z-10"
		:class="{
			'album-grid': isAlbumRoute,
			'artist-grid': !isAlbumRoute,
		}"
		data-target="track"
		tabindex="0"
		@contextmenu="onTrackRowRightClick($event, data)"
	>
		<span class="flex justify-center text-center">
			<span
				v-if="currentSong?.id !== data.id"
				class="group-focus-visible/track:sm:hidden group-hover/track:sm:hidden"
			>
				{{ index + 1 }}
			</span>
			<EqSpinner
				v-if="currentSong?.id === data.id"
				color="rgb(var(--color-focus))"
				:playing="isPlaying"
				class="hidden group-focus-visible/track:sm:!hidden group-hover/track:sm:!hidden"
			/>

			<PlayerIcon
				v-if="currentSong?.id === data.id && isPlaying"
				icon="nmPause"
				class="hidden h-6 w-6 group-focus-visible/track:sm:block group-hover/track:sm:block"
			/>
			<PlayerIcon
				v-else
				icon="nmPlay"
				class="hidden h-6 w-6 group-focus-visible/track:sm:block group-hover/track:sm:block"
			/>
		</span>

		<span
			class="flex h-12 items-center gap-2 overflow-hidden w-available sm:gap-4"
		>
			<CoverImage
				v-if="isAlbumRoute"
				:data="data"
				:size="100"
				:style="{
					display: isAlbumRoute ? 'none' : '',
				}"
				class-name="relative hidden h-12 w-12 overflow-hidden min-w-[3rem] sm:block"
				loading="eager"
			/>
			<span class="flex h-full flex-col justify-evenly overflow-clip w-inherit">
				<span
					class="flex h-6 flex-nowrap overflow-clip text-left line-clamp-1 w-inherit tracking-wide leading-6 px-2 py-1 -ml-2"
				>
					{{ data.name }}
				</span>
				<span
					:data-size="musicSize"
					class="inline-flex h-6 w-available gap-1 overflow-hidden whitespace-nowrap text-slate-light-3 dark:slate-dark-3 line-clamp-1 text-2xs hover:animate-pause leading-6"
				>
					<Marquee>
						<TrackLinks
							v-if="data && !isArtistRoute"
							:id="data.id"
							:data="data.artist_track"
							:onclick="(e: MouseEvent) => e.stopPropagation()"
							data-target="artist"
							type="artists"
						/>
						<TrackLinks
							v-if="data && !isAlbumRoute"
							:id="data.id"
							:data="data.album_track"
							:onclick="(e: MouseEvent) => e.stopPropagation()"
							data-target="album"
							type="albums"
						/>
					</Marquee>
				</span>
			</span>
		</span>

		<template v-for="item in data.album_track" :key="item.id">
			<span
				class="hidden items-center overflow-clip pr-2 line-clamp-2 h-inherit w-inherit sm:flex"
				:class="{
					'opacity-0': !isAlbumRoute,
					'opacity-100': isAlbumRoute,
				}"
				@click="(e) => e.stopPropagation()"
			>
				<RouterLink
					:to="item?.link"
					tabindex="0"
					data-target="album"
					class="flex items-center gap-1 whitespace-nowrap font-semibold line-clamp-1 hover:underline focus:underline dark:font-medium pointer-events-auto"
					no-ring
				>
					<span class="flex whitespace-nowrap">
						<Marquee :text="item.name" />
					</span>
				</RouterLink>
			</span>
		</template>
		<span class="hidden sm:flex invisible max-h-12 md:visible">
			{{
				data?.date
					? new Date(data?.date).toLocaleDateString(
						i18next.language ?? "en-US",
						{
							year: "numeric",
							month: "short",
							day: "2-digit",
						},
					)
					: $t("Unknown")
			}}
		</span>

		<span
			class="flex items-center justify-end gap-2 text-end"
			:class="{
				'mr-16': !isMobile,
			}"
		>
			<MediaLikeButton
				:key="data.id + data?.favorite"
				:data="data"
				color="var(--color-focus)"
			/>
			<span class="hidden sm:flex mr-4 monospace sm:mr-0">
				{{ data.duration }}
			</span>

			<DropdownMenu v-if="isMobile" direction="down">
				<template #button>
					<BannerButton class="" title="">
						<OptimizedIcon
							class-name="relative h-5 w-5"
							icon="menuDotsVertical"
						/>
					</BannerButton>
				</template>
				Hellooo
			</DropdownMenu>
		</span>
	</button>
</template>
