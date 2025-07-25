<script setup lang="ts">
import type { PropType } from 'vue';
import { computed } from 'vue';

import type {
	AlbumResponse,
	ArtistResponse,
	DisplayList,
} from '@/types/api/music/musicPlayer';
import audioPlayer, {
	currentMusicDeviceId,
	currentPlaylist,
	currentSong,
	isPlaying,
	setCurrentPlaylist,
} from '@/store/audioPlayer';

import PlayerIcon from '@/components/Images/icons/PlayerIcon.vue';
import MusicButton from '@/components/MusicPlayer/components/MusicButton.vue';
import { musicSocketConnection } from '@/store/musicSocket';
import { user } from '@/store/user';
import { deviceId } from '@/store/deviceInfo';

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
		audioPlayer.playTrack(props.data.tracks.at(0)!, props.data.tracks);
		setCurrentPlaylist(playlistName.value);
		return;
	}

	if (!currentMusicDeviceId.value) {
		musicSocketConnection.value
			?.invoke('ChangeDeviceCommand', deviceId.value)
			.then(() => {
				console.log('Switched to device:', deviceId.value);
			})
			.catch((error) => {
				console.error('Error switching device:', error);
			});
	}

	const trackId = props.data.tracks.some(t => t.id === currentSong.value?.id)
		? currentSong.value?.id
		: props.data.tracks.at(0)?.id;

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
		label="Play"
		:onclick="handleClick"
		:onkeyup="onkeyup"
		:class="className"
		class="h-12 w-12 min-w-12 min-h-12 max-w-12 max-h-12 relative !rounded-full overflow-clip !bg-focus transition-all duration-200 shadow-[0_1px_0_0_rgba(255,255,255,0.20)_inset,0_-1px_0_0_rgba(var(--color-slate-9)/60%)_inset,0_22px_30px_-4px_rgba(var(--color-slate-9)/70%)] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.20)_inset,0_-1px_0_0_rgba(var(--color-slate-1)/30%)_inset,0_22px_30px_-4px_rgba(var(--color-slate-1)/70%)] hover:shadow-[0_1px_0_0_rgba(255,255,255,0.20)_inset,0_-1px_0_0_rgba(var(--color-slate-11)/60%)_inset,0_22px_30px_-4px_rgba(var(--color-slate-11)/70%)] dark:hover:shadow-[0_1px_0_0_rgba(255,255,255,0.20)_inset,0_-1px_0_0_rgba(var(--color-slate-1)/30%)_inset,0_22px_30px_-4px_rgba(var(--color-slate-1)/70%)] active:!bg-focus focus-visible:!bg-focus hover:!bg-focus dark:active:!bg-focus dark:focus-visible:!bg-focus dark:sm:hover:!bg-focus active:!shadow-none active:!dark:shadow-none"
	>
		<PlayerIcon
			v-if="isPlaying && currentPlaylist === playlistName"
			icon="nmPause"
			class="h-8 w-8 text-white"
		/>
		<PlayerIcon v-else icon="nmPlay" class="h-8 w-8 text-white" />
	</MusicButton>
</template>
