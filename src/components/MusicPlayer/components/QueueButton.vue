<script setup lang="ts">
import OptimizedIcon from '@/components/OptimizedIcon.vue';
import MusicButton from './MusicButton.vue';
import { queueMenuOpen, toggleQueueMenuOpen } from '@/store/audioPlayer';

function handleClick(e?: MouseEvent) {
	e?.stopPropagation();
	toggleQueueMenuOpen();
}
</script>

<template>
	<MusicButton label="Queue" :onclick="handleClick">
		<OptimizedIcon
			v-if="queueMenuOpen"
			icon="currentPlaylist"
			class="h-6 w-6 text-focus"
		/>
		<OptimizedIcon v-else icon="currentPlaylist" class="h-6 w-6" />
	</MusicButton>
</template>
