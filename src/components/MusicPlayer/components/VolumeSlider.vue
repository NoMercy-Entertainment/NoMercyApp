<script setup lang="ts">
import { ref, watch } from 'vue';

import { audioPlayer, ensureActiveDevice, volume } from '@/store/audioPlayer';

import SliderBar from '@/components/MusicPlayer/components/SliderBar.vue';
import { musicSocketConnection } from '@/store/musicSocket';
import { useDebounce } from '@vueuse/core/index';

const seekValue = ref(0);
const debouncedSeekValue = useDebounce(seekValue, 50);

watch(debouncedSeekValue, (value) => {
	ensureActiveDevice();
	musicSocketConnection.value?.invoke('ChangeVolumeCommand', value);
});

function seek(value: number) {
	seekValue.value = value;
	volume.value = value;
	audioPlayer.setVolume(seekValue.value);
}
</script>

<template>
	<SliderBar
		:percentage="volume"
		:value="volume"
		:min="0"
		:step="1"
		:max="100"
		@input="seek(Number(($event.target as HTMLInputElement).value))"
	/>
</template>
