<script lang="ts" setup>
import type { PropType } from 'vue';
import { computed } from 'vue';

import type { AlbumResponse, ArtistResponse, DisplayList } from '@/types/api/music/musicPlayer';
import audioPlayer, {
	currentPlaylist,
	currentSong,
	ensureActiveDevice,
	isPlaying,
	setCurrentPlaylist,
} from '@/store/audioPlayer';

import PlayerIcon from '@/components/Images/icons/PlayerIcon.vue';
import MusicButton from '@/components/MusicPlayer/components/MusicButton.vue';
import { musicSocketConnection } from '@/store/musicSocket';
import { user } from '@/store/user';
import { sortByType } from '@/lib/utils/array';
import { setSortOrder, sortOrder, sortType } from '@/store/ui';

const props = defineProps({
	data: {
		type: Object as PropType<
        DisplayList | ArtistResponse | AlbumResponse | undefined
		>,
		required: true,
	},
	onkeyup: {
		type: Function as PropType<(e: KeyboardEvent) => void>,
		required: false,
	},
	className: {
		type: String,
		required: false,
		default: '',
	},
});

const playlistName = computed(
	() => `/music/${props.data?.type?.replace(/s$/u, '')}/${props.data?.id}`,
);

function handleClick() {
	if (!props.data?.tracks)
		return;

	if (!user.value.features?.nomercyConnect) {
		if (currentPlaylist.value === playlistName.value) {
			audioPlayer.togglePlayback();
			return;
		}
		const sorted = sortByType(props.data.tracks, sortType.value, sortOrder.value, setSortOrder);
		audioPlayer.playTrack(sorted.at(0)!, sorted);
		setCurrentPlaylist(playlistName.value);
		return;
	}

	ensureActiveDevice();

	const sorted = sortByType(props.data.tracks, sortType.value, sortOrder.value, setSortOrder);
	const trackId = sorted.some(t => t.id === currentSong.value?.id)
		? currentSong.value?.id
		: sorted.at(0)?.id;

	musicSocketConnection.value?.invoke(
		'StartPlaybackCommand',
		props.data.type.replace(/s$/u, ''),
		props.data.id,
		trackId,
	);
}
</script>

<template>
	<MusicButton
		v-if="audioPlayer"
		id="playList"
		:class="className"
		:onclick="handleClick"
		:onkeyup="onkeyup"
		class="h-12 w-12 min-w-12 min-h-12 max-w-12 max-h-12 relative !rounded-full overflow-clip !bg-focus transition-all duration-200 shadow-[0_1px_0_0_rgba(255,255,255,0.20)_inset,0_-1px_0_0_rgba(from_var(--color-slate-9)_g_g_b/60%)_inset,0_22px_30px_-4px_rgba(from_var(--color-slate-9)_g_g_b/70%)] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.20)_inset,0_-1px_0_0_rgba(from_var(--color-slate-1)_g_g_b/30%)_inset,0_22px_30px_-4px_rgba(from_var(--color-slate-1)_g_g_b/70%)] hover:shadow-[0_1px_0_0_rgba(255,255,255,0.20)_inset,0_-1px_0_0_rgba(from_var(--color-slate-11)_g_g_b/60%)_inset,0_22px_30px_-4px_rgba(from_var(--color-slate-11)_g_g_b/70%)] dark:hover:shadow-[0_1px_0_0_rgba(255,255,255,0.20)_inset,0_-1px_0_0_rgba(from_var(--color-slate-1)_g_g_b/30%)_inset,0_22px_30px_-4px_rgba(from_var(--color-slate-1)_g_g_b/70%)] active:!bg-focus focus-visible:!bg-focus hover:!bg-focus dark:active:!bg-focus dark:focus-visible:!bg-focus dark:sm:hover:!bg-focus active:!shadow-none active:!dark:shadow-none text-white"
		label="Play"
		no-tooltip
	>
		<PlayerIcon
			v-if="isPlaying && currentPlaylist === playlistName"
			class="h-8 w-8"
			icon="nmPause"
		/>
		<PlayerIcon v-else class="h-8 w-8" icon="nmPlay" />
	</MusicButton>
</template>
