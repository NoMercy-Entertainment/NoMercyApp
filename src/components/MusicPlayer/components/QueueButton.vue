<script setup lang="ts">

import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';
import MusicButton from './MusicButton.vue';
import {queueMenuOpen, toggleQueueMenuOpen} from '@/store/audioPlayer';

const handleClick = (e?: MouseEvent) => {
    e?.stopPropagation();
    toggleQueueMenuOpen();
};
</script>

<template>
    <MusicButton label="Queue" :onclick="handleClick">
        <MoooomIcon icon="currentPlaylist" class="h-6 w-6 text-focus" v-if="queueMenuOpen" />
        <MoooomIcon icon="currentPlaylist" class="h-6 w-6" v-else />
    </MusicButton>
</template>
