<script setup lang="ts">
import { type PropType, ref, watch } from 'vue';
import { IonItem } from '@ionic/vue';

import type { QueueResponse } from '@/types/api/dashboard/server';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';
import serverClient from "@/lib/clients/serverClient";


const props = defineProps({
  data: {
    type: Object as PropType<QueueResponse>,
    required: true,
  }
});

const priority = ref<number>(props.data.priority ?? 0);

const updatePriority = (value: number) => {
  serverClient()
    .patch(`/dashboard/tasks/queue/${props.data.id}`, {
      id: props.data.id,
      priority: value,
    })
    .then(() => {
      console.log('Priority updated');
    })
};

const deleteItem = () => {
  serverClient()
      .delete(`/dashboard/tasks/queue/${props.data.id}`)
      .then(() => {
        console.log('Item deleted');
      })
};

watch(priority, (value) => {
  console.log(value);
  updatePriority(value);
});

</script>

<template>
  <div
    class="flex flex-shrink-0 flex-grow-0 items-start gap-4 self-stretch overflow-hidden rounded-lg py-4 px-4 bg-slate-lightA-3 dark:bg-slate-darkA-3 text-slate-light-12/80 dark:text-slate-dark-12/80">

    <div class="relative flex flex-1 flex-grow flex-col items-start space-y-[-2px] w-full">
      <span class="flex flex-nowrap w-full justify-between">
        <p class="text-sm font-semibold text-auto-12 line-clamp-1 h-6" :title="data.title.replace(/NoMercy/giu, '')">
          {{ data.title.replace(/NoMercy/giu, '') }}
        </p>
        <button @click="deleteItem"
          class="float-right flex items-center justify-center gap-2 overflow-hidden rounded-lg bg-transparent w-10 -mt-1.5 -mr-1.5 aspect-square">
          <MoooomIcon icon="cross" class="relative h-5 w-5 flex-shrink-0 flex-grow-0" />
        </button>
      </span>

        <p
          class="flex-shrink-0 flex-grow-0 self-stretch text-xs w-available !mt-1 text-slate-light-12/80 dark:text-slate-dark-12/80">
          {{ $t('Id') }}:
          <span class="text-slate-light-11 dark:text-slate-dark-11">
            {{ data.id }}
          </span>
        </p>
        <p
          class="flex-shrink-0 flex-grow-0 self-stretch text-xs w-available text-slate-light-12/80 dark:text-slate-dark-12/80 w-full flex justify-between">
          <span>{{ $t('Priority') }}:</span>
          <InputNumber size="small" variant="filled" showButtons v-model="priority"
            class="ml-auto h-8 first:children:!w-12 last:children:!w-4 children:last:children:!w-4 overflow-clip -mb-2"
            :min="0" :max="100" :step="1" />
        </p>
        <p
          class="flex-shrink-0 flex-grow-0 self-stretch text-xs w-available text-slate-light-12/80 dark:text-slate-dark-12/80">
          {{ $t('Profile') }}:
          <span class="text-slate-light-11 dark:text-slate-dark-11">
            {{ data.profile }}
          </span>
        </p>
        <p
          class="flex-shrink-0 flex-grow-0 self-stretch break-all text-xs w-available text-slate-light-12/80 dark:text-slate-dark-12/80">
          {{ $t('File') }}:
          <span class="text-slate-light-11 dark:text-slate-dark-11">
            {{ data.input_file }}
          </span>
        </p>
    </div>
  </div>
</template>

<style scoped>
.p-inputnumber .p-inputnumber-button {
  --p-inputnumber-button-width: 1rem;
}
</style>