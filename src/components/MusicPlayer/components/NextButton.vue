<script lang="ts" setup>
import audioPlayer, { ensureActiveDevice } from '@/store/audioPlayer';

import MusicButton from './MusicButton.vue';
import PlayerIcon from '@/components/Images/icons/PlayerIcon.vue';
import { user } from '@/store/user';
import { musicSocketConnection } from '@/store/musicSocket';

function handleClick(e?: MouseEvent) {
	e?.stopPropagation();
	if (!user.value.features?.nomercyConnect) {
		audioPlayer?.actions?.next?.();
		return;
	}
	ensureActiveDevice();
	musicSocketConnection.value?.invoke('PlaybackCommand', 'next', null);
}
</script>

<template>
	<MusicButton :onclick="handleClick" label="Next" no-tooltip>
		<PlayerIcon class="absolute h-7 w-7 inset-1.5" icon="nmNextHalftone" />
		<PlayerIcon
			class="absolute h-7 w-7 opacity-0 group-hover/button:opacity-100 inset-1.5"
			icon="nmNext"
		/>
	</MusicButton>
</template>
