<script setup lang="ts">

import audioPlayer, {isMuted, volume} from '@/store/audioPlayer';
import {user} from "@/store/user";
import {musicSocketConnection, playerState} from "@/store/musicSocket";

import MusicButton from './MusicButton.vue';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';

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
    <MoooomIcon icon="volumeMuted" v-if="playerState?.muted_state == undefined ? isMuted : playerState.muted_state" class="h-6 w-6"/>
    <MoooomIcon icon="volumeOne" v-else-if="playerState?.volume_percentage ?? volume == 0" class="h-6 w-6"/>
    <MoooomIcon icon="volumeThree" v-else-if="playerState?.volume_percentage ?? volume > 50" class="h-6 w-6"/>
    <MoooomIcon icon="volumeTwo" v-else class="h-6 w-6"/>
  </MusicButton>
</template>
