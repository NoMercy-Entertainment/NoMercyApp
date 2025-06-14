<script setup lang="ts">

import OptimizedIcon from '@/components/OptimizedIcon.vue';
import MusicButton from './MusicButton.vue';
import { queueMenuOpen, toggleQueueMenuOpen } from '@/store/audioPlayer';

const handleClick = (e?: MouseEvent) => {
    e?.stopPropagation();
    toggleQueueMenuOpen();
};
</script>

<template>
    <MusicButton label="Queue" :onclick="handleClick">        <OptimizedIcon icon="currentPlaylist" class="h-6 w-6 text-focus" v-if="queueMenuOpen" />
        <OptimizedIcon icon="currentPlaylist" class="h-6 w-6" v-else />
    </MusicButton>
</template>
