<script setup lang="ts">
import {ref} from 'vue';
import {IonToolbar} from '@ionic/vue';

import router from '@/router';
import libraries from '@/store/Libraries';
import {isLibraryRoute} from '@/store/routeState';

import MobileLibraryHeaderButton from '@/views/Base/Library/components/MobileLibraryHeaderButton.vue';

const shownRoutes = [
  '/libraries/',
  '/collection',
  '/specials',
  '/genres',
  '/person',
];

const shown = ref(shownRoutes.some(route => router.currentRoute.value.fullPath.startsWith(route)));
router.afterEach(to => {
  shown.value = shownRoutes.some(route => to.fullPath.startsWith(route));
});

</script>

<template>
  <ion-toolbar v-if="shown"
      class="mt-safe transition-all duration-300"
  >
    <div class="flex h-16 items-center gap-2 overflow-auto p-2 will-change-auto min-h-16 w-available" >
      <template v-for="library in libraries?.filter(l => l.type != 'music') ?? []" :key="library.id">
        <MobileLibraryHeaderButton
            :url="`/libraries/${library.id}`"
            :title="library.title"
            icon="folder"
        />
      </template>

      <MobileLibraryHeaderButton url="/collection"
                                 :show="isLibraryRoute"
                                 icon="collection1"
                                 v-if="libraries?.some?.(l => l.type === 'movie')"
                                 title="Collections"/>
      <MobileLibraryHeaderButton url="/specials"
                                 :show="isLibraryRoute"
                                 icon="sparkles"
                                 title="Specials"/>
      <MobileLibraryHeaderButton url="/genres"
                                 :show="isLibraryRoute"
                                 icon="witchHat"
                                 v-if="libraries?.some?.(l => l.type !== 'music')"
                                 title="Genres"/>
      <MobileLibraryHeaderButton url="/person"
                                 :show="isLibraryRoute"
                                 icon="user"
                                 title="People"/>
    </div>
  </ion-toolbar>
</template>

