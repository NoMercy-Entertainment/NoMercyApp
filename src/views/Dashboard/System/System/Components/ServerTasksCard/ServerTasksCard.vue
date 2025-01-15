<script setup lang="ts">
import {computed, onMounted, ref} from 'vue';

import type {QueueResponse, ServerEncoderProgress} from '@/types/api/dashboard/server';

import {sortBy} from '@/lib/stringArray';
import useServerClient from '@/lib/clients/useServerClient';
import useHubListener from '@/hooks/useHubListener';
import {connection} from "@/lib/clients/dashboardSocket";

import SystemCard from '../ServerSystemCard.vue';
import ServerEncoderTaskCard from './ServerEncoderTaskCard.vue';
import ServerQueueTaskCard from './ServerQueueTaskCard.vue';

onMounted(() => {
  encoderData.value = [];
});

const encoderData = ref<ServerEncoderProgress[]>([]);

const {data: queueData, refetch} = useServerClient<QueueResponse[]>({
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
  return queueData.value?.filter(item => !encoderData.value.find(encoder => encoder.id == item.payload_id));
});

const handleQueue = (data: QueueResponse[]) => {
  queueData.value = data;
};

const handleClear = () => {
  encoderData.value = [];
  refetch();
};

useHubListener(connection, 'encoder-progress', handleProgress);
useHubListener(connection, 'encoder-queue', handleQueue);
useHubListener(connection, 'encoder-clear', handleClear);
useHubListener(connection, 'disconnected', handleClear);

</script>

<template>
  <SystemCard v-if="encoderData.length || queueData?.length" title="Running tasks" :background="false">
    <template v-slot:cta>

    </template>

    <template v-for="data in encoderData ?? []" :key="data.id">
      <ServerEncoderTaskCard :data="data"/>
    </template>

    <template v-for="data in filteredQueueData" :key="data.id">
      <ServerQueueTaskCard :data="data"/>
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
