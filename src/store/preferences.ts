import {computed, ref, watch} from 'vue';
import {Preferences} from '@capacitor/preferences';

const autoThemeColors = ref<boolean>(true);
export const useAutoThemeColors = computed(() => autoThemeColors.value);
watch(autoThemeColors, async (value) => {
	await Preferences.set({
		key: 'autoThemeColors',
		value: value.toString(),
	});
});
(async () => {
	const { value } = await Preferences.get({ key: 'autoThemeColors' });
	autoThemeColors.value = (value ?? true) == true;
})();
export const setUseAutoThemeColors = (value: boolean) => {
	autoThemeColors.value = value;
}


const backdrops = ref<boolean>(false);
export const showBackdrops = computed(() => backdrops.value);
watch(backdrops, async (value) => {
	await Preferences.set({
		key: 'showBackdrops',
		value: value.toString(),
	});
});
(async () => {
	const { value } = await Preferences.get({ key: 'showBackdrops' });
	backdrops.value = (value ?? false) == 'true';
})();
export const setShowBackdrops = (value: boolean) => {
	backdrops.value = value;
}

const percentageColors = ref<boolean>(true);
export const usePercentageColors = computed(() => percentageColors.value);
watch(percentageColors, async (value) => {
	await Preferences.set({
		key: 'percentageColors',
		value: value.toString(),
	});
});
(async () => {
	const { value } = await Preferences.get({ key: 'percentageColors' });
	percentageColors.value = (value ?? true) == 'true';
})();
export const setUsePercentageColors = (value: boolean) => {
	percentageColors.value = value;
}
