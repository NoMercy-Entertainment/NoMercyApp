import {ref, watch} from 'vue';
import { Preferences } from '@capacitor/preferences';
// import {StatusBar, Style} from '@capacitor/status-bar';
import {NavigationBar} from '@hugotomazi/capacitor-navigation-bar';
import {isPlatform} from '@ionic/vue';
import twConfig from '../../tailwind.config';

import type {ColorScheme} from '@/types/config';

import {isDarkMode} from '@/config/global';
import {RGBString2hex} from '@/lib/colorHelper';

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
		const {StatusBar, Style} = (await import('@capacitor/status-bar'));

		if (value === 'dark') {
			darkMode.value = true;
			const topNavColor = RGBString2hex(twConfig.theme.extend.colors.violet.dark[7].replace(/\s/gu, ','));
			const bottomButtonsColor = RGBString2hex(twConfig.theme.extend.colors.slate.dark[2].replace(/\s/gu, ','));
			StatusBar.setBackgroundColor({color: topNavColor}).then();
			await NavigationBar.setColor({color: bottomButtonsColor, darkButtons: true});
			StatusBar.setStyle({style: Style.Dark}).then();
		} else {
			darkMode.value = false;
			const topNavColor = RGBString2hex(twConfig.theme.extend.colors.violet.light[8].replace(/\s/gu, ','));
			const bottomButtonsColor = RGBString2hex(twConfig.theme.extend.colors.slate.light[1].replace(/\s/gu, ','));
			StatusBar.setBackgroundColor({color: topNavColor}).then();
			await NavigationBar.setColor({color: bottomButtonsColor, darkButtons: false});
			StatusBar.setStyle({style: Style.Light}).then();
		}
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
	await setColorScheme(value ? 'dark' : 'light');
});

(async () => {
	const colorScheme = await checkColorScheme();

	await setColorScheme(darkMode.value ? 'dark' : 'light');

	if (!colorScheme) {
		return;
	}

	darkMode.value = colorScheme === 'dark';
})();
