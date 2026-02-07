<script setup lang="ts">
import type { PropType } from 'vue';
import { SwiperSlide } from 'swiper/vue';

import type { InfoCredit } from '@/types/api/base/info';

import Carousel from '@/components/Carousel/Carousel.vue';
import PersonCard from '@/components/Cards/PersonCard.vue';

defineProps({
	data: {
		type: Array as PropType<Array<InfoCredit>> | undefined,
		required: true,
	},
	title: {
		type: String,
		required: true,
	},
	limitCardCountBy: {
		type: Number,
		required: false,
	},
});
</script>

<template>
	<Carousel
		:title="title"
		:limit-card-count-by="limitCardCountBy"
		type="poster"
		:disable-auto-aspect="true"
	>
		<SwiperSlide v-for="(item, itemIndex) in data" :key="item.id" :virtual-index="itemIndex" class="flex sm:p-1 pl-0">
			<PersonCard :data="item" class="" />
		</SwiperSlide>
	</Carousel>
</template>
