import {UAParser} from 'ua-parser-js';

import {Device} from '@capacitor/device'
import {isTv} from "@/config/global";
import {isPlatform} from "@ionic/vue";
import {useLocalStorage} from "@vueuse/core";
import {deviceId} from "@/store/deviceInfo";

const res = new UAParser().getResult();

export interface ClientInfo {
    id: string;
    browser: string;
    os: string;
    device: string;
    type: string;
    name: string;
    version: string;
    volume_percent: number;
}

export const makeDeviceInfo = async (): Promise<ClientInfo> => {
    const info = await Device.getInfo();

    let deviceType = '';
    switch (info.platform) {
        case 'android':
            deviceType = info.platform;
            if (isPlatform('tablet')) {
                deviceType = 'tablet';
            }
            if (isTv.value) {
                deviceType = 'tv';
            }
            break;
        case 'ios':
            deviceType = info.platform;
            if (isPlatform('tablet')) {
                deviceType = 'tablet';
            }
            break;
        case 'web':
            deviceType = info.platform;
            if (isPlatform('tablet')) {
                deviceType = 'tablet';
            }
            if (isPlatform('electron')) {
                deviceType = 'desktop';
            }
            if (isPlatform('mobileweb')) {
                deviceType = 'android';
            }
            break;
        default:
            deviceType = info.platform;
    }

    const deviceName = info.name
        ?? localStorage.getItem('CapacitorStorage.deviceName')
        ?? localStorage.getItem('CapacitorStorage.deviceId') ?? deviceId.value;

    const volume = useLocalStorage('nmplayer-music-volume', 100);

    return {
        id: localStorage.getItem('CapacitorStorage.deviceId') ?? deviceId.value,
        browser: `${res.browser?.name} ${res.browser?.version}`,
        os: `${info.osVersion.toLowerCase().includes(info.operatingSystem.toLowerCase()) ? '' : info.operatingSystem} ${info.osVersion}`.trim(),
        device: info.manufacturer
            ? `${info.manufacturer} ${info.model}`
            : '',
        type: deviceType,
        name: deviceName,
        version: '0.0.1',
        volume_percent: volume.value
    }
};
