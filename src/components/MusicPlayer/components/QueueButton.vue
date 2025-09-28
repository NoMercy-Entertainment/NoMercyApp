<script lang="ts" setup>
import { queueMenuOpen, toggleQueueMenuOpen } from '@/store/audioPlayer';

import MusicButton from './MusicButton.vue';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';

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
