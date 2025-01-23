import { computed } from 'vue';
import { rgbaToHex } from '@uiw/color-convert';
import { isPlatform } from '@ionic/vue';
import { focusColor } from '@/store/ui';
import { setColorScheme } from "@/store/colorScheme";
import { isDarkMode } from "@/config/global";

const topNavColor = computed(() => {
	return rgbaToHex({
		r: parseInt(focusColor.value.split(' ')[0], 10) * 0.35,
		g: parseInt(focusColor.value.split(' ')[1], 10) * 0.35,
		b: parseInt(focusColor.value.split(' ')[2], 10) * 0.35,
		a: 1,
	});
});

const setBackgroundColor = computed(() => {
	if (isPlatform('capacitor')) {
		return import('@capacitor/status-bar').then(({ StatusBar }) => {
			return StatusBar.setBackgroundColor
		});
	}
	return () => { };
});

export const change = async (value: boolean) => {
	if (isPlatform('capacitor')) {
		if (value) {
			(await setBackgroundColor.value)?.({ color: topNavColor.value });
		}
		else {
			await setColorScheme(isDarkMode ? 'dark' : 'light');
		}
	}
};
