<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import Chart from 'primevue/chart';

import type { Resource } from '@/types/api/dashboard/resource';
import type { ServerInfo } from '@/types/api/dashboard/server';

import useMounted from '@/hooks/useMounted';
import useHubListener from '@/hooks/useHubListener';
import { connection } from '@/lib/clients/dashboardSocket';
import { useVideoSocket } from '@/store/videoSocket';
import { getCpuColor, getGpuColor, hexOpacity } from '@/lib/colorHelper';
import { orange, purple } from '@/config/global';
import useServerClient from '@/lib/clients/useServerClient';
import { currentServer } from '@/store/currentServer';

import SystemCard from '../ServerSystemCard.vue';
import ResourceBar from './ResourceBar.vue';
import ResourceCircle from './ResourceCircle.vue';
import type { ChartOptions } from 'chart.js';
import { useLocalStorage } from '@vueuse/core';

const { data: serverInfo } = useServerClient<ServerInfo>({
	path: 'dashboard/server/info',
	queryKey: ['serverInfo', currentServer.value?.serverBaseUrl],
});

const resources = ref<Resource>();

const display = ref<'bar' | 'graph'>('graph');

const MAX_DATA_POINTS = 40;
const lableGraph = ref<string[]>(Array.from({ length: MAX_DATA_POINTS }).fill('') as string[]);
const cpuGraph = ref<number[]>(Array.from({ length: MAX_DATA_POINTS }).fill(null) as number[]);
const memoryGraph = ref<number[]>(Array.from({ length: MAX_DATA_POINTS }).fill(null) as number[]);
const gpuGraph = ref<number[][]>(Array.from({ length: MAX_DATA_POINTS }).fill([null]) as number[][]);

useMounted(
	() => connection.value?.invoke('StartResources'),
	() => connection.value?.invoke('StopResources').catch(),
	10,
);

function connected() {
	connection.value?.invoke('StartResources');
}

onMounted(() => {
	const socket = useVideoSocket();
	socket?.onreconnected(connected);
});

const cpuCores = computed(() => {
	return (
		resources.value?.cpu?.core
		// .filter(c => !Number.isNaN(c))
			?.toSorted((a, b) => a.index - b.index) ?? []
	);
});

const gpuCores = computed(() => {
	return (
		resources.value?.gpu
		// ?.filter(c => !Number.isNaN(c))
			?.toSorted((a, b) => a.index - b.index)
			.map(gpu => (gpu.power + gpu.core) / 2) ?? []
	);
});

const cpuUsage = computed(() => {
	if (!resources.value?.cpu?.core?.length)
		return -1;

	return Math.floor(
		cpuCores.value?.reduce((a, b) => a + b.utilization, 0)
		/ cpuCores.value.length,
	);
});

const memoryUsage = computed(() => {
	if (resources.value?.memory?.percentage === 'NaN')
		return -1;

	return resources.value?.memory?.percentage ?? -1;
});

const gpuUsage = computed(() => {
	if (resources.value?.gpu?.length === 0)
		return -1;

	const result = Math.floor(
		gpuCores.value?.reduce((a, b) => a + b, 0) / gpuCores.value.length,
	);

	if (Number.isNaN(result))
		return -1;

	return result;
});

const size = computed(() => {
	return (window.innerWidth - 5000) / 3;
});

function generateOpacityValues(gpus: string[]) {
	const minOpacity = 25;
	const maxOpacity = 75;
	const maxOpacitiesPerColor = 3;

	if (gpus.length === 1) {
		return [{ color: getGpuColor(gpus[0]), opacity: 50 }];
	}

	const step = (maxOpacity - minOpacity) / (maxOpacitiesPerColor - 1);
	const opacityValues = [];

	for (let i = 0; i < gpus.length; i++) {
		const opacity = minOpacity + (i % maxOpacitiesPerColor) * step;
		opacityValues.push({ color: getGpuColor(gpus[i]), opacity });
	}

	return opacityValues;
}

function handleResourceUpdate(data: Resource) {
	if (!data)
		return;
	resources.value = data;

	// lableGraph.value = [...lableGraph.value.slice(-MAX_DATA_POINTS), new Date().toLocaleTimeString()];
	cpuGraph.value = [...cpuGraph.value.slice(-MAX_DATA_POINTS), cpuUsage.value];
	memoryGraph.value = [
		...memoryGraph.value.slice(-MAX_DATA_POINTS),
		memoryUsage.value,
	];
	gpuGraph.value = [...gpuGraph.value.slice(-MAX_DATA_POINTS), gpuCores.value];
}

