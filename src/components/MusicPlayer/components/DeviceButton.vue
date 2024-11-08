<script setup lang="ts">

import MusicButton from './MusicButton.vue';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';
import {deviceMenuOpen, toggleDeviceMenuOpen} from '@/store/audioPlayer';

const handleClick = (e?: MouseEvent) => {
	e?.stopPropagation();
  toggleDeviceMenuOpen();
};

</script>

<template>
    <MusicButton label=""
                 :onclick="handleClick">
        <div data-target="devices"
             class="flex items-center h-10 rounded-full !text-xs focus-visible:bg-transparent active:bg-transparent hover:bg-transparent"
             data-current_device="b1e90166-b05e-3f8f-bcaa-474fd334c04c">
            <MusicButton  label=""
                 :onclick="handleClick"
                    aria-label="Playing on this device"
                    data-state="closed">
                <MoooomIcon icon="devices" class="h-6 w-6 text-focus" v-if="deviceMenuOpen" />
                <MoooomIcon icon="devices" class="h-6 w-6" v-else />
            </MusicButton>
            <p
               class="text-auto-900 hidden compact:hidden pointer-events-none !text-sm min-w-full whitespace-nowrap pl-2 pr-8 max-w-64 css-1045ydt">
                {{ $t('this device') }}
            </p>
        </div>
    </MusicButton>
</template>
