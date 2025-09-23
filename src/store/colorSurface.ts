import { computed } from 'vue';
import { Preferences } from '@capacitor/preferences';
import { useLocalStorage } from '@vueuse/core';

const surface = useLocalStorage('surface', 'gray');
export const currentSurface = computed(() => surface.value);

export async function setSurfaceColor(value: string) {
	surface.value = value;

	const el = document.body.parentElement!;

	for (let i = el.classList.length - 1; i >= 0; i--) {
		const className = el.classList[i];
		if (className.startsWith('surface')) {
			el.classList.remove(className);
		}
	}

	if (value) {
		el.classList.add(`surface-${value}`);
	}
	else {
		el.classList.add('surface-gray');
	}

	await Preferences.set({
		key: 'surfaceColor',
		value,
	});
}

export async function checkSurfaceColor() {
	const { value } = await Preferences.get({ key: 'surfaceColor' });
	return value;
}

export async function removeSurfaceColor() {
	await Preferences.remove({ key: 'surfaceColor' });
}

(async () => {
	setTimeout(async () => {
		const surfaceColor = await checkSurfaceColor();

		if (!surfaceColor) {
			return;
		}

		await setSurfaceColor(surfaceColor);
	}, 10);
})();

const strength = useLocalStorage<string | number>('strength', 0);
export const currentStrength = computed(() => strength.value);

export async function setStrengthColor(value: number | string) {
	strength.value = value;

	const el = document.body.parentElement!;
	if (value) {
		el.style.setProperty('--surface-strength', `${value}%`);
	}
	else {
		el.style.setProperty('--surface-strength', '0');
	}

	await Preferences.set({
		key: 'strengthColor',
		value: `${value ?? 0}`,
	});
}

export async function checkStrengthColor() {
	const { value } = await Preferences.get({ key: 'strengthColor' });
	return value;
}

export async function removeStrengthColor() {
	await Preferences.remove({ key: 'strengthColor' });
}

(async () => {
	setTimeout(async () => {
		const strengthColor = await checkStrengthColor();

		if (!strengthColor) {
			return;
		}

		await setStrengthColor(strengthColor);
	}, 10);
})();
