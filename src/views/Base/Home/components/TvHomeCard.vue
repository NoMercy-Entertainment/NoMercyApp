<script setup lang="ts">
import {type PropType} from 'vue';

import type {Component} from '@/lib/routerHelper';
import type {HomeItem} from '@/types/api/base/home';

import {currentServer} from '@/store/currentServer';

import ContentRating from '@/components/Images/ContentRating.vue';

defineProps({
  carousel: {
    type: Object as PropType<Component<HomeItem>>,
    required: true
  },
  items: {
    type: Array as PropType<HomeItem[]>,
    required: true
  }
});

</script>

<template>
  <div class="w-full h-full absolute right-0 top-0 overflow-hidden bg-black" v-if="carousel?.props?.data">
    <img
        :src="`${currentServer?.serverBaseUrl}/images/original${carousel?.props?.data?.backdrop}`"
        alt=""
        class="w-full h-full absolute inset-0 left-40 object-scale-down"
    />

    <div class="absolute bottom-0 w-full h-[200%]"
         style="
                flex-shrink: 0;
               background: radial-gradient(87.82% 267.96% at 92.04% -27%, rgba(19, 19, 20, 0.10) 34%, #131314 70.74%);"
    ></div>
  </div>

  <div class="flex flex-col justify-start items-start absolute left-8 gap-5 bottom-4">

    <div class="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 relative gap-1">

      <div class="flex items-center gap-2 text-xs font-medium text-left text-slate-dark-11">
        <ContentRating :ratings="carousel.props.data.content_ratings" />
        <span class="text-3xs">( {{ carousel.props.data.year }} )</span>
      </div>

      <p class="text-2xl text-left text-slate-dark-12 line-clamp-1 w-4/5">
        {{ carousel.props?.data?.title }}
      </p>

      <p class="line-clamp-5 text-xs w-3/6">
        {{ carousel.props?.data?.overview }}
      </p>

    </div>

    <div
        class="flex justify-center items-center flex-grow-0 flex-shrink-0 relative">

      <RouterLink :to="carousel?.props.data.link" id="watch_now" ref="play"
                  tabindex="0"
                  class="text-black flex-grow-0 flex-shrink-0 px-4 py-2 rounded-3xl bg-slate-light-4 focus-visible:ring-[3px] ring-inset focus-visible:ring-focus">
                {{ $t('Watch Now') }}
      </RouterLink>
    </div>
  </div>

<!--  <div-->
<!--      class="flex justify-center items-center absolute right-4 bottom-4 gap-1.5 px-2 py-1.5 z-10"-->
<!--  >-->
<!--    <div class="absolute flex-grow-0 flex-shrink-0 w-20 h-5 opacity-50 rounded-2xl bg-black"></div>-->
<!--    <template v-for="(item, index) in [0,1,2,3,4]" :key="item">-->
<!--      <div-->
<!--          class="flex-grow-0 flex-shrink-0 w-1.5 h-1.5 rounded-full"-->
<!--          :class="{-->
<!--                    'bg-white': index === 0,-->
<!--                    'bg-[#8e918f]': index !== 0-->
<!--                  }"-->
<!--      ></div>-->
<!--    </template>-->
<!--  </div>-->
</template>

<style scoped>

</style>
