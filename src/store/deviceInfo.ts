import { computed, ref, toRaw } from 'vue';

import { App as android } from '@capacitor/app';
import type { AppInfo, AppState } from '@capacitor/app';
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

export const deviceName = useLocalStorage('deviceName', '');
export function setDeviceName(value: string) {
	deviceName.value = value;
	Preferences.set({ key: 'deviceName', value }).then();
}

async function getDeviceName() {
	const deviceId = await Device.getId().then(device => device.identifier);
	const deviceName
		= (await Preferences.get({ key: 'deviceName' })).value
			?? deviceInfo.value?.name
			?? deviceId;
	setDeviceName(deviceName);
}

export const deviceId = useLocalStorage('deviceId', '');
export function setDeviceId(value: string) {
	deviceId.value = value;
	Preferences.set({ key: 'deviceId', value }).then();
}

async function getDeviceId() {
	const deviceId = await Device.getId().then(device => device.identifier);
	setDeviceId(deviceId);
}

(async () => {
	await getDeviceName();
	await getDeviceId();

	di.value = await Device.getInfo();
	ci.value = await makeDeviceInfo();

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
})();
