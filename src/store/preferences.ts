import { computed } from 'vue';
import { Preferences } from '@capacitor/preferences';
import i18next from "@/config/i18next";
import {useLocalStorage} from "@vueuse/core/index";

const autoThemeColors = useLocalStorage<boolean>('autoThemeColors', true);
export const useAutoThemeColors = computed(() => autoThemeColors.value);
(async () => {
	const { value } = await Preferences.get({ key: 'autoThemeColors' });
	if (value === null) {
		autoThemeColors.value = true;
		Preferences.set({
			key: 'autoThemeColors',
			value: 'true',
		}).then();
		return;
	}
	autoThemeColors.value = !!value;
})();
export const setUseAutoThemeColors = (value: boolean) => {
	autoThemeColors.value = value;
	Preferences.set({
		key: 'autoThemeColors',
		value: value.toString(),
	}).then();
}

const backdrops = useLocalStorage<boolean>('showBackdrops', false);
export const showBackdrops = computed(() => backdrops.value);
(async () => {
	const { value } = await Preferences.get({ key: 'showBackdrops' });
	if (value === null) {
		backdrops.value = false;
		Preferences.set({
			key: 'showBackdrops',
			value: 'false',
		}).then();
		return;
	}
	backdrops.value = value == 'true';
})();
export const setShowBackdrops = (value: boolean) => {
	backdrops.value = value;
	Preferences.set({
		key: 'showBackdrops',
		value: value.toString(),
	}).then();
}

const percentageColors = useLocalStorage<boolean>('percentageColors', true);
export const usePercentageColors = computed(() => percentageColors.value);
(async () => {
	const { value } = await Preferences.get({ key: 'percentageColors' });
	if (value === null) {
		percentageColors.value = true;
		Preferences.set({
			key: 'percentageColors',
			value: 'true',
		}).then();
		return;
	}

	percentageColors.value = (value || true) == 'true';
})();
export const setUsePercentageColors = (value: boolean) => {
	percentageColors.value = value;
	Preferences.set({
		key: 'percentageColors',
		value: value.toString(),
	}).then();
}

const ssd = useLocalStorage<number>('screensaverDelay', 5);
export const screensaverDelay = computed(() => ssd.value);
(async () => {
	const { value } = await Preferences.get({ key: 'screensaverDelay' });
	if (value === null) {
		ssd.value = 5;
		Preferences.set({
			key: 'screensaverDelay',
			value: '5',
		}).then();
		return;
	}
	ssd.value = parseInt(value ?? '5');
})();
export const setScreensaverDelay = (delay: number) => {
	ssd.value = delay;
	Preferences.set({
		key: 'screensaverDelay',
		value: delay.toString(),
	}).then();
}

const lang = useLocalStorage('displayLanguage', window.navigator.language.split('-')?.[0]);
export const displayLanguage = computed(() => lang.value);
export async function setDisplayLanguage(value: string) {
	lang.value = value;
	await i18next.changeLanguage(value);
	Preferences.set({
		key: 'display_language',
		value: value
	}).then();
}
(async () => {
	Preferences.get({ key: 'display_language'})
		.then(async (value) => {
			await setDisplayLanguage(value.value ?? window.navigator.language.split('-')?.[0]);
		});
})()