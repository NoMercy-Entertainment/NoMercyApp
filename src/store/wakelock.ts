import { isPlatform } from '@ionic/vue';

export async function keepAwake() {
	if (isPlatform('capacitor')) {
		const { KeepAwake } = await import('@capacitor-community/keep-awake');
		await KeepAwake.keepAwake();
	}
}

export async function allowSleep() {
	if (isPlatform('capacitor')) {
		const { KeepAwake } = await import('@capacitor-community/keep-awake');
		await KeepAwake.allowSleep();
	}
}

export async function isSupported() {
	if (isPlatform('capacitor')) {
		const { KeepAwake } = await import('@capacitor-community/keep-awake');
		const result = await KeepAwake.isSupported();
		return result.isSupported;
	}
	return false;
}

export async function isKeptAwake() {
	if (isPlatform('capacitor')) {
		const { KeepAwake } = await import('@capacitor-community/keep-awake');
		const result = await KeepAwake.isKeptAwake();
		return result.isKeptAwake;
	}
	return false;
}
