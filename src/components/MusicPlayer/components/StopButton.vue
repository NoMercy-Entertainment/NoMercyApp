<script setup lang="ts">
import audioPlayer from '@/store/audioPlayer';

import MusicButton from './MusicButton.vue';
import PlayerIcon from '@/components/Images/icons/PlayerIcon.vue';
import { user } from '@/store/user';
import { musicSocketConnection } from '@/store/musicSocket';

function handleClick(e?: MouseEvent) {
	e?.stopPropagation();
	if (!user.value.features?.nomercyConnect) {
		audioPlayer?.actions?.stop?.();
		return;
	}
	musicSocketConnection.value?.invoke('PlaybackCommand', 'stop', null);
}
</script>

<template>
	<MusicButton label="Stop" :onclick="handleClick">
		<PlayerIcon icon="nmStop" class="h-7 w-7" />
	</MusicButton>
</template>
