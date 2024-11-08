<script setup lang="ts">

import {musicSize} from '@/store/audioPlayer';

import DeviceButton from '../components/DeviceButton.vue';
import NextButton from '../components/NextButton.vue';
import PlaybackButton from '../components/PlaybackButton.vue';
import PreviousButton from '../components/PreviousButton.vue';
import QueueButton from '../components/QueueButton.vue';
import RepeatButton from '../components/RepeatButton.vue';
import ShuffleButton from '../components/ShuffleButton.vue';
import StopButton from '../components/StopButton.vue';

</script>

<template>
    <div class="flex w-full items-center justify-between"
         :data-size="musicSize">
        <ShuffleButton />
        <PreviousButton />
        <PlaybackButton class="!h-14 !w-14 !bg-white text-black !min-w-14 !min-h-14 !max-w-14 !max-h-14 !relative !rounded-full !overflow-clip !pl-0.5" />
        <NextButton />
        <RepeatButton />
    </div>
    <div class="z-0 mb-12 flex h-12 w-full justify-between"
         :data-size="musicSize">
        <DeviceButton />
        <StopButton class="ml-auto" />
        <QueueButton />
    </div>
</template>
