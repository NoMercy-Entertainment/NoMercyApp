<script lang="ts" setup>
import type { PropType } from 'vue';
import { ref, watch } from 'vue';
import { SwiperSlide } from 'swiper/vue';

import type { Episode, Season } from '@/types/api/base/info';

import Carousel from '@/components/Carousel/Carousel.vue';
import Select from '@/components/Forms/Select.vue';
import type { Swiper } from 'swiper';
import { useTranslation } from 'i18next-vue';
import type { SwiperContainer } from 'swiper/element/bundle';
import SeasonCard from '@/components/Cards/SeasonCard.vue';

const props = defineProps({
	data: {
		type: Array as PropType<Array<Season>> | undefined,
		required: true,
	},
	type: {
		type: String as PropType<'poster' | 'backdrop'>,
		required: false,
		default: 'poster',
	},
	limitCardCountBy: {
		type: Number,
		required: false,
	},
});

const { t } = useTranslation();

function handleClick(item: Episode) {
	//
}

let index = props.data?.findIndex(s => s.season_number === 1);
if (index === -1) {
	index = 0;
}

const seasonSelectorData = props.data?.map((s, index: number) => ({
	index,
	id: s.id,
	name: `${s.season_number} - ${s.title}`,
	season_number: s.season_number,
	episodes: s.episodes,
})) ?? [];

const currentSeason = ref(seasonSelectorData[index]);

function reset() {
	const swiper: Swiper = document.querySelector<SwiperContainer>(
		'.swiper-undefined',
	)?.swiper as Swiper;
	swiper?.slideTo(0, 300);
}

watch(currentSeason, reset);
</script>

<template>
	<Carousel
		:index="currentSeason.season_number"
		:limit-card-count-by="limitCardCountBy"
		:type="type"
	>
		<template #selector>
			<Select
				id="season-selector"
				v-model="currentSeason"
				:disabled="seasonSelectorData.length === 1"
				:items="seasonSelectorData"
				option-label="title"
				class="min-w-[21rem] ml-3"
				label=""
				variant="normal"
			/>
		</template>

		<SwiperSlide
			v-if="currentSeason.episodes?.length === 0"
			class="flex sm:p-1 sm:pl-0"
		>
			<SeasonCard
				id="item-0"
				:key="0"
				:data="{
					id: 1,
					title: t('To be announced'),
					season_number: null,
					episode_number: null,
					available: false,
					overview: '',
					airDate: '',
					still: '',
					link: '',
					color_palette: { still: { darkVibrant: '', lightVibrant: '' } },
					progress: null,
				}"
				:onclick="() => {}"
			/>
		</SwiperSlide>

		<SwiperSlide
			v-for="item in currentSeason.episodes"
			v-else
			:key="item.id"
			class="flex sm:p-1 sm:pl-0"
		>
			<SeasonCard
				:id="`item-${item.id}`"
				:data="item"
				:onclick="() => handleClick(item as Episode)"
			/>
		</SwiperSlide>
	</Carousel>
</template>
