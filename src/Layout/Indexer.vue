<script setup lang="ts">
import {onMounted, onUnmounted} from 'vue';
import {useRoute, RouterLink} from 'vue-router';

import {scrollToDiv} from '@/lib/scrollHandlers';
import {alphaNumericRange} from '@/lib/stringArray';
import {isNative} from '@/config/global';
import indexer, {setIndexerOpen} from '@/store/indexer';
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
    document.getElementById('indexer')
        ?.querySelectorAll<HTMLDivElement>('[data-indexer]')
        .forEach((el) => {
          el.classList.add('opacity-20', '!cursor-not-allowed');

          let target;
          if (el.dataset.indexer === '#') {
            target = document.querySelector?.('[data-scroll]');
          } else {
            target = document.querySelector?.(`[data-scroll='scroll_${el.dataset.indexer}']`);
          }

          if (!!target || isQueryPath(router.currentRoute.value.path)) {
            el.classList.remove('opacity-20', '!cursor-not-allowed');
          }
        });
  }, 500);
};

const disableScrollableTargets = () => {
  document.getElementById?.('indexer')
      ?.querySelectorAll('[data-indexer]')
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
  }, 50);
});

router.beforeEach(() => {
  disableScrollableTargets();
});

onMounted(() => {
  document.addEventListener("indexer", updateScrollableTargets);
});

onUnmounted(() => {
  document.removeEventListener("indexer", updateScrollableTargets);
})

</script>

<template>
  <div
      id="indexer"
      class="pointer-events-none z-0 mt-2 flex flex-col items-center justify-between self-stretch overflow-clip transition-width duration-300 text-slate-dark-1 dark:text-slate-light-1 sm:-translate-x-3"

      :class="{
          'w-8': indexer,
          'w-0': !indexer,
          'sm:ml-2': !isNative && indexer,
        }"
  >
    <template  v-for="letter in alphaNumericRange('#','Z')" :key="letter">
      <template v-if="isQueryPath(route.path)">
        <RouterLink :to="`${letter}`"
              :data-indexer="letter"
              tabindex="-1"
              class="pointer-events-auto relative flex h-6 w-6 flex-shrink-0 flex-grow-0 cursor-pointer flex-col items-center justify-center gap-2 rounded-sm hover:bg-auto-alpha-5">
            <p class="flex-shrink-0 flex-grow-0 text-center text-xs font-semibold leading-4">
              {{ letter }}
            </p>
        </RouterLink>
      </template>
      <div v-else
           :data-indexer="letter"
           tabindex="-1"
           @click="scrollToDiv(letter)"
           class="pointer-events-auto relative flex h-6 w-6 flex-shrink-0 flex-grow-0 cursor-pointer flex-col items-center justify-center gap-2 rounded-sm hover:bg-auto-alpha-5">
        <p class="flex-shrink-0 flex-grow-0 text-center text-xs font-semibold leading-4">
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
