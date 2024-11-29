<script setup lang="ts">
import {computed, onMounted, ref} from 'vue';

import type {QueueResponse, ServerEncoderProgress} from '@/types/api/dashboard/server';

import {sortBy} from '@/lib/stringArray';
import useServerClient from '@/lib/clients/useServerClient';
import useHubListener from '@/hooks/useHubListener';
import {socketInstance} from '@/store/socket';

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
  refetchInterval: 10000,
});

const handleProgress = (data: ServerEncoderProgress) => {
  if (data.status == 'running' || data.status == 'paused') {
    encoderData.value = sortBy([...encoderData.value.filter(item => item?.id !== data?.id), data], 'id');
  } else if (data.status == 'completed') {
    encoderData.value = sortBy([...encoderData.value.filter(item => item?.id !== data?.id)], 'id');
    refetch();
  }
};

const filteredQueueData = computed(() => {
  return queueData.value?.filter(item => !encoderData.value.find(encoder => encoder.id === item.id));
});

const handleQueue = (data: QueueResponse[]) => {
  queueData.value = data;
};

const handleClear = () => {
  encoderData.value = [];
  refetch();
};

useHubListener(socketInstance, 'encoder-progress', handleProgress);
useHubListener(socketInstance, 'encoder-queue', handleQueue);
useHubListener(socketInstance, 'encoder-clear', handleClear);
useHubListener(socketInstance, 'disconnected', handleClear);

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
        class="relative flex items-start justify-start gap-2 self-stretch rounded-lg p-4 bg-auto-2/6 dark:bg-auto-alpha-3">
        <span class="flex-shrink-0 flex-grow-0 self-stretch text-sm font-semibold">
          {{ $t('No tasks are currently running') }}
        </span>
    </div>
  </SystemCard>
</template>
