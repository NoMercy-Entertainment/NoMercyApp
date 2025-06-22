import { ref, watch } from 'vue';
import { useIdle } from '@vueuse/core';

import type { LogoResponse } from '@/types/server';

import { screensaverDelay } from '@/store/preferences';
import {
	disableScreensaver,
	setImageModalData,
	setShowScreensaver,
	showImageModal,
	showScreensaver,
} from '@/store/imageModal';
import serverClient from '@/lib/clients/serverClient';
import { currentServer } from '@/store/currentServer';

const { idle, reset } = useIdle((screensaverDelay.value ?? 0) * 60 * 1000, {
	window,
	listenForVisibilityChange: false,
});

const index = ref(-1);
const images = ref<LogoResponse[] | null>(null);

watch(
	currentServer,
	(value, prevValue) => {
		if (!value || value.id === prevValue?.id)
			return;

		serverClient()
			.get<{ data: LogoResponse[] }>('/screensaver')
			.then(({ data }) => {
				images.value = data.data;
			});
	},
	{ immediate: true },
);

setInterval(() => {
	if (!images.value)
		return;
	if (disableScreensaver.value)
		return;
	if (!showScreensaver.value)
		return;

	index.value = index.value + 1 >= images.value?.length ? 0 : index.value + 1;
}, 45 * 1000);

watch([index, showScreensaver], () => {
	setTimeout(() => {
		if (!images.value)
			return;
		if (
			disableScreensaver.value
			|| showImageModal.value
			|| !showScreensaver.value
		) {
			return;
		}

		setImageModalData(images.value[index.value % images.value.length]);
	}, 150);
});

watch(screensaverDelay, () => {
	reset();
});

watch(images, () => {
	index.value = 0;
});

watch([idle, images], ([idleValue]) => {
	if (idleValue && images.value && images.value.length > 0) {
		setShowScreensaver(true);
	}
	else {
		setShowScreensaver(false);
		setImageModalData(null);
	}
});
