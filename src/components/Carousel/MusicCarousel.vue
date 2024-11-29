<script setup lang="ts">
import {PropType} from 'vue';
import {SwiperSlide} from 'swiper/vue';

import type {HomeDataItem, MusicHomeResponseItem} from '@/types/api/music/index.d';

import Carousel from '@/components/Carousel/Carousel.vue';
import MusicCard from '@/components/Cards/MusicCard.vue';

defineProps({
  data: {
    type: Object as PropType<MusicHomeResponseItem<HomeDataItem>> | undefined,
    required: true,
  },
  index: {
    type: Number,
    required: false,
    default: 0,
  },
  limitCardCountBy: {
    type: Number,
    required: false,
  },
});

const handleClick = (item: HomeDataItem) => {
  setTimeout(() => {
    if (item.color_palette) {
      //setLogoColorFromPalette(item.color_palette.poster);
      //setColorPalette(item.color_palette);
    }
  }, 50);
};

</script>

<template>
  <Carousel :title="data.title"
            :index="index" v-if="data.items?.length > 0" :limitCardCountBy="limitCardCountBy" :disableAutoAspect="true">

    <template v-slot:link v-if="data.moreLink">
      <RouterLink
          :to="data.moreLink"
          class="mr-auto ml-4 font-medium underline underline-offset-4">
        see more
      </RouterLink>
    </template>

    <swiper-slide v-for="item in data.items"
                  class="flex py-1" :key="item?.id"
                  :virtualIndex="index">

      <MusicCard
                v-if="item?.id"
                :data="item"
                 class=""
                 :id="`item-${item?.name}-${item?.id}`"
                 :onclick="() => handleClick(item)"/>
    </swiper-slide>
  </Carousel>
</template>
