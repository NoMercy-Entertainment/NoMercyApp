<script lang="ts" setup>
import { computed } from 'vue';

import type { Device } from '@/types/server';

import { connectedMusicDevices, currentMusicDeviceId, deviceMenuOpen, musicSize } from '@/store/audioPlayer';
import { deviceId } from '@/store/deviceInfo';
import { musicSocketConnection } from '@/store/musicSocket';

import { user } from '@/store/user';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';

function switchDevice(device: Device) {
	if (device.device_id === currentMusicDeviceId.value)
		return;

	musicSocketConnection.value
		?.invoke('ChangeDeviceCommand', device.device_id)
		.then(() => {
			console.log('Switched to device:', device.device_id);
		})
		.catch((error) => {
			console.error('Error switching device:', error);
		});
}

const currentDevice = computed(() =>
	connectedMusicDevices.value.find(d => d.device_id === currentMusicDeviceId.value),
);
</script>

<template>
	<div
		v-if="user.features?.nomercyConnect"
		:data-open="deviceMenuOpen"
		:data-size="musicSize"
		:inert="!deviceMenuOpen"
		class="absolute left-4 sm:left-auto right-4 top-auto -bottom-8 data-[open='true']:full:bottom-28 data-[open='true']:compact:bottom-16 sm:data-[open='true']:full:bottom-4 sm:data-[open='true']:compact:bottom-4 sm:bottom-4 w-available sm:w-1/4 bg-surface-3 dark:bg-surface-1 flex items-center justify-center rounded-lg transition-all duration-500 border-2 border-focus data-[open='false']:translate-y-[200%] z-[29999] text-left"
	>
		<div
			class="pointer-events-none absolute inset-0 flex items-center justify-center rounded-lg opacity-60 bg-surface-10/40"
		/>

		<div
			id="devices_container"
			class="flex h-full w-full flex-col justify-center gap-2 overflow-auto tv:overflow-clip p-2 scrollbar-none"
		>
			<template
				v-for="device in connectedMusicDevices"
				:key="device?.device_id"
			>
				<button
					:class="{
						'bg-[#2f2f2f]': currentDevice?.device_id === device?.device_id,
					}"
					:style="
						currentDevice?.device_id === device?.device_id
							&& `color: hsl(from var(--color-theme-8) h s calc(l + 25))`
					"
					class="flex w-full items-center justify-between gap-2 px-2 py-1 rounded-md focus-visible:bg-[#3f3f3f] transition-all duration-200 text-left"
					@click="
						currentDevice?.device_id !== device.device_id
							&& switchDevice(device)
					"
				>
					<div
						v-show="device.type === 'web'"
						class="flex justify-center items-center w-10 h-10 rounded-full"
					>
						<MoooomIcon class-name="w-7" icon="laptop" />
					</div>
					<div
						v-show="device.type === 'desktop'"
						class="flex justify-center items-center w-10 h-10 rounded-full"
					>
						<MoooomIcon class-name="w-7" icon="monitor" />
					</div>
					<div
						v-show="
							device.type === 'android'
								|| device.type === 'ios'
								|| device.type === 'tablet'
						"
						class="flex justify-center items-center w-10 h-10 rounded-full"
					>
						<MoooomIcon class-name="w-7" icon="mobilePhone" />
					</div>
					<div
						v-show="device.type === 'tv'"
						class="flex justify-center items-center w-10 h-10 rounded-full"
					>
						<MoooomIcon class-name="w-7" icon="tv" />
					</div>

					<div class="flex w-full flex-col gap-1">
						<p class="w-full font-semibold leading-none text-md line-clamp-1">
							{{
								deviceId === device?.device_id
									? $t("This device")
									: device?.custom_name ?? device?.name
							}}
						</p>
					</div>
				</button>
			</template>
		</div>
	</div>
</template>
