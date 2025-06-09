<script setup lang="ts">
import audioPlayer from "@/store/audioPlayer";

import MusicButton from './MusicButton.vue';
import PlayerIcon from '@/components/Images/icons/PlayerIcon.vue';
import {user} from "@/store/user";
import {musicSocketConnection} from "@/store/musicSocket";

const handleClick = (e?: MouseEvent) => {
  e?.stopPropagation();
  if (!user.value.features?.nomercyConnect) {
    audioPlayer?.actions?.next?.();
    return;
  }
  musicSocketConnection.value?.invoke('PlaybackCommand',
      'next',
      null
  );
}
</script>

<template>
  <MusicButton label="Next" :onclick="handleClick">
    <PlayerIcon icon="nmNextHalftone" class="absolute h-7 w-7 inset-1.5" />
    <PlayerIcon icon="nmNext" class="absolute h-7 w-7 opacity-0 group-hover/button:opacity-100 inset-1.5" />
  </MusicButton>
</template>
