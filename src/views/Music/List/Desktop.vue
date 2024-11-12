<script setup lang="ts">
import {onMounted, onUnmounted, ref, watch} from 'vue';
import {useRoute} from 'vue-router';
import {IonContent, IonPage} from '@ionic/vue';

import type {DisplayList, Song} from '@/types/api/music/musicPlayer';
import {SortOrder, SortType} from '@/types/musicPlayer';

import {isNative} from '@/config/global';
import useServerClient from '@/lib/clients/useServerClient';
import {setTitle, sortByType} from '@/lib/stringArray';
import {setColorPalette, setSortOrder, sortOrder, sortType} from '@/store/ui';
import {audioPlayer, currentSong} from '@/store/audioPlayer';

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
  if (document.getElementById('navbar')) {
    document.getElementById('navbar')!.style.display = 'flex';
  }
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
    <ion-content :fullscreen="true">
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
                class="flex flex-1 flex-shrink-0 flex-col items-start justify-start self-stretch bg-auto-1/95 flex-grow-1 gap-0.5 sm:p-4"
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
                  @contextmenu="onRightClick($event, item)"
                  :index="index"/>
            </div>
          </div>
          <!--          <ContextMenu ref="cardMenu" :model="items"/>-->
        </div>
      </ScrollContainer>
    </ion-content>
  </ion-page>
</template>
