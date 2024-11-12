<script setup lang="ts">
import { IonPage, IonContent } from '@ionic/vue';

import type {MusicHomeResponseItem} from '@/types/api/music';

import useServerClient from '@/lib/clients/useServerClient';

import NavBar from '@/Layout/Mobile/components/NavBar.vue';
import MusicCarousel from '@/components/Carousel/MusicCarousel.vue';

const {data} = useServerClient<MusicHomeResponseItem[]>({
  path: '/music',
  queryKey: ['music', 'home']
});

</script>

<template>
  <ion-page>
    <NavBar />
    <ion-content :fullscreen="true">
      <div class="z-0 flex h-auto flex-col gap-4 p-3 w-available pt-safe-offset-4 pb-safe-offset-10">
        <MusicCarousel :data="carousel"
                       v-for="carousel in data?.filter(d => d.title != 'recent' && d.title != null) ?? []"
                       :key="carousel.title"
                       class="-mx-3"/>
      </div>
    </ion-content>
  </ion-page>
</template>
