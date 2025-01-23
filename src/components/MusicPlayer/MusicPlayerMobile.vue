<script setup lang="ts">

import audioPlayer, { setMusicVisibility } from '@/store/audioPlayer';
import { VisibilityState } from '@/types/musicPlayer';
// import {pickPaletteColor} from '@/lib/colorHelper';
import FullPlayer from '@/components/MusicPlayer/mobile/FullPlayer.vue';
import MiniPlayer from '@/components/MusicPlayer/mobile/MiniPlayer.vue';

defineProps({
  menuOpen: {
    type: Boolean,
    required: false,
  },
});

audioPlayer.on?.('song', (item) => {
  if (item) {
    setMusicVisibility(VisibilityState.showing);

    // setMusicColor(pickPaletteColor(item?.color_palette.cover));

  } else {
    setMusicVisibility(VisibilityState.hidden);
  }
});
</script>

<template>
  <FullPlayer />
  <MiniPlayer :menuOpen="menuOpen" />
</template>
