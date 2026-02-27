<script lang="ts" setup>
import audioPlayer, { ensureActiveDevice, isShuffling } from '@/store/audioPlayer';
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
	ensureActiveDevice();
	musicSocketConnection.value?.invoke('PlaybackCommand', 'shuffle', null);
}
</script>

<template>
	<MusicButton :onclick="handleClick" label="shuffle" no-tooltip>
		<PlayerIcon
			v-if="isShuffling"
			class="h-6 w-6 text-focus"
			icon="nmShuffle"
		/>
		<PlayerIcon v-else class="h-6 w-6" icon="nmShuffleHalftone" />
	</MusicButton>
</template>
