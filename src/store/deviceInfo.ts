import {computed, ref, toRaw} from 'vue';

import {App as android, type AppInfo, type AppState} from '@capacitor/app';
import {BatteryInfo, Device, DeviceInfo} from '@capacitor/device';
import {isPlatform} from '@ionic/vue';

const ai = ref<AppInfo>();
export const appInfo = computed(() => ai.value);

const di = ref<DeviceInfo>();
export const deviceInfo = computed(() => di.value);

const bi = ref<BatteryInfo>();
export const batteryInfo = computed(() => bi.value);

const as = ref<AppState>();
export const appState = computed(() => as.value);

(async () => {
	di.value = await Device.getInfo();

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
		batteryInfo: toRaw(batteryInfo.value)
	});

})();
