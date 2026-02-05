import { computed, ref, toRaw } from 'vue';

import type { AppInfo, AppState } from '@capacitor/app';
import { App as android } from '@capacitor/app';
import type { BatteryInfo, DeviceInfo } from '@capacitor/device';
import { Device } from '@capacitor/device';
import { Preferences } from '@capacitor/preferences';
import { isPlatform } from '@ionic/vue';
import type { ClientInfo } from '@/lib/clients/socketClient/device';
import { makeDeviceInfo } from '@/lib/clients/socketClient/device';
import { useLocalStorage } from '@vueuse/core';

const ai = ref<AppInfo>();
export const appInfo = computed(() => ai.value);

const di = ref<DeviceInfo>();
export const deviceInfo = computed(() => di.value);

const ci = ref<ClientInfo>();
export const clientInfo = computed(() => ci.value);

const bi = ref<BatteryInfo>();
export const batteryInfo = computed(() => bi.value);

const as = ref<AppState>();
export const appState = computed(() => as.value);

export const deviceName = useLocalStorage('deviceName', ci.value?.name);
export function setDeviceName(value: string): void {
	deviceName.value = value;
	Preferences.set({ key: 'deviceName', value }).catch((err) => {
		console.error('Failed to persist deviceName:', err);
	});
}

export const deviceId = useLocalStorage('deviceId', '');
export function setDeviceId(value: string): void {
	deviceId.value = value;
	Preferences.set({ key: 'deviceId', value }).catch((err) => {
		console.error('Failed to persist deviceId:', err);
	});
}

async function getDeviceName(): Promise<void> {
	const name = await Preferences.get({ key: 'deviceName' });

	const deviceName = name.value
		?? toRaw(deviceInfo.value)?.name
		?? deviceId.value;

	setDeviceName(deviceName);
}

async function getDeviceId(): Promise<void> {
	const device = await Device.getId();
	setDeviceId(device.identifier);
}

(async () => {
	try {
		di.value = await Device.getInfo();
		ci.value = await makeDeviceInfo();

		await getDeviceId();
		await getDeviceName();

		if (isPlatform('capacitor') && isPlatform('android')) {
			ai.value = await android.getInfo();
			bi.value = await Device.getBatteryInfo();
		}
		await android.addListener('appStateChange', (data) => {
			as.value = data;
		});

		console.log({
			appInfo: toRaw(appInfo.value),
			deviceInfo: toRaw(deviceInfo.value),
			batteryInfo: toRaw(batteryInfo.value),
		});
	}
	catch (err) {
		console.error('Failed to initialize device info:', err);
	}
})();
