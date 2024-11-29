<script setup lang="ts">
import {computed, onMounted, watch} from 'vue';
import {ScrollPanel} from 'primevue';

import type {Playlist} from '@/types/api/music/playlists';

import useServerClient from '@/lib/clients/useServerClient';

import sidebar, {closeSidebar, hideSidebar, openSidebar, toggleSidebar} from '@/store/sidebar';
import router from '@/router';

import SidebarButtonGroup from './SidebarButtonGroup.vue';
import SidebarButton from './SidebarButton.vue';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';
import libraries from '@/store/Libraries';
import {setMusicPlaylists} from '@/store/musicPlaylists';

// const {data: libraries, refetch} = useServerClient<ServerLibrary[]>({
//   path: '/dashboard/libraries',
//   queryKey: ['libraries'],
// });

const {data: playlists} = useServerClient<Playlist[]>({
  path: '/music/playlists',
  queryKey: ['playlists'],
});

watch(playlists, (value) => {
  if (!value) return;
  setMusicPlaylists(value);
});

const isHomeRoute = computed(() => {
  return router.currentRoute.value.fullPath === '/home';
});

const isLibraryRoute = computed(() => {
  return router.currentRoute.value.fullPath.startsWith('/libraries')
      || router.currentRoute.value.fullPath?.startsWith('/collection')
      || router.currentRoute.value.fullPath?.startsWith('/specials')
      || router.currentRoute.value.fullPath?.startsWith('/genres')
      || router.currentRoute.value.fullPath?.startsWith('/movie')
      || router.currentRoute.value.fullPath?.startsWith('/tv')
      || router.currentRoute.value.fullPath?.startsWith('/person');
});

const isMusicRoute = computed(() => {
  return router.currentRoute.value.fullPath?.startsWith('/music');
});

const isDashboardRoute = computed(() => {
  return router.currentRoute.value.fullPath?.startsWith('/dashboard');
});

const isSetupRoute = computed(() => {
  return router.currentRoute.value.fullPath?.startsWith('/setup') || router.currentRoute.value.fullPath?.includes('search');
});

const isPreferencesRoute = computed(() => {
  return router.currentRoute.value.fullPath?.startsWith('/preferences');
});

const handleSidebar = () => {
  if (isLibraryRoute.value || isMusicRoute.value || isDashboardRoute.value || isPreferencesRoute.value) {
    openSidebar();
  } else if (isHomeRoute.value || isSetupRoute.value) {
    hideSidebar();
  } else {
    closeSidebar();
  }
};

router.afterEach(() => {
  setTimeout(() => {
    handleSidebar();
  }, 50);
});

onMounted(() => {
  handleSidebar();
});

router.beforeEach(() => {
});

const libraryIconName = (type: string) => {
  switch (type) {
    case 'anime':
    case 'tv':
      return 'monitor';
    case 'movie':
      return 'movieClap';
  }
};

</script>

