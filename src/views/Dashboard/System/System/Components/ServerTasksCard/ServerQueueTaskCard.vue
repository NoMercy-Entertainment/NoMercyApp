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
      class="flex flex-shrink-0 flex-grow-0 items-start gap-4 self-stretch overflow-hidden rounded-lg py-2 pr-1 pl-2 bg-auto-2/6 dark:bg-auto-alpha-3"
  >
    <!--    <div-->
    <!--        class="relative flex flex-shrink-0 flex-grow-0 items-start gap-2 self-center rounded-lg p-2 bg-focus/5"-->
    <!--    >-->
    <!--      <MoooomIcon v-if="data.type == 'EncodeVideoJob'" icon="videoSettings" class="relative h-5 w-5 flex-shrink-0 flex-grow-0"/>-->
    <!--      <MoooomIcon v-else icon="file" class="relative h-5 w-5 flex-shrink-0 flex-grow-0"/>-->

    <!--    </div>-->

    <div class="relative flex w-0 flex-1 flex-grow flex-col items-start space-y-[-2px]">
      <p
          class="flex-shrink-0 flex-grow-0 self-stretch text-sm font-semibold w-available"
      >
        {{ data.title.replace(' NoMercy', '') }}
      </p>
      <p
          class="flex-shrink-0 flex-grow-0 self-stretch text-xs w-available dark:text-auto-alpha-10"
      >
        {{ $t('Id') }}: {{ data.id }}
      </p>
      <p
          class="flex-shrink-0 flex-grow-0 self-stretch text-xs w-available dark:text-auto-alpha-10"
      >
        {{ $t('Profile') }}: {{ data.profile }}
      </p>
      <p
          class="flex-shrink-0 flex-grow-0 self-stretch break-all text-xs w-available dark:text-auto-alpha-10"
      >
        {{ $t('File') }}: {{ data.input_file }}
      </p>
    </div>

    <button
        class="relative flex flex-shrink-0 flex-grow-0 items-start justify-start gap-2 overflow-hidden rounded-lg bg-transparent p-1.5 -mt-1.5 -mr-0.5 dark:text-auto-alpha-10"
    >
      <MoooomIcon icon="cross" class="relative h-5 w-5 flex-shrink-0 flex-grow-0"/>
    </button>
  </div>
</template>
