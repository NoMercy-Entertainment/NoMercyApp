<script setup lang="ts">
import {computed, onMounted, onUnmounted, ref, watch} from 'vue';
import {useRouter} from 'vue-router';
import {IonContent, IonPage} from '@ionic/vue';

import type {LibraryResponse} from '@/types/api/base/library';
import type {PeopleResponse, PersonResponseItem} from '@/types/api/base/person';
import type {GenreResponse} from '@/types/api/base/genre';

import {isNative} from '@/config/global';
import {currentSong} from '@/store/audioPlayer';
import useInfiniteServerClient from '@/lib/clients/useInfiniteServerClient';
import {showBackdrops} from '@/store/preferences';
import {setBackground} from '@/store/ui';
import router from '@/router';
import {setTitle} from '@/lib/stringArray';

import Indexer from '@/Layout/Indexer.vue';

import MediaCard from '@/components/Cards/MediaCard.vue';
import PersonCard from '@/components/Cards/PersonCard.vue';
import GenreCard from '@/components/Cards/GenreCard.vue';
import EmptyCard from '@/components/Cards/EmptyCard.vue';

const routing = useRouter();

const {data, fetchNextPage, hasNextPage} = useInfiniteServerClient<{
  data: Array<LibraryResponse | GenreResponse | PeopleResponse>
}>({
  queryKey: ['libraries', ((routing.currentRoute?.value?.params.id ?? routing.currentRoute.value.name) as string)?.split('&').at(0)],
  limit: 20,
  keepForever: true,
});

onMounted(() => {
  setTitle();
  setBackground(null);
  document.dispatchEvent(new Event('sidebar'));
  setTimeout(() => {
    document.dispatchEvent(new Event('indexer'));
  }, 1000);
});

watch(data, (value) => {
  if (!value) return;
  setTimeout(() => {
    document.dispatchEvent(new Event('indexer'));
  }, 1000);
});

const backdropStyle = 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 3xl:grid-cols-5 4xl:grid-cols-5 5xl:grid-cols-9 tv:grid-cols-6';

const posterStyle = 'grid-cols-2 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-7 3xl:grid-cols-9 4xl:grid-cols-10 5xl:grid-cols-[repeat(14,minmax(0,1fr))] tv:grid-cols-6';

const useBackdropStyle = computed(() => {
  return showBackdrops.value && data.value?.pages?.[0]?.data[0].media_type !== 'person' && data.value?.pages?.[0]?.data[0].media_type !== 'genres';
});

onUnmounted(() => {
  stop();
  setBackground(null);
});

onMounted(() => {
  if (hasNextPage.value && (data?.value?.pages?.length ?? 0) < 50) {
    fetchNextPage();
  }
});

watch(data, (value) => {
  if (!value) return;

  if (hasNextPage.value && value?.pages?.length < 50) {
    fetchNextPage();
  }
});

const items = ref([]);

const selectedCard = ref<LibraryResponse | GenreResponse | PeopleResponse>();
const cardMenu = ref();

const onRightClick = (event: Event, data: LibraryResponse | GenreResponse | PeopleResponse) => {
  selectedCard.value = data;
  cardMenu.value.show(event);
};

</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true" class="ion-padding ">
      <div class="pt-safe-offset-2 flex w-full pr-8 h-inherit p-2">
        <div
            class="z-0 flex flex-col gap-4 rounded-3xl border-0 w-available scrollbar-none border-auto-3"
            :class="{
           'pb-2' : isNative &&  currentSong,
           'children:pb-4 sm:children:pb-3' : !isNative &&  currentSong
        }"
            :key="router.currentRoute.value.params?.id as string">

          <div
              :class="`grid w-full gap-4 scroll-smooth music-showing:pb-0 ${useBackdropStyle ? backdropStyle : posterStyle}`">
            <!--        <ContextMenu ref="cardMenu" :model="items"/>-->
            <template v-if="data">
              <template v-for="(group, index) in data.pages ?? []" :key="index">
                <template v-if="group.data.length > 0">
                  <template v-for="(data, index2) in group.data ?? []">
                    <MediaCard
                        v-if="data?.media_type === 'tv' || data?.media_type == 'movie' || data?.media_type == 'collection' || data?.media_type == 'specials'"
                        :key="data.id"
                        :data="data as LibraryResponse"
                        @context-menu="onRightClick($event, data)"
                        :index="index2"/>
                    <PersonCard
                        v-else-if="data?.media_type === 'person'"
                        :key="data.id + '_person'"
                        :data="data as PersonResponseItem"
                        @context-menu="onRightClick($event, data)"
                        :index="index2"/>
                    <GenreCard
                        v-else-if="data?.media_type === 'genres'"
                        :key="data.id + '_genres'"
                        :data="data as GenreResponse"
                        @context-menu="onRightClick($event, data)"
                        :index="index2"/>
                  </template>
                </template>
                <template v-else-if="data.pages?.[0]?.data?.length == 0">
                  <EmptyCard/>
                </template>
              </template>
            </template>
          </div>
        </div>
        <Indexer class="w-8 !-mt-4 pt-4 pb-4 mb-0 fixed right-0 bg-slate-light-1 dark:bg-slate-dark-3"
                 :class="{
                    'h-available': !isNative,
                    'h-inherit': isNative
                 }"
        />
      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped>

@media screen and (max-width: 800px) {
  ion-content::part(scroll) {
    --offset-top: -4.5rem;
  }

  *:has(ion-toolbar:first-child:nth-last-child(2) ~ *) ion-content::part(scroll) {
    --offset-top: -8.5rem;
  }
}
</style>
