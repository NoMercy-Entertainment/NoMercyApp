<script setup lang="ts">

import { musicSize } from '@/store/audioPlayer';
import VolumeButton from '@/components/MusicPlayer/components/VolumeButton.vue';
import VolumeSlider from '@/components/MusicPlayer/components/VolumeSlider.vue';
</script>

<template>
    <div class="mr-2 flex w-32 min-w-28 items-center gap-2" :data-size="musicSize">

        <VolumeButton />

        <div class="w-full h-full items-center flex full:mb-2 !mb-0" :data-size="musicSize">
            <VolumeSlider />
        </div>
    </div>
</template>
