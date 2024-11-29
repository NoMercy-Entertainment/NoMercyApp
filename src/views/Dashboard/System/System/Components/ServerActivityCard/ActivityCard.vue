<script setup lang="ts">
import {computed, onMounted, onUnmounted, PropType, ref} from 'vue';
import {Card} from 'primevue';

import type {ActivityLog} from '@/types/server';
import type {Device} from '@/types/api/dashboard/server';

import {timeAgoShort} from '@/lib/dateTime';
import {sensorPublicIpAddresses} from '@/lib/stringArray';

const props = defineProps({
  activity: {
    type: Object as PropType<ActivityLog>,
    required: true,
  },
  devices: {
    type: Array as PropType<Array<Device>>,
    required: true,
  }
});

const interval = ref<NodeJS.Timeout>();
const showTime = ref('');

onMounted(() => {
  showTime.value = timeAgoShort(new Date(props.activity?.time).getTime());

  interval.value = setInterval(() => {
    showTime.value = timeAgoShort(new Date(props.activity?.time).getTime());
  }, 1000 * 5);
});

onUnmounted(() => {
  clearInterval(interval.value);
});

const device = computed(() => {
  const d = props.devices?.find(d => d.id == props.activity?.device_id);
  return {
    name: d?.custom_name || d?.device || d?.device_id,
    ip: sensorPublicIpAddresses(d?.ip),
  };
});

</script>

<template>
  <Card>
    <template #title>
      {{ activity?.user }} {{ $t(activity?.type) }}
    </template>
    <template #content>
      <div class="flex flex-col">
        <p class="flex-shrink-0 flex-grow-0 self-stretch text-sm dark:text-auto-alpha-10">
          {{ $t('Time') }}: {{ showTime }}
        </p>
        <span class="flex-shrink-0 flex-grow-0 self-stretch text-sm dark:text-auto-alpha-10">
                    {{ $t('Device') }}: {{ device.name }}
                </span>
        <span class="flex-shrink-0 flex-grow-0 self-stretch text-sm dark:text-auto-alpha-10">
                    {{ $t('IP address') }}:
                    {{ device.ip }}
                </span>
      </div>
    </template>
  </Card>
</template>
