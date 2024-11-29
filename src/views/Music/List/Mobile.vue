<script setup lang="ts">
import {onMounted, onUnmounted, ref, watch} from 'vue';
import {useRouter} from 'vue-router';
import {IonContent, IonPage, onIonViewWillEnter, onIonViewWillLeave} from '@ionic/vue';

import type {ScrollCustomEvent} from '@ionic/core/dist/types/components/content/content-interface';
import type {DisplayList} from '@/types/api/music/musicPlayer';

import {Song, SortOrder, SortType} from '@/types/musicPlayer';

import useServerClient from '@/lib/clients/useServerClient';
import {breakTitle2, setTitle, sortByType} from '@/lib/stringArray';
import {setColorPalette, setSortOrder, sortOrder, sortType} from '@/store/ui';

import ControlHeader from '@/views/Music/List/components/ControlHeader.vue';
import ArtistHeader from '@/views/Music/List/components/ArtistHeader.vue';
import SortHeader from '@/views/Music/List/components/SortHeader.vue';
import TrackRow from '@/views/Music/List/components/TrackRow.vue';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';

const router = useRouter();

const {data} = useServerClient<DisplayList>({
  path: router.currentRoute.value.fullPath,
  keepForever: true,
});

const main = ref<HTMLDivElement | null>(null);

const displayList = ref<Song[]>();
const filter = ref('');

watch(data, (value) => {
  setTitle(value?.name ?? null);

  sort(value?.tracks ?? [], sortType.value, sortOrder.value, filter.value);

  setColorPalette(value?.color_palette?.cover);
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

const sort = (songs: Song[], sortType: SortType, sortOrder: SortOrder, value: string) => {

  const newList = sortByType<Song>(songs ?? [], sortType, sortOrder, setSortOrder);

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
  sort(data?.value?.tracks ?? [], sortType.value, sortOrder.value, filter.value);
  setColorPalette(data.value?.color_palette?.cover);
});

onIonViewWillLeave(() => {
  setColorPalette(null);
});

const handleBack = () => {
  window.history.back();
};

const showScrollHeader = ref(false);
const showScrollHeaderText = ref(false);
const sortHeader = ref<VueDivElement>();

const onScroll = (e: ScrollCustomEvent) => {
  console.log(sortHeader.value?.$el?.getBoundingClientRect().top);
  const headerScrollTop = 290;
  const headerScrollTextTop = 310;
  const sortHeaderTop = 88;

  showScrollHeader.value = e.detail?.scrollTop >= headerScrollTop;
  showScrollHeaderText.value = e.detail?.scrollTop >= headerScrollTextTop;

  if (sortHeader.value?.$el?.getBoundingClientRect().top == sortHeaderTop) {
    sortHeader.value?.$el?.classList.add('!bg-focus');
    sortHeader.value?.$el?.firstChild?.classList.add('!bg-slate-light-10/11', 'dark:!bg-black/45');
  } else {
    sortHeader.value?.$el?.classList.remove('!bg-focus');
    sortHeader.value?.$el?.firstChild?.classList.remove('!bg-slate-light-10/11', 'dark:!bg-black/45');
  }
};

</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true" @ionScroll="onScroll" :scrollEvents="true">
      <div
          v-if="!router.currentRoute.value.params.id || (router.currentRoute.value.params.id && data?.id == router.currentRoute.value.params.id)"
          ref="main"
          class="flex flex-col overflow-x-clip w-available h-min sm:rounded-2xl -mt-safe-offset-12"
      >
        <ArtistHeader
            :data="data"
        />

        <div class="relative z-0 flex h-auto flex-shrink-0 flex-grow flex-col items-start justify-start self-stretch">

          <div class="pointer-events-none absolute z-0 h-96 w-full bg-spotifyBottom bg-focus"></div>

          <div id="navbar"
               class=" fixed z-1099 -mx-2 flex gap-4 p-2 px-4 w-available sm:hidden bg-slate-light-11 dark:bg-slate-dark-1 top-0 pt-safe-offset-4 transition-opacity duration-300"
               :class="{
                  'opacity-0 pointer-events-none': !showScrollHeader,
                  'opacity-100 pointer-events-auto': showScrollHeader
               }"
          >
            <div id="navBg"
                 class="z-20 absolute flex items-center inset-0 w-available h-full bg-focus/12 dark:bg-focus transition-transform duration-300 bg-spotifyTop opacity-80 pointer-events-none">
            </div>

            <button @click="handleBack" class="z-30 flex h-10 w-12 items-center justify-center rounded-md">
              <MoooomIcon icon="arrowLeft"/>
            </button>

            <div id="navText"
                 class="pointer-events-none whitespace-pre text-left relative z-20 h-auto line-clamp-2 w-full self-center text-xl font-bold leading-none transition-opacity duration-300"
                 :class="{
                  'opacity-0 pointer-events-none': !showScrollHeader,
                  'opacity-100 pointer-events-auto': showScrollHeader
               }"
                 v-html="breakTitle2(data?.name ?? 'Songs you like')"
            >
            </div>
          </div>

          <ControlHeader
              :key="data?.id"
              :data="data"
              :filter="filter"
              @filter-change="(e: string) => filter = e"/>

          <div
              class="flex flex-1 flex-shrink-0 flex-col items-start justify-start self-stretch bg-slate-dark-12 dark:bg-transparent flex-grow-1 gap-0.5 sm:p-4">
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
    </ion-content>
  </ion-page>
</template>
