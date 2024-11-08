<script setup lang="ts">
import { PropType } from 'vue';
import { SwiperSlide } from 'swiper/vue';

import type {InfoCredit} from '@/types/api/base/info';

import Carousel from '@/components/Carousel/Carousel.vue';
import PersonCard from '@/components/Cards/PersonCard.vue';

defineProps({
	data: {
		type: Array as PropType<Array<InfoCredit>>|undefined,
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
    <Carousel :title="title" :limitCardCountBy="limitCardCountBy" type="poster" :disableAutoAspect="true">
        <swiper-slide v-for="item in data" :key="item.id" class="flex p-1 pl-0">
            <PersonCard :data="item" class="" />
        </swiper-slide>
    </Carousel>
</template>
