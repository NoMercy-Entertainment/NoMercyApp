<script lang="ts" setup>
import MusicButton from './MusicButton.vue';
import OptimizedIcon from '@/components/OptimizedIcon.vue';
import { lyricsMenuOpen, toggleLyricsMenuOpen } from '@/store/audioPlayer';

function toggleLyricsButton(e?: MouseEvent) {
	e?.stopPropagation();
	toggleLyricsMenuOpen();
}
</script>

<template>
	<MusicButton :onclick="toggleLyricsButton" label="Lyrics">
		<OptimizedIcon
			v-if="lyricsMenuOpen"
			class="h-6 w-6 text-focus"
			icon="lyrics"
		/>
		<OptimizedIcon v-else class="h-6 w-6" icon="lyrics" />
	</MusicButton>
</template>
