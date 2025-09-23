<script lang="ts" setup>
import OptimizedIcon from '@/components/OptimizedIcon.vue';
import MusicButton from './MusicButton.vue';
import { queueMenuOpen, toggleQueueMenuOpen } from '@/store/audioPlayer';

function handleClick(e?: MouseEvent) {
	e?.stopPropagation();
	toggleQueueMenuOpen();
}
</script>

<template>
	<MusicButton :onclick="handleClick" label="Queue">
		<OptimizedIcon
			v-if="queueMenuOpen"
			class="h-6 w-6 text-focus"
			icon="currentPlaylist"
		/>
		<OptimizedIcon v-else class="h-6 w-6" icon="currentPlaylist" />
	</MusicButton>
</template>
