<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { useLocalStorage } from '@vueuse/core';

import type { PlaylistItem } from '@/types/musicPlayer';
import { user } from '@/store/user';

import serverClient from '@/lib/clients/serverClient';
import { setTitle } from '@/lib/stringArray';
import audioPlayer, { currentSong, musicSize, musicVisibility } from '@/store/audioPlayer';
import { currentServer } from '@/store/currentServer';
import sidebar from '@/store/sidebar';

import CoverImage from '@/components/MusicPlayer/components/CoverImage.vue';
import MediaLikeButton from '@/components/Buttons/MediaLikeButton.vue';

import DeviceButton from './components/DeviceButton.vue';
import NextButton from './components/NextButton.vue';
import PlaybackButton from './components/PlaybackButton.vue';
import PreviousButton from './components/PreviousButton.vue';
import ProgressBarContainer from './components/ProgressBarContainer.vue';
import QueueButton from './components/QueueButton.vue';
import RepeatButton from './components/RepeatButton.vue';
import ShuffleButton from './components/ShuffleButton.vue';
import StopButton from './components/StopButton.vue';
import TrackLinks from './components/TrackLinks.vue';
import VolumeContainer from './components/VolumeContainer.vue';
import LyricsButton from './components/LyricsButton.vue';
import Marquee from '@/components/Marquee.vue';
import EqButton from '@/components/MusicPlayer/components/EqButton.vue';

const dataAttribute = ref<any>();
const shouldSubmitPlayback = ref(true);
const supportsAudioContext = useLocalStorage(
	'nmplayer-music-supports-audio-context',
	false,
);

function createMusicDatasetAttribute(data: any) {
	if (!data)
		return;
	return JSON.stringify({
		id: data?.id,
		Artist: data?.Artist,
		host: data.host,
		track: `${data.libraryId}${data.folder}${data.filename}`,
		type: data?.type,
		favorite_track: data?.favorite_track,
		Album: data?.Album,
		playlists: data?.playlists,
	});
}

onMounted(() => {
	if (!currentServer.value)
		return;

	audioPlayer.on?.('song', (item) => {
		if (!item)
			return;

		shouldSubmitPlayback.value = true;

		if (item) {
			setTitle(
				`${item.name} - ${item.artist_track.at(0)?.name} - ${
					item.album_track.at(0)?.name
				}`,
			);
		}

		dataAttribute.value = createMusicDatasetAttribute(
			Object.keys(item as object)
				.filter(key => key !== 'lyrics')
				.reduce((obj, key) => {
					// @ts-ignore
					obj[key] = item[key];
					return obj;
				}, {}),
		);
	});

	audioPlayer.on?.('time', (data) => {
		if (Math.floor(data.percentage) === 50 && shouldSubmitPlayback.value) {
			shouldSubmitPlayback.value = false;

			if (!user.value.features?.nomercyConnect) {
				submitPlayback();
			}
		}
	});
});

async function submitPlayback() {
	if (!currentSong.value)
		return;

	await serverClient().post<PlaylistItem>(
		`music/tracks/${currentSong.value?.id}/playback`,
	);
}

const leftSize = computed(() => {
	if (sidebar.value === 'open') {
		return 100 / 4;
	}
	else if (sidebar.value === 'closed') {
		return 100 / 3.2;
	}
	return 100 / 3;
});
const centerSize = computed(() => {
	return 100 / 3;
});
const rightSize = computed(() => {
	if (sidebar.value === 'open') {
		return 100 / 2.9;
	}
	else if (sidebar.value === 'closed') {
		return 100 / 3;
	}
	return 100 / 3;
});
</script>

<template>
	<div
		id="fullPlayer"
		:data-music="musicVisibility"
		:data-sidebar="sidebar"
		:inert="musicVisibility === 'hidden'"
		class="bg-surface-12/3 hidden h-0 music-showing:h-20 flex-shrink-0 flex-grow-0 flex-row items-center justify-start gap-12 self-stretch pr-6 sidebar-closed:ml-16 sidebar-open:ml-64 rounded-lg m-2 mt-2 mb-4 pl-4 mx-5 transition-all duration-200 sm:flex 2xl:sidebar-open:ml-[16.3rem]"
	>
		<div
			v-if="currentSong"
			class="flex h-full w-full items-center gap-8 music-showing:transition-all music-showing:duration-75"
		>
			<div
				id="left"
				:style="{
					width: `${leftSize}%`,
				}"
				class="flex flex-grow items-center justify-start transition-width duration-200 gap-2 overflow-clip h-16"
				data-target="track"
			>
				<CoverImage
					v-if="currentSong"
					:data="currentSong"
					:size="100"
					class-name="w-14 h-14 max-h-14 !max-w-14 overflow-clip"
				/>

				<div
					v-if="currentSong"
					class="mx-4 flex flex-col overflow-hidden gap-0.5 w-available hover-animate-pause"
				>
					<Marquee :text="currentSong?.name" />
					<div
						:key="currentSong.id"
						:data-size="musicSize"
						class="inline-flex gap-1 overflow-hidden whitespace-nowrap text-xs w-available line-clamp-1 hover-animate-pause"
					>
						<TrackLinks
							v-if="currentSong"
							:id="currentSong.id"
							:key="currentSong.id"
							:data="currentSong.artist_track"
							suffix="player"
							type="artists"
						/>
					</div>
				</div>
				<MediaLikeButton
					:key="currentSong.id"
					:data="currentSong"
					class="hidden sm:flex"
					color="var(--color-theme-8)"
				/>
			</div>
			<div
				id="center"
				:style="{
					width: `${centerSize}%`,
				}"
				class="flex w-full flex-grow flex-col items-center justify-start transition-width duration-200"
			>
				<div class="flex justify-center">
					<div
						class="flex flex-shrink-0 flex-grow-0 items-center justify-center gap-2"
					>
						<ShuffleButton />
						<PreviousButton />
						<PlaybackButton class="children:h-10 h-12 children:w-10 w-12 !bg-surface-12/4 hover:!bg-surface-12/6" />
						<NextButton />
						<RepeatButton />
					</div>
				</div>
				<ProgressBarContainer />
			</div>
			<div
				id="right"
				:data-size="musicSize"
				:style="{
					width: `${rightSize}%`,
				}"
				class="relative flex flex-grow items-center justify-end gap-2 transition-width duration-200"
			>
				<StopButton />

				<LyricsButton />
				<QueueButton />
				<EqButton v-if="supportsAudioContext" />
				<DeviceButton />

				<VolumeContainer />
			</div>
		</div>
	</div>
</template>
