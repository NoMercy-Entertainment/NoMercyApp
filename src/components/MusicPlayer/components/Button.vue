<script setup lang="ts">
import MusicButton from './MusicButton.vue';
import audioPlayer from '@/store/audioPlayer';
</script>

<template>
	<MusicButton label="" :onclick="() => audioPlayer?.togglePlayback()" />
</template>
