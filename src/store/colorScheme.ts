import { isPlatform } from '@ionic/vue';
import type { BasicColorSchema } from '@vueuse/core';
import { useColorMode } from '@vueuse/core';
import { Preferences } from '@capacitor/preferences';
import { SafeArea } from 'capacitor-plugin-safe-area';
import { NavigationBar } from '@hugotomazi/capacitor-navigation-bar';

import type { ColorScheme } from '@/types/config';

import { isTv } from '@/config/global';
import { StatusBar, Style } from '@capacitor/status-bar';
import { EdgeToEdge } from '@capawesome/capacitor-android-edge-to-edge-support';

export async function setColorScheme(value: 'system' | BasicColorSchema) {
	const el = document.body.parentElement!;

	for (let i = el.classList.length - 1; i >= 0; i--) {
		const className = el.classList[i];
		if (className.startsWith('scheme') || className === 'system') {
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

		if (value === 'dark' || (value === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
			await NavigationBar.setColor({ color: '#000000', darkButtons: true });
			if (isPlatform('capacitor') && !isTv.value) {
				await StatusBar.setStyle({ style: Style.Dark });
			}
			await EdgeToEdge.setBackgroundColor({ color: '#000000' });
		}
		else {
			await NavigationBar.setColor({ color: '#FFFFFF', darkButtons: false });
			if (isPlatform('capacitor') && !isTv.value) {
				await StatusBar.setStyle({ style: Style.Light });
			}
			await EdgeToEdge.setBackgroundColor({ color: '#ffffff' });
		}

		await EdgeToEdge.enable();
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

export const scheme = useColorMode({
	attribute: 'class',
	modes: {
		light: 'scheme-light',
		system: 'scheme-system',
		dark: 'scheme-dark',
	},
});

(async () => {
	setTimeout(async () => {
		const colorScheme = await checkColorScheme();

		if (!colorScheme) {
			return;
		}

		await setColorScheme(colorScheme);
	}, 10);
})();
