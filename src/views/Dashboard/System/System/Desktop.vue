<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue';

import { connection, dashboardSocketIsConnected } from '@/lib/clients/dashboardSocket';

import DashboardLayout from '@/Layout/Desktop/DashboardLayout.vue';

import ServerResourceCard from './Components/ServerResouceCard/ServerResourceCard.vue';
import ServerSystemCard from './Components/ServerSystemCard.vue';
import ServerTasksCard from './Components/ServerTasksCard/ServerTasksCard.vue';
import ServerActivityCard from './Components/ServerActivityCard/ServerActivityCard.vue';
import ServerSystemInfoCard from '@/views/Dashboard/System/System/Components/ServerSystemInfoCard.vue';
import useServerClient from '@/lib/clients/useServerClient';
import { currentServer } from '@/store/currentServer';

const showing = ref(true);

watch(connection, (value) => {
	showing.value = !!value;
});

onMounted(() => {
	setTimeout(() => {
		showing.value = !!connection.value;
	}, 1000);
});

const { data: storage, error } = useServerClient({
	path: 'dashboard/server/storage',
	queryKey: ['dashboard', 'storage', currentServer.value?.serverBaseUrl],
});

onMounted(() => {
	console.raw(storage.value);
});

const supportsMasonry = computed(() =>
	window.CSS.supports('grid-template-rows: masonry'),
);
</script>

<template>
			<DashboardLayout
				:grid-style="supportsMasonry ? 3 : 2"
				styles="grid-template-rows: masonry; masonry-surface-flow: next;"
				title="Dashboard overview"
			>
				<template #cta />

				<template v-if="supportsMasonry">
					<ServerSystemInfoCard />
					<ServerTasksCard />
					<ServerActivityCard />
					<ServerResourceCard v-if="dashboardSocketIsConnected" />
					<ServerSystemCard
						v-else
						class="animate-pulse"
						title="Resources monitor"
					>
						<template #cta />
						<div class="min-h-80" />
					</ServerSystemCard>
				</template>

				<template v-else>
					<div
						class="col-span-3 col-start-1 flex flex-col gap-4 lg:col-span-2 xl:col-span-2 xl:col-start-1 xl:row-start-1"
					>
						<ServerSystemInfoCard />

						<ServerResourceCard v-if="dashboardSocketIsConnected" />
						<ServerSystemCard
							v-else
							class="animate-pulse"
							title="Resources monitor"
						>
							<template #cta />
							<div class="min-h-80" />
						</ServerSystemCard>
					</div>
					<div
						class="col-span-3 col-start-1 flex flex-col gap-4 lg:col-span-2 xl:col-span-2 xl:col-start-3 xl:row-start-1"
					>
						<ServerTasksCard />
					</div>
					<div
						class="col-span-3 col-start-1 flex flex-col gap-4 lg:col-span-2 lg:col-start-1 lg:row-start-2 2xl:col-span-2 2xl:col-start-5 2xl:row-start-1 2xl:flex"
					>
						<ServerActivityCard />
					</div>
				</template>
			</DashboardLayout>
</template>
