<script setup lang="ts">
import {computed} from "vue";

import {connectedDevices, currentDeviceId, deviceMenuOpen, musicSize, toggleDeviceMenuOpen} from '@/store/audioPlayer';
import {deviceId} from "@/store/deviceInfo";
import {user} from "@/store/user";

import MusicButton from './MusicButton.vue';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';

defineProps({
  noName: {
    type: Boolean,
    default: false,
  },
})

const handleClick = (e?: MouseEvent) => {
  e?.stopPropagation();
  toggleDeviceMenuOpen();
};

const currentDevice = computed(() => connectedDevices.value.find(d => d.device_id === currentDeviceId.value));

</script>

<template>
  <div data-target="devices" v-if="user.features?.nomercyConnect"
       class="flex items-center h-10 rounded-full !text-xs focus-visible:bg-transparent active:bg-transparent hover:bg-transparent"
       :data-current_device="currentDeviceId">
    <MusicButton label="Playing on this device" :onclick="handleClick">
      <MoooomIcon icon="devices" class="h-6 w-6 text-focus" v-if="deviceMenuOpen"/>
      <MoooomIcon icon="devices" class="h-6 w-6" v-else/>
    </MusicButton>
    <p :data-size="musicSize" v-if="!noName"
       class="text-auto-900 flex sm:hidden compact:hidden pointer-events-none !text-sm min-w-full whitespace-nowrap pl-2 pr-8 max-w-64">
      {{
        currentDeviceId === deviceId
            ? $t('This device')
            : currentDevice?.custom_name ?? currentDevice?.name
      }}
    </p>
  </div>
</template>
