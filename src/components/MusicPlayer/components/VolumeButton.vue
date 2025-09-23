<script lang="ts" setup>
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
	<MusicButton :onclick="handleClick" label="Mute" no-tooltip>
		<OptimizedIcon
			v-if="
				playerState?.muted_state === undefined
					? isMuted
					: playerState.muted_state
			"
			class="h-6 w-6"
			icon="volumeMuted"
		/>
		<OptimizedIcon
			v-else-if="playerState?.volume_percentage ?? volume === 0"
			class="h-6 w-6"
			icon="volumeOne"
		/>
		<OptimizedIcon
			v-else-if="playerState?.volume_percentage ?? volume > 50"
			class="h-6 w-6"
			icon="volumeThree"
		/>
		<OptimizedIcon v-else class="h-6 w-6" icon="volumeTwo" />
	</MusicButton>
</template>
