<script setup lang="ts">

import { type PropType } from "vue";
import type { Device } from '@/types/api/dashboard/server';
import type { DeviceIcons } from '@Icons/icons';

import DashboardCard from '@/components/Cards/DashboardCard.vue';
import DeviceIcon from '@/components/Images/icons/DeviceIcon.vue';

const props = defineProps({
    server: {
        type: Object as PropType<Device>,
        required: true,
    },
    basePath: {
        type: String,
        required: false,
        default: 'server',
    },
});


let icon: keyof typeof DeviceIcons;
switch (props.server.browser) {
    case 'android':
    case 'Android':
    case 'android tv':
    case 'Android TV':
    case 'Chrome WebView':
    case 'Android 10':
    case 'Android 11':
    case 'Android 12':
    case 'Android 13':
    case 'Android 14':
    case 'Android 15':
        icon = 'android';
        break;
    case 'apple':
    case 'Apple':
    case 'Apple iPhone':
    case 'iPhone':
    case 'iPad':
        icon = 'apple';
        break;
    case 'Mobile Safari':
        icon = 'safari';
        break;
    case 'arc':
    case 'Arc':
        icon = 'arc';
        break;
    case 'brave':
    case 'Brave':
        icon = 'brave';
        break;
    case 'chrome':
    case 'Chrome':
    case 'chromium':
    case 'Chromium':
    case 'google chrome':
    case 'Google Chrome':
        icon = 'chrome';
        break;
    case 'edge':
    case 'Edge':
    case 'microsoft edge':
    case 'Microsoft Edge':
        icon = 'edgeOld';
        break;
    case 'edge chromium':
    case 'Edge Chromium':
        icon = 'edge';
        break;
    case 'firefox':
    case 'Firefox':
        icon = 'firefox';
        break;
    case 'html5':
    case 'Html5':
        icon = 'html5';
        break;
    case 'kodi':
    case 'Kodi':
        icon = 'kodi';
        break;
    case 'msie':
    case 'Msie':
        icon = 'msie';
        break;
    case 'opera':
    case 'Opera':
    case 'opera gx':
    case 'Opera GX':
        icon = 'opera';
        break;
    case 'playstation':
    case 'Playstation':
        icon = 'playstation';
        break;
    case 'safari':
    case 'Safari':
        icon = 'safari';
        break;
    case 'samsung':
    case 'Samsung':
    case 'samsung tv':
    case 'Samsung TV':
        icon = 'samsung';
        break;
    case 'samsung internet':
    case 'Samsung Internet':
        icon = 'samsungInternet';
        break;
    case 'windows':
    case 'Windows':
        icon = 'windows';
        break;
    case 'xbox':
    case 'Xbox':
        icon = 'xbox';
        break;
    case 'electron':
    case 'Electron':
        icon = 'electron';
        break;
    case 'linux':
    case 'Linux':
        icon = 'linux';
        break;
    default:
}
console.log('ServerDeviceCard', props.server.browser, icon);

</script>

<template>
    <DashboardCard :line1="server.custom_name ?? server.name" :line2="server.ip" :route="`/dashboard/${basePath}/${server.id}`">
        <template v-slot:image>
            <div
                class="flex flex-col justify-start items-start self-stretch bg-auto-1 bg-[radial-gradient(81.87%_66.22%_at_0%_0%,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0)_100%)] w-full h-auto aspect-video">
                <div
                    class="relative m-auto flex aspect-video h-auto w-full flex-shrink-0 flex-grow-0 flex-col items-center justify-center self-stretch text-auto-12 bg-focus/8">
                    <DeviceIcon :icon="icon" className="!w-[40%]" />
                </div>
            </div>
        </template>
    </DashboardCard>
</template>
