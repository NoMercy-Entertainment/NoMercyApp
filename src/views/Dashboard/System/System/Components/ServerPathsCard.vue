<script setup lang="ts">

import type {SystemPath} from '@/types/api/dashboard/server';

import useServerClient from '@/lib/clients/useServerClient';
import {currentServer} from '@/store/currentServer';

import SystemCard from './ServerSystemCard.vue';
import {MoooomIcons} from "@Icons/icons";
import {onMounted, ref, watch} from "vue";
import MeterGroup from "primevue/metergroup";
import type {LibrariesResponse} from "@/types/api/base/library";
import {green, purple, orange, blue, gray} from "@/config/global";
import {hexOpacity} from "@/lib/colorHelper";
import {dashboardSocketIsConnected} from "@/lib/clients/dashboardSocket";

// const {data: paths} = useServerClient<SystemPath[]>({
//   path: 'dashboard/server/paths',
//   queryKey: ['serverpaths', currentServer.value?.serverBaseUrl],
// });

const {data: libraries} = useServerClient<LibrariesResponse[]>({
  path: 'dashboard/libraries',
  queryKey: ['dashboard', 'libraries', currentServer.value?.serverBaseUrl],
});

interface Drive {
  name: string;
  data: {
    label: string;
    color: string;
    value: number;
    icon: `mooooom-${keyof typeof MoooomIcons}`;
  }[]
}

const generateRandomValues = (type: 'anime'|'movies'|'shows'|'music') => {
  let movies = 0, shows = 0, music = 0, other = 0;

  switch (type) {
    case 'movies':
      movies = Math.random() * 75;
      other = Math.random() * (100 - movies);
      break;
    case 'shows':
      shows = Math.random() * 75;
      other = Math.random() * (100 - shows);
      break;
    case 'music':
      music = Math.random() * 75;
      other = Math.random() * (100 - music);
      break;
    default:
      movies = Math.random() * 50;
      shows = Math.random() * (100 - movies);
      other = Math.random() * (100 - movies - shows);
      break;
  }

  const free = 100 - movies - shows - music - other;
  return { movies, shows, music, other, free };
};

const drives = ref<Drive[]>([]);

watch(libraries, (value) => {
  if (!value) return;
  drives.value = value.map(l => l.folder_library.map(lib => {
    const {movies, shows, music, other, free} = generateRandomValues(l.type);
    return {
      name: lib.folder.path,
      data: [
        {label: 'Movies', color: hexOpacity(green, 50), value: movies},
        {label: 'TV Shows', color: hexOpacity(orange, 50), value: shows},
        {label: 'Music', color: hexOpacity(purple, 50), value: music},
        {label: 'Other', color: hexOpacity(blue, 50), value: other},
        // {label: 'Free', color: hexOpacity(gray, 1), value: free ?? 1}
      ].filter(d => d.value > 0)
    } as Drive
  })).flat().sort((a, b) => a.name.localeCompare(b.name));
});

onMounted(() => {
  if (!libraries.value) return;
  drives.value = libraries.value.map(l => l.folder_library.map(lib => {
    const {movies, shows, music, other, free} = generateRandomValues(l.type);
    return {
      name: lib.folder.path,
      data: [
        {label: 'Movies', color: hexOpacity(green, 50), value: movies},
        {label: 'TV Shows', color: hexOpacity(orange, 50), value: shows},
        {label: 'Music', color: hexOpacity(purple, 50), value: music},
        {label: 'Other', color: hexOpacity(blue, 50), value: other},
        // {label: 'Free', color: hexOpacity(gray, 1), value: free ?? 1}
      ].filter(d => d.value > 0)
    } as Drive
  })).flat().flat().sort((a, b) => a.name.localeCompare(b.name));
});


</script>

<template>
  <SystemCard v-if="dashboardSocketIsConnected" title="Storage">
    <!--    <template v-for="path in paths" :key="path.key">-->
    <!--      <div-->
    <!--          class="relative flex flex-shrink-0 flex-grow-0 flex-col items-start justify-start self-stretch overflow-clip w-available"-->
    <!--      >-->
    <!--        <p-->
    <!--            class="self-stretch text-sm font-semibold  text-slate-light-11 dark:text-slate-dark-11 whitespace-nowrap"-->
    <!--        >-->
    <!--          {{ path.key }}:-->
    <!--        </p>-->
    <!--        <p class="flex-shrink-0 flex-grow-0 self-stretch text-sm text-auto-alpha-10 line-clamp-1">-->
    <!--          {{ path.value }}-->
    <!--        </p>-->
    <!--      </div>-->
    <!--    </template>-->

    <div v-for="drive in drives" :key="drive.name"
         class="relative flex flex-shrink-0 flex-grow-0 flex-col items-start justify-start self-stretch overflow-clip w-available text-slate-light-12/80 dark:text-slate-dark-12/70">
      <p class="self-stretch text-sm font-semibold whitespace-nowrap">
        {{ drive.name }}
      </p>
      <MeterGroup :value="drive.data" :max="100" class="flex-shrink-0 flex-grow-0 self-stretch text-xs line-clamp-1 mt-2 children:first:children:bg-auto-2 dark:children:first:children:bg-auto-1"/>
    </div>
  </SystemCard>
</template>
