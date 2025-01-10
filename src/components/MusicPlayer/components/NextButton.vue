<script setup lang="ts">

import MusicButton from './MusicButton.vue';
import audioPlayer from '@/store/audioPlayer';
import PlayerIcon from '@/components/Images/icons/PlayerIcon.vue';

const handleClick = (e?: MouseEvent) => {
  e?.stopPropagation();
  audioPlayer.next();
};
</script>

<template>
  <MusicButton label="Next" :onclick="handleClick">
    <PlayerIcon icon="nmNextHalftone" class="absolute h-7 w-7 inset-1.5"/>
    <PlayerIcon icon="nmNext" class="absolute h-7 w-7 opacity-0 group-hover/button:opacity-100 inset-1.5"/>
  </MusicButton>
</template>
