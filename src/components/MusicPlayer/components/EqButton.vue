<script lang="ts" setup>
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
	<MusicButton :onclick="handleClick" label="Equalizer">
		<OptimizedIcon
			:class="{
				'text-focus': equalizerMenuOpen,
			}"
			:icon="MoooomIcons.faderOnOff"
			class="absolute h-7 w-7 inset-1.5"
		/>
	</MusicButton>
</template>
