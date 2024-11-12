<script setup lang="ts">
import {nextTick, onMounted, ref, watch} from 'vue';
import {useRouter} from 'vue-router';
import {IonPage, IonContent} from '@ionic/vue';

import type {MusicCardPageResponse} from '@/types/musicPlayer';

import useServerClient from '@/lib/clients/useServerClient';
import {isNative} from '@/config/global';
import {currentSong} from '@/store/audioPlayer';

import MusicCard from '@/components/Cards/MusicCard.vue';
import Navbar from '@/Layout/Desktop/components/Navbar/Navbar.vue';

const show = ref(false);

const router = useRouter();
const { data } = useServerClient<MusicCardPageResponse['data']>({
  path: router.currentRoute.value.fullPath,
  keepForever: true,
});

watch(data, () => {
  show.value = true;
});

onMounted(() => {
  show.value = true;
  nextTick(() =>{
    document.dispatchEvent(new Event('indexer'));
  });
});

</script>

<template>
  <ion-page>
    <Navbar />
    <ion-content :fullscreen="true">
      <div
          v-if="show"
          data-scroll
          :class="{
         'pb-24' : isNative &&  !currentSong,
         'pb-40' : isNative &&  currentSong,
         'children:pb-4 sm:children:pb-3' : !isNative &&  currentSong
      }"
          class="z-0 w-available overflow-x-clip w-full h-auto grid gap-4 pl-4 pr-4 pt-4 music-showing:pb-0 grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-7 3xl:grid-cols-9 4xl:grid-cols-9 5xl:grid-cols-[repeat(14,minmax(0,1fr))] tv:grid-cols-6 scroll-smooth"
          style="opacity:1">

        <template v-if="Array.isArray(data)">
          <template  v-for="item in data"
                     :key="item.id">

            <MusicCard :data="item" />
          </template>
        </template>
      </div>
    </ion-content>
  </ion-page>
</template>
