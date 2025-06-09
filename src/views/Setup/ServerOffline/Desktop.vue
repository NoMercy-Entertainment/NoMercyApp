<script setup lang="ts">
import { onMounted, watch } from "vue";
import { IonPage, IonContent } from '@ionic/vue';

import type { LibrariesResponse } from "@/types/api/base/library";

import router from '@/router';
import useServerClient from "@/lib/clients/useServerClient";
import { setLibraries } from "@/store/Libraries";

import type { Playlist } from "@/types/api/music/playlists";
import { setMusicPlaylists } from "@/store/musicPlaylists";
import type { LogoResponse } from "@/types/server";
import EmptyBackdrop from "@/components/Images/EmptyBackdrop.vue";
import {redirectUrl} from "@/store/routeState";

const { data: libraries } = useServerClient<LibrariesResponse[]>({
  path: '/libraries',
  refetchInterval: 10000,
  queryKey: ['libraries'],
});

const { data: playlists, refetch: refetchPlaylists } = useServerClient<Playlist[]>({
  enabled: !!libraries.value,
  path: '/music/playlists',
  queryKey: ['playlists'],
});

const { refetch: refetchScreensaver } = useServerClient<LogoResponse[]>({
  enabled: !!libraries.value,
  path: '/screensaver',
});

watch(libraries, (value) => {
  if (!value) return;
  refetchPlaylists();
  refetchScreensaver();

  setLibraries(value);

  if (value.length > 0) {
    router.push(redirectUrl.value);
  }
});

watch(playlists, (value) => {
  if (!value) return;
  setMusicPlaylists(value);
});

onMounted(() => {
  if (!libraries.value) return;
  if (libraries.value.length > 0) {
    router.push(redirectUrl.value);
  }
});

</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="flex flex-col justify-center items-center w-full h-full">
        <EmptyBackdrop />
        <svg width="210" height="210" viewBox="0 0 210 210" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path opacity="0.6"
            d="M61.25 148.75H70M96.25 148.75H148.75M35 148.75L35.4349 143.966M35 148.75C35 163.247 46.7525 175 61.25 175H148.75C163.247 175 175 163.247 175 148.75M35 148.75C35 147.116 35.1493 145.517 35.4349 143.966M35.4349 143.966L41.5797 76.3735C42.8088 62.8527 54.1453 52.5 67.7219 52.5001L105 52.5002M35.4349 143.966C37.6839 131.753 48.3864 122.5 61.25 122.5H148.75C161.75 122.5 172.543 131.95 174.634 144.356M170.625 96.2502L174.634 144.356M174.634 144.356L175 148.75M174.634 144.356C174.875 145.785 175 147.253 175 148.75"
            stroke="#fff" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" />
          <path
            d="M129.062 48.125L127.011 15.3082C126.938 14.1252 127.877 13.125 129.062 13.125C130.248 13.125 131.187 14.1252 131.114 15.3082L129.062 48.125Z"
            stroke="#fff" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" />
          <path
            d="M161.875 70H199.184C200.325 70 201.25 70.9251 201.25 72.0663C201.25 73.2979 200.179 74.2561 198.955 74.12L161.875 70Z"
            stroke="#fff" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" />
          <path
            d="M157.5 48.125L181.443 11.7019C182.46 10.1559 184.62 9.89094 185.98 11.1456C187.174 12.2472 187.273 14.0992 186.203 15.3216L157.5 48.125Z"
            stroke="#fff" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" />
        </svg>

        <h1 class="text-7xl font-bold text-center text-slate-light-11 dark:text-slate-dark-11">
          {{ $t('Server Offline') }}
        </h1>
      </div>
    </ion-content>
  </ion-page>
</template>
