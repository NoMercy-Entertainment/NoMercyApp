<script setup lang="ts">
import {onMounted, onUnmounted, ref, watch} from 'vue';
import {IonPage, IonContent} from '@ionic/vue';
import {MenuItem} from 'primevue/menuitem';

import type {HomeItem} from '@/types/api/base/home';
import type {MoooomIcons} from '@Icons/icons';

import {setTitle} from '@/lib/stringArray';
import serverClient from '@/lib/clients/serverClient';
import {isNative} from '@/config/global';
import {setBackground} from '@/store/ui';
import {currentSong} from '@/store/audioPlayer';

import {useContinueWatchingData, useHomeData} from '@/views/Base/data';

import HomeCard from '@/components/Cards/HomeCard.vue';
import MediaCarousel from '@/components/Carousel/MediaCarousel.vue';
import ScrollContainer from '@/Layout/Desktop/components/ScrollContainer.vue';

const {data: home, fetchNextPage, hasNextPage} = useHomeData();
const {data: continueWatching, refetch} = useContinueWatchingData();

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

watch(home, () => {
  if (hasNextPage.value) {
    fetchNextPage();
  }
});

const selectedCard = ref<HomeItem>();

const onRightClick = (event: Event, data: HomeItem) => {
  console.log('right click', data);
  selectedCard.value = data;
};

const menuItems = ref<(MenuItem & { icon: `mooooom-${keyof typeof MoooomIcons}` })[]>([
  {
    label: 'Remove from watchlist',
    icon: 'mooooom-trash',
    command: () => {
      serverClient()
          .delete('/userdata/continue', {
            data: {
              id: selectedCard.value!.id,
              type: selectedCard.value!.media_type
            }
          })
          .then(() => {
            refetch();
          });
    }
  }
]);

</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true">
    <ScrollContainer :autoHide="true" :static="true">
      <div v-if="home"
           class="flex flex-col gap-4 pb-3 w-available"
      >
        <HomeCard/>

        <MediaCarousel v-if="continueWatching?.[0]"
                       :data="continueWatching"
                       :index="0"
                       :title="'Continue watching'"
                       :menuItems="menuItems"
                       :onRightClick="onRightClick"
                       suffix="/watch"/>

        <template v-if="home?.pages">
          <template v-for="(group, index) in home.pages" :key="index">
            <template v-if="group">
              <template v-for="(data, index2) in group?.data ?? []"
                        :key="index2">

                <MediaCarousel v-if="data.items?.length > 0"
                               :key="data.title"
                               :data="data.items"
                               :index="index"
                               :title="data.title"/>
              </template>
            </template>
          </template>
        </template>
      </div>
    </ScrollContainer>
    </ion-content>
  </ion-page>
</template>
