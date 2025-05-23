<script setup lang="ts">

import audioPlayer, { setDeviceMenuOpen, setLyricsMenuOpen, setQueueMenuOpen } from '@/store/audioPlayer';
import {musicSocketConnection} from "@/store/musicSocket";
import {user} from "@/store/user";

import MusicButton from './MusicButton.vue';
import PlayerIcon from '@/components/Images/icons/PlayerIcon.vue';

const handleClick = (e?: MouseEvent) => {
  e?.stopPropagation();
  setLyricsMenuOpen(false);
  setQueueMenuOpen(false);
  setDeviceMenuOpen(false);
  if (!user.value.features?.nomercyConnect) {
    audioPlayer.stop();
    return;
  }
  musicSocketConnection.value?.invoke('PlaybackCommand',
      'stop',
      null
  );
};
</script>

<template>
  <MusicButton label="Stop" :onclick="handleClick">
    <PlayerIcon icon="nmStop" class="h-7 w-7" />
  </MusicButton>
</template>