useHubListener(connection, 'ResourceUpdate', handleResourceUpdate);

const chartData = computed(() => {
	return {
		labels: lableGraph.value,
		datasets: [
			...(serverInfo.value?.cpu?.map((core, index) => {
				const color = purple ?? getCpuColor(core);
				return {
					label: `CPU ${serverInfo.value?.cpu.length > 1 ? index : ''}`,
					data: cpuGraph.value,
					yAxisID: 'y',
					borderColor: hexOpacity(color, 50),
				};
			}) ?? []),
			{
				label: 'Memory',
				data: memoryGraph.value,
				yAxisID: 'y',
				borderColor: hexOpacity(orange, 50),
			},
			...(serverInfo.value?.gpu?.map((core, index) => {
				const c = generateOpacityValues(serverInfo.value?.gpu)[index];
				const color = hexOpacity(c.color, c.opacity);

				return {
					label: `GPU ${serverInfo.value?.gpu.length > 1 ? index : ''}`,
					data: gpuGraph.value.map(g => g[index]),
					yAxisID: 'y',
					borderColor: color,
				};
			}) ?? []),
		],
	};
});

const legendPosition = useLocalStorage<'left' | 'top' | 'right' | 'bottom'>(
	'legendPosition',
	'bottom',
);

const chartOptions = computed(() => {
	const documentStyle = getComputedStyle(document.documentElement);
	const textColor = documentStyle.getPropertyValue('--surface-12');

	const surfaceBorder = documentStyle.getPropertyValue(
		'--p-content-border-color',
	);
	const positionOptions: Array<'left' | 'top' | 'right' | 'bottom'> = [
		'left',
		'top',
		'right',
		'bottom',
	];

	const options: ChartOptions<'line'> = {
		indexAxis: 'x',
		maintainAspectRatio: false,
		animation: false,
		plugins: {
			legend: {
				labels: {
					color: textColor,
				},
				value: legendPosition.value,
				onClick() {
					legendPosition.value
						= positionOptions[
							(positionOptions.indexOf(legendPosition.value) + 1)
							% positionOptions.length
						];
				},
			},
		},
		elements: {
			line: {
				tension: 0.2,
			},
			point: {
				pointStyle: false,
			},
		},
		scales: {
			x: {
				ticks: {
					color: 'transparent',
				},
				grid: {
					color: 'transparent',
				},
			},
			y: {
				min: 0,
				max: 100,
				beginAtZero: true,
				clip: true,
				ticks: {
					color: textColor,
				},
				grid: {
					color: surfaceBorder,
				},
			},
		},
	};
	return options;
});

const chartHeight = computed(() => {
	const number = serverInfo.value?.gpu?.length ?? 0;
	const baseHeight = 120;
	const additionalHeightPerGpu = 40;
	const additionalHeight = number * additionalHeightPerGpu + baseHeight;
	return `${additionalHeight}px`;
});
</script>

<template>
	<SystemCard title="Resources monitor">
		<template #cta />

		<div
			class="flex items-start justify-between gap-2 overflow-clip w-available text-surface-12/80"
		>
			<ResourceCircle :size="size" :value="cpuUsage" name="CPU" />

			<div
				class="w-px flex-shrink-0 flex-grow-0 self-stretch bg-white/10"
			/>

			<ResourceCircle :size="size" :value="memoryUsage" name="Memory" />

			<div
				class="w-px flex-shrink-0 flex-grow-0 self-stretch bg-white/10"
			/>

			<ResourceCircle :size="size" :value="gpuUsage" name="GPU" />
		</div>
		<div
			class="flex flex-shrink-0 flex-grow-0 flex-col items-start justify-start self-stretch"
		>
			<template v-if="display === 'bar'">
				<template
					v-for="(core, index) in resources?.cpu?.core ?? []"
					:key="core.index"
				>
					<ResourceBar
						v-if="!Number.isNaN(core.utilization)"
						:cpu="index"
						:value="core.utilization"
					/>
				</template>
			</template>

			<template v-if="display === 'graph'">
				<Chart
					:data="chartData"
					:options="chartOptions"
					:style="`height: ${chartHeight}`"
					class="w-available"
					type="line"
				/>
			</template>
		</div>
	</SystemCard>
</template>
