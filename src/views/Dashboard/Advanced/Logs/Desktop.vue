<script setup lang="ts">
import {onMounted, ref, watch} from "vue";
import {refDebounced} from "@vueuse/core";
import {IonPage, IonContent} from '@ionic/vue';

import type {LogEntry, LogType} from "@/types/server";

import useServerClient from "@/lib/clients/useServerClient";
import serverClient from "@/lib/clients/serverClient";
import {sensorPublicIpAddresses} from "@/lib/stringArray";
import {userTime} from "@/lib/dateTime";
import {connection} from "@/lib/clients/dashboardSocket";
import DashboardLayout from "@/Layout/Desktop/DashboardLayout.vue";
import useHubListener from "@/hooks/useHubListener";

import DropdownMenu from "@/Layout/Desktop/components/Menus/DropdownMenu.vue";
import MoooomIcon from "@/components/Images/icons/MoooomIcon.vue";
import LogModal from "@/views/Dashboard/Advanced/Logs/components/LogModal.vue";
import LogTypeSelector from "@/views/Dashboard/Advanced/Logs/components/LogTypeSelector.vue";

const selectedTypes = ref<LogType[]>([]);
const selectedTypeNames = ref<string[]>([]);
const selectedLevels = ref<string[]>([]);
const limit = ref(50);
const logs = ref<LogEntry[]>([]);
const filter = ref('');
const debouncedFilter = refDebounced(filter, 500);

const {data, refetch} = useServerClient<LogEntry[]>({
  path: '/dashboard/logs',
  queryKey: ['logs'],
  refetchInterval: 5 * 60 * 1000,
  data: {
    limit: limit,
    types: selectedTypeNames,
    levels: selectedLevels,
    filter: debouncedFilter,
  }
});

watch(data, value => {
  if (!value) return;
  logs.value = value;
})

const {data: logTypes} = useServerClient<LogType[]>({
  path: '/dashboard/logs/types',
});

const {data: levels} = useServerClient<string[]>({
  path: '/dashboard/logs/levels',
});

watch(limit, () => {
  refetch();
});
watch(debouncedFilter, () => {
  refetch();
});
watch(levels, value => {
  if (!value) return;
  selectedLevels.value = value;
});

watch(selectedTypes, value => {
  if (!value) return;
  selectedTypeNames.value = value.map(v => v.name);
  refetch();
});

const handleAddLog = (data: LogEntry) => {
  if (!selectedLevels.value.includes(data.level)) return;
  logs.value = logs.value
      .slice(0, logs.value.length - 1);

  logs.value = [
    data,
    ...logs.value,
  ];
}

useHubListener(connection, 'NewLog', handleAddLog);

onMounted(() => {
  if (!data.value || !levels.value || !selectedTypes.value) return;

  logs.value = data.value;
  selectedLevels.value = levels.value;

  refetch();
});

const currentLog = ref<LogEntry | null>(null)
const showLogOpen = ref(false);
const openLog = (item: LogEntry) => {
  currentLog.value = item;
  showLogOpen.value = true;
};
const closeLog = (e: Event) => {
  e.stopPropagation();
  currentLog.value = null;
  showLogOpen.value = false;
};

const handleClear = () => {
  serverClient()
      .delete('/dashboard/logs')
      .catch(() => {
        alert("you'd think this would actually do something huh 😋");
      })
      .then(() => {
        logs.value = [];
      });
}

const handleLevel = (value: string) => {
  if (selectedLevels.value.some(selectedLevel => selectedLevel == value)) {
    selectedLevels.value = selectedLevels.value.filter(selectedLevel => selectedLevel != value);
  } else {
    selectedLevels.value.push(value);
  }
  refetch();
}


