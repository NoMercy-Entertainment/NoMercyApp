import { UAParser } from 'ua-parser-js';

import {Device} from '@capacitor/device'
import {isTv} from "@/config/global";
import {isPlatform} from "@ionic/vue";
import {useLocalStorage} from "@vueuse/core";

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
    const uuid = await Device.getId();

    let deviceType = '';
    switch (info.platform) {
        case 'android':
            deviceType = info.platform;
            if(isTv.value) {
                deviceType = 'tv';
            }
            if(isPlatform('tablet')) {
                deviceType = 'tablet';
            }
            break;
        case 'ios':
            deviceType = info.platform;
            if(isPlatform('tablet')) {
                deviceType = 'tablet';
            }
            break;
        case 'web':
            deviceType = info.platform;
            if(isPlatform('electron')) {
                deviceType = 'desktop';
            }
            if(isPlatform('tablet')) {
                deviceType = 'tablet';
            }
            break;
        default:
            deviceType = info.platform;
    }

    const deviceName = info.name ?? localStorage.getItem('CapacitorStorage.deviceName') ?? uuid.identifier;
    const volume = useLocalStorage('nmplayer-music-volume', 100);

    return {
        id: uuid.identifier,
        browser: `${res.browser?.name} ${res.browser?.version}`,
        os: `${info.operatingSystem} ${info.osVersion}`,
        device: info.manufacturer
            ? `${info.manufacturer} ${info.model}`
            : '',
        type: deviceType,
        name: deviceName,
        version: '0.0.1',
        volume_percent: volume.value
    }
};
