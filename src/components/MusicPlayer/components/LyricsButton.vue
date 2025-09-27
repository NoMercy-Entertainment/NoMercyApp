<script lang="ts" setup>
import MusicButton from './MusicButton.vue';
import { lyricsMenuOpen, toggleLyricsMenuOpen } from '@/store/audioPlayer';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';

function toggleLyricsButton(e?: MouseEvent) {
	e?.stopPropagation();
	toggleLyricsMenuOpen();
}
</script>

<template>
	<MusicButton :onclick="toggleLyricsButton" label="Lyrics">
		<MoooomIcon
			v-if="lyricsMenuOpen"
			class="h-6 w-6 text-focus"
			icon="lyrics"
		/>
		<MoooomIcon v-else class="h-6 w-6" icon="lyrics" />
	</MusicButton>
</template>
