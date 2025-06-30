<script setup lang="ts">
import { computed } from 'vue';

import {
	connectedMusicDevices,
	currentMusicDeviceId,
	deviceMenuOpen,
	musicSize,
	toggleDeviceMenuOpen,
} from '@/store/audioPlayer';
import { deviceId } from '@/store/deviceInfo';
import { user } from '@/store/user';

import MusicButton from './MusicButton.vue';
import OptimizedIcon from '@/components/OptimizedIcon.vue';

defineProps({
	noName: {
		type: Boolean,
		default: false,
	},
});

function handleClick(e?: MouseEvent) {
	e!.stopPropagation();
	toggleDeviceMenuOpen();
}

const currentDevice = computed(() =>
	connectedMusicDevices.value.find(
		d => d.device_id === currentMusicDeviceId.value,
	),
);
</script>

<template>
	<MusicButton
		v-if="user.features?.nomercyConnect"
		data-target="devices"
		label="Playing on this device"
		:onclick="handleClick"
		class="flex gap-2 items-center flex-nowrap"
		:data-current_device="currentMusicDeviceId"
	>
		<OptimizedIcon
			v-if="deviceMenuOpen"
			icon="devices"
			class="h-6 w-6 text-focus"
		/>
		<OptimizedIcon v-else icon="devices" class="h-6 w-6" />
		<p
			v-if="!noName"
			:data-size="musicSize"
			class="text-auto-900 flex sm:hidden compact:hidden pointer-events-none !text-sm min-w-full whitespace-nowrap pl-2 max-w-72"
		>
			{{
				currentMusicDeviceId === deviceId
					? $t("This device")
					: currentDevice?.custom_name ?? currentDevice?.name
			}}
		</p>
	</MusicButton>
</template>