<template>
  <aside id="sidebar"
         :data-sidebar="sidebar"
         class="absolute bg-slate-light-1 dark:bg-slate-dark-1 top-0 bottom-0 left-0 flex sidebar-open:w-64 sidebar-closed:-translate-x-full sidebar-hidden:-translate-x-full items-start justify-start self-stretch overflow-x-visible transition-[transform,width] duration-300 sidebar h-available z-1099 group/aside sidebar-hidden:sm:w-0 sidebar-closed:sm:w-20 sidebar-closed:sm:translate-x-0 sidebar-hidden:sm:translate-x-0 sm:!relative max-h-available overflow-clip children:opacity-100 sidebar-hidden:children:opacity-0">
    <div
        class="flex sidebar-open:w-64 flex-grow flex-col items-start justify-start self-stretch overflow-clip h-available sidebar-hidden:sm:w-4 sidebar-closed:sm:w-20 sm:mt-4 overflow-x-hidden"
        :data-sidebar="sidebar">
      <ScrollPanel class="w-available h-available"
                   :dt="{
                      bar: {
                          background: 'rgb(var(--background-auto-12) / 60%)'
                      }
                  }"
      >
        <div class="flex flex-col items-start justify-start gap-1 self-stretch px-4">

          <!--                    Base pages-->
          <template v-for="library in libraries?.filter?.(l => l.type !== 'music')" :key="library.id">
            <SidebarButton :href="`/libraries/${library.id}`"
                           :show="isLibraryRoute"
                           :icon="libraryIconName(library.type)"
                           :name="library.title"/>
          </template>
          <SidebarButton href="/collection"
                         :show="isLibraryRoute"
                         icon="collection1"
                         v-if="libraries?.some?.(l => l.type === 'movie')"
                         name="Collections"/>
          <SidebarButton href="/specials"
                         :show="isLibraryRoute"
                         icon="sparkles"
                         name="Specials"/>
          <SidebarButton href="/genres"
                         :show="isLibraryRoute"
                         icon="witchHat"
                         v-if="libraries?.some?.(l => l.type !== 'music')"
                         name="Genres"/>
          <SidebarButton href="/person"
                         :show="isLibraryRoute"
                         icon="user"
                         name="People"/>
          <!--                    End Base pages-->

          <!--                    Music pages-->
          <SidebarButton href="/music/start"
                         :show="isMusicRoute"
                         icon="speaker"
                         name="Start"/>
          <SidebarButton href="/music/artists"
                         :show="isMusicRoute"
                         icon="user" name="Artists"/>
          <SidebarButton href="/music/albums"
                         :show="isMusicRoute"
                         icon="disk" name="Albums"/>
          <SidebarButton href="/music/genres"
                         :show="isMusicRoute"
                         icon="noteClefTreble" name="Genres"/>
          <SidebarButton href="/music/tracks"
                         :show="isMusicRoute"
                         icon="heart"
                         name="Songs you like"/>

          <SidebarButtonGroup :show="isMusicRoute"
                              icon="playlist1Add"
                              title="Playlists"
          >

            <SidebarButton href="/music/playlists"
                           name="Show all"/>

            <template v-for="playlist in playlists ?? []" :key="playlist.id">
              <SidebarButton :href="`/music/playlists/${playlist.id}`"
                             :cover="playlist.cover"
                             :name="playlist.name"/>
            </template>

          </SidebarButtonGroup>
          <!--                    End Music pages-->

          <!--                    Dashboard pages-->
          <SidebarButtonGroup :show="isDashboardRoute"
                              title="System"
          >

            <SidebarButton href="/dashboard/system"
                           icon="gridMasonry" name="System info"/>
            <SidebarButton href="/dashboard/general"
                           icon="settings" name="General"/>
            <SidebarButton href="/dashboard/users"
                           icon="users" name="Users"/>
            <SidebarButton href="/dashboard/libraries"
                           icon="folder" name="Libraries"/>
            <SidebarButton href="/dashboard/encoderprofiles"
                           icon="playCircle" name="Encoder profiles"/>
            <SidebarButton href="/dashboard/notifications"
                           icon="bell" name="Notifications"/>

          </SidebarButtonGroup>
          <SidebarButtonGroup :show="isDashboardRoute"
                              title="Content"
          >

            <SidebarButton href="/dashboard/metadata"
                           icon="edit" name="Metadata"/>
            <SidebarButton href="/dashboard/specials"
                           icon="sparkles" name="Specials"/>
            <SidebarButton href="/dashboard/ripper"
                           icon="disk" name="Ripper"/>

          </SidebarButtonGroup>
          <SidebarButtonGroup :show="isDashboardRoute"
                              title="Devices"
          >

            <SidebarButton href="/dashboard/devices"
                           icon="monitor" name="Devices"/>
            <SidebarButton href="/dashboard/activity"
                           icon="tag" name="Activity"/>
            <SidebarButton href="/dashboard/dlna"
                           icon="airPlay" name="DLNA"/>

          </SidebarButtonGroup>
          <SidebarButtonGroup :show="isDashboardRoute"
                              title="Advanced"
          >

            <SidebarButton href="/dashboard/logs"
                           icon="terminalBox"
                           name="Logs"/>
            <SidebarButton href="/dashboard/plugins"
                           icon="shoppingCart"
                           name="Plugins"/>
            <SidebarButton href="/dashboard/schedule"
                           icon="timeFast1"
                           name="Scheduled Tasks"/>

          </SidebarButtonGroup>
          <!--                    End Dashboard pages-->

          <!--                    Preferences pages-->
          <SidebarButton href="/preferences/display"
                         icon="tv"
                         :show="isPreferencesRoute"
                         name="Display"/>
          <SidebarButton href="/preferences/profile"
                         icon="userEdit"
                         :show="isPreferencesRoute"
                         name="Profile"/>
          <SidebarButton href="/preferences/subtitles"
                         icon="closedCaption"
                         :show="isPreferencesRoute"
                         name="Subtitles"/>
          <SidebarButton href="/preferences/controls"
                         icon="keyboard"
                         :show="isPreferencesRoute"
                         name="Controls"/>
          <!--                    end Preferences pages-->
        </div>
      </ScrollPanel>
    </div>
    <button @click="toggleSidebar()"
            :data-sidebar="sidebar"
            style="box-shadow: 0 1px 2px 0 rgba(16,24,40,0.05);"
            class="bg-slate-light-5 dark:bg-slate-dark-5 border-slate-light-10 dark:border-slate-dark-10 hidden sm:group-hover/aside:flex absolute top-[30px] overflow-hidden z-1099 duration-300 w-8 h-8 p-1.5 rounded-md shadow justify-center items-center gap-2 border border-auto-alpha-7 sidebar-open:left-60 sidebar-closed:left-16 sidebar-hidden:!hidden">
      <MoooomIcon icon="chevronLeft"
                  :data-sidebar="sidebar"
                  className="rotate-0 sidebar-closed:rotate-180"/>
    </button>
  </aside>
</template>
