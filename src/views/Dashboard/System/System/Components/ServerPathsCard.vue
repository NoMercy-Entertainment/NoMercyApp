<script setup lang="ts">

import type {SystemPath} from '@/types/api/dashboard/server';

import useServerClient from '@/lib/clients/useServerClient';
import {currentServer} from '@/store/currentServer';

import SystemCard from './ServerSystemCard.vue';

const {data: paths} = useServerClient<SystemPath[]>({
  path: 'dashboard/server/paths',
  queryKey: ['serverpaths', currentServer.value?.serverBaseUrl],
});

</script>

<template>
  <SystemCard title="Paths">
    <template v-for="path in paths" :key="path.key">
      <div
          class="relative flex flex-shrink-0 flex-grow-0 flex-col items-start justify-start self-stretch overflow-clip w-available"
      >
        <p
            class="self-stretch text-sm font-semibold text-[#eeecec] whitespace-nowrap"
        >
          {{ path.key }}:
        </p>
        <p class="flex-shrink-0 flex-grow-0 self-stretch text-sm text-auto-alpha-10 line-clamp-1">
          {{ path.value }}
        </p>
      </div>
    </template>
  </SystemCard>
</template>
