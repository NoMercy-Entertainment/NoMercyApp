<script setup lang="ts">
import { onUnmounted, onMounted, ref, watch } from 'vue';
import { useIdle } from '@vueuse/core';

import type {LogoResponse} from "@/types/server";

import useServerClient from "@/lib/clients/useServerClient";
import {screensaverDelay} from "@/store/preferences";
import {
  disableScreensaver,
  setImageModalData, setShowScreensaver,
  showImageModal,
  showScreensaver
} from '@/store/imageModal';

const { idle, reset } = useIdle((screensaverDelay.value ?? 0) * 60 * 1000);

const index = ref(-1);
const interval = ref<NodeJS.Timeout | null>(null);

const { data: images } = useServerClient<LogoResponse[]>({
	path: '/screensaver',
});

onMounted(() => {
	interval.value = setInterval(() => {
		if (!images.value) return;
        if (disableScreensaver.value) return;
        if (!showScreensaver.value) return;

		index.value = index.value + 1 >= images.value?.length
			? 0
			: index.value + 1;
	}, 45 * 1000);
});

watch(index, () => {
	if (!images.value) return;
	if (disableScreensaver.value || showImageModal.value) return;

	setImageModalData(images.value[index.value % images.value.length]);
});

watch(screensaverDelay, () => {
  reset();
});

watch(images, () => {
  index.value = 0;
});

watch(idle, (idleValue) => {
	if (idleValue && images.value && images.value.length > 0) {
		setShowScreensaver(true);
	} else {
		setShowScreensaver(false);
	}
});

onUnmounted(() => {
	if (interval.value) {
		clearInterval(interval.value);
	}
});

</script>

<template>
  <i></i>
</template>
