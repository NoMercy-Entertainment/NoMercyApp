<script setup lang="ts">
import type { PropType } from 'vue';
import { ref, watch } from 'vue';
import { useDebounce } from '@vueuse/core';

import audioPlayer, {
	currentTime,
	duration,
	percentage,
} from '@/store/audioPlayer';

import SliderBar from '@/components/MusicPlayer/components/SliderBar.vue';
import { musicSocketConnection } from '@/store/musicSocket';

defineProps({
	color: {
		type: String,
		required: false,
	},
	onKeyDown: {
		type: Function as PropType<(event: KeyboardEvent) => void>,
		required: false,
	},
	onKeyUp: {
		type: Function as PropType<(event: KeyboardEvent) => void>,
		required: false,
	},
});

const seekValue = ref(0);
const debouncedSeekValue = useDebounce(seekValue, 200);

watch(debouncedSeekValue, (value) => {
	musicSocketConnection.value?.invoke('PlaybackCommand', 'seek', value);
});

function seek(value: number) {
	seekValue.value = value;
	audioPlayer.seek(value);
}
</script>

<template>
	<SliderBar
		:percentage="percentage"
		:value="currentTime"
		:min="0"
		:on-key-down="onKeyDown"
		:on-key-up="onKeyUp"
		:max="duration"
		@input="seek(Number(($event.target as HTMLInputElement).value))"
	/>
</template>
