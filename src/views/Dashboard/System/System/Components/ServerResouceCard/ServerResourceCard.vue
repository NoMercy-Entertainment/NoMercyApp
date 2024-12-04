<script setup lang="ts">
import {computed, onMounted, ref, watch} from 'vue';
import Chart from 'primevue/chart';

import type {Resource} from '@/types/api/dashboard/resource';
import type {ServerInfo} from "@/types/api/dashboard/server";

import useMounted from '@/hooks/useMounted';
import useHubListener from '@/hooks/useHubListener';
import {connection} from '@/lib/clients/dashboardSocket';
import {useSocket} from '@/store/socket';
import {getCpuColor, getGpuColor, hexOpacity} from "@/lib/colorHelper";
import {orange, purple} from "@/config/global";
import useServerClient from "@/lib/clients/useServerClient";
import {currentServer} from "@/store/currentServer";

import SystemCard from '../ServerSystemCard.vue';
import ResourceBar from './ResourceBar.vue';
import ResourceCircle from './ResourceCircle.vue';
import {darkMode} from "@/store/colorScheme";

const {data: serverInfo} = useServerClient<ServerInfo>({
  path: 'dashboard/server/info',
  queryKey: ['serverInfo', currentServer.value?.serverBaseUrl],
});

const resources = ref<Resource>();

const display = ref<'bar' | 'graph'>('graph');

const MAX_DATA_POINTS = 20;
const lableGraph = ref<string[]>(Array(MAX_DATA_POINTS).fill(''));
const cpuGraph = ref<number[]>(Array(MAX_DATA_POINTS).fill(null));
const memoryGraph = ref<number[]>(Array(MAX_DATA_POINTS).fill(null));
const gpuGraph = ref<number[][]>(Array(MAX_DATA_POINTS).fill([null]));

const handleResourceUpdate = (data: Resource) => {
  if (!data) return;
  resources.value = data;

  // lableGraph.value = [...lableGraph.value.slice(-MAX_DATA_POINTS), new Date().toLocaleTimeString()];
  cpuGraph.value = [...cpuGraph.value.slice(-MAX_DATA_POINTS), cpuUsage.value];
  memoryGraph.value = [...memoryGraph.value.slice(-MAX_DATA_POINTS), memoryUsage.value];
  gpuGraph.value = [...gpuGraph.value.slice(-MAX_DATA_POINTS), gpuCores.value];
};

useMounted(
    () => connection.value?.invoke('StartResources'),
    () => connection.value?.invoke('StopResources').catch(),
);

useHubListener(connection, 'ResourceUpdate', handleResourceUpdate);

const connected = () => {
  connection.value?.invoke('StartResources');
};

onMounted(() => {
  const socket = useSocket();
  socket?.onreconnected(connected);
});

const cpuCores = computed(() => {
  return resources.value?.cpu?.core
      // .filter(c => !Number.isNaN(c))
      ?.toSorted((a, b) => a.index - b.index) ?? [];
});

const gpuCores = computed(() => {
  return resources.value?.gpu
      // ?.filter(c => !Number.isNaN(c))
      ?.toSorted((a, b) => a.index - b.index)
      .map(gpu => gpu.encode) ?? [];
});

const cpuUsage = computed(() => {
  if (!resources.value?.cpu?.core?.length) return -1;

  return Math.floor(cpuCores.value?.reduce((a, b) => a + b.utilization, 0) / cpuCores.value.length);
});

const memoryUsage = computed(() => {
  if (resources.value?.memory?.percentage == 'NaN') return -1;

  return resources.value?.memory?.percentage ?? -1;
});

const gpuUsage = computed(() => {
  if (resources.value?.gpu?.length == 0) return -1;

  const result = Math.floor(gpuCores.value?.reduce((a, b) => a + b, 0) / gpuCores.value.length);

  if (Number.isNaN(result)) return -1;

  return result;
});

const size = computed(() => {
  return (window.innerWidth - 5000) / 3;
});

const generateOpacityValues = (gpus: string[]) => {
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
};

