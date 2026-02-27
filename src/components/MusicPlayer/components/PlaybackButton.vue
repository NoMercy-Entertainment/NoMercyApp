<script lang="ts" setup>
import audioPlayer, { ensureActiveDevice, isPlaying } from '@/store/audioPlayer';

import MusicButton from './MusicButton.vue';
import PlayerIcon from '@/components/Images/icons/PlayerIcon.vue';
import { user } from '@/store/user';
import { musicSocketConnection } from '@/store/musicSocket';

function handleClick(e?: MouseEvent) {
	e?.stopPropagation();
	if (!user.value.features?.nomercyConnect) {
		isPlaying.value
			? audioPlayer?.actions?.pause?.()
			: audioPlayer?.actions?.play?.();
		return;
	}
	ensureActiveDevice();
	musicSocketConnection.value?.invoke(
		'PlaybackCommand',
		isPlaying.value ? 'pause' : 'play',
		null,
	);
}
</script>

<template>
	<MusicButton :onclick="handleClick" label="Toggle Playback" no-tooltip>
		<PlayerIcon v-if="isPlaying" class-name="h-9 w-9" icon="nmPause" />
		<PlayerIcon v-else class-name="h-9 w-9" icon="nmPlay" />
	</MusicButton>
</template>
