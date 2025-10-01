<script lang="ts" setup>
import audioPlayer, { isMuted, volume } from '@/store/audioPlayer';
import { user } from '@/store/user';
import { musicSocketConnection, playerState } from '@/store/musicSocket';

import MusicButton from './MusicButton.vue';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';

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
		<MoooomIcon
			v-if="
				playerState?.muted_state === undefined
					? isMuted
					: playerState.muted_state
			"
			class="h-6 w-6"
			icon="volumeMuted"
		/>
		<MoooomIcon
			v-else-if="volume === 0"
			class="h-6 w-6"
			icon="volumeZero"
		/>
		<MoooomIcon
			v-else-if="volume > 30 && volume <= 70"
			class="h-6 w-6"
			icon="volumeTwo"
		/>
		<MoooomIcon
			v-else-if="volume > 70"
			class="h-6 w-6"
			icon="volumeThree"
		/>
		<MoooomIcon v-else class="h-6 w-6" icon="volumeOne" />
	</MusicButton>
</template>
