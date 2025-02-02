import {computed, ref, watch} from 'vue';
import { rgbaToHex } from '@uiw/color-convert';
import { focusColor } from '@/store/ui';
import {Preferences} from "@capacitor/preferences";

export const topNavColor = computed(() => {
	return rgbaToHex({
		r: parseInt(focusColor.value.split(' ')[0], 10) * 0.35,
		g: parseInt(focusColor.value.split(' ')[1], 10) * 0.35,
		b: parseInt(focusColor.value.split(' ')[2], 10) * 0.35,
		a: 1,
	});
});

const theme = ref('violet');
export const colorTheme = computed(() => theme.value);
export const setColorTheme = async (value: string) => {
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
	} else {
		el.classList.add('theme-system');
	}

	await Preferences.set({
		key: 'colorTheme',
		value: value,
	});
};

export const checkColorTheme = async () => {
	const { value } = await Preferences.get({ key: 'colorTheme' });
	return value;
};

export const removeColorTheme = async () => {
	await Preferences.remove({ key: 'colorTheme' });
};

(async () => {
	setTimeout(async () => {
		const colorTheme = await checkColorTheme();

		if (!colorTheme) {
			return;
		}

		await setColorTheme(colorTheme);
	}, 10);
})();
