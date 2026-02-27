<script lang="ts" setup>
import audioPlayer, { ensureActiveDevice } from '@/store/audioPlayer';

import MusicButton from './MusicButton.vue';
import PlayerIcon from '@/components/Images/icons/PlayerIcon.vue';
import { user } from '@/store/user';
import { musicSocketConnection } from '@/store/musicSocket';

function handleClick(e?: MouseEvent) {
	e?.stopPropagation();
	if (!user.value.features?.nomercyConnect) {
		audioPlayer?.actions?.previous?.();
		return;
	}
	ensureActiveDevice();
	musicSocketConnection.value?.invoke('PlaybackCommand', 'previous', null);
}
</script>

<template>
	<MusicButton :onclick="handleClick" label="Previous" no-tooltip>
		<PlayerIcon class="absolute h-7 w-7 inset-1.5" icon="nmPreviousHalftone" />
		<PlayerIcon
			class="absolute h-7 w-7 opacity-0 group-hover/button:opacity-100 inset-1.5"
			icon="nmPrevious"
		/>
	</MusicButton>
</template>
