<script setup lang="ts">
import {type PropType} from 'vue';

import type {QueueResponse} from '@/types/api/dashboard/server';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';


defineProps({
  data: {
    type: Object as PropType<QueueResponse>,
    required: true,
  }
});

</script>

<template>
  <div
      class="flex flex-shrink-0 flex-grow-0 items-start gap-4 self-stretch overflow-hidden rounded-lg py-4 pr-1 pl-4 bg-slate-lightA-3 dark:bg-slate-darkA-3 text-slate-light-12/80 dark:text-slate-dark-12/80"
  >
    <!--    <div-->
    <!--        class="relative flex flex-shrink-0 flex-grow-0 items-start gap-2 self-center rounded-lg p-2 bg-focus/5"-->
    <!--    >-->
    <!--      <MoooomIcon v-if="data.type == 'EncodeVideoJob'" icon="videoSettings" class="relative h-5 w-5 flex-shrink-0 flex-grow-0"/>-->
    <!--      <MoooomIcon v-else icon="file" class="relative h-5 w-5 flex-shrink-0 flex-grow-0"/>-->

    <!--    </div>-->

    <div class="relative flex w-0 flex-1 flex-grow flex-col items-start space-y-[-2px]">
      <p
          class="flex-shrink-0 flex-grow-0 self-stretch text-base font-semibold w-available leading-none line-clamp-1 text-slate-light-12/80 dark:text-slate-dark-12/70"
      >
        {{ data.title.replace(' NoMercy', '') }}
      </p>
      <p
          class="flex-shrink-0 flex-grow-0 self-stretch text-xs w-available !mt-3 text-slate-light-12/80 dark:text-slate-dark-12/80"
      >
        {{ $t('Id') }}:
        <span class="text-slate-light-11 dark:text-slate-dark-11">
          {{ data.id }}
        </span>
      </p>
      <p
          class="flex-shrink-0 flex-grow-0 self-stretch text-xs w-available text-slate-light-12/80 dark:text-slate-dark-12/80"
      >
        {{ $t('Profile') }}:
        <span class="text-slate-light-11 dark:text-slate-dark-11">
          {{ data.profile }}
        </span>
      </p>
      <p
          class="flex-shrink-0 flex-grow-0 self-stretch break-all text-xs w-available text-slate-light-12/80 dark:text-slate-dark-12/80"
      >
        {{ $t('File') }}:
        <span class="text-slate-light-11 dark:text-slate-dark-11">
          {{ data.input_file }}
        </span>
      </p>
    </div>

    <button
        class="relative flex flex-shrink-0 flex-grow-0 items-start justify-start gap-2 overflow-hidden rounded-lg bg-transparent p-1.5 -mt-1.5 -mr-0.5"
    >
      <MoooomIcon icon="cross" class="relative h-5 w-5 flex-shrink-0 flex-grow-0"/>
    </button>
  </div>
</template>
