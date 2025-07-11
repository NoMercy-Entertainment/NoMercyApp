<script setup lang="ts">
import type { PropType } from 'vue';
import { useLocalStorage } from '@vueuse/core';

import { defaultSubtitleStyles } from '@/lib/VideoPlayer/plugins/UIPlugin/buttons';
import type { SubtitleStyle } from '@nomercy-entertainment/nomercy-video-player/src/types';

const props = defineProps({
	title: {
		type: String,
		required: true,
	},
	type: {
		type: String as PropType<keyof SubtitleStyle>,
		required: true,
	},
	color: {
		type: String as PropType<keyof SubtitleStyle>,
		required: true,
	},
	min: {
		type: Number,
		required: true,
	},
	max: {
		type: Number,
		required: true,
	},
	step: {
		type: Number,
		required: true,
	},
});

const currentStyle = useLocalStorage<SubtitleStyle>(
	'nmplayer-subtitle-style',
	defaultSubtitleStyles,
);

function setCurrentValue(event: Event) {
	const value = Number.parseFloat((event.target as HTMLInputElement).value);

	currentStyle.value = {
		...currentStyle.value,
		[props.type]: value,
	};
}
</script>

<template>
	<div class="flex select-none flex-col gap-3 mb-1">
		<p class="font-bold">
			{{ $t(title) }}: {{ currentStyle[type] }}
		</p>
		<div class="flex flex-row gap-2 flex-1 my-2">
			<input
				id="sub"
				v-model="currentStyle[type]"
				type="range"
				:min="min"
				:max="max"
				:step="step"
				class="!w-available"
				:style="`--color: ${currentStyle[color]};`"
				@input="setCurrentValue($event)"
			>
		</div>
	</div>
</template>

<style lang="scss">
input[type='range']#sub {
	@apply bg-white #{!important};
}
input[type='range']#sub::-webkit-slider-runnable-track {
	@apply h-2 bg-[linear-gradient(45deg,transparent,var(--color))];
}
</style>
