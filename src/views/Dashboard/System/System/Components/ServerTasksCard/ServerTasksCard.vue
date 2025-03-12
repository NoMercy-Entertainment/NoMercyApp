<script setup lang="ts">
import {computed, onMounted, ref} from 'vue';

import type { QueueResponse, ServerEncoderProgress } from '@/types/api/dashboard/server';

import { sortBy } from '@/lib/stringArray';
import useServerClient from '@/lib/clients/useServerClient';
import useHubListener from '@/hooks/useHubListener';
import { connection } from "@/lib/clients/dashboardSocket";

import SystemCard from '../ServerSystemCard.vue';
import ServerEncoderTaskCard from './ServerEncoderTaskCard.vue';
import ServerQueueTaskCard from './ServerQueueTaskCard.vue';

onMounted(() => {
  encoderData.value = [];
});

const encoderData = ref<ServerEncoderProgress[]>([]);
const displayAll = ref(false);

const { data: queueData, refetch } = useServerClient<QueueResponse[]>({
  path: 'dashboard/tasks/queue',
  queryKey: ['queue'],
  refetchInterval: 30000,
});

const handleProgress = (data: ServerEncoderProgress) => {
  if (data.status == 'running' || data.status == 'paused') {
    encoderData.value = sortBy([...encoderData.value.filter(item => item?.id !== data?.id), data], 'id');
  } else {
    encoderData.value = sortBy([...encoderData.value.filter(item => item?.id !== data?.id)], 'id');
    refetch();
  }
};

const filteredQueueData = computed(() => {
  const filtered = queueData.value?.filter(item =>
      !encoderData.value.find(encoder => encoder.id == item.payload_id)
  ) ?? [];

  if (displayAll.value) {
    return filtered;
  }

  if (filtered.length <= 20) {
    return filtered;
  }

  return [
    ...filtered.slice(0, 10),
    ...filtered.slice(-10)
  ];
});

const handleQueue = (data: QueueResponse[]) => {
  queueData.value = data;
};

const handleClear = () => {
  encoderData.value = [];
  refetch();
};

const toggleDisplayAll = () => {
  displayAll.value = !displayAll.value;
};

useHubListener(connection, 'encoder-progress', handleProgress);
useHubListener(connection, 'encoder-queue', handleQueue);
useHubListener(connection, 'encoder-clear', handleClear);
useHubListener(connection, 'disconnected', handleClear);

</script>

<template>
  <SystemCard v-if="encoderData.length || queueData?.length" title="Running tasks" :background="false">

    <template v-slot:cta>
      <button @click="toggleDisplayAll"
          class="relative h-7 flex flex-shrink-0 flex-grow-0 items-center justify-center gap-2 overflow-hidden border border-solid border-slate-light-10 dark:border-slate-dark-10 text-slate-light-12/80 dark:text-slate-dark-12/80 rounded-lg px-2 py-1">
        <p class="flex-shrink-0 flex-grow-0 text-sm">
          {{ displayAll ? $t('Show less') : $t('Show all') }}
        </p>
      </button>
    </template>

    <template v-for="data in encoderData ?? []" :key="data.id">
      <ServerEncoderTaskCard :data="data" />
    </template>

    <template v-for="data in filteredQueueData" :key="data.id">
      <ServerQueueTaskCard :data="data" />
    </template>
  </SystemCard>

  <SystemCard v-else title="Running tasks" :background="false">
    <div
      class="relative flex items-start justify-start gap-2 self-stretch rounded-lg p-4 bg-slate-lightA-3 dark:bg-slate-darkA-3 text-slate-light-12/80 dark:text-slate-dark-12/80">
      <span class="flex-shrink-0 flex-grow-0 self-stretch text-sm font-semibold">
        {{ $t('No tasks are currently running') }}
      </span>
    </div>
  </SystemCard>
</template>
