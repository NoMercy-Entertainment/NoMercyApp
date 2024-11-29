<script setup lang="ts">
import { IonPage, IonContent } from '@ionic/vue';

import type {HomeDataItem} from '@/types/api/music';
import type {Component} from '@/lib/routerHelper';

import useServerClient from '@/lib/clients/useServerClient';

import {onMounted} from 'vue';
import {setColorPalette} from '@/store/ui';

const {data} = useServerClient<Component<HomeDataItem>[]>({
  queryKey: ['music', 'home']
});

onMounted(() => {
  setColorPalette(null);
});

</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <template v-if="data">
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
