<script setup lang="ts">
import { MoooomIcons } from '@Icons/icons';

import {
	equalizerMenuOpen,
	toggleEqualizerMenuOpen,
} from '@/store/audioPlayer';

import MusicButton from './MusicButton.vue';
import OptimizedIcon from '@/components/OptimizedIcon.vue';

function handleClick(e?: MouseEvent) {
	e?.stopPropagation();
	toggleEqualizerMenuOpen();
}
</script>

<template>
	<MusicButton label="Equalizer" :onclick="handleClick">
		<OptimizedIcon
			:icon="MoooomIcons.faderOnOff"
			class="absolute h-7 w-7 inset-1.5"
			:class="{
				'text-focus': equalizerMenuOpen,
			}"
		/>
	</MusicButton>
</template>
