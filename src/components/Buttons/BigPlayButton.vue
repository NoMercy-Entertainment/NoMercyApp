<script setup lang="ts">
import {computed, onUnmounted, PropType, ref, watch} from 'vue';

import type {AlbumResponse, ArtistResponse, DisplayList} from '@/types/api/music/musicPlayer';
import audioPlayer, {currentPlaylist, currentSong, setCurrentPlaylist, isPlaying} from '@/store/audioPlayer';

import PlayerIcon from '@/components/Images/icons/PlayerIcon.vue';
import MusicButton from '@/components/MusicPlayer/components/MusicButton.vue';
import {useRoute} from 'vue-router';

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

const state = ref(false);

const route = useRoute();

const isCurrentPlaylist = computed(() => {
  return currentPlaylist.value == route.path;
});

const setCurrentList = () => {
  setCurrentPlaylist(route.path);
};

const handleClick = () => {

  if (props.data?.tracks?.[0]) {
    if (isCurrentPlaylist.value) {
      if (isPlaying.value && isCurrentPlaylist.value) {
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
      state.value = audioPlayer.value?.isPlaying ?? false;
    }
  }
};

const setIsPlaying = () => {
  if (isCurrentPlaylist.value) {
    state.value = audioPlayer.value?.isPlaying ?? false;
  }
};

watch(currentPlaylist, () => {
  if (isCurrentPlaylist.value) {
    state.value = audioPlayer.value?.isPlaying ?? false;
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
               class="h-12 w-12 min-w-12 min-h-12 max-w-12 max-h-12 relative !rounded-full overflow-clip !bg-focus transition-all duration-300
                       shadow-[0_1px_0_0_rgba(255,255,255,0.20)_inset,0_-1px_0_0_rgba(var(--color-slate-9)/60%)_inset,0_22px_30px_-4px_rgba(var(--color-slate-9)/70%)]
                       dark:shadow-[0_1px_0_0_rgba(255,255,255,0.20)_inset,0_-1px_0_0_rgba(var(--color-slate-1)/30%)_inset,0_22px_30px_-4px_rgba(var(--color-slate-1)/70%)]
                       hover:shadow-[0_1px_0_0_rgba(255,255,255,0.20)_inset,0_-1px_0_0_rgba(var(--color-slate-11)/60%)_inset,0_22px_30px_-4px_rgba(var(--color-slate-11)/70%)]
                       dark:hover:shadow-[0_1px_0_0_rgba(255,255,255,0.20)_inset,0_-1px_0_0_rgba(var(--color-slate-1)/30%)_inset,0_22px_30px_-4px_rgba(var(--color-slate-1)/70%)]
                       active:!bg-focus focus-visible:!bg-focus hover:!bg-focus dark:active:!bg-focus dark:focus-visible:!bg-focus dark:sm:hover:!bg-focus
                       active:!shadow-none
                       active:!dark:shadow-none">
    <PlayerIcon icon="nmPause" v-if="(isPlaying && isCurrentPlaylist)" class="h-8 w-8 text-white"/>
    <PlayerIcon icon="nmPlay" v-else class="h-8 w-8 text-white"/>
  </MusicButton>
</template>
