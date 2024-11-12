<script setup lang="ts">
import {IonContent, IonPage} from '@ionic/vue';

import type {MusicHomeResponseItem} from '@/types/api/music';

import useServerClient from '@/lib/clients/useServerClient';

import MusicHomeCard from '@/components/Cards/MusicHomeCard.vue';
import MusicCarousel from '@/components/Carousel/MusicCarousel.vue';
import ScrollContainer from '@/Layout/Desktop/components/ScrollContainer.vue';

const {data} = useServerClient<MusicHomeResponseItem[]>({
  path: '/music',
  queryKey: ['music', 'home']
});

</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <ScrollContainer :autoHide="true" :static="true">
        <div
            class="z-0 flex h-auto flex-col gap-4 p-3 w-available">
          <div class="hidden shrink grow basis-0 flex-col items-start justify-start self-stretch sm:inline-flex">
            <div class="grid flex-shrink-0 flex-grow-0 grid-cols-3 gap-6 self-stretch">
              <template v-for="item in data?.find?.(d => d.title == null)?.items ?? []" :key="item?.name">
                <MusicHomeCard :data="item" v-if="item?.name"/>
              </template>
            </div>
          </div>
          <MusicCarousel :data="carousel"
                         v-for="carousel in data?.filter(d => d.title != 'recent' && d.title != null) ?? []"
                         :key="carousel.title"
                         class="-mx-3"/>
        </div>
      </ScrollContainer>
    </ion-content>
  </ion-page>
</template>
