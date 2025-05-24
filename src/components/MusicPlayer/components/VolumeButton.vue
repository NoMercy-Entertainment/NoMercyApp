<script setup lang="ts">

import audioPlayer, {isMuted, volume} from '@/store/audioPlayer';
import {user} from "@/store/user";
import {musicSocketConnection} from "@/store/musicSocket";

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
    <MoooomIcon icon="volumeMuted" v-if="isMuted" class="h-6 w-6"/>
    <MoooomIcon icon="volumeOne" v-else-if="volume == 0" class="h-6 w-6"/>
    <MoooomIcon icon="volumeThree" v-else-if="volume > 50" class="h-6 w-6"/>
    <MoooomIcon icon="volumeTwo" v-else class="h-6 w-6"/>
  </MusicButton>
</template>
