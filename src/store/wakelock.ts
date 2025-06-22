import { KeepAwake } from '@capacitor-community/keep-awake';

export async function keepAwake() {
	await KeepAwake.keepAwake();
}

export async function allowSleep() {
	await KeepAwake.allowSleep();
}

export async function isSupported() {
	const result = await KeepAwake.isSupported();
	return result.isSupported;
}

export async function isKeptAwake() {
	const result = await KeepAwake.isKeptAwake();
	return result.isKeptAwake;
}
