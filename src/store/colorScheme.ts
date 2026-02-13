import { watch } from 'vue';
import { isPlatform } from '@ionic/vue';
import type { BasicColorSchema } from '@vueuse/core';
import { useColorMode } from '@vueuse/core';
import { Preferences } from '@capacitor/preferences';
import { SafeArea } from 'capacitor-plugin-safe-area';
import type { ColorScheme } from '@/types/config';

import { colorTheme, setColorTheme } from '@/store/colorTheme.ts';

export const scheme = useColorMode({
	attribute: 'class',
	modes: {
		light: 'scheme-light light',
		system: 'scheme-system system',
		dark: 'scheme-dark dark',
	},
});

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
		const safeAreaData = await SafeArea.getSafeAreaInsets();
		const { insets } = safeAreaData;
		for (const [key, value] of Object.entries(insets)) {
			document.documentElement.style.setProperty(
				`--safe-area-inset-${key}`,
				`${value}px`,
			);
		}

		await setColorTheme(colorTheme.value);
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

watch(scheme, async (newValue) => {
	await setColorScheme(newValue);
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
