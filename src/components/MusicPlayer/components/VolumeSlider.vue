<script setup lang="ts">
import {ref, watch} from 'vue';

import audioPlayer from '@/store/audioPlayer';

import SliderBar from '@/components/MusicPlayer/components/SliderBar.vue';

const volumePercentage = ref<number>(audioPlayer.value?.volume ?? 0);

// watch(volume, (value) => {
//   volumePercentage.value = value;
// });

function calculateLogVolume(sliderValue: number, p = 1.5) {
  const normalizedValue = sliderValue / 100;
  return Math.pow(normalizedValue, p) * 100;
}

watch(volumePercentage, (value) => {
  const volume = calculateLogVolume(value);
  audioPlayer.value?.setVolume(volume);
});

</script>

<template>
  <SliderBar
      v-model="volumePercentage"
      :percentage="volumePercentage"
      :position="volumePercentage"
      :min="0"
      :step="1"
      :max="100"
  />
</template>
