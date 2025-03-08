<script lang="ts" setup>
import { SortType } from '@/types/musicPlayer';

import SortButton from './SortButton.vue';
import { isAlbumRoute } from '@/store/routeState';
import { isPlatform } from "@ionic/vue";

</script>

<template>
  <div id="sortHeaderElement"
    class="sticky -mx-4 px-4 z-30 mt-4 block h-10 content-center items-center justify-start self-stretch bg-transparent text-sm font-medium transition-all duration-200 w-available group/track sm:w-available sm:-top-px"
    :class="{
      'top-safe-offset-10': isPlatform('capacitor'),
      'top-safe-offset-16': !isPlatform('capacitor')
    }">
    <span id="sorterChild"
      class="absolute inset-0 h-10 sm:rounded-t-2xl overflow-clip w-full transition-all duration-200"></span>
    <span :class="{
      'album-grid': isAlbumRoute,
      'artist-grid': !isAlbumRoute
    }"
      class="grid justify-start items-center self-stretch pr-3 sm:px-3 rounded-lg sm:hover:bg-slate-lightA-6 dark:hover:bg-slate-darkA-6 text-auto-12 group/track text-sm font-medium py-2 z-0 group/track gap-2 ">

      <SortButton id="sortIndex" :aria-label="$t('Sort by index')" :sortingType="SortType.index" class="!flex justify-center" iconSpacer="absolute left-6"
        name="#" />

      <SortButton :aria-label="$t('Sort by name')" :sortingType="SortType.name" class="flex sm:flex" iconSpacer="w-6 h-6" name="Title" />

      <SortButton :aria-label="$t('Sort by album')" :sortingType="SortType.album"  class="!hidden sm:!flex"
        :class="{
          'opacity-0': !isAlbumRoute,
          'opacity-100': isAlbumRoute
        }" iconSpacer="w-6 h-6" name="Album" />
      <!--routeIs('app.music.tracks') ? 'Date added' :-->
      <SortButton :name="'Release date'" :aria-label="$t('Sort by date')" :sortingType="SortType.date" class="!hidden sm:!flex" iconSpacer="w-6 h-6" />

      <SortButton :aria-label="$t('Sort by duration')" :sortingType="SortType.duration" class="!hidden sm:!flex gap-2 flex-row-reverse pr-[4.5rem]"
        iconSpacer="w-6 h-6" name="Duration" />
    </span>
  </div>
</template>

<style scoped>
.sticky {
  container-type: scroll-state;

  >*:first-child {
    @container scroll-state(stuck: top) {
      background: hsl(from rgb(var(--color-focus, var(--color-theme-9)) / var(--tw-bg-opacity, 1)) h calc(s / 1) calc(l / 1.8));
    }
  }
}
</style>
