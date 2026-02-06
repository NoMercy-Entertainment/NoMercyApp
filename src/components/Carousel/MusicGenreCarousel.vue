<script lang="ts" setup>
import type { PropType } from 'vue';
import { SwiperSlide } from 'swiper/vue';

import type { HomeDataItem, MusicHomeResponseItem } from '@/types/api/music';

import Carousel from '@/components/Carousel/Carousel.vue';
import NMMusicCard from '@/components/NMMusicCard.vue';

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
		:index="index"
		:limit-card-count-by="limitCardCountBy"
		:title="data.title"
	>
		<SwiperSlide
			v-for="(item, itemIndex) in data.items"
			:key="item.id"
			:virtual-index="itemIndex"
			class="flex py-1"
		>
			<NMMusicCard
				:id="`item-${item.name}-${item.id}`"
				:data="item"
				:onclick="() => handleClick(item)"
				class="px-2"
			/>
		</SwiperSlide>
	</Carousel>
</template>
