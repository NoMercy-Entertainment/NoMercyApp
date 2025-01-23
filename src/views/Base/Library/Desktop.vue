<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { IonContent, IonPage } from '@ionic/vue';
import { isNative } from '@/config/global';
import { currentSong } from '@/store/audioPlayer';

import type { LibraryResponse } from '@/types/api/base/library';
import type { PeopleResponse, PersonResponseItem } from '@/types/api/base/person';
import type { GenreResponse } from '@/types/api/base/genre';

import useInfiniteServerClient from '@/lib/clients/useInfiniteServerClient';
import { showBackdrops } from '@/store/preferences';
import { setBackground, setColorPalette } from '@/store/ui';
import router from '@/router';
import { setTitle } from '@/lib/stringArray';

import MediaCard from '@/components/Cards/MediaCard.vue';
import PersonCard from '@/components/Cards/PersonCard.vue';
import GenreCard from '@/components/Cards/GenreCard.vue';
import EmptyCard from '@/components/Cards/EmptyCard.vue';
import ScrollContainer from '@/Layout/Desktop/components/ScrollContainer.vue';
import { useRouter } from 'vue-router';
import NotFound from "@/Layout/Desktop/components/NotFound.vue";

const routing = useRouter();

const { data, fetchNextPage, hasNextPage, isError } = useInfiniteServerClient<{
  data: Array<LibraryResponse | GenreResponse | PeopleResponse>
}>({
  queryKey: ['libraries', routing.currentRoute?.value?.params.id ?? routing.currentRoute.value.name],
  limit: 20,
  keepForever: true,
});

const backdropStyle = 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 3xl:grid-cols-5 4xl:grid-cols-5 5xl:grid-cols-9 tv:grid-cols-6';

const posterStyle = 'grid-cols-2 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-7 3xl:grid-cols-9 4xl:grid-cols-10 5xl:grid-cols-[repeat(14,minmax(0,1fr))] tv:grid-cols-6';

const useBackdropStyle = computed(() => {
  return showBackdrops.value && data.value?.pages?.[0]?.data[0].media_type !== 'person' && data.value?.pages?.[0]?.data[0].media_type !== 'genres';
});

onMounted(() => {
  setTitle();
  setBackground(null);
  setColorPalette(null);

  if (hasNextPage.value && (data?.value?.pages?.length ?? 0) < 50) {
    fetchNextPage();
  }

  document.dispatchEvent(new Event('sidebar'));
  setTimeout(() => {
    document.dispatchEvent(new Event('indexer'));
  }, 500);
});

watch(data, (value) => {
  if (!value) return;

  if (hasNextPage.value && value?.pages?.length < 50) {
    fetchNextPage();
  }

  setTimeout(() => {
    document.dispatchEvent(new Event('indexer'));
  }, 500);
});

onUnmounted(() => {
  setTitle();
  setBackground(null);
  setColorPalette(null);
});

const selectedCard = ref<LibraryResponse | GenreResponse | PeopleResponse>();
const cardMenu = ref();

const onRightClick = (event: Event, data: LibraryResponse | GenreResponse | PeopleResponse) => {
  selectedCard.value = data;
  cardMenu.value.show(event);
};

</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <NotFound v-if="isError" />
      <ScrollContainer v-else :autoHide="true" :static="true" :id="router.currentRoute.value.fullPath">
        <div class="z-0 flex flex-col gap-4 rounded-3xl border-0 p-4 w-available scrollbar-none border-auto-3" :class="{
          'pb-24': isNative && !currentSong,
          'pb-40': isNative && currentSong,
          'children:pb-4 sm:children:pb-3': !isNative && currentSong
        }" :key="router.currentRoute.value.params?.id as string">

          <div
            :class="`grid w-full gap-4 scroll-smooth music-showing:pb-0 whitespace-pre ${useBackdropStyle ? backdropStyle : posterStyle}`">
            <!--        <ContextMenu ref="cardMenu" :model="items"/>-->
            <template v-for="(group, index) in data?.pages ?? []" :key="index">
              <template v-if="group.data.length > 0">
                <template v-for="(item, index2) in group.data ?? []">
                  <MediaCard
                    v-if="item?.media_type === 'tv' || item?.media_type == 'movie' || item?.media_type == 'collection' || item?.media_type == 'specials'"
                    :key="item.id" :data="item as LibraryResponse" @context-menu="onRightClick($event, item)"
                    :index="index2" />
                  <PersonCard v-else-if="item?.media_type === 'person'" :key="item.id + '_person'"
                    :data="item as PersonResponseItem" @context-menu="onRightClick($event, item)" :index="index2" />
                  <GenreCard v-else-if="item?.media_type === 'genres'" :key="item.id + '_genres'"
                    :data="item as GenreResponse" @context-menu="onRightClick($event, item)" :index="index2" />
                </template>
              </template>
              <template v-else-if="data?.pages?.[0]?.data?.length == 0">
                <EmptyCard />
              </template>
            </template>
          </div>
        </div>
      </ScrollContainer>
    </ion-content>
  </ion-page>
</template>
