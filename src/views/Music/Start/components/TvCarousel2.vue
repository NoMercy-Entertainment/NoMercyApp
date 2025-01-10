<script setup lang="ts">

import {type PropType} from "vue";
import type {HomeDataItem} from "@/types/api/music";
import {currentServer} from "@/store/currentServer";
import {Component} from "@/lib/routerHelper";

const props = defineProps({
  data: {
    type: Array as PropType<Component<HomeDataItem>[]>,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  handleFocus: {
    type: Function as PropType<(event: FocusEvent, item?: HomeDataItem) => void>,
    required: true,
  },
  handleDown: {
    type: Function as PropType<(event: KeyboardEvent) => void>,
    required: true,
  },
  handleUp: {
    type: Function as PropType<(event: KeyboardEvent) => void>,
    required: true,
  },
  suffix: {
    type: String,
    required: false,
    default: '',
  },
});

</script>

<template>
  <div data-row v-if="data.length"
       class="grid grid-rows-[auto_1fr] grid-cols-7 relative justify-start flex-1 w-full gap-3 mb-2 mt-4">
    <h3 class="row-start-1 col-span-7 pointer-events-none font-semibold font-3xl">
      {{ title }}
    </h3>
    <template v-for="(item, index) in data?.slice(0,7)" :key="item.id">
      <RouterLink :to="`${item.props?.data.link}${suffix}`" :data-card="item.props?.data.id" :data-index="index"
                  class="row-start-2 w-full h-auto rounded-xl bg-cover aspect-square focus:scale-105 focus:outline outline-[2.2px] outline-white transition-transform duration-200 scroll-mb-20 scroll-mt-8 snap-top snap-mandatory"
                  @focus="handleFocus($event, item.props.data)"
                  @keydown="handleDown($event)"
                  @keyup="handleUp($event)"
                  :style="`background-image: url('${currentServer?.serverBaseUrl}${item.props.data.cover}')`"
      ></RouterLink>
    </template>
  </div>

  <Teleport to=".image-preload-container">
    <template v-for="item in data?.slice(0,7)" :key="item.id">
      <img :src="`${currentServer?.serverBaseUrl}${item.props.data.cover}`"
           width="0"
           height="0"
           loading="eager"
           alt=""
           class="absolute">
    </template>
  </Teleport>
</template>
