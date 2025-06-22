import { computed, ref, watch } from 'vue';
import { isPlatform } from '@ionic/vue';
import { Preferences } from '@capacitor/preferences';
import { SafeArea } from 'capacitor-plugin-safe-area';
import { useMediaQuery } from '@vueuse/core';
import { NavigationBar } from '@hugotomazi/capacitor-navigation-bar';

import type { ColorScheme } from '@/types/config';

import { isDarkMode } from '@/config/global';
import { StatusBar, Style } from '@capacitor/status-bar';
import { topNavColor } from '@/store/colorTheme';

export const darkMode = ref(isDarkMode.value);

export async function setColorScheme(value: ColorScheme) {
	document.body.classList.add('scheme-transition');
	document.body.style.setProperty('--speed', '300');

	setTimeout(() => {
		document.body.classList.remove('scheme-transition');
		document.body.style.setProperty('--speed', '0');
	}, 300);

	darkMode.value = value === 'dark';
	isDarkMode.value = value === 'dark';

	const el = document.body.parentElement!;

	for (let i = el.classList.length - 1; i >= 0; i--) {
		const className = el.classList[i];
		if (className.startsWith('scheme')) {
			el.classList.remove(className);
		}
	}

	if (value) {
		el.classList.add(`scheme-${value}`);
	}
	else {
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
			NavigationBar.setColor({ color: '#000000', darkButtons: true }).then();
			StatusBar.setBackgroundColor({ color: '#00000080' }).then();
			StatusBar.setStyle({ style: Style.Dark }).then();
		}
		else {
			NavigationBar.setColor({ color: '#FFFFFF', darkButtons: true }).then();
			StatusBar.setBackgroundColor({ color: '#FFFFFFA0' }).then();
			StatusBar.setStyle({ style: Style.Dark }).then();
		}

		StatusBar.setOverlaysWebView({ overlay: true }).then();
	}

	await Preferences.set({
		key: 'colorScheme',
		value,
	});
}

export async function checkColorScheme() {
	const { value } = await Preferences.get({ key: 'colorScheme' });
	return value as ColorScheme;
}

export async function removeColorScheme() {
	await Preferences.remove({ key: 'colorScheme' });
}

watch(darkMode, async (value) => {
	await setColorScheme?.(value ? 'dark' : 'light');
});

(async () => {
	setTimeout(async () => {
		const colorScheme = await checkColorScheme();

		await setColorScheme?.(
			useMediaQuery('(prefers-color-scheme: dark)').value || colorScheme
				? 'dark'
				: 'light',
		);

		if (!colorScheme) {
			return;
		}

		darkMode.value = colorScheme === 'dark';
	}, 100);
})();

const setBackgroundColor = computed(() => {
	if (isPlatform('capacitor')) {
		return import('@capacitor/status-bar').then(({ StatusBar }) => {
			return StatusBar.setBackgroundColor;
		});
	}
	return () => {};
});

export async function change(value: boolean) {
	if (isPlatform('capacitor')) {
		if (value) {
			(await setBackgroundColor.value)?.({ color: topNavColor.value });
		}
		else {
			await setColorScheme?.(isDarkMode ? 'dark' : 'light');
		}
	}
}
