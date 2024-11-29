<script setup lang="ts">
import {onMounted, type PropType} from 'vue';

import type {HomeItem} from '@/types/api/base/home';
import {type Component, getMutating, getMutation, getQuery, queryKey} from '@/lib/routerHelper';

import {setTitle} from '@/lib/stringArray';
import {setBackground, setColorPalette} from '@/store/ui';

const props = defineProps({
  options: {
    type: Object as PropType<Component<HomeItem>[] & { queryKey: string[], path?: string }>,
    required: false,
    default: () => ({
      keepForever: true,
      queryKey: queryKey(),
    }),
  },
});

const kc = props.options.queryKey ?? queryKey();

const isMutating = getMutating(kc);

const {data: homeData} = getQuery(kc);

const {data: mutatedData, mutate} = getMutation({key: kc, homeData: homeData});

onMounted(() => {
  if (!homeData.value) return;

  setTitle();
  setBackground(null);
  setColorPalette(null);

  const mutations = homeData.value?.filter?.(item => item?.update?.when == 'pageLoad') ?? [];
  mutate(mutations);
});

</script>

<template>
  <template v-if="!isMutating">
    <component
        v-for="(render, index) in mutatedData ?? homeData ?? []"
        :index="index"
        :key="render.id"
        :is="render.component"
        v-bind="render.props"
    />
  </template>
</template>
