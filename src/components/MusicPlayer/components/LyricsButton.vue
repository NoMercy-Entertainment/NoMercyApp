<script setup lang="ts">

import MusicButton from './MusicButton.vue';
import OptimizedIcon from '@/components/OptimizedIcon.vue';
import { lyricsMenuOpen, toggleLyricsMenuOpen } from '@/store/audioPlayer';

const toggleLyricsButton = (e?: MouseEvent) => {
  e?.stopPropagation();
  toggleLyricsMenuOpen();
};

</script>

<template>
  <MusicButton label="Lyrics" :onclick="toggleLyricsButton">    <OptimizedIcon icon="lyrics" class="h-6 w-6 text-focus" v-if="lyricsMenuOpen" />
    <OptimizedIcon icon="lyrics" class="h-6 w-6" v-else />
  </MusicButton>
</template>
