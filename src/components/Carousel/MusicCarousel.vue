<script setup lang="ts">
import type { PropType } from 'vue';
import { SwiperSlide } from 'swiper/vue';

import type {
	HomeDataItem,
	MusicHomeResponseItem,
} from '@/types/api/music/index.d';

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
	setTimeout(() => {
		if (item.color_palette) {
			// setLogoColorFromPalette(item.color_palette.poster);
			// setColorPalette(item.color_palette);
		}
	}, 50);
}
</script>

<template>
	<Carousel
		v-if="data.items?.length > 0"
		:title="data.title"
		:index="index"
		:limit-card-count-by="limitCardCountBy"
		:disable-auto-aspect="true"
	>
		<template v-if="data.moreLink" #link>
			<RouterLink
				:to="data.moreLink"
				class="mr-auto ml-4 font-medium underline underline-offset-4"
			>
				see more
			</RouterLink>
		</template>

		<SwiperSlide
			v-for="item in data.items"
			:key="item?.id"
			class="flex py-1"
			:virtual-index="index"
		>
			<MusicCard
				v-if="item?.id"
				:id="`item-${item?.name}-${item?.id}`"
				:data="item"
				class=""
				:onclick="() => handleClick(item)"
			/>
		</SwiperSlide>
	</Carousel>
</template>
