<script setup lang="ts">
import {onMounted, onUnmounted} from 'vue';
import {IonPage, IonContent} from '@ionic/vue';

import type {MobileLibrariesResponseItem} from '@/types/api/base/libraries';

import useServerClient from '@/lib/clients/useServerClient';
import {setTitle} from '@/lib/stringArray';
import {isNative} from '@/config/global';
import {setBackground} from '@/store/ui';
import {currentSong} from '@/store/audioPlayer';

import HomeCard from '@/components/Cards/HomeCard.vue';
import MediaCarousel from '@/components/Carousel/MediaCarousel.vue';
import NavBar from '@/Layout/Mobile/components/NavBar.vue';

const {data} = useServerClient<MobileLibrariesResponseItem[]>({
  path: '/libraries/mobile',
  queryKey: ['libraries', 'mobile'],
  keepForever: true,
});

console.raw(data.value);

onMounted(() => {
  setTitle();
  document.dispatchEvent(new Event('sidebar'));
  setBackground(null);
});

onUnmounted(() => {
  document.dispatchEvent(new Event('sidebar'));
  stop();
});

setTitle();

</script>

<template>
  <ion-page>
    <NavBar />
    <ion-content :fullscreen="true" >
        <div v-if="data"
             class="flex flex-col gap-4 pt-2 w-available"
             :class="{
               'pb-4 mt-1.5' : isNative &&  !currentSong,
               'pb-2 mt-1.5' : isNative &&  currentSong,
               'pb-4 sm:pb-4' : !isNative &&  currentSong,
               'mb-2' : !isNative &&  !currentSong
            }"
        >

          <HomeCard/>

          <template v-for="(library, index) in data ?? []" :key="index">
            <MediaCarousel v-if="library?.items.length > 0"
                           :key="library.title"
                           :data="library.items"
                           :moreLink="library.moreLink"
                           :index="index"
                           :title="library.title"/>
          </template>
        </div>
    </ion-content>
  </ion-page>
</template>
