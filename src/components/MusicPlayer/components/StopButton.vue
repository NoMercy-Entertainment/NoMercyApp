<script lang="ts" setup>
import audioPlayer, { ensureActiveDevice } from '@/store/audioPlayer';

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
	ensureActiveDevice();
	musicSocketConnection.value?.invoke('PlaybackCommand', 'stop', null);
}
</script>

<template>
	<MusicButton :onclick="handleClick" label="Stop" no-tooltip>
		<PlayerIcon class="h-7 w-7" icon="nmStop" />
	</MusicButton>
</template>
