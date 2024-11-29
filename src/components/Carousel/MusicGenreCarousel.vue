<script setup lang="ts">
import { PropType } from 'vue';
import { SwiperSlide } from 'swiper/vue';

import {HomeDataItem, MusicHomeResponseItem} from '@/types/api/music';

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

	// setTimeout(() => {
	// 	if (item?.backdrop) {
	// 		setBackground(item?.backdrop);
	// 	}
	// 	if (item?.poster) {
	// 		setPoster(item.poster);
	// 	}
	// 	if (item.title) {
	// 		setTitle(item.title);
	// 	}
	//   if (item.color_palette) {
	//     setLogoColorFromPalette(item.color_palette.poster);
	//     setColorPalette(item.color_palette);
	//   } else {
	//     resetLogoColors();
	//   }
	// }, 550);
};

</script>

<template>
  <Carousel :title="data.title" :index="index"  :limitCardCountBy="limitCardCountBy">
    <swiper-slide v-for="item in data.items" :key="item.id"
                  class="flex py-1" :virtualIndex="index">
      <MusicCard :data="item"
            class="px-2"
            :id="`item-${item.name}-${item.id}`"
            :onclick="() => handleClick(item)" />
    </swiper-slide>
  </Carousel>
</template>
