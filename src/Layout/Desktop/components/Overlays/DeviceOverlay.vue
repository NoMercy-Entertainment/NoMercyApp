<script setup lang="ts">
import {computed, } from 'vue';

import {Device} from "@/types/server";

import {
  connectedDevices,
  currentDeviceId,
  deviceMenuOpen,
  musicSize,
} from "@/store/audioPlayer";
import {deviceId} from "@/store/deviceInfo";
import {musicSocketConnection} from "@/store/musicSocket";

import OptimizedIcon from "@/components/OptimizedIcon.vue";
import {user} from "@/store/user";

const switchDevice = (device: Device) => {
  if (device.device_id === currentDeviceId.value) return;

  musicSocketConnection.value?.invoke('ChangeDeviceCommand', device.device_id)
      .then(() => {
        console.log('Switched to device:', device.device_id);
      })
      .catch((error) => {
        console.error('Error switching device:', error);
      });
};

const currentDevice = computed(() => connectedDevices.value.find(d => d.device_id === currentDeviceId.value));

</script>

<template>
  <div :data-open="deviceMenuOpen" :inert="!deviceMenuOpen" :data-size="musicSize" v-if="user.features?.nomercyConnect"
       class="absolute left-4 sm:left-auto right-4 top-auto -bottom-8 data-[open='true']:full:bottom-28 data-[open='true']:compact:bottom-16 sm:data-[open='true']:full:bottom-4 sm:data-[open='true']:compact:bottom-4 sm:bottom-4 w-available sm:w-1/4 bg-slate-light-3 dark:bg-slate-dark-1 flex items-center justify-center rounded-lg transition-all duration-500 border-2 border-focus data-[open='false']:translate-y-[200%] z-[29999] text-left">
    <div
        class="pointer-events-none absolute inset-0 flex items-center justify-center rounded-lg opacity-60 bg-auto-3/40">
    </div>

    <div id="devices_container"
         class="flex h-full w-full flex-col justify-center gap-2 overflow-auto tv:overflow-clip p-2 scrollbar-none">

      <template :key="device?.id" v-for="device in connectedDevices
          .toSorted((a,b) => (a?.custom_name ?? a?.name).localeCompare((b?.custom_name ?? b?.name)))">
        <button
            class="flex w-full items-center justify-between gap-2 px-2 py-1 rounded-md focus-visible:bg-[#3f3f3f] transition-all duration-200 text-left"
            :class="{
              'bg-[#2f2f2f]': currentDeviceId === device?.device_id,
            }"
            :style="currentDeviceId === device?.device_id && `color: hsl(from rgb(var(--color-focus)) h s calc(l + 25))`"
            @click="currentDevice?.device_id != device.device_id && switchDevice(device)">
          <div class="flex justify-center items-center w-10 h-10 rounded-full"
               v-show="device.type === 'web'">
            <OptimizedIcon icon="laptop" className="w-7 text-auto-12"/>
          </div>
          <div class="flex justify-center items-center w-10 h-10 rounded-full"
               v-show="device.type === 'desktop'">
            <OptimizedIcon icon="monitor" className="w-7 text-auto-12"/>
          </div>
          <div class="flex justify-center items-center w-10 h-10 rounded-full"
               v-show="device.type === 'android' || device.type === 'ios' || device.type === 'tablet'">
            <OptimizedIcon icon="mobilePhone" className="w-7 text-auto-12"/>
          </div>
          <div class="flex justify-center items-center w-10 h-10 rounded-full"
               v-show="device.type === 'tv'">
            <OptimizedIcon icon="tv" className="w-7 text-auto-12"/>
          </div>

          <div class="flex w-full flex-col gap-1">
            <p class="w-full font-semibold leading-none text-md line-clamp-1">
              {{
                deviceId === device?.device_id
                    ? $t('This device')
                    : device?.custom_name ?? device?.name
              }}
            </p>
          </div>
        </button>
      </template>
    </div>
  </div>
</template>
