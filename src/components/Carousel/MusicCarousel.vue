<script lang="ts" setup>
import type { PropType } from 'vue';
import { SwiperSlide } from 'swiper/vue';

import type { HomeDataItem, MusicHomeResponseItem } from '@/types/api/music/index.d';

import Carousel from '@/components/Carousel/Carousel.vue';

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
		:disable-auto-aspect="true"
		:index="index"
		:limit-card-count-by="limitCardCountBy"
		:title="data.title"
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
			:virtual-index="index"
			class="flex py-1"
		>
			<NMMusicCard
				v-if="item?.id"
				:id="`item-${item?.name}-${item?.id}`"
				:data="item"
				:onclick="() => handleClick(item)"
				class=""
			/>
		</SwiperSlide>
	</Carousel>
</template>
