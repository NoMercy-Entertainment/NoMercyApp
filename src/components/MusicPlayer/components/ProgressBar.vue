<script setup lang="ts">
import {ref, watch} from 'vue';
import {useDebounce} from '@vueuse/core';

import audioPlayer, {currentTime, duration, percentage} from '@/store/audioPlayer';

import SliderBar from '@/components/MusicPlayer/components/SliderBar.vue';

defineProps({
	color: {
		type: String,
		required: false,
	},
});


const seekValue = ref(0);
const debouncedSeekValue = useDebounce(seekValue, 50);

watch(debouncedSeekValue, (value) => {
    audioPlayer.value?.seek(value);
});

const seek = (value: number) => {
  seekValue.value = value;
  percentage.value = value / duration.value * 100;
};

</script>

<template>
  <SliderBar
      :percentage="percentage"
      :position="currentTime"
      :min="0"
      :max="duration"
      @input="seek(Number(($event.target as HTMLInputElement).value))"
  />
</template>
