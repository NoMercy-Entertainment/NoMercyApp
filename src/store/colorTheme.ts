import { computed } from 'vue';
import { rgbaToHex } from '@uiw/color-convert';
import { focusColor } from '@/store/ui';
import { Preferences } from '@capacitor/preferences';
import { rgbToHex } from '@/types/config.ts';
import { StatusBar } from '@capacitor/status-bar';
import { useLocalStorage } from '@vueuse/core';
import { isPlatform } from '@ionic/vue';

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
	document.body.classList.add('scheme-transition');
	document.body.style.setProperty('--speed', '300');

	setTimeout(() => {
		document.body.classList.remove('scheme-transition');
		document.body.style.setProperty('--speed', '0');
	}, 300);

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

	if (isPlatform('capacitor')) {
		const style = window.getComputedStyle(document.body);
		const color = `rgb(${style.getPropertyValue('--color-theme-7')})`;
		StatusBar.setBackgroundColor({
			color: rgbToHex(color, 1),
		}).then();
	}

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

(async () => {
	setTimeout(async () => {
		const colorTheme = await checkColorTheme();

		if (!colorTheme) {
			return;
		}

		await setColorTheme(colorTheme);
	}, 10);
})();
