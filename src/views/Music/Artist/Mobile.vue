<script setup lang="ts">
import { IonPage, IonContent } from '@ionic/vue';


import NavBar from '@/Layout/Mobile/components/NavBar.vue';
import BannerButton from '@/components/Buttons/BannerButton.vue';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';
import Home from '@/views/Music/Artist/components/Home.vue';
import Albums from '@/views/Music/Artist/components/Albums.vue';
import Playlists from '@/views/Music/Artist/components/Playlists.vue';
import About from '@/views/Music/Artist/components/About.vue';
import useServerClient from '@/lib/clients/useServerClient';
import {ArtistResponse} from '@/types/api/music/artist';
import {computed, onMounted, onUnmounted, ref, watch} from 'vue';
import {setColorPalette, setSortOrder, sortOrder, sortType} from '@/store/ui';
import {Song, SortOrder, SortType} from '@/types/musicPlayer';
import {setTitle, sortByType} from '@/lib/stringArray';
import {useRouter} from 'vue-router';

const router = useRouter();

const {data} = useServerClient<ArtistResponse>({
  path: router.currentRoute.value.fullPath,
  keepForever: true,
});

onMounted(() => {
  document.dispatchEvent(new Event('sidebar'));
});

onUnmounted(() => {
  setColorPalette(null);
});

const displayList = ref<Song[]>();
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

const sort = (songs: Song[], sortType: SortType, sortOrder: SortOrder, value: string) => {

  const newList = sortByType<Song>(songs ?? [], sortType, sortOrder, setSortOrder);

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
  })
})

const displayType = ref<'list'|'card'>('list');
const setDisplayType = (type: 'list'|'card') => {
  displayType.value = type;
}
</script>

<template>
  <ion-page><NavBar />
    <ion-content :fullscreen="true">
      <div v-if="data?.id == page.props.id"
           class="inline-flex w-full flex-1 flex-col items-start justify-start overflow-clip rounded-2xl bg-auto-2/1">
        <Header v-if="data" :data="data"/>

        <Tabs :tabs="tabs">
          <template v-slot:extra="{ activeTab }">
            <div v-if="activeTab === tabs[0].name" class="absolute right-4 inline-flex items-center justify-start top-[9.65px] gap-2.5">
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
              <Home :activeTab="activeTab" v-if="data" :data="data" :displayType="displayType" />
            </Tab>
            <Tab :isActive="activeTab === tabs[1].name">
              <Albums v-if="data" :activeTab="activeTab" :data="data" item="albums" />
            </Tab>
            <Tab :isActive="activeTab === tabs[2].name">
              <Albums v-if="data" :activeTab="activeTab" :data="data" item="featured" />
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
    </ion-content>
  </ion-page>
</template>
