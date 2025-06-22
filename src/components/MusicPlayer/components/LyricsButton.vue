<script setup lang="ts">
import MusicButton from './MusicButton.vue';
import OptimizedIcon from '@/components/OptimizedIcon.vue';
import { lyricsMenuOpen, toggleLyricsMenuOpen } from '@/store/audioPlayer';

function toggleLyricsButton(e?: MouseEvent) {
	e?.stopPropagation();
	toggleLyricsMenuOpen();
}
</script>

<template>
	<MusicButton label="Lyrics" :onclick="toggleLyricsButton">
		<OptimizedIcon
			v-if="lyricsMenuOpen"
			icon="lyrics"
			class="h-6 w-6 text-focus"
		/>
		<OptimizedIcon v-else icon="lyrics" class="h-6 w-6" />
	</MusicButton>
</template>
