<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useRoute, RouterLink } from 'vue-router';

import {keyHandler, scrollToDiv} from '@/lib/scrollHandlers';
import { alphaNumericRange } from '@/lib/stringArray';
import {isMobile, isNative} from '@/config/global';
import indexer, { setIndexerOpen } from '@/store/indexer';
import router from '@/router';

const openPaths = [
  'Libraries',
  'Library',
  'Collections',
  'Albums',
  'Artists',
];

const queryPaths = [
  '/music/albums',
  '/music/artists',
];

const indexerState = (route: string) => openPaths.some((path) => route.startsWith(path));
const isQueryPath = (route: string) => queryPaths.some((path) => route.startsWith(path));

const route = useRoute();

const updateScrollableTargets = () => {
  setTimeout(() => {
    document.querySelector(isMobile.value ? 'ion-tabs ion-router-outlet  div.ion-page:not(.ion-page-hidden) [indexer]' : '[indexer]')
      ?.querySelectorAll<HTMLDivElement>('[data-indexer]')
      .forEach((el) => {

        let target;
        if (el.dataset.indexer === '#') {
          target = document.querySelector?.('ion-tabs ion-router-outlet div.ion-page:not(.ion-page-hidden) [data-scroll]');
        } else {
          target = document.querySelector?.(`ion-tabs ion-router-outlet div.ion-page:not(.ion-page-hidden) [data-scroll='scroll_${el.dataset.indexer}']`);
        }

        if (!!target || isQueryPath(router.currentRoute.value.path)) {
          el.classList.remove('opacity-20', '!cursor-not-allowed');
        } else {
          el.classList.add('opacity-20', '!cursor-not-allowed');
        }
      });
  }, 500);
};

window.updateScrollableTargets = updateScrollableTargets;

const disableScrollableTargets = () => {
  document.querySelector(isMobile.value ? 'ion-tabs ion-router-outlet  div.ion-page:not(.ion-page-hidden) [indexer]' : '[indexer]')
    ?.querySelectorAll<HTMLDivElement>('[data-indexer]')
    .forEach((el) => {
      el.classList.add('opacity-20', '!cursor-not-allowed');
    });
};

const triggerIndexer = (route: string) => {
  setIndexerOpen(indexerState(route));
  updateScrollableTargets();
};

router.afterEach((to) => {
  setTimeout(() => {
    triggerIndexer(to.name as string ?? to.path);
  }, 150);
});

router.beforeEach(() => {
  disableScrollableTargets();
});

onMounted(() => {
  setTimeout(() => {
    triggerIndexer(router.currentRoute.value.name as string ?? router.currentRoute.value.path as string);
  }, 150);
  document.addEventListener("indexer", updateScrollableTargets);
  document.addEventListener('keydown', keyHandler);
});

onUnmounted(() => {
  document.removeEventListener("indexer", updateScrollableTargets);
  document.removeEventListener('keydown', keyHandler);
});

</script>

<template>
  <div indexer
    class="pointer-events-none z-0 mt-safe h-available sm:h-available flex flex-col items-center justify-between self-stretch overflow-clip transition-width duration-300 text-slate-dark-1 dark:text-slate-light-1 sm:-translate-x-3 pt-2"
    :class="{
      'w-8': indexer,
      'w-0': !indexer,
      'sm:ml-2': !isNative && indexer,
      'bottom-0': isNative,
    }">
    <template v-for="letter in alphaNumericRange('#', 'Z')" :key="letter">
      <template v-if="isQueryPath(route.path)">
        <RouterLink :to="`${letter}`" :data-indexer="letter" tabindex="-1"
          class="pointer-events-auto relative flex size-6 cursor-pointer flex-col items-center justify-center rounded-sm hover:bg-auto-alpha-5">
          <p class="flex-shrink-0 flex-grow-0 text-center text-xs font-semibold leading-none">
            {{ letter }}
          </p>
        </RouterLink>
      </template>
      <div v-else :data-indexer="letter" tabindex="-1" @click="scrollToDiv(letter)"
        class="pointer-events-auto relative flex size-6 cursor-pointer flex-col items-center justify-center rounded-sm hover:bg-auto-alpha-5">
        <p class="flex-shrink-0 flex-grow-0 text-center text-xs font-semibold leading-none">
          {{ letter }}
        </p>
      </div>
    </template>
  </div>
</template>

<style scoped>
html.plt-mobileweb:has(#miniPlayer) .indexer {
  @apply pb-16;
}
</style>
