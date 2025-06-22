<script setup lang="ts">
import type { ActivityLog, Device } from '@/types/server';

import useServerClient from '@/lib/clients/useServerClient';

import SystemCard from '../ServerSystemCard.vue';
import ActivityCard from './ActivityCard.vue';
import { dashboardSocketIsConnected } from '@/lib/clients/dashboardSocket';

const { data: serverActivity } = useServerClient<ActivityLog[]>({
	path: 'dashboard/activity',
	refetchInterval: 10000,
	data: {
		take: 999,
	},
	queryKey: ['server', 'activity'],
});

const { data: devices } = useServerClient<Device[]>({
	path: 'dashboard/devices',
	refetchInterval: 10000,
	queryKey: ['devices'],
});
</script>

<template>
	<SystemCard
		v-if="dashboardSocketIsConnected"
		title="Activity"
		:background="false"
	>
		<template #cta />

		<ActivityCard
			v-for="activity in serverActivity?.slice(0, 5) ?? []"
			:key="activity?.id"
			:devices="devices ?? []"
			:activity="activity"
		/>
	</SystemCard>
</template>