const chartData = computed(() => {

  return {
    labels: lableGraph.value,
    datasets: [
      ...serverInfo.value?.cpu?.map((core, index) => {
        const color = purple ?? getCpuColor(core);
        return {
          label: `CPU ${index}`,
          data: cpuGraph.value.map(c => c),
          fill: false,
          tension: 0.4,
          yAxisID: 'y',
          borderColor: hexOpacity(color, 50),
          backgroundColor: hexOpacity(color, 50),
        };
      }) ?? [],
      {
        label: 'Memory (%)',
        data: memoryGraph.value,
        fill: false,
        tension: 0.4,
        yAxisID: 'y',
        borderColor: hexOpacity(orange, 50),
        backgroundColor: hexOpacity(orange, 50),
      },
      ...serverInfo.value?.gpu?.map((core, index) => {

        const c = generateOpacityValues(serverInfo.value?.gpu)[index]
        const color = hexOpacity(c.color, c.opacity);

        return {
          label: `GPU ${index}`,
          data: gpuGraph.value.map(g => g[index]),
          fill: false,
          tension: 0.4,
          yAxisID: 'y',
          borderColor: color,
          backgroundColor: color,
        };
      }) ?? [],
    ],
  };
});

const chartOptions = computed(() => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = darkMode.value
      ? `rgb(${documentStyle.getPropertyValue('--color-slate-12')})`
      : `rgb(${documentStyle.getPropertyValue('--color-slate-1')})`;
  const textColorSecondary = textColor;

  const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

  return {
    stacked: false,
    indexAxis: 'x',
    maintainAspectRatio: false,
    aspectRatio: 0.8,
    animation: false,
    plugins: {
      legend: {
        labels: {
          color: textColor
        },
      }
    },
    scales: {
      x: {
        ticks: {
          color: textColorSecondary
        },
        grid: {
          color: surfaceBorder
        },
      },
      y: {
        display: true,
        min: 0,
        max: 100,
        ticks: {
          color: textColorSecondary
        },
        grid: {
          color: surfaceBorder
        },
      }
    }
  };
});

const chartHeight = computed(() => {
  const number = serverInfo.value?.gpu?.length ?? 0;
  const baseHeight = 136;
  const additionalHeightPerGpu = 40;
  const additionalHeight = ((number * additionalHeightPerGpu) + baseHeight);
  return `${additionalHeight}px`;
});

</script>

<template>
  <SystemCard title="Resources monitor">

    <template v-slot:cta>

    </template>

    <div
        class="flex items-start justify-between gap-2 overflow-clip w-available text-slate-light-12/80 dark:text-slate-dark-12/80"
    >
      <ResourceCircle name="CPU"
                      :value="cpuUsage"
                      :size="size"/>

      <div class="w-px flex-shrink-0 flex-grow-0 self-stretch bg-white/10"></div>

      <ResourceCircle name="Memory"
                      :value="memoryUsage"
                      :size="size"/>

      <div class="w-px flex-shrink-0 flex-grow-0 self-stretch bg-white/10"></div>

      <ResourceCircle name="GPU"
                      :value="gpuUsage"
                      :size="size"/>
    </div>
    <div
        class="flex flex-shrink-0 flex-grow-0 flex-col items-start justify-start self-stretch"
    >
<!--      <div class="relative flex flex-shrink-0 flex-grow-0 items-center justify-start gap-6 self-stretch pb-2">-->
<!--        <div-->
<!--            class="ml-auto flex items-start justify-start overflow-hidden rounded-lg border-2 border-auto-alpha-8">-->
<!--          <button @click="display = 'bar'"-->
<!--                  :class="display == 'bar' ? 'bg-auto-alpha-5 text-theme-8' : 'bg-auto-alpha-2'"-->
<!--                  class="relative flex flex-shrink-0 flex-grow-0 items-center justify-center border-r-2 transition-transform duration-300 p-2.5 border-auto-alpha-8"-->
<!--          >-->
<!--            <MoooomIcon icon="bulletList" className="w-5 text-slate-light-12/80 dark:text-slate-dark-12/80"/>-->
<!--          </button>-->
<!--          <button @click="display = 'graph'"-->
<!--                  :class="display == 'graph' ? 'bg-auto-alpha-5 text-theme-8' : 'bg-auto-alpha-2'"-->
<!--                  class="relative flex flex-shrink-0 flex-grow-0 items-center justify-center transition-transform duration-300 p-2.5"-->
<!--          >-->
<!--            <MoooomIcon icon="barChart" className="w-5 text-slate-light-11/80 dark:text-slate-dark-11/80"/>-->
<!--          </button>-->
<!--        </div>-->
<!--      </div>-->

      <template v-if="display == 'bar'">
        <template v-for="(core, index) in resources?.cpu?.core ?? []" :key="core.index">
          <ResourceBar :cpu="index" :value="core.utilization" v-if="!Number.isNaN(core.utilization)"/>
        </template>
      </template>

      <template v-if="display == 'graph'">
        <Chart type="line" :data="chartData" :options="chartOptions" :style="`height: ${chartHeight}`"
               class="w-available"
        />
      </template>
    </div>
  </SystemCard>
</template>
