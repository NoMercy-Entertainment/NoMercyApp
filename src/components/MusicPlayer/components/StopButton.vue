<script setup lang="ts">

import audioPlayer from '@/store/audioPlayer';

import MusicButton from './MusicButton.vue';
import PlayerIcon from '@/components/Images/icons/PlayerIcon.vue';

const handleClick = (e?: MouseEvent) => {
  e?.stopPropagation();

  audioPlayer?.actions?.stop?.();
}
</script>

<template>
  <MusicButton label="Stop" :onclick="handleClick">
    <PlayerIcon icon="nmStop" class="h-7 w-7" />
  </MusicButton>
</template>
