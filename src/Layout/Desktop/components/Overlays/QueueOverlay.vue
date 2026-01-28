<script lang="ts" setup>
import type { PlaylistItem } from '@/types/musicPlayer';

import audioPlayer, {
	currentPlaylist,
	currentSong,
	musicSize,
	queue,
	queueMenuOpen,
	setCurrentPlaylist,
} from '@/store/audioPlayer';
import { musicSocketConnection } from '@/store/musicSocket';
import { user } from '@/store/user';

import { MoooomIcons } from '@Icons/icons';
import ScrollContainer from '@/Layout/Desktop/components/ScrollContainer.vue';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';
import QueueTrackItem from './QueueTrackItem.vue';

function handleClick(song: PlaylistItem) {
	if (!queue.value)
		return;

	const playlistName = `${song.type?.replace(/s$/u, '')}/${song.id}`;

	if (!user.value.features?.nomercyConnect) {
		audioPlayer.addToBackLog(audioPlayer.currentSong);

		if (audioPlayer._queue?.length > 0) {
			let nexItem = audioPlayer._queue[0];

			if (audioPlayer._shuffle) {
				const index = Math.round(
					Math.random() * (audioPlayer._queue.length - 1),
				);
				nexItem = audioPlayer._queue[index];
			}

			audioPlayer.setCurrentSong(nexItem);
			audioPlayer.removeFromQueue(nexItem);
			return;
		}
	}

	musicSocketConnection.value?.invoke(
		'StartPlaybackCommand',
		song.type.replace(/s$/u, ''),
		song.id,
		queue.value?.at(0)?.id,
	);
	if (currentPlaylist.value === playlistName) {
		audioPlayer.togglePlayback();
		return;
	}
	audioPlayer.playTrack(song, queue.value);
	setCurrentPlaylist(playlistName);
}
</script>

<template>
	<aside
		:data-open="queueMenuOpen"
		:data-size="musicSize"
		:inert="!queueMenuOpen"
		class="absolute right-4 top-safe-offset-4 bottom-8 data-[open='true']:full:bottom-28 data-[open='true']:compact:bottom-16 sm:data-[open='true']:full:bottom-4 sm:data-[open='true']:compact:bottom-4 sm:bottom-4 overflow-clip w-available ml-4 sm:w-1/3 bg-surface-3 dark:bg-surface-1 flex items-center justify-center rounded-lg transition-all duration-500 border-2 border-focus data-[open='false']:translate-x-[150%] z-[29999] before:content-[''] before:pointer-events-none before:absolute before:inset-0 before:rounded-lg before:opacity-60 before:bg-surface-10/40"
	>
		<article
			v-if="currentSong"
			id="queue_container"
			class="flex w-full flex-col px-4 h-available overflow-clip pb-4"
		>
			<!-- Now Playing Header -->
			<header class="flex w-full items-center justify-between p-2 pr-6">
				<h2 class="text-lg font-semibold">
					{{ $t("Now Playing") }}
				</h2>
				<RouterLink
					v-if="currentPlaylist"
					:to="currentPlaylist"
					class="text-sm font-semibold flex gap-1 items-center hover:underline underline-offset-2"
				>
					<span>{{ $t("View Playlist") }}</span>
					<MoooomIcon :icon="MoooomIcons.shareSquare" class-name="w-4 h-4" />
				</RouterLink>
			</header>

			<!-- Current Song -->
			<QueueTrackItem :song="currentSong" />

			<!-- Queue Header -->
			<header class="mt-2 mb-1 flex w-full items-center justify-between px-2">
				<h2 class="text-lg font-semibold">
					{{ $t("Queue") }}
				</h2>
			</header>

			<!-- Queue List -->
			<section
				class="flex w-full flex-col items-start justify-start gap-4 relative overflow-hidden h-available"
			>
				<ScrollContainer :auto-hide="true" :static="false">
					<QueueTrackItem
						v-for="song in queue"
						v-show="song.id !== currentSong?.id"
						:key="song?.id"
						:song="song"
						:on-click="() => handleClick(song)"
					/>
				</ScrollContainer>
			</section>
		</article>
	</aside>
</template>
