<script setup lang="ts">

import audioPlayer, {isPlaying} from '@/store/audioPlayer';

import MusicButton from './MusicButton.vue';
import PlayerIcon from '@/components/Images/icons/PlayerIcon.vue';
import {user} from "@/store/user";
import {musicSocketConnection} from "@/store/musicSocket";

const handleClick = (e?: MouseEvent) => {
  e?.stopPropagation();
  if (!user.value.features?.nomercyConnect) {
    isPlaying.value
        ? audioPlayer?.actions?.pause?.()
        : audioPlayer?.actions?.play?.();
    return;
  }
  musicSocketConnection.value?.invoke('PlaybackCommand',
      isPlaying.value ? 'pause' : 'play',
      null
  );
}
</script>

<template>
  <MusicButton label="Toggle Playback" :onclick="handleClick">
    <PlayerIcon icon="nmPause" v-if="isPlaying" className="h-9 w-9"/>
    <PlayerIcon icon="nmPlay" v-else className="h-9 w-9"/>
  </MusicButton>
</template>
