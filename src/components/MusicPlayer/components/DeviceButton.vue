<script lang="ts" setup>
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
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';

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
		:data-current_device="currentMusicDeviceId"
		:onclick="handleClick"
		class="flex gap-2 items-center flex-nowrap"
		data-target="devices"
		label="Playing on this device"
	>
		<MoooomIcon
			v-if="deviceMenuOpen"
			class="h-6 w-6 text-focus"
			icon="devices"
		/>
		<MoooomIcon v-else class="h-6 w-6" icon="devices" />
		<p
			v-if="!noName"
			:data-size="musicSize"
			class="text-surface-900 flex sm:hidden compact:hidden pointer-events-none !text-sm min-w-full whitespace-nowrap pl-2 max-w-72"
		>
			{{
				currentMusicDeviceId === deviceId
					? $t("This device")
					: currentDevice?.custom_name ?? currentDevice?.name
			}}
		</p>
	</MusicButton>
</template>
