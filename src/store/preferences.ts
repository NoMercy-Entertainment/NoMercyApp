import { computed } from 'vue';
import { Preferences } from '@capacitor/preferences';
import i18next from '@/config/i18next';
import { useLocalStorage } from '@vueuse/core';

function persistPreference(key: string, value: string): void {
	Preferences.set({ key, value }).catch((err) => {
		console.error(`Failed to persist preference "${key}":`, err);
	});
}

const autoThemeColors = useLocalStorage<boolean>('autoThemeColors', true);
export const useAutoThemeColors = computed(() => autoThemeColors.value);
(async () => {
	try {
		const { value } = await Preferences.get({ key: 'autoThemeColors' });
		if (value === null) {
			autoThemeColors.value = true;
			persistPreference('autoThemeColors', 'true');
			return;
		}
		autoThemeColors.value = !!value;
	}
	catch (err) {
		console.error('Failed to load autoThemeColors:', err);
	}
})();
export function setUseAutoThemeColors(value: boolean): void {
	autoThemeColors.value = value;
	persistPreference('autoThemeColors', value.toString());
}

const backdrops = useLocalStorage<boolean>('showBackdrops', false);
export const showBackdrops = computed(() => backdrops.value);
(async () => {
	try {
		const { value } = await Preferences.get({ key: 'showBackdrops' });
		if (value === null) {
			backdrops.value = false;
			persistPreference('showBackdrops', 'false');
			return;
		}
		backdrops.value = value === 'true';
	}
	catch (err) {
		console.error('Failed to load showBackdrops:', err);
	}
})();
export function setShowBackdrops(value: boolean): void {
	backdrops.value = value;
	persistPreference('showBackdrops', value.toString());
}

const overlayCarouselButtons = useLocalStorage<boolean>('useOverlayCarouselButtons', false);
export const useOverlayCarouselButtons = computed(() => overlayCarouselButtons.value);
(async () => {
	try {
		const { value } = await Preferences.get({ key: 'useOverlayCarouselButtons' });
		if (value === null) {
			overlayCarouselButtons.value = false;
			persistPreference('useOverlayCarouselButtons', 'false');
			return;
		}
		overlayCarouselButtons.value = value === 'true';
	}
	catch (err) {
		console.error('Failed to load useOverlayCarouselButtons:', err);
	}
})();
export function setOverlayCarouselButtons(value: boolean): void {
	overlayCarouselButtons.value = value;
	persistPreference('useOverlayCarouselButtons', value.toString());
}

const percentageColors = useLocalStorage<boolean>('percentageColors', true);
export const usePercentageColors = computed(() => percentageColors.value);
(async () => {
	try {
		const { value } = await Preferences.get({ key: 'percentageColors' });
		if (value === null) {
			percentageColors.value = true;
			persistPreference('percentageColors', 'true');
			return;
		}
		percentageColors.value = (value || true) === 'true';
	}
	catch (err) {
		console.error('Failed to load percentageColors:', err);
	}
})();
export function setUsePercentageColors(value: boolean): void {
	percentageColors.value = value;
	persistPreference('percentageColors', value.toString());
}

const screensaverDelayData = useLocalStorage<number>('screensaverDelay', 5);
export const screensaverDelay = computed(() => screensaverDelayData.value);
(async () => {
	try {
		const { value } = await Preferences.get({ key: 'screensaverDelay' });
		if (value === null) {
			screensaverDelayData.value = 5;
			persistPreference('screensaverDelay', '5');
			return;
		}
		screensaverDelayData.value = Number.parseInt(value ?? '5');
	}
	catch (err) {
		console.error('Failed to load screensaverDelay:', err);
	}
})();
export function setScreensaverDelay(delay: number): void {
	screensaverDelayData.value = delay;
	persistPreference('screensaverDelay', delay.toString());
}

const lang = useLocalStorage(
	'displayLanguage',
	window.navigator.language.split('-')?.[0],
);
export const displayLanguage = computed(() => lang.value);
export async function setDisplayLanguage(value: string): Promise<void> {
	lang.value = value;
	await i18next.changeLanguage(value);
	persistPreference('display_language', value);
}
(async () => {
	try {
		const { value } = await Preferences.get({ key: 'display_language' });
		await setDisplayLanguage(
			value ?? window.navigator.language.split('-')?.[0],
		);
	}
	catch (err) {
		console.error('Failed to load display_language:', err);
	}
})();
