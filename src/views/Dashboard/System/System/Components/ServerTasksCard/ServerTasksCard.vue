<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';

import type { QueueResponse, ServerEncoderProgress } from '@/types/api/dashboard/server';

import { sortBy } from '@/lib/utils/array';
import useServerClient from '@/lib/clients/useServerClient';
import useHubListener from '@/hooks/useHubListener';
import { connection } from '@/lib/clients/dashboardSocket';

import SystemCard from '../ServerSystemCard.vue';
import ServerEncoderTaskCard from './ServerEncoderTaskCard.vue';
import ServerQueueTaskCard from './ServerQueueTaskCard.vue';

const encoderData = ref<ServerEncoderProgress[]>([]);
const displayAll = ref(false);

const { data: queueData, refetch } = useServerClient<QueueResponse[]>({
	path: 'dashboard/tasks/queue',
	queryKey: ['queue'],
	refetchInterval: 30000,
});

onMounted(() => {
	encoderData.value = [];
});

function handleProgress(data: ServerEncoderProgress) {
	if (data.status === 'running' || data.status === 'paused') {
		encoderData.value = sortBy(
			[...encoderData.value.filter(item => item.id !== data.id), data],
			'id',
		);
	}
	else {
		encoderData.value = sortBy(
			[...encoderData.value.filter(item => item.id !== data.id)],
			'id',
		);
		refetch();
	}
}

const filteredQueueData = computed(() => {
	const filtered
		= queueData.value?.filter(
			item =>
				!encoderData.value.find(encoder => encoder.title === item.title),
		) ?? [];

	if (displayAll.value) {
		return filtered;
	}

	if (filtered.length <= 20) {
		return filtered;
	}

	return [...filtered.slice(0, 5), ...filtered.slice(-5)];
});

function handleQueue(data: QueueResponse[]) {
	queueData.value = data;
}

function handleClear() {
	encoderData.value = [];
	refetch();
}

function toggleDisplayAll() {
	displayAll.value = !displayAll.value;
}

useHubListener(connection, 'encoder-progress', handleProgress);
useHubListener(connection, 'encoder-queue', handleQueue);
useHubListener(connection, 'encoder-clear', handleClear);
useHubListener(connection, 'disconnected', handleClear);
</script>

<template>
	<SystemCard
		v-if="encoderData.length || queueData?.length"
		:background="false"
		title="Running tasks"
	>
		<template #count>
			<span
				class="h-7 w-min flex rounded-lg px-2 border border-solid border-surface-12/11 text-surface-11 text-sm font-semibold"
			>
				{{ encoderData.length + (queueData?.length ?? 0) }}
			</span>
		</template>
		<template #cta>
			<!-- number pill with the amount of tasks -->
			<button
				class="relative h-7 flex flex-shrink-0 flex-grow-0 items-center justify-center gap-2 overflow-hidden border border-solid border-surface-12/11 rounded-lg pl-1 pr-2 py-1 text-surface-12/11"
				@click="toggleDisplayAll"
			>
				<p class="flex-shrink-0 flex-grow-0 text-sm">
					{{ displayAll ? $t("Show less") : $t("Show all") }}
				</p>
			</button>
		</template>

		<template
			v-for="data in encoderData.toSorted((a, b) =>
				a.title.localeCompare(b.title),
			) ?? []"
			:key="data.id"
		>
			<ServerEncoderTaskCard :data="data" />
		</template>

		<template v-for="data in filteredQueueData" :key="data.id">
			<ServerQueueTaskCard :data="data" />
		</template>
	</SystemCard>

	<SystemCard v-else :background="false" title="Running tasks">
		<div
			class="relative flex items-start justify-start gap-2 self-stretch rounded-lg p-4 text-surface-11 bg-surface-12/2"
		>
			<span
				class="flex-shrink-0 flex-grow-0 self-stretch text-sm font-semibold"
			>
				{{ $t("No tasks are currently running") }}
			</span>
		</div>
	</SystemCard>
</template>
