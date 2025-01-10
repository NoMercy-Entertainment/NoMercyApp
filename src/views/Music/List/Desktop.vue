<script setup lang="ts">
import {onMounted, onUnmounted, ref, watch} from 'vue';
import {useRoute} from 'vue-router';
import {IonContent, IonPage, onIonViewWillEnter, onIonViewWillLeave} from '@ionic/vue';

import type {DisplayList} from '@/types/api/music/musicPlayer';
import type {PlaylistItem, SortOrder, SortType} from '@/types/musicPlayer';

import {isNative} from '@/config/global';
import useServerClient from '@/lib/clients/useServerClient';
import {setTitle, sortByType} from '@/lib/stringArray';
import {setColorPalette, setSortOrder, sortOrder, sortType} from '@/store/ui';
import {currentSong} from '@/store/audioPlayer';

import ControlHeader from '@/views/Music/List/components/ControlHeader.vue';
import ArtistHeader from '@/views/Music/List/components/ArtistHeader.vue';
import SortHeader from '@/views/Music/List/components/SortHeader.vue';
import TrackRow from '@/views/Music/List/components/TrackRow.vue';
import ScrollContainer from '@/Layout/Desktop/components/ScrollContainer.vue';

const route = useRoute();

const {data} = useServerClient<DisplayList>({
  path: route.fullPath,
  keepForever: true,
});

const main = ref<HTMLDivElement | null>(null);

const displayList = ref<PlaylistItem[]>();
const filter = ref('');

watch(data, (value) => {
  if (!value) return;

  setTitle(value?.name ?? null);

  sort(value?.tracks ?? [], sortType.value, sortOrder.value, filter.value);

  if(value?.color_palette?.cover) {
    setColorPalette(value?.color_palette?.cover);
  }
});

watch(sortOrder, (value) => {
  sort(data.value?.tracks ?? [], sortType.value, value, filter.value);
});
watch(sortType, (value) => {
  sort(data.value?.tracks ?? [], value, sortOrder.value, filter.value);
});
watch(filter, (value) => {
  sort(data.value?.tracks ?? [], sortType.value, sortOrder.value, value);
});

const sort = (songs: PlaylistItem[], sortType: SortType, sortOrder: SortOrder, value: string) => {

  const newList = sortByType<PlaylistItem>(songs ?? [], sortType, sortOrder, setSortOrder);

  if (value == '') {
    displayList.value = newList;
  } else {
    // @ts-ignore
    displayList.value = newList?.filter(t =>
        t.name?.toLowerCase().includes(value?.toLowerCase?.())
        || t.artist_track?.some(a => a.name.toLowerCase().includes(value?.toLowerCase?.()))
        || t.album_track?.[0]?.name.toLowerCase().includes(value?.toLowerCase?.())) ?? [];
  }
};

onIonViewWillEnter(() => {
  if (data?.value?.tracks) {
    sort(data?.value?.tracks ?? [], sortType.value, sortOrder.value, filter.value);
  }

  if(data.value?.color_palette?.cover) {
    setColorPalette(data.value?.color_palette?.cover);
  }
});

onIonViewWillLeave(() => {
  if (document.getElementById('navbar')) {
    document.getElementById('navbar')!.style.display = 'flex';
  }
  setColorPalette(null);
});

const sortHeader = ref<VueDivElement>();

const onScroll = () => {
  const sortHeaderTop = 67;

  if (Math.ceil(sortHeader.value?.$el?.getBoundingClientRect()?.top ?? 500) <= sortHeaderTop) {
    sortHeader.value?.$el?.classList.add('!bg-focus');
    sortHeader.value?.$el?.firstChild?.classList.add('!bg-black/50');
  } else {
    sortHeader.value?.$el?.classList.remove('!bg-focus');
    sortHeader.value?.$el?.firstChild?.classList.remove('!bg-black/50');
  }
};

</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true" class="flex">
      <ScrollContainer :autoHide="true" :static="true" @scroll="onScroll">
        <div
            v-if="!route.params.id || (route.params.id && data?.id == route.params.id)"
            ref="main"
            class="flex flex-col overflow-x-clip w-available h-available sm:rounded-2xl"
        >
          <ArtistHeader
              :data="data"
          />
          <div
              class="relative z-0 flex h-auto flex-shrink-0 flex-grow flex-col items-start justify-start self-stretch">
            <div class="pointer-events-none absolute z-0 h-96 w-full bg-spotifyBottom bg-focus"></div>

            <ControlHeader
                :key="data?.id"
                :data="data"
                :filter="filter"
                @filter-change="(e: string) => filter = e"/>

            <div
                class="flex flex-1 flex-shrink-0 flex-col items-start justify-start self-stretch bg-slate-light-1 dark:bg-slate-dark-2 flex-grow-1 gap-0.5 sm:p-4"
                :class="{
                   'pb-24' : isNative &&  !currentSong,
                   'pb-40' : isNative &&  currentSong,
                   'pb-4 sm:pb-4' : !isNative &&  currentSong
                }"
            >
              <SortHeader
                  ref="sortHeader"
                  :key="data?.id"/>

              <TrackRow
                  v-for="(item, index) in displayList"
                  :key="item.id"
                  :data="item"
                  :displayList="displayList"
                  :index="index"/>
            </div>
          </div>
        </div>
      </ScrollContainer>
    </ion-content>
  </ion-page>
</template>
