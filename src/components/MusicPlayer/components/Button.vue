<script setup lang="ts">
import MusicButton from './MusicButton.vue';
import audioPlayer, { ensureActiveDevice, isPlaying } from '@/store/audioPlayer';
import { musicSocketConnection } from '@/store/musicSocket';
import { user } from '@/store/user';

function handleClick() {
	if (!user.value.features?.nomercyConnect) {
		audioPlayer?.togglePlayback();
		return;
	}
	ensureActiveDevice();
	musicSocketConnection.value?.invoke('PlaybackCommand', isPlaying.value ? 'pause' : 'play', null);
}
</script>

<template>
	<MusicButton label="" :onclick="handleClick" />
</template>
