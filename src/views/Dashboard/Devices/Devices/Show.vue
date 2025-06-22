<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { IonContent, IonPage } from '@ionic/vue';

import type { ActivityLog, Device } from '@/types/server';

import useServerClient from '@/lib/clients/useServerClient';
import DashboardLayout from '@/Layout/Desktop/DashboardLayout.vue';
import ActivityCard from '@/views/Dashboard/System/System/Components/ServerActivityCard/ActivityCard.vue';

const { data: devices, error: devicesError } = useServerClient<Device[]>({
	path: 'dashboard/devices',
	queryKey: ['dashboard', 'devices'],
});

const { data: serverActivity, error: activityError } = useServerClient<
	ActivityLog[]
>({
	path: 'dashboard/activity',
	refetchInterval: 1000 * 20,
	data: {
		take: 999,
	},
	queryKey: ['server', 'activity'],
});

const route = useRoute();

const name = computed(() => {
	return devices.value?.find(sa => sa.device_id === route?.params.id)
		?.custom_name;
});
</script>

<template>
	<IonPage>
		<IonContent :fullscreen="true">
			<DashboardLayout
				:params="{ name }"
				title="Device avtivity: {{name}}"
				:error="devicesError || activityError"
				:grid-style="2"
			>
				<template #cta />
				<ActivityCard
					v-for="activity in serverActivity?.filter(
						(sa) => sa.device_id === route?.params.id,
					) ?? []"
					:key="activity?.id"
					:devices="devices ?? []"
					:activity="activity"
					class="col-span-2 gap-3 w-full"
				/>
			</DashboardLayout>
		</IonContent>
	</IonPage>
</template>
