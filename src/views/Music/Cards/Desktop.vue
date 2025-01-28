<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { IonPage, IonContent } from '@ionic/vue';


import useServerClient from '@/lib/clients/useServerClient';
import { isNative } from '@/config/global';
import { currentSong } from '@/store/audioPlayer';

import ScrollContainer from '@/Layout/Desktop/components/ScrollContainer.vue';
import MusicCard from '@/components/Cards/MusicCard.vue';
import { setColorPalette } from '@/store/ui';
import NotFound from "@/Layout/Desktop/components/NotFound.vue";
import { MusicCardPageResponseData } from "@/types/api/music/musicPlayer";

const show = ref(false);

const route = useRoute();
const { data, isError } = useServerClient<MusicCardPageResponseData>({
  path: route.fullPath,
  keepForever: true,
});

watch(data, () => {
  show.value = true;
});

onMounted(() => {
  show.value = true;
  setColorPalette(null);
  nextTick(() => {
    document.dispatchEvent(new Event('indexer'));
  });
});
</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <NotFound v-if="isError && !data" />
      <ScrollContainer v-else :autoHide="true" :static="true">
        <div v-if="show" :class="{
          'pb-24': isNative && !currentSong,
          'pb-40': isNative && currentSong,
          'children:pb-4 sm:children:pb-3': !isNative && currentSong
        }" class="z-0 w-available overflow-x-clip w-full h-auto grid gap-4 p-4 music-showing:pb-0 grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-7 3xl:grid-cols-9 4xl:grid-cols-9 5xl:grid-cols-[repeat(14,minmax(0,1fr))] tv:grid-cols-6 scroll-smooth"
          style="opacity:1">

          <template v-if="Array.isArray(data)">
            <template v-for="item in data" :key="item.id">

              <MusicCard :data="item" />
            </template>
          </template>
        </div>
      </ScrollContainer>
    </ion-content>
  </ion-page>
</template>
