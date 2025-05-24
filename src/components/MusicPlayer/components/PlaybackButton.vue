<script setup lang="ts">

import audioPlayer, {currentDeviceId, isPlaying} from '@/store/audioPlayer';
import {musicSocketConnection} from "@/store/musicSocket";
import {user} from "@/store/user";

import MusicButton from './MusicButton.vue';
import PlayerIcon from '@/components/Images/icons/PlayerIcon.vue';
import {deviceId} from "@/store/deviceInfo";

const handleClick = (e?: MouseEvent) => {
  e?.stopPropagation();
  if (!user.value.features?.nomercyConnect) {
    audioPlayer.togglePlayback();
    return;
  }
  if(!currentDeviceId.value) {
    musicSocketConnection.value?.invoke('ChangeDeviceCommand', deviceId.value)
        .then(() => {
          console.log('Switched to device:', deviceId.value);
        })
        .catch((error) => {
          console.error('Error switching device:', error);
        });
  }
  musicSocketConnection.value?.invoke('PlaybackCommand',
      isPlaying.value ? 'pause' : 'play',
      null
  );
};

</script>

<template>
  <MusicButton label="Toggle Playback" :onclick="handleClick">
    <PlayerIcon icon="nmPause" v-if="isPlaying" className="h-9 w-9"/>
    <PlayerIcon icon="nmPlay" v-else className="h-9 w-9"/>
  </MusicButton>
</template>
