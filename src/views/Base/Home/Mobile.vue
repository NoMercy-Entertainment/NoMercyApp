<script setup lang="ts">
import { IonPage, IonContent, onIonViewWillEnter } from '@ionic/vue';

import {type PropType, watch} from 'vue';
import type { HomeItem } from '@/types/api/base/home';
import { type Component, getMutating, getMutation, getQuery, queryKey } from '@/lib/routerHelper';

import router from '@/router';
import { useRoute } from 'vue-router';
import {currentServer} from "@/store/currentServer";

const props = defineProps({
  options: {
    type: Object as PropType<Component<HomeItem>[] & { queryKey?: string[], path?: string }>,
    required: false,
    default: () => ({
      keepForever: true,
      queryKey: queryKey(),
    }),
  },
});

const route = useRoute();
const routeName = router.currentRoute.value.name;

const isMutating = getMutating({ queryKey: props.options?.queryKey, path: route.path });

const { data: homeData, refetch } = getQuery({ queryKey: props.options.queryKey, path: route.path });

const { data: mutatedData, mutate, reset } = getMutation({ queryKey: props.options.queryKey, homeData: homeData });

onIonViewWillEnter(() => {
  if (!homeData.value) return;

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
