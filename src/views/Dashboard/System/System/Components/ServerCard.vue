<script setup lang="ts">
import { type PropType } from 'vue';
import { Card } from 'primevue';

import type { Server } from '@/types/auth';

import DeviceIcon from '@/components/Images/icons/DeviceIcon.vue';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';

defineProps({
  server: {
    type: Object as PropType<Server>,
    required: true,
  }
});

</script>

<template>
  <Card>
    <template #title>
    </template>
    <template #content>
      <div class="flex flex-col">
        <div
          class="flex flex-col justify-end items-center w-full overflow-hidden rounded-xl border-[1.5px] border-[#e2f0fd]/4 transition-transform duration-200 cursor-pointer max-w-[360px]">
          <div
            class="flex flex-col justify-start items-start self-stretch bg-auto-1 bg-[radial-gradient(81.87%_66.22%_at_0%_0%,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0)_100%)] w-full h-auto aspect-video">
            <div
              class="relative m-auto flex aspect-video h-auto w-full flex-shrink-0 flex-grow-0 flex-col items-center justify-center self-stretch  text-slate-light-12 dark:text-slate-dark-12 bg-focus/8">
              <DeviceIcon v-if="server.platform" :icon="server.platform" className="!w-32" />
            </div>
          </div>
          <div
            class="relative flex flex-shrink-0 flex-grow-0 items-center justify-start self-stretch px-4 py-2 bg-auto-1">
            <div class="relative flex flex-grow flex-col items-start justify-center text-left">
              <p
                class="flex-shrink-0 flex-grow-0 self-stretch text-sm font-semibold  text-slate-light-12 dark:text-slate-dark-12 line-clamp-1">
                {{ server.server_name }}
              </p>
              <p class="flex-shrink-0 flex-grow-0 self-stretch text-xs text-auto-alpha-10">
                {{ server.internal_ip }}
              </p>
            </div>
            <MoooomIcon icon="menuDotsVertical" className="w-5" />
          </div>
        </div>
      </div>
  </Card>
</template>
