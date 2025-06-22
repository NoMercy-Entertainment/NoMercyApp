<script setup lang="ts">
import type { PropType } from 'vue';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { Card } from 'primevue';

import type { ActivityLog } from '@/types/server';
import type { Device } from '@/types/api/dashboard/server';

import { timeAgoShort } from '@/lib/dateTime';
import { censorPublicIpAddresses } from '@/lib/stringArray';

const props = defineProps({
	activity: {
		type: Object as PropType<ActivityLog>,
		required: true,
	},
	devices: {
		type: Array as PropType<Array<Device>>,
		required: true,
	},
});

const interval = ref<NodeJS.Timeout>();
const showTime = ref('');

onMounted(() => {
	showTime.value = timeAgoShort(new Date(props.activity?.time).getTime());

	interval.value = setInterval(() => {
		showTime.value = timeAgoShort(new Date(props.activity?.time).getTime());
	}, 1000);
});

onUnmounted(() => {
	clearInterval(interval.value);
});

const device = computed(() => {
	const d = props.devices?.find(d => d.id === props.activity?.device_id);
	return {
		name: d?.custom_name || d?.device || d?.device_id,
		ip: censorPublicIpAddresses(d?.ip),
	};
});
</script>

<template>
	<Card>
		<template #title>
			<span class="text-slate-light-12/80 dark:text-slate-dark-12/70">
				{{ activity?.user }} {{ $t(activity?.type) }}
			</span>
		</template>
		<template #content>
			<div class="flex flex-col text-slate-light-12 dark:text-slate-dark-12">
				<p class="flex-shrink-0 flex-grow-0 self-stretch text-sm">
					{{ $t("Time") }}:
					<span class="text-slate-light-11 dark:text-slate-dark-11">
						{{ showTime }}
					</span>
				</p>
				<span class="flex-shrink-0 flex-grow-0 self-stretch text-sm">
					{{ $t("Device") }}:
					<span class="text-slate-light-11 dark:text-slate-dark-11">
						{{ device.name }}
					</span>
				</span>
				<span class="flex-shrink-0 flex-grow-0 self-stretch text-sm">
					{{ $t("IP address") }}:
					<span class="text-slate-light-11 dark:text-slate-dark-11">
						{{ device.ip }}
					</span>
				</span>
			</div>
		</template>
	</Card>
</template>