</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true">

      <DashboardLayout :gridStyle="4" description="" title="Logs">

        <template v-slot:cta>
        </template>

        <table
            class="mx-2 flex flex-col overflow-auto rounded-lg outline outline-1 min-w-available min-h-available divide-y divide-auto-12/8 h-inherit outline-auto-alpha-5 max-h-[78vh] min-h-[78vh]">

          <thead
              class="flex flex-grow-0 items-start justify-start self-stretch rounded-tl-lg rounded-tr-lg w-available">

          <tr class="flex w-full flex-1 gap-4 text-xs font-medium bg-auto-2/10">
            <th
                class="relative flex h-11 items-center justify-between gap-3 self-stretch p-3 group/tableButton w-[150px] min-w-[150px]">
              <span>{{ $t('Limit') }} ({{ limit }})</span>

              <DropdownMenu
                  class="relative flex items-center justify-center gap-2 rounded-lg transition-colors duration-300 hover:bg-auto-5/6"
                  translate="-translate-x-1/2">

                <template v-slot:button>
                  <MoooomIcon className="w-6" icon="chevronDown"/>
                </template>

                <div class="flex w-full flex-col items-start justify-between py-2 bg-auto-1">
                  <template v-for="l in [5,10,20,50,100,500,1000,2000]">
                    <button class="flex flex-grow items-center justify-start gap-3 rounded-md px-2.5"
                            @click="limit = l">
                      <Checkbox :modelValue="limit == l" :label="l"/>
                    </button>
                  </template>
                </div>

              </DropdownMenu>
            </th>
            <th
                class="relative flex h-11 items-center justify-between gap-3 self-stretch p-3 group/tableButton w-[120px] min-w-[120px]">
              <span>{{ $t('Type') }}</span>
              <LogTypeSelector v-if="logTypes" :logTypes="logTypes" v-model:selectedTypes="selectedTypes" :refetch="refetch"/>
            </th>
            <th
                class="relative flex h-11 items-center justify-between gap-3 self-stretch p-3 group/tableButton w-[120px] min-w-[120px]">
              <span>{{ $t('Level') }}</span>
              <DropdownMenu
                  class="relative flex items-center justify-center gap-2 rounded-lg transition-colors duration-300 hover:bg-auto-5/6"
                  translate="-translate-x-1/2">
                <template v-slot:button>
                  <MoooomIcon className="w-6" icon="chevronDown"/>
                </template>

                <div class="flex w-full flex-col items-start justify-between py-2 bg-auto-1">
                  <template v-for="level in levels">
                    <button class="flex flex-grow items-center justify-start gap-3 rounded-md px-2.5"
                            @click="() => handleLevel(level)">
                      <Checkbox :modelValue="selectedLevels?.includes(level)" :label="level"/>
                    </button>
                  </template>
                </div>
              </DropdownMenu>
            </th>
            <th
                class="relative flex h-11 items-center justify-between gap-3 self-stretch p-3 group/tableButton w-available">
              <span>{{ $t('Message') }}</span>
              <InputText id="filter"
                     v-model="filter"
                         variant="filled"
                         size="small"
                     class="mr-auto ml-4 min-w-40"
                     name=""
                     placeholder="Filter..."
              />
            </th>
            <th
                class="relative flex h-11 w-20 items-center justify-between gap-3 self-stretch p-3 group/tableButton min-w-20">
              <Button
                  id="clear"
                  className="!py-1 !h-8"
                  color="theme"
                  title="Clear logs"
                  variant="text"
                  @click="handleClear"
              >
                {{ $t('clear') }}
              </Button>
            </th>
          </tr>
          </thead>

          <tbody class="overflow-auto divide-y divide-auto-12/5 h-available">
          <template v-for="log in logs ?? []">
            <tr class="flex h-12 w-full flex-1 justify-center gap-4 odd:bg-white/[0.04]">
              <td
                  class="relative flex flex-grow items-center justify-start whitespace-nowrap px-3 text-xs line-clamp-1 w-[150px] min-w-[150px]">
                {{ userTime(log.time) }}
              </td>
              <td
                  class="relative flex flex-grow items-center justify-center whitespace-nowrap text-xs line-clamp-1 w-[120px] min-w-[120px]">
                <div :style="`background: ${log.color}55`" class="h-5 w-min rounded-full px-2 text-center leading-5">
                  {{ logTypes?.find(t => t.name == log.type)?.display_name }}
                </div>
              </td>
              <td
                  class="relative flex flex-grow items-center justify-start whitespace-nowrap px-3 text-xs line-clamp-1 w-[120px] min-w-[120px]">
                {{ log.level }}
              </td>
              <td
                  class="relative flex flex-grow cursor-pointer items-center justify-start whitespace-nowrap px-3 text-xs line-clamp-1 w-available"
                  @click="() => openLog(log)">
                {{ sensorPublicIpAddresses(log.message) }}
              </td>
            </tr>
          </template>
          </tbody>
        </table>

        <LogModal
            v-if="currentLog?.level"
            :id="currentLog?.level"
            :close="closeLog"
            :data="currentLog"
            :name="currentLog?.level"
            :open="showLogOpen"/>

      </DashboardLayout>
    </ion-content>
  </ion-page>
</template>
