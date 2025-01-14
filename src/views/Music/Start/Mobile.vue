<script setup lang="ts">
import {IonPage, IonContent, onIonViewWillEnter} from '@ionic/vue';

import type {HomeDataItem} from '@/types/api/music';
import type {Component} from '@/lib/routerHelper';

import useServerClient from '@/lib/clients/useServerClient';

import {onMounted} from 'vue';
import {setColorPalette} from '@/store/ui';
import NotFound from "@/Layout/Desktop/components/NotFound.vue";

const {data, isError} = useServerClient<Component<HomeDataItem>[]>({
  queryKey: ['music', 'home']
});

onMounted(() => {
  setColorPalette(null);
});
onIonViewWillEnter(() => {
  setColorPalette(null);
});

</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <NotFound v-if="isError" />
      <template v-else-if="data">
        <template v-for="(render, index) in data ?? []" :key="render.id">
          <component
              v-if="render.component"
              :index="index"
              :is="render.component"
              v-bind="render.props"
          />
        </template>
      </template>
    </ion-content>
  </ion-page>
</template>
