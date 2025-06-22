<script setup lang="ts">
import { IonContent, IonPage } from '@ionic/vue';
import { useQueryClient } from '@tanstack/vue-query';

import type { Device } from '@/types/server';

import useServerClient from '@/lib/clients/useServerClient';
import serverClient from '@/lib/clients/serverClient';

import DashboardLayout from '@/Layout/Desktop/DashboardLayout.vue';
import ServerDeviceCard from '@/views/Dashboard/System/System/Components/ServerDeviceCard.vue';
import OptimizedIcon from '@/components/OptimizedIcon.vue';

const query = useQueryClient();

const { data: devices, error } = useServerClient<Device[]>({
	path: 'dashboard/devices',
	queryKey: ['dashboard', 'devices'],
});

async function handleDelete() {
	await serverClient()
		.delete<any, any>('/dashboard/devices', {
			forceUpdate: true,
			synchronous: false,
		})
		.then(() => {
			query.invalidateQueries({ queryKey: ['devices'] });

			// showNotification({
			//     title: t('Activity logs deleted'),
			//     type: TYPE.SUCCESS,
			//     visibleOnly: true,
			//     duration: 2000,
			// });
		})
		.catch(() => {
			// showNotification({
			//     title: `${t('Something went wrong')} ${t('trying to delete activity logs')}`,
			//     type: TYPE.ERROR,
			//     visibleOnly: true,
			//     duration: 2000,
			// });
		});
}
</script>

<template>
	<IonPage>
		<IonContent :fullscreen="true">
			<DashboardLayout :error="error" :grid-style="1" title="Devices">
				<template #cta>
					<button
						class="relative flex h-10 flex-shrink-0 flex-grow-0 items-center justify-center gap-2 overflow-hidden rounded-lg border px-4 py-2.5 bg-theme-9 border-theme-5"
						@click="handleDelete"
					>
						<OptimizedIcon icon="trash" />
						<p class="text-left text-xs font-semibold line-clamp-1 sm:text-sm">
							{{ $t("Delete all") }}
						</p>
					</button>
				</template>

				<template v-for="device in devices ?? []">
					<ServerDeviceCard
						v-if="device?.id"
						:server="device"
						base-path="devices"
					/>
				</template>
			</DashboardLayout>
		</IonContent>
	</IonPage>
</template>
