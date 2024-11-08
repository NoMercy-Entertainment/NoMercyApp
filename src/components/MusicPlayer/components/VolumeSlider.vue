<script setup lang="ts">
import {ref, watch} from 'vue';

import audioPlayer, {volume} from '@/store/audioPlayer';

import SliderBar from '@/components/MusicPlayer/components/SliderBar.vue';

const volumePercentage = ref(audioPlayer.value?.volume);

watch(volume, (value) => {
  volumePercentage.value = value;
});

watch(volumePercentage, (value) => {
  audioPlayer.value?.setVolume(value);
});

</script>

<template>
  <SliderBar
      v-model="volumePercentage"
      :percentage="volumePercentage"
      :position="volumePercentage"
      :min="0"
      :max="100"
  />
</template>
