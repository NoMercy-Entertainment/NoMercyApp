<script setup lang="ts">

import type { ActivityLog, Device } from '@/types/server';

import useServerClient from '@/lib/clients/useServerClient';

import DashboardLayout from '@/Layout/Desktop/DashboardLayout.vue';
import ActivityCard from '@/views/Dashboard/System/System/Components/ServerActivityCard/ActivityCard.vue';

const { data: serverActivity, error: activityError } = useServerClient<
	ActivityLog[]
>({
	path: 'dashboard/activity',
	refetchInterval: 1000 * 20,
	queryKey: ['serveractivity'],
	data: {
		take: 999,
	},
});

const { data: devices, error: devicesError } = useServerClient<Device[]>({
	path: 'dashboard/devices',
	refetchInterval: 1000 * 20,
	queryKey: ['dashboard', 'devices'],
});
</script>

<template>
			<DashboardLayout
				:error="activityError || devicesError"
				title="Activity"
				:grid-style="2"
			>
				<template #cta />

				<ActivityCard
					v-for="activity in serverActivity ?? []"
					:key="activity?.id"
					:devices="devices ?? []"
					:activity="activity"
					class="col-span-2 gap-3"
				/>
			</DashboardLayout>
</template>
