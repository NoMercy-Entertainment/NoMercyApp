<script lang="ts" setup>
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
import EqButton from '../components/EqButton.vue';
import DeviceOverlay from '@/Layout/Desktop/components/Overlays/DeviceOverlay.vue';
import QueueOverlay from '@/Layout/Desktop/components/Overlays/QueueOverlay.vue';

const supportsAudioContext = useLocalStorage(
	'nmplayer-music-supports-audio-context',
	false,
);
</script>

<template>
	<div
		:data-size="musicSize"
		class="flex w-full items-center justify-between px-6"
	>
		<ShuffleButton />
		<PreviousButton />
		<PlaybackButton
			class="!h-14 !w-14 !bg-focus/50 !rounded-full shadow-[0_1px_0_0_rgba(255,255,255,0.20)_inset,0_-1px_0_0_rgb(from_var(--color-slate-9)_r_g_b/60%)_inset,0_22px_30px_-4px_rgb(from_var(--color-slate-9)_r_g_b/70%)] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.20)_inset,0_-1px_0_0_rgb(from_var(--color-slate-1)_r_g_b/30%)_inset,0_22px_30px_-4px_rgb(from_var(--color-slate-1)_r_g_b/70%)] hover:shadow-[0_1px_0_0_rgba(255,255,255,0.20)_inset,0_-1px_0_0_rgb(from_var(--color-slate-11)_r_g_b/60%)_inset,0_22px_30px_-4px_rgb(from_var(--color-slate-11)_r_g_b/70%)] dark:hover:shadow-[0_1px_0_0_rgba(255,255,255,0.20)_inset,0_-1px_0_0_rgb(from_var(--color-slate-1)_r_g_b/30%)_inset,0_22px_30px_-4px_rgb(from_var(--color-slate-1)_r_g_b/70%)] active:!shadow-none active:!dark:shadow-none"
		/>
		<NextButton />
		<RepeatButton />
	</div>
	<div
		:data-size="musicSize"
		class="mb-12 flex h-12 w-full justify-between px-6 gap-2 z-10"
	>
		<DeviceButton ref="deviceOverlay" class="!w-auto !justify-start" />
		<StopButton class="ml-auto" />
		<EqButton v-if="supportsAudioContext" />
		<QueueButton ref="queueOverlay" />
		<DeviceOverlay />
		<QueueOverlay />
	</div>
</template>
