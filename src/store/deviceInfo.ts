import { computed, ref } from 'vue';

import { App as android, type AppInfo, type AppState } from '@capacitor/app';
import { BatteryInfo, Device, DeviceInfo } from '@capacitor/device';
import { Preferences } from '@capacitor/preferences';
import { isPlatform } from '@ionic/vue';
import {ClientInfo, makeDeviceInfo} from "@/lib/clients/socketClient/device";

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

export const deviceName = ref('');
export function setDeviceName(value: string) {
	deviceName.value = value;
	Preferences.set({ key: 'deviceName', value: value }).then();
}
const getDeviceName = async () => {
	const deviceId = await Device.getId().then((device) => device.identifier);
	const deviceName = (await Preferences.get({ key: 'deviceName' })).value ?? deviceInfo.value?.name ?? deviceId;
	setDeviceName(deviceName);
}

export const deviceId = ref('');
export function setDeviceId(value: string) {
	deviceId.value = value;
	Preferences.set({ key: 'deviceId', value: value }).then();
}
const getDeviceId = async () => {
	const deviceId = await Device.getId().then((device) => device.identifier);
	setDeviceId(deviceId);
}

(async () => {
	di.value = await Device.getInfo();
	ci.value = await makeDeviceInfo();

	await getDeviceName();
	await getDeviceId();

	if (isPlatform('capacitor') && isPlatform('android')) {
		ai.value = await android.getInfo();
		bi.value = await Device.getBatteryInfo();
	}
	await android.addListener('appStateChange', (data) => {
		as.value = data;
	});

	// console.log({
	// 	appInfo: toRaw(appInfo.value),
	// 	deviceInfo: toRaw(deviceInfo.value),
	// 	batteryInfo: toRaw(batteryInfo.value)
	// });

})();
