<script setup lang="ts">
import {computed} from "vue";

import {connectedDevices, currentDeviceId, deviceMenuOpen, musicSize, toggleDeviceMenuOpen} from '@/store/audioPlayer';
import {deviceId} from "@/store/deviceInfo";
import {user} from "@/store/user";

import MusicButton from './MusicButton.vue';
import OptimizedIcon from '@/components/OptimizedIcon.vue';

defineProps({
  noName: {
    type: Boolean,
    default: false,
  },
})

const handleClick = (e?: MouseEvent) => {
  e!.stopPropagation();
  toggleDeviceMenuOpen();
};

const currentDevice = computed(() => connectedDevices.value.find(d => d.device_id === currentDeviceId.value));

</script>

<template>
  <MusicButton
      v-if="user.features?.nomercyConnect"
      data-target="devices"
      label="Playing on this device"
      :onclick="handleClick"
      class="flex gap-2 items-center flex-nowrap"
      :data-current_device="currentDeviceId">    <OptimizedIcon icon="devices" class="h-6 w-6 text-focus" v-if="deviceMenuOpen"/>
    <OptimizedIcon icon="devices" class="h-6 w-6" v-else/>
    <p :data-size="musicSize" v-if="!noName"
       class="text-auto-900 flex sm:hidden compact:hidden pointer-events-none !text-sm min-w-full whitespace-nowrap pl-2 max-w-72">
      {{
        currentDeviceId === deviceId
            ? $t('This device')
            : currentDevice?.custom_name ?? currentDevice?.name
      }}
    </p>
  </MusicButton>
</template>
