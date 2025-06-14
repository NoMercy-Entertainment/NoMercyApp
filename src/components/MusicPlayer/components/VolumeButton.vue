<script setup lang="ts">

import audioPlayer, {isMuted, volume} from '@/store/audioPlayer';
import {user} from "@/store/user";
import {musicSocketConnection, playerState} from "@/store/musicSocket";

import MusicButton from './MusicButton.vue';
import OptimizedIcon from '@/components/OptimizedIcon.vue';

const handleClick = (e?: MouseEvent) => {
  e?.stopPropagation();
  if (!user.value.features?.nomercyConnect) {
    audioPlayer.toggleMute();
    return;
  }
  musicSocketConnection.value?.invoke('PlaybackCommand',
      'mute',
      !isMuted.value
  );
};
</script>

<template>
  <MusicButton label="Mute" :onclick="handleClick">
    <OptimizedIcon icon="volumeMuted" v-if="playerState?.muted_state == undefined ? isMuted : playerState.muted_state" class="h-6 w-6"/>
    <OptimizedIcon icon="volumeOne" v-else-if="playerState?.volume_percentage ?? volume == 0" class="h-6 w-6"/>
    <OptimizedIcon icon="volumeThree" v-else-if="playerState?.volume_percentage ?? volume > 50" class="h-6 w-6"/>
    <OptimizedIcon icon="volumeTwo" v-else class="h-6 w-6"/>
  </MusicButton>
</template>
