<script setup lang="ts">
import {computed, onUnmounted, PropType, ref, watch} from 'vue';

import type {AlbumResponse, ArtistResponse, DisplayList} from '@/types/api/music/musicPlayer';
import router from '@/router';
import audioPlayer, {currentPlaylist, currentSong, setCurrentPlaylist} from '@/store/audioPlayer';
import MusicButton from '@/components/Buttons/MusicButton.vue';
import PlayerIcon from '@/components/Images/icons/PlayerIcon.vue';

const props = defineProps({
  data: {
    type: Object as PropType<DisplayList | ArtistResponse | AlbumResponse | undefined>,
    required: true,
  },
  onkeyup: {
    type: Function as PropType<(e: KeyboardEvent) => void>,
    required: false,
  },
  className: {
    type: String,
    required: false,
    default: '',
  },
});

const isPlaying = ref(false);

const isCurrentPlaylist = computed(() => {
  return currentPlaylist.value == router.currentRoute.value.fullPath;
});

const setCurrentList = () => {
  setCurrentPlaylist(router.currentRoute.value.fullPath);
};

const handleClick = () => {

  if (props.data?.tracks?.[0]) {
    if (isCurrentPlaylist.value) {
      if (isPlaying.value) {
        audioPlayer.value?.pause();
      } else {
        audioPlayer.value?.play();
      }
    } else {
      audioPlayer.value?.setQueue([]);
      audioPlayer.value?.setBackLog([]);

      const song = props.data.tracks.find(track => track.id == currentSong.value?.id);

      if (currentSong.value?.id && song) {
        audioPlayer.value?.playTrack(song, props.data?.tracks ?? []);
      } else {
        audioPlayer.value?.playTrack(props.data?.tracks?.[0], props.data?.tracks ?? []);
      }

      setCurrentList();
      isPlaying.value = audioPlayer.value?.isPlaying ?? false;
    }
  }
};

const setIsPlaying = () => {
  if (isCurrentPlaylist.value) {
    isPlaying.value = audioPlayer.value?.isPlaying ?? false;
  }
};

watch(currentPlaylist, () => {
  if (isCurrentPlaylist.value) {
    isPlaying.value = audioPlayer.value?.isPlaying ?? false;
  }
});

watch(audioPlayer, () => {
  setIsPlaying();

  audioPlayer.value?.on?.('play', setIsPlaying);
  audioPlayer.value?.on?.('pause', setIsPlaying);
});

onUnmounted(() => {
  audioPlayer.value?.off('play', setIsPlaying);
  audioPlayer.value?.off('pause', setIsPlaying);
});

</script>

<template>
  <MusicButton label="Play"
               v-if="audioPlayer"
               id="playList"
               :onclick="handleClick"
               :onkeyup="onkeyup"
               :class="className"
               class="h-12 w-12 min-w-12 min-h-12 max-w-12 max-h-12 relative rounded-full overflow-clip !bg-focus">
    <PlayerIcon icon="nmPause" v-if="isPlaying" class="h-8 w-8 text-white"/>
    <PlayerIcon icon="nmPlay" v-else class="h-8 w-8 text-white"/>
  </MusicButton>
</template>
