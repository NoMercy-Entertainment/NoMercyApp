import {ref, watch} from 'vue';
import {Preferences} from '@capacitor/preferences';

export const useAutoThemeColors = ref<boolean>(true);
watch(useAutoThemeColors, async (value) => {
	await Preferences.set({
		key: 'autoThemeColors',
		value: value.toString(),
	});
});
(async () => {
	const { value } = await Preferences.get({ key: 'autoThemeColors' });
	useAutoThemeColors.value = (value ?? true) == true;
})();
