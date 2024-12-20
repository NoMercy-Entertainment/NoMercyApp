<script setup lang="ts">
import {onMounted, watch} from "vue";
import {IonPage, IonContent} from '@ionic/vue';

import type {LibrariesResponse} from "@/types/api/base/library";

import router from '@/router';
import useServerClient from "@/lib/clients/useServerClient";
import {setLibraries} from "@/store/Libraries";

import ExploreContainer from '@/components/ExploreContainer.vue';
import type {Playlist} from "@/types/api/music/playlists";
import {setMusicPlaylists} from "@/store/musicPlaylists";
import type {LogoResponse} from "@/types/server";

const {data: libraries, refetch} = useServerClient<LibrariesResponse[]>({
  path: '/libraries',
  refetchInterval: 10000,
  queryKey: ['libraries'],
});

const {data: playlists, refetch: refetchPlaylists} = useServerClient<Playlist[]>({
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
    router.push({name: 'Home'});
  }
});

watch(playlists, (value) => {
  if (!value) return;
  setMusicPlaylists(value);
});

onMounted(() => {
  if (!libraries.value) return;
  if (libraries.value.length > 0) {
    router.push({name: 'Home'});
  }
});

</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <ExploreContainer name="Server offline" />
    </ion-content>
  </ion-page>
</template>
