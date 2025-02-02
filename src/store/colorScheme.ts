import { ref, watch } from 'vue';
import { isPlatform } from '@ionic/vue';
import { Preferences } from '@capacitor/preferences';
import { SafeArea } from 'capacitor-plugin-safe-area';
import { useMediaQuery } from '@vueuse/core';
import { NavigationBar } from "@hugotomazi/capacitor-navigation-bar";

import type { ColorScheme } from '@/types/config';

import { isDarkMode } from '@/config/global';
import { StatusBar, Style } from "@capacitor/status-bar";

export const setColorScheme = async (value: ColorScheme) => {
	document.body.classList.add('scheme-transition');
	document.body.style.setProperty('--speed', '300');

	setTimeout(() => {
		document.body.classList.remove('scheme-transition');
		document.body.style.setProperty('--speed', '0');
	}, 300);

	const el = document.body.parentElement!;

	for (let i = el.classList.length - 1; i >= 0; i--) {
		const className = el.classList[i];
		if (className.startsWith('scheme')) {
			el.classList.remove(className);
		}
	}

	if (value) {
		el.classList.add(`scheme-${value}`);
	} else {
		el.classList.add('scheme-system');
	}

	if (isPlatform('capacitor') && isPlatform('android')) {
		NavigationBar.setTransparency({
			isTransparent: false,
		}).then();

		const safeAreaData = await SafeArea.getSafeAreaInsets();
		const { insets } = safeAreaData;
		for (const [key, value] of Object.entries(insets)) {
			document.documentElement.style.setProperty(
				`--safe-area-inset-${key}`,
				`${value}px`,
			);
		}

		if (value === 'dark') {
			darkMode.value = true;
			isDarkMode.value = true;
			NavigationBar.setColor({ color: '#000000', darkButtons: true }).then();
			StatusBar.setBackgroundColor({ color: '#00000080' }).then();
			StatusBar.setStyle({ style: Style.Dark }).then();
		} else {
			darkMode.value = false;
			isDarkMode.value = false;
			NavigationBar.setColor({ color: '#FFFFFF', darkButtons: true }).then();
			StatusBar.setBackgroundColor({ color: '#FFFFFFA0' }).then();
			StatusBar.setStyle({ style: Style.Dark }).then();
		}

		StatusBar.setOverlaysWebView({ overlay: true }).then();
	}

	await Preferences.set({
		key: 'colorScheme',
		value: value,
	});
};

export const checkColorScheme = async () => {
	const { value } = await Preferences.get({ key: 'colorScheme' });
	return value as ColorScheme;
};

export const removeColorScheme = async () => {
	await Preferences.remove({ key: 'colorScheme' });
};

export const darkMode = ref(isDarkMode.value);

watch(darkMode, async (value) => {
	await setColorScheme?.(value ? 'dark' : 'light');
});

(async () => {
	setTimeout(async () => {
		const colorScheme = await checkColorScheme();

		await setColorScheme?.(useMediaQuery('(prefers-color-scheme: dark)').value || colorScheme ? 'dark' : 'light');

		if (!colorScheme) {
			return;
		}

		darkMode.value = colorScheme === 'dark';
	}, 100);
})();
