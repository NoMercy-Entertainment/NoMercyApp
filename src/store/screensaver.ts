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
import { isPlatform } from '@ionic/vue';
import { isTv } from '@/config/global.ts';

const { idle, reset } = useIdle((screensaverDelay.value ?? 0) * 60 * 1000, {
	events: ['mousemove', 'mousedown', 'keydown', 'touchstart', 'wheel'],
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

watch([idle, images], async ([idleValue]) => {
	if (idleValue && images.value && images.value.length > 0) {
		setShowScreensaver(true);
		document.querySelector<HTMLDialogElement>('#imageModal')?.showModal();
		if (isPlatform('capacitor') && !isTv.value) {
			const StatusBar = await import('@capacitor/status-bar').then(m => m.StatusBar);
			StatusBar.setOverlaysWebView({ overlay: true }).then();
		}
	}
	else if (idleValue) {
		setShowScreensaver(false);
		setImageModalData(null);
		document.querySelector<HTMLDialogElement>('#imageModal')?.close();
		if (isPlatform('capacitor') && !isTv.value) {
			const StatusBar = await import('@capacitor/status-bar').then(m => m.StatusBar);
			StatusBar.setOverlaysWebView({ overlay: false }).then();
		}
	}
	else {
		setShowScreensaver(false);
		setImageModalData(null);
		document.querySelector<HTMLDialogElement>('#imageModal')?.close();
		if (isPlatform('capacitor') && !isTv.value) {
			const StatusBar = await import('@capacitor/status-bar').then(m => m.StatusBar);
			StatusBar.setOverlaysWebView({ overlay: false }).then();
		}
	}
});
