<script setup lang="ts">
import audioPlayer, { isShuffling } from '@/store/audioPlayer';
import { musicSocketConnection } from '@/store/musicSocket';
import { user } from '@/store/user';

import MusicButton from './MusicButton.vue';
import PlayerIcon from '@/components/Images/icons/PlayerIcon.vue';

function handleClick(e?: MouseEvent) {
	e?.stopPropagation();
	if (!user.value.features?.nomercyConnect) {
		audioPlayer.shuffle(!isShuffling.value);
		return;
	}
	musicSocketConnection.value?.invoke('PlaybackCommand', 'shuffle', null);
}
</script>

<template>
	<MusicButton label="shuffle" :onclick="handleClick">
		<PlayerIcon
			v-if="isShuffling"
			icon="nmShuffle"
			class="h-6 w-6 text-focus"
		/>
		<PlayerIcon v-else icon="nmShuffleHalftone" class="h-6 w-6" />
	</MusicButton>
</template>
