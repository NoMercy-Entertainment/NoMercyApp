<script setup lang="ts">
import { computed, onMounted, type PropType, watch } from 'vue';
import { type AxiosError } from 'axios';

import { ErrorResponse } from '@/types/server';

import { dashboardBigCardGrid, dashboardCardGrid, dashboardColumnGrid } from '@/config/global';
import useMounted from '@/hooks/useMounted';
import useServerClient from '@/lib/clients/useServerClient';
import { dashboardSocketIsConnected, startDashboardSocket, stopDashboardSocket } from '@/lib/clients/dashboardSocket';
import {setBackground, setColorPalette} from '@/store/ui';

import FloatingBackButton from '@/components/Buttons/FloatingBackButton.vue';
import HelpButton from '@/components/Buttons/HelpButton.vue';
import ScrollContainer from '@/Layout/Desktop/components/ScrollContainer.vue';
import RipperOverlay from "@/Layout/Desktop/components/Overlays/RipperOverlay.vue";
import {ripperMenuOpen} from "@/store/ripper";

const addModalOpen = defineModel({
  required: false,
  type: Boolean,
});

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  params: {
    type: Object,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  gridStyle: {
    type: Number,
    required: false,
    default: 0,
  },
  back: {
    type: Boolean,
    required: false,
    default: false,
  },
  error: {
    type: Object as PropType<AxiosError<unknown, any> | null>,
    required: false,
  },
  allowAnyone: {
    type: Boolean,
    required: false,
    default: false,
  },
  styles: {
    type: String,
    required: false,
  },
});

const { dataUpdatedAt, error: permissionsError, isPending } = useServerClient({
  path: 'dashboard/server',
  enabled: !props.allowAnyone,
  refetchInterval: 10000,
  queryKey: ['dashboard', 'server', dashboardSocketIsConnected.value],
});

const grid = computed(() => {
  if (props.gridStyle == 1) {
    return dashboardCardGrid.value;
  } else if (props.gridStyle == 2) {
    return dashboardColumnGrid.value;
  } else if (props.gridStyle == 3) {
    return dashboardBigCardGrid.value;
  } else if (props.gridStyle == 4) {
    return 'flex flex-wrap h-available';
  } else {
    return 'flex flex-wrap h-available overflow-clip';
  }
});

const accessError = computed(() => {
  if (props.allowAnyone) return null;
  const err = permissionsError.value as AxiosError<ErrorResponse, any> | null;

  if (err?.response?.status == 200) return;

  return {
    code: err?.response?.data?.status ?? null,
    message: err?.response?.data?.detail ?? ''
  };
});

const error = computed(() => {
  const err = props.error as AxiosError<ErrorResponse, any> | null;
  console.log(err);

  if (!err?.response || err?.response?.status == 200) return;

  return {
    code: err?.response?.status,
    message: err?.response?.data?.detail ?? ''
  };
});

onMounted(() => {
  setColorPalette(null);
  setBackground(null);
});

useMounted(startDashboardSocket, stopDashboardSocket, 1);

const showError = computed(() => {
  return (accessError.value?.code || isPending.value || !dashboardSocketIsConnected.value) && !props.allowAnyone;
});

watch(showError, (value) => {
  if (value && addModalOpen.value != undefined) {
    addModalOpen.value = false;
  }
});

watch(dataUpdatedAt, (value) => {
  if (value && !dashboardSocketIsConnected.value) {
    startDashboardSocket();
  }
});

</script>

<template>
  <KeepAlive>
    <div v-if="showError" class="grid h-full w-full place-items-center">
      <div class="relative flex items-center justify-start gap-8 overflow-hidden">
        <div class="relative flex w-full flex-col gap-4">
          <p class="text-7xl font-bold text-center text-slate-light-12/80 dark:text-slate-dark-12/80">
            {{ accessError?.code ? accessError?.code : 'Offline' }}
          </p>
          <p class="left-0 text-2xl text-center text-slate-light-12/80 dark:text-slate-dark-12/80 whitespace-pre-line">
            {{ (accessError as any)?.message }}
          </p>
        </div>
      </div>
    </div>

    <div v-else
         :class="{
          ' min-h-[92vh] sm:min-h-[92.75vh]': !$slots.cta,
          ' min-h-[92vh] sm:min-h-[90.1vh]': !!$slots.cta,
         }"
      class="flex flex-col relative z-0 flex-1*- h-available h-px overflow-clip items-start justify-start self-stretch w-available bg-slate-light-4 dark:bg-slate-dark-2">
      <div
        class="sticky top-0 z-10 flex flex-shrink-0 flex-grow-0 flex-col items-start justify-start gap-5 self-stretch" :inert="ripperMenuOpen">
        <div class="absolute inset-0 z-0 h-full w-full"></div>
        <!--			<Shadow type="linear"/>-->
        <div
          class="z-10 flex h-20 items-center justify-between gap-4 self-stretch border-b px-4 py-4 border-auto-7/6 xl:px-6 bg-slate-light-4 dark:bg-slate-dark-2">
          <div
            class="relative flex h-full flex-col items-start justify-center gap-1 text-slate-light-12/80 dark:text-slate-dark-12/80">
            <p class="w-auto flex-shrink-0 flex-grow-0 self-stretch whitespace-nowrap text-xl font-semibold">
              {{ $t(title, params) }}
            </p>
            <FloatingBackButton v-if="back" position="relative" class="left-4" />
            <p v-else
              class="hidden h-8 w-auto flex-shrink-0 flex-grow-0 items-center self-stretch text-sm empty:hidden lg:flex">
              {{ $t(description) }}
            </p>
          </div>

          <slot name="title" />
          <div class="flex flex-col flex-nowrap items-end justify-center gap-x-3 gap-y-1 sm:flex-row">
            <HelpButton />
            <slot name="cta" />
          </div>
        </div>
      </div>

      <div v-if="error" class="grid h-full w-full place-items-center bg-slate-light-4 dark:bg-slate-dark-2">
        <div class="relative flex flex-col items-center justify-start gap-8 overflow-hidden">
          <div class="relative flex w-full flex-col gap-4">
            <p class="text-7xl font-bold text-center text-slate-light-12/80 dark:text-slate-dark-12/80">
              {{ error.code }}
            </p>
            <p
              class="left-0 text-2xl text-center text-slate-light-12/80 dark:text-slate-dark-12/80 whitespace-pre-line">
              {{ error.message }}
            </p>
          </div>
        </div>
      </div>
      <ScrollContainer v-else :static="true" frame
        class="z-0 w-full flex-1 overflow-y-auto overflow-x-hidden sm:p-4 bg-slate-light-4 dark:bg-slate-dark-2">
        <div class="h-auto w-full flex-wrap content-start gap-4 flex-1" :style="styles" :class="grid">
          <slot />
        </div>
      </ScrollContainer>

      <div v-if="!error && $slots.actions"
        class="sticky bottom-0 z-0 flex w-full flex-wrap items-center gap-4 border-t px-4 py-4 border-auto-7/6 empty:hidden sm:h-16 xl:px-6">
        <div class="absolute inset-0 -z-10 h-full w-full"></div>
        <slot name="actions" />
      </div>

      <RipperOverlay />
    </div>
  </KeepAlive>
</template>
