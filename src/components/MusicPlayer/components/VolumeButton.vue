<script setup lang="ts">
import audioPlayer, { isMuted, volume } from '@/store/audioPlayer';
import { user } from '@/store/user';
import { musicSocketConnection, playerState } from '@/store/musicSocket';

import MusicButton from './MusicButton.vue';
import OptimizedIcon from '@/components/OptimizedIcon.vue';

function handleClick(e?: MouseEvent) {
	e?.stopPropagation();
	if (!user.value.features?.nomercyConnect) {
		audioPlayer.toggleMute();
		return;
	}
	musicSocketConnection.value?.invoke(
		'PlaybackCommand',
		'mute',
		!isMuted.value,
	);
}
</script>

<template>
	<MusicButton label="Mute" :onclick="handleClick">
		<OptimizedIcon
			v-if="
				playerState?.muted_state === undefined
					? isMuted
					: playerState.muted_state
			"
			icon="volumeMuted"
			class="h-6 w-6"
		/>
		<OptimizedIcon
			v-else-if="playerState?.volume_percentage ?? volume === 0"
			icon="volumeOne"
			class="h-6 w-6"
		/>
		<OptimizedIcon
			v-else-if="playerState?.volume_percentage ?? volume > 50"
			icon="volumeThree"
			class="h-6 w-6"
		/>
		<OptimizedIcon v-else icon="volumeTwo" class="h-6 w-6" />
	</MusicButton>
</template>
