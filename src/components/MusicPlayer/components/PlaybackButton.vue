<script setup lang="ts">

import audioPlayer, {isPlaying} from '@/store/audioPlayer';

import MusicButton from './MusicButton.vue';
import PlayerIcon from '@/components/Images/icons/PlayerIcon.vue';

const handleClick = (e?: MouseEvent) => {
  e?.stopPropagation();

  isPlaying.value
      ? audioPlayer?.actions?.pause?.()
      : audioPlayer?.actions?.play?.();
}
</script>

<template>
  <MusicButton label="Toggle Playback" :onclick="handleClick">
    <PlayerIcon icon="nmPause" v-if="isPlaying" className="h-9 w-9"/>
    <PlayerIcon icon="nmPlay" v-else className="h-9 w-9"/>
  </MusicButton>
</template>
