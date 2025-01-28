<script setup lang="ts">
import { onMounted, watch, type PropType } from 'vue';

import type { HomeItem } from '@/types/api/base/home';
import { type Component, getMutating, getMutation, getQuery, queryKey as qk } from '@/lib/routerHelper';

import { setTitle } from '@/lib/stringArray';
import { setBackground, setColorPalette } from '@/store/ui';
import { useOnline } from '@vueuse/core';

const props = defineProps({
  options: {
    type: Object as PropType<Component<HomeItem>[] & { queryKey: string[], path?: string }>,
    required: false,
    default: () => ({
      keepForever: true,
      queryKey: qk(),
    }),
  },
});

const queryKey = props.options.queryKey ?? qk();

const isMutating = getMutating({ queryKey });

const { data: homeData } = getQuery({ queryKey });

const { data: mutatedData, mutate } = getMutation({ queryKey, homeData: homeData });

const onlineStatus = useOnline();

onMounted(() => {
  if (!homeData.value) return;

  setTitle();
  setBackground(null);
  setColorPalette(null);

  if (onlineStatus.value) {
    const mutations = homeData.value?.filter?.(item => item?.update?.when == 'pageLoad') ?? [];
    mutate(mutations);
  }
});

watch(onlineStatus, (value) => {
  if (!value) return;

  const mutations = homeData.value?.filter?.(item => item?.update?.when == 'online') ?? [];
  mutate(mutations);
});

</script>

<template>
  <template v-if="!isMutating || !onlineStatus">
    <component v-for="(render, index) in mutatedData ?? homeData ?? []" :index="index" :key="render.id"
      :is="render.component" v-bind="render.props" />
  </template>
</template>
