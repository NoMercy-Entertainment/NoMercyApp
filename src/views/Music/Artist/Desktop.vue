<script setup lang="ts">
import {computed, onMounted, onUnmounted, ref, watch} from 'vue';
import {useRoute} from 'vue-router';
import {IonContent, IonPage} from '@ionic/vue';

import type {ArtistResponse} from '@/types/api/music/artist';
import {type PlaylistItem, SortOrder, SortType} from '@/types/musicPlayer';

import useServerClient from '@/lib/clients/useServerClient';
import {setTitle, sortByType} from '@/lib/stringArray';
import {setColorPalette, setSortOrder, sortOrder, sortType} from '@/store/ui';

import ScrollContainer from '@/Layout/Desktop/components/ScrollContainer.vue';

import BannerButton from '@/components/Buttons/BannerButton.vue';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';
import Home from './components/Home.vue';
import Albums from './components/Albums.vue';
import Playlists from './components/Playlists.vue';
import About from './components/About.vue';
import Tabs from './components/Tabs.vue';
import Tab from './components/Tab.vue';
import Header from './components/Header.vue';
import NotFound from "@/Layout/Desktop/components/NotFound.vue";

const route = useRoute();

const {data} = useServerClient<ArtistResponse>({
  path: route.fullPath,
  keepForever: true,
});

onMounted(() => {
  document.dispatchEvent(new Event('sidebar'));
});

onUnmounted(() => {
  setColorPalette(null);
});

const displayList = ref<PlaylistItem[]>();
const filter = ref('');

watch(sortOrder, (value) => {
  sort(data.value?.tracks ?? [], sortType.value, value, filter.value);
});
watch(sortType, (value) => {
  sort(data.value?.tracks ?? [], value, sortOrder.value, filter.value);
});
watch(filter, (value) => {
  sort(data.value?.tracks ?? [], sortType.value, sortOrder.value, value);
});

watch(data, (value) => {
  setTitle(value?.name ?? null);
});

const sort = (songs: PlaylistItem[], sortType: SortType, sortOrder: SortOrder, value: string) => {

  const newList = sortByType<PlaylistItem>(songs ?? [], sortType, sortOrder, setSortOrder);

  if (value == '') {
    displayList.value = newList;
  } else {
    displayList.value = newList?.filter(t =>
        t.name?.toLowerCase().includes(value?.toLowerCase?.())
        || t.artist_track?.some(a => a.name.toLowerCase().includes(value?.toLowerCase?.()))
        || t.album_track?.[0]?.name.toLowerCase().includes(value?.toLowerCase?.())) ?? [];
  }
};

const tabs = computed(() => {
  return [
    {
      name: 'Home',
    },
    {
      name: 'Albums',
    },
    {
      name: 'Featured',
    },
    {
      name: 'Playlists',
    },
    {
      name: 'About',
    },
  ].filter(t => {
    if (t.name == 'Albums' && data.value?.albums?.length == 0) {
      t.name = '';
    }
    if (t.name == 'Playlists' && data.value?.playlists?.length == 0) {
      t.name = '';
    }
    if (t.name == 'Playlists' && data.value?.featured?.length == 0) {
      t.name = '';
    }
    return true;
  });
});

const displayType = ref<'list' | 'card'>('list');
const setDisplayType = (type: 'list' | 'card') => {
  displayType.value = type;
};
</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <NotFound v-if="!data" />
      <ScrollContainer v-else :autoHide="true" :static="true">

        <div v-if="data?.id == route.params.id"
             class="inline-flex w-full flex-1 flex-col items-start justify-start overflow-clip rounded-2xl bg-auto-2/1">
          <Header v-if="data" :data="data"/>

          <Tabs :tabs="tabs">
            <template v-slot:extra="{ activeTab }">
              <div v-if="activeTab === tabs[0].name"
                   class="absolute right-4 inline-flex items-center justify-start top-[9.65px] gap-2.5">
                <BannerButton title="" @click="setDisplayType('list')" :isActive="displayType == 'list'">
                  <MoooomIcon icon="bulletList" className="relative h-5 w-5"/>
                </BannerButton>
                <BannerButton title="" @click="setDisplayType('card')" :isActive="displayType == 'card'">
                  <MoooomIcon icon="collection" className="relative h-5 w-5"/>
                </BannerButton>
              </div>
            </template>

            <template v-slot:default="{ activeTab }">
              <Tab :isActive="activeTab === tabs[0].name">
                <Home :activeTab="activeTab" v-if="data" :data="data" :displayType="displayType"/>
              </Tab>
              <Tab :isActive="activeTab === tabs[1].name">
                <Albums v-if="data" :activeTab="activeTab" :data="data" item="albums"/>
              </Tab>
              <Tab :isActive="activeTab === tabs[2].name">
                <Albums v-if="data" :activeTab="activeTab" :data="data" item="featured"/>
              </Tab>
              <Tab :isActive="activeTab === tabs[3].name">
                <Playlists :activeTab="activeTab" v-if="data" :data="data"/>
              </Tab>
              <Tab :isActive="activeTab === tabs[4].name">
                <About :activeTab="activeTab" v-if="data" :data="data"/>
              </Tab>
            </template>
          </Tabs>
        </div>
      </ScrollContainer>
    </ion-content>
  </ion-page>
</template>
