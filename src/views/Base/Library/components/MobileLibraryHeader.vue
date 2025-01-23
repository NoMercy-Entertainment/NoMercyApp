<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from "vue-router";
import {
  IonToolbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  SegmentCustomEvent,
} from '@ionic/vue';

import router from '@/router';
import libraries from '@/store/Libraries';

import MoooomIcon from "@/components/Images/icons/MoooomIcon.vue";

const shownRoutes = [
  '/libraries/',
  '/genres',
];
const endsWithRoutes = [
  '/collection',
  '/specials',
  '/person',
];
const route = useRoute();

const show = ref(
  shownRoutes.some(r => route.fullPath.startsWith(r))
  || endsWithRoutes.some(r => route.fullPath.endsWith(r))
);
router.afterEach(to => {
  show.value = shownRoutes.some(route => to.fullPath.startsWith(route))
    || endsWithRoutes.some(route => to.fullPath.endsWith(route));
});

const onChange = async (event: SegmentCustomEvent) => {
  await router.push(event.detail.value as string);
};

</script>

<template>
  <ion-toolbar v-if="show" class="mt-safe transition-all duration-300">
    <ion-segment :scrollable="true" mode="ios" @ionChange="onChange">

      <template v-for="library in libraries?.filter(l => l.type != 'music') ?? []" :key="library.id">
        <ion-segment-button :value="`/libraries/${library.id}`" layout="icon-start">
          <MoooomIcon icon="folder" class="mr-2" />
          <ion-label>{{ library.title }}</ion-label>
        </ion-segment-button>
      </template>

      <ion-segment-button value="/collection" layout="icon-start" v-if="libraries?.some?.(l => l.type === 'movie')">
        <MoooomIcon icon="collection1" class="mr-2" />
        <ion-label>{{ $t('Collections') }}</ion-label>
      </ion-segment-button>

      <ion-segment-button value="/specials" layout="icon-start">
        <MoooomIcon icon="sparkles" class="mr-2" />
        <ion-label>{{ $t('Specials') }}</ion-label>
      </ion-segment-button>

      <ion-segment-button value="/genres" layout="icon-start" v-if="libraries?.some?.(l => l.type !== 'music')">
        <MoooomIcon icon="witchHat" class="mr-2" />
        <ion-label>{{ $t('Genres') }}</ion-label>
      </ion-segment-button>

      <ion-segment-button value="/person" layout="icon-start">
        <MoooomIcon icon="user" class="mr-2" />
        <ion-label>{{ $t('People') }}</ion-label>
      </ion-segment-button>
    </ion-segment>

  </ion-toolbar>
</template>

<style scoped lang="scss">
ion-toolbar {
  @apply bg-slate-light-1 dark:bg-slate-dark-3;
  --color-background: var(--color-background);
  --background: transparent !important;
}

ion-segment {
  @apply px-4;
  --background: transparent !important;
}

ion-segment-button::part(indicator-background) {
  @apply bg-focus;
}
</style>
