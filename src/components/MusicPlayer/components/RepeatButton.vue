<script setup lang="ts">
import { onMounted } from 'vue';
import { useCycleList } from '@vueuse/core';

import audioPlayer, {isRepeating} from '@/store/audioPlayer';
import {musicSocketConnection} from "@/store/musicSocket";
import {user} from "@/store/user";
import MusicButton from './MusicButton.vue';

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
  if (!user.value.features?.nomercyConnect) {
    next();
    audioPlayer.repeat(state.value);
    return;
  }
  musicSocketConnection.value?.invoke('PlaybackCommand',
      'repeat',
      null
  );
};
</script>

<template>
  <MusicButton :label="`repeat ${isRepeating}`" :key="isRepeating" :onclick="handleClick">
    <PlayerIcon icon="nmRepeatHalftone" v-if="isRepeating == 'off'" class="h-6 w-6" />
    <PlayerIcon icon="nmRepeat" v-else-if="isRepeating == 'one'" class="h-6 w-6 text-focus" />
    <PlayerIcon icon="nmRepeatdoublearrowHalftone" v-else-if="isRepeating == 'all'" class="h-6 w-6 text-focus" />
  </MusicButton>
</template>
