<script setup lang="ts">
import audioPlayer from '@/store/audioPlayer';

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
	musicSocketConnection.value?.invoke('PlaybackCommand', 'previous', null);
}
</script>

<template>
	<MusicButton label="Previous" :onclick="handleClick">
		<PlayerIcon icon="nmPreviousHalftone" class="absolute h-7 w-7 inset-1.5" />
		<PlayerIcon
			icon="nmPrevious"
			class="absolute h-7 w-7 opacity-0 group-hover/button:opacity-100 inset-1.5"
		/>
	</MusicButton>
</template>
