<script setup lang="ts">
import {onMounted, onUnmounted, ref, watch} from 'vue';
import {useRouter} from 'vue-router';
import {IonPage, IonContent} from '@ionic/vue';

import type {ScrollCustomEvent} from '@ionic/core/dist/types/components/content/content-interface';
import type {DisplayList, Song} from '@/types/api/music/musicPlayer';
import {SortOrder, SortType} from '@/types/musicPlayer';

import useServerClient from '@/lib/clients/useServerClient';
import {setTitle, sortByType} from '@/lib/stringArray';
import {setColorPalette, setSortOrder, sortOrder, sortType} from '@/store/ui';
import {audioPlayer, currentSong} from '@/store/audioPlayer';

import ControlHeader from '@/views/Music/List/components/ControlHeader.vue';
import ArtistHeader from '@/views/Music/List/components/ArtistHeader.vue';
import SortHeader from '@/views/Music/List/components/SortHeader.vue';
import TrackRow from '@/views/Music/List/components/TrackRow.vue';
import NavBar from '@/Layout/Mobile/components/NavBar.vue';
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

  const match = data.value?.tracks?.find((t: Song) => t.id == currentSong.value?.id);
  if (match) {
    audioPlayer.value?.playTrack(match);
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

onMounted(() => {
  sort(data?.value?.tracks ?? [], sortType.value, sortOrder.value, filter.value);
  setColorPalette(data.value?.color_palette?.cover);
});

onUnmounted(() => {
  setColorPalette(null);
});

const items = ref([
  {
    label: 'Add to playlist',
    icon: 'mooooom-add',
    items: [
      {
        label: 'New Playlist',
        icon: 'mooooom-add',
      },
      {
        label: 'Existing Playlist',
        icon: 'pi pi-pause'
      }
    ]
  },
  {
    label: 'Save to your Liked Songs',
    icon: 'mooooom-add-circle',
    command: () => {
      alert(selectedCard.value?.id);
    }
  },
  {
    label: 'Add to Queue',
    icon: 'mooooom-add-circle',
    command: () => {
      alert(selectedCard.value?.id);
    }
  },
  {
    separator: true
  },
  {
    label: 'Go to Album',
    icon: 'pi pi-volume-up',
  },
  {
    label: 'Go to Artist',
    icon: 'pi pi-volume-up',
  },
  {
    label: 'Share',
    icon: 'pi pi-print',
    items: [
      {
        label: 'Facebook',
        icon: 'pi pi-caret-right'
      },
      {
        label: 'Twitter',
        icon: 'pi pi-pause'
      }
    ]
  }
]);

const selectedCard = ref<Song>();
const cardMenu = ref();

const onRightClick = (event: Event, data: Song) => {
  selectedCard.value = data;
  cardMenu.value.show(event);
};

const handleBack = () => {
  window.history.back();
}

const showScrollHeader = ref(false);
const showScrollHeaderText = ref(false);
const sortHeader = ref<VueDivElement>();

const onScroll = (e: ScrollCustomEvent) => {
  const headerScrollTop = 250;
  const headerScrollTextTop = 270;
  const sortHeaderTop = 88;

  showScrollHeader.value = e.detail?.scrollTop > headerScrollTop;
  showScrollHeaderText.value = e.detail?.scrollTop > headerScrollTextTop;

  if (sortHeader.value?.$el?.getBoundingClientRect().top == sortHeaderTop) {
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
    <NavBar />
    <ion-content :fullscreen="true"  @ionScroll="onScroll" :scrollEvents="true">
      <div
          v-if="!router.currentRoute.value.params.id || (router.currentRoute.value.params.id && data?.id == router.currentRoute.value.params.id)"
          ref="main"
          class="flex flex-col overflow-x-clip w-available h-min sm:rounded-2xl"
      >
        <ArtistHeader
            :data="data"
        />

        <div class="relative z-0 flex h-auto flex-shrink-0 flex-grow flex-col items-start justify-start self-stretch">

          <div class="pointer-events-none absolute z-0 h-96 w-full bg-spotifyBottom bg-focus"></div>

          <div id="navbar"
               class=" fixed z-1099 -mx-2 flex gap-4 p-2 px-4 w-available sm:hidden bg-focus top-0 pt-safe-offset-4 transition-opacity duration-300"
               :class="{
                  'opacity-0 pointer-events-none': !showScrollHeader,
                  'opacity-100 pointer-events-auto': showScrollHeader
               }"
          >
            <div id="navBg"
                 class="z-20 absolute flex items-center inset-0 w-available h-full bg-focus transition-transform duration-300 bg-spotifyTop opacity-80 pointer-events-none">
            </div>

            <button @click="handleBack" class="z-30 flex h-10 w-12 items-center justify-center rounded-md">
              <MoooomIcon icon="arrowLeft" />
            </button>

            <div id="navText"
                 class="pointer-events-none relative z-20 h-auto w-full self-center text-2xl font-bold leading-none transition-opacity duration-300"
                 :class="{
                  'opacity-0 pointer-events-none': !showScrollHeader,
                  'opacity-100 pointer-events-auto': showScrollHeader
               }"
            >
              {{ $t(data?.name ?? 'Songs you like') }}
            </div>
          </div>

          <ControlHeader
              :key="data?.id"
              :data="data"
              :filter="filter"
              @filter-change="(e: string) => filter = e"/>

          <div
              class="flex flex-1 flex-shrink-0 flex-col items-start justify-start self-stretch bg-auto-1/95 flex-grow-1 gap-0.5 sm:p-4"
          >
            <SortHeader
                ref="sortHeader"
                :key="data?.id"/>

            <TrackRow
                v-for="(item, index) in displayList"
                :key="item.id"
                :data="item"
                :displayList="displayList"
                @contextmenu="onRightClick($event, item)"
                :index="index"/>
          </div>
        </div>
        <!--          <ContextMenu ref="cardMenu" :model="items"/>-->
      </div>
    </ion-content>
  </ion-page>
</template>
