<script setup lang="ts">
import {ref} from 'vue';
import {useRoute} from "vue-router";
import {
  IonToolbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
} from '@ionic/vue';

import router from '@/router';
import libraries from '@/store/Libraries';

import MoooomIcon from "@/components/Images/icons/MoooomIcon.vue";

const shownRoutes = [
  '/libraries/',
  '/genre',
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

</script>

<template>
  <ion-toolbar v-if="show" class="mt-safe transition-all duration-200 toolbar">
    <ion-segment :scrollable="true" mode="ios" :value="route.fullPath">

      <template v-for="library in libraries?.filter(l => l.type != 'music') ?? []" :key="library.id">
        <ion-segment-button :value="`/libraries/${library.id}`"
                            layout="icon-start"
                            @click="() => router.push(`/libraries/${library.id}`)"
                            :class="{
                              'bg-focus': route.fullPath.startsWith(`/libraries/${library.id}`),
                            }"
        >
          <MoooomIcon icon="folder" class="mr-2"/>
          <ion-label>{{ library.title }}</ion-label>
        </ion-segment-button>
      </template>

      <ion-segment-button value="/collection"
                          layout="icon-start"
                          @click="() => router.push('/collection')"
                          v-if="libraries?.some?.(l => l.type === 'movie')"
                          :class="{
                            'bg-focus': route.fullPath.startsWith('/collection'),
                          }"
      >
        <MoooomIcon icon="collection1" class="mr-2"/>
        <ion-label>{{ $t('Collections') }}</ion-label>
      </ion-segment-button>

      <ion-segment-button value="/specials"
                          layout="icon-start"
                          @click="() => router.push('/specials')"
                          :class="{
                            'bg-focus': route.fullPath.startsWith('/specials'),
                          }"
      >
        <MoooomIcon icon="sparkles" class="mr-2"/>
        <ion-label>{{ $t('Specials') }}</ion-label>
      </ion-segment-button>

      <ion-segment-button value="/genre"
                          layout="icon-start"
                          @click="() => router.push('/genre')"
                          :class="{
                            'bg-focus': route.fullPath.startsWith('/genre'),
                          }"
      >
        <MoooomIcon icon="witchHat" class="mr-2"/>
        <ion-label>{{ $t('Genres') }}</ion-label>
      </ion-segment-button>

      <ion-segment-button value="/person"
                          layout="icon-start"
                          @click="() => router.push('/person')"
                          :class="{
                            'bg-focus': route.fullPath.startsWith('/person'),
                          }"
      >
        <MoooomIcon icon="user" class="mr-2"/>
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
ion-segment-button::part(native) {

}
</style>
