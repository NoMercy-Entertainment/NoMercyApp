<script setup lang="ts">

import audioPlayer, {isShuffling} from '@/store/audioPlayer';

import MusicButton from '@/components/Buttons/MusicButton.vue';
import PlayerIcon from '@/components/Images/icons/PlayerIcon.vue';

const handleClick = (e: MouseEvent) => {
	e.stopPropagation();
	audioPlayer.value?.shuffle(!isShuffling.value);
};

</script>

<template>
    <MusicButton label="shuffle"
                 :onclick="handleClick">
        <PlayerIcon icon="nmShuffle" v-if="isShuffling"
                        class="h-6 w-6 text-focus" />
        <PlayerIcon icon="nmShuffleHalftone" v-else
                          class="h-6 w-6" />
    </MusicButton>
</template>
