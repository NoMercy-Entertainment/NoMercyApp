<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core';

import { musicSize } from '@/store/audioPlayer';

import DeviceButton from '../components/DeviceButton.vue';
import NextButton from '../components/NextButton.vue';
import PlaybackButton from '../components/PlaybackButton.vue';
import PreviousButton from '../components/PreviousButton.vue';
import QueueButton from '../components/QueueButton.vue';
import RepeatButton from '../components/RepeatButton.vue';
import ShuffleButton from '../components/ShuffleButton.vue';
import StopButton from '../components/StopButton.vue';
import EqButton from "../components/EqButton.vue";
import DeviceOverlay from "@/Layout/Desktop/components/Overlays/DeviceOverlay.vue";
import QueueOverlay from "@/Layout/Desktop/components/Overlays/QueueOverlay.vue";

const supportsAudioContext = useLocalStorage('nmplayer-music-supports-audio-context', false);

</script>

<template>
    <div class="flex w-full items-center justify-between px-6" :data-size="musicSize">
        <ShuffleButton />
        <PreviousButton />
        <PlaybackButton class="!h-14 !w-14 !bg-focus/50 !rounded-full
                       shadow-[0_1px_0_0_rgba(255,255,255,0.20)_inset,0_-1px_0_0_rgba(var(--color-slate-9)/60%)_inset,0_22px_30px_-4px_rgba(var(--color-slate-9)/70%)]
                       dark:shadow-[0_1px_0_0_rgba(255,255,255,0.20)_inset,0_-1px_0_0_rgba(var(--color-slate-1)/30%)_inset,0_22px_30px_-4px_rgba(var(--color-slate-1)/70%)]
                       hover:shadow-[0_1px_0_0_rgba(255,255,255,0.20)_inset,0_-1px_0_0_rgba(var(--color-slate-11)/60%)_inset,0_22px_30px_-4px_rgba(var(--color-slate-11)/70%)]
                       dark:hover:shadow-[0_1px_0_0_rgba(255,255,255,0.20)_inset,0_-1px_0_0_rgba(var(--color-slate-1)/30%)_inset,0_22px_30px_-4px_rgba(var(--color-slate-1)/70%)]
                       active:!shadow-none
                       active:!dark:shadow-none" />
        <NextButton />
        <RepeatButton />
    </div>
    <div class="z-0 mb-12 flex h-12 w-full justify-between px-6 gap-2 z-10" :data-size="musicSize">
        <DeviceButton ref="deviceOverlay" />
        <StopButton class="ml-auto" />
        <EqButton v-if="supportsAudioContext" />
        <QueueButton ref="queueOverlay"/>
        <DeviceOverlay />
        <QueueOverlay />
    </div>
</template>
