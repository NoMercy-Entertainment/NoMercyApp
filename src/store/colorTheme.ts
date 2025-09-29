import { computed } from 'vue';
import { isPlatform } from '@ionic/vue';
import { useLocalStorage } from '@vueuse/core';
import { hexToRgba, rgbaToHex } from '@uiw/color-convert';
import { Preferences } from '@capacitor/preferences';
import { NavigationBar } from '@hugotomazi/capacitor-navigation-bar';

import { tooDark, tooLight } from '@/lib/colorHelper.ts';
import { focusColor } from '@/store/ui';
import { scheme } from '@/store/colorScheme.ts';
import { StatusBar, Style } from '@capacitor/status-bar';
import { EdgeToEdge } from '@capawesome/capacitor-android-edge-to-edge-support';

export const topNavColor = computed(() => {
	return rgbaToHex({
		r: Number.parseInt(focusColor.value.split(' ')[0], 10) * 0.35,
		g: Number.parseInt(focusColor.value.split(' ')[1], 10) * 0.35,
		b: Number.parseInt(focusColor.value.split(' ')[2], 10) * 0.35,
		a: 1,
	});
});

const theme = useLocalStorage('theme', 'violet');
export const colorTheme = computed(() => theme.value);

export async function setColorTheme(value: string) {
	theme.value = value;

	const el = document.body.parentElement!;

	for (let i = el.classList.length - 1; i >= 0; i--) {
		const className = el.classList[i];
		if (className.startsWith('theme')) {
			el.classList.remove(className);
		}
	}

	if (value) {
		el.classList.add(`theme-${value}`);
	}
	else {
		el.classList.add('theme-violet');
	}

	await applyNativeColor();

	await Preferences.set({
		key: 'colorTheme',
		value,
	});
}

export async function checkColorTheme() {
	const { value } = await Preferences.get({ key: 'colorTheme' });
	return value;
}

export async function removeColorTheme() {
	await Preferences.remove({ key: 'colorTheme' });
}

export async function applyNativeColor() {
	if (!isPlatform('capacitor'))
		return;

	const { r, g, b } = hexToRgba(focusColor.value);

	let color = rgbaToHex({
		r: r * 0.35,
		g: g * 0.35,
		b: b * 0.35,
		a: 1,
	});

	const style = window.getComputedStyle(document.body);
	const defaultColor = style.getPropertyValue('--color-theme-8');

	if (tooDark(color, 10)) {
		color = defaultColor;
	}
	if (tooLight(color, 160)) {
		color = defaultColor;
	}

	await StatusBar.setOverlaysWebView({ overlay: false });
	await EdgeToEdge.setBackgroundColor({ color });

	if (scheme.value === 'dark' || (scheme.value === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
		await StatusBar.setStyle({ style: Style.Dark });
		await NavigationBar.setColor({ color: '#000000', darkButtons: false });
	}
	else {
		await StatusBar.setStyle({ style: Style.Light });
		await NavigationBar.setColor({ color: '#ffffff', darkButtons: true });
	}
}

(async () => {
	setTimeout(async () => {
		const colorTheme = await checkColorTheme();

		if (!colorTheme) {
			return;
		}

		await setColorTheme(colorTheme);
	}, 10);
})();
