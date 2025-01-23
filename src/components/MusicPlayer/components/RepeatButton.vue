<script setup lang="ts">
import { onMounted } from 'vue';

import MusicButton from './MusicButton.vue';
import { useCycleList } from '@vueuse/core';
import audioPlayer from '@/store/audioPlayer';
import PlayerIcon from '@/components/Images/icons/PlayerIcon.vue';

const states = [
  'off',
  'one',
  'all',
];

const { state, next, go } = useCycleList<'off' | 'one' | 'all'>([
  'off',
  'one',
  'all',
]);

onMounted(() => {
  if (!audioPlayer._repeat) return;
  go(states.indexOf(audioPlayer._repeat));

});

const handleClick = (e?: MouseEvent) => {
  e?.stopPropagation();
  next();
  audioPlayer.repeat(state.value);
};
</script>

<template>
  <MusicButton :label="`repeat ${state}`" :key="state" :onclick="handleClick">
    <PlayerIcon icon="nmRepeatHalftone" v-if="state == 'off'" class="h-6 w-6" />
    <PlayerIcon icon="nmRepeat" v-else-if="state == 'one'" class="h-6 w-6 text-focus" />
    <PlayerIcon icon="nmRepeatdoublearrowHalftone" v-else-if="state == 'all'" class="h-6 w-6 text-focus" />
  </MusicButton>
</template>
