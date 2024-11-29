<script setup lang="ts">
import {computed, onMounted, ref} from 'vue';

import type {Resource} from '@/types/api/dashboard/resource';

import useMounted from '@/hooks/useMounted';
import useHubListener from '@/hooks/useHubListener';
import {connection} from '@/lib/clients/dashboardSocket';
import {useSocket} from '@/store/socket';

import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';

import SystemCard from '../ServerSystemCard.vue';
import ResourceBar from './ResourceBar.vue';
import ResourceCircle from './ResourceCircle.vue';

const resources = ref<Resource>();

const handleResourceUpdate = (data: Resource) => {
  if (!data) return;
  resources.value = data;
};

useMounted(
    () => connection.value?.invoke('StartResources'),
    () => connection.value?.invoke('StopResources')
);

useHubListener(connection, 'ResourceUpdate', handleResourceUpdate);

const connected = () => {
  connection.value?.invoke('StartResources');
};

onMounted(() => {
  const socket = useSocket();
  socket?.onreconnected(connected);
});

const display = ref<'bar' | 'graph'>('bar');

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

</script>

<template>
  <SystemCard title="Resources monitor">

    <template v-slot:cta>

    </template>

    <div
        class="flex items-start justify-between gap-2 overflow-clip w-available"
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
      <div class="relative flex flex-shrink-0 flex-grow-0 items-center justify-start gap-6 self-stretch pb-2">
        <div
            class="ml-auto flex items-start justify-start overflow-hidden rounded-lg border-2 border-auto-alpha-8">
          <button @click="display = 'bar'"
                  :class="display == 'bar' ? 'bg-auto-alpha-5 text-theme-8' : 'bg-auto-alpha-2'"
                  class="relative flex flex-shrink-0 flex-grow-0 items-center justify-center border-r-2 transition-transform duration-300 p-2.5 border-auto-alpha-8"
          >
            <MoooomIcon icon="bulletList" className="w-5"/>
          </button>
          <button @click="display = 'graph'"
                  :class="display == 'graph' ? 'bg-auto-alpha-5 text-theme-8' : 'bg-auto-alpha-2'"
                  class="relative flex flex-shrink-0 flex-grow-0 items-center justify-center transition-transform duration-300 p-2.5"
          >
            <MoooomIcon icon="barChart" className="w-5"/>
          </button>
        </div>
      </div>

      <template v-if="display == 'bar'">
        <template v-for="(core, index) in resources?.cpu?.core ?? []" :key="core.index">
          <ResourceBar :cpu="index" :value="core.utilization" v-if="!Number.isNaN(core.utilization)"/>
        </template>
      </template>

      <template v-if="display == 'graph'">

      </template>
    </div>
  </SystemCard>
</template>
