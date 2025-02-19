<script setup lang="ts">
import { watch} from 'vue';
import { IonPage, IonContent, onIonViewWillEnter } from '@ionic/vue';

import {getMutating, getMutation, getQuery} from '@/lib/routerHelper';

import {currentServer} from "@/store/currentServer";
import {useRoute} from "vue-router";
import router from "@/router";

const route = useRoute();
const routeName = router.currentRoute.value.name;

const isMutating = getMutating({ queryKey: ['music', 'home'], path: route.path });

const { data: homeData, refetch } = getQuery({ queryKey: ['music', 'home'], path: route.path });

const { data: mutatedData, mutate, reset } = getMutation({ queryKey: ['music', 'home'], homeData: homeData, path: route.path });

onIonViewWillEnter(() => {
  if (!homeData.value) {
    refetch();
    return;
  }

  if (route.name !== routeName) return;

  const mutations = homeData.value?.filter?.(item => item?.update?.when == 'pageLoad') ?? [];
  mutate(mutations);
});

watch(currentServer, (value) => {
  if (!value) {
    mutatedData.value = undefined;
    homeData.value = undefined;
  }
  else {
    refetch();
    reset();
  }
});

</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <template v-if="!isMutating && (mutatedData?.every?.(d => d.component) || homeData?.every?.(d => d.component))">
        <component v-for="(render, index) in mutatedData ?? homeData" :index="index" :key="render.id"
                   :is="render.component" v-bind="render.props" />
      </template>
    </ion-content>
  </ion-page>
</template>
