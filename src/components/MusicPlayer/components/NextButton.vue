<script setup lang="ts">

import audioPlayer from "@/store/audioPlayer";

import MusicButton from './MusicButton.vue';
import PlayerIcon from '@/components/Images/icons/PlayerIcon.vue';

</script>

<template>
  <MusicButton label="Next" :onclick="audioPlayer.actions.next">
    <PlayerIcon icon="nmNextHalftone" class="absolute h-7 w-7 inset-1.5" />
    <PlayerIcon icon="nmNext" class="absolute h-7 w-7 opacity-0 group-hover/button:opacity-100 inset-1.5" />
  </MusicButton>
</template>
