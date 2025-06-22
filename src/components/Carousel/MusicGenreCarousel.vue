<script setup lang="ts">
import type { PropType } from 'vue';
import { SwiperSlide } from 'swiper/vue';

import type { HomeDataItem, MusicHomeResponseItem } from '@/types/api/music';

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

function handleClick(item: HomeDataItem) {
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
}
</script>

<template>
	<Carousel
		:title="data.title"
		:index="index"
		:limit-card-count-by="limitCardCountBy"
	>
		<SwiperSlide
			v-for="item in data.items"
			:key="item.id"
			class="flex py-1"
			:virtual-index="index"
		>
			<MusicCard
				:id="`item-${item.name}-${item.id}`"
				:data="item"
				class="px-2"
				:onclick="() => handleClick(item)"
			/>
		</SwiperSlide>
	</Carousel>
</template>
