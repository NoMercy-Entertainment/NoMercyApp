<script lang="ts" setup>
import MusicButton from './MusicButton.vue';
import { queueMenuOpen, toggleQueueMenuOpen } from '@/store/audioPlayer';

function handleClick(e?: MouseEvent) {
	e?.stopPropagation();
	toggleQueueMenuOpen();
}
</script>

<template>
	<MusicButton :onclick="handleClick" label="Queue">
		<MoooomIcon
			v-if="queueMenuOpen"
			class="h-6 w-6 text-focus"
			icon="currentPlaylist"
		/>
		<MoooomIcon v-else class="h-6 w-6" icon="currentPlaylist" />
	</MusicButton>
</template>
