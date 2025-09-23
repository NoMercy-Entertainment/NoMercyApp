<script lang="ts" setup>
import { equalizerMenuOpen } from '@/store/audioPlayer';

import EqualizerPanel from '@/components/MusicPlayer/components/EqualizerPannel.vue';
</script>

<template>
	<div
		:data-open="equalizerMenuOpen"
		:inert="!equalizerMenuOpen"
		class="absolute right-4 top-4 bottom-8 sm:bottom-4 overflow-clip ml-4 mt-auto bg-surface-1 dark:bg-surface-10 flex items-center justify-center rounded-lg transition-transform duration-500 border-2 border-focus data-[open='false']:translate-y-[150%] z-[9999] h-fit w-fit"
	>
		<EqualizerPanel />
	</div>
</template>

<style scoped>
input[type='range'].vertical {
	writing-mode: vertical-lr;
}
</style>
