<script setup lang="ts">
import type { PropType } from 'vue';
import { computed } from 'vue';

import type { InfoResponse } from '@/types/api/base/info';

import { useTranslation } from 'i18next-vue';
import { episodeCounter } from '@/lib/utils';
import { getColorFromPercent, redToGreen } from '@/lib/colorHelper';

const props = defineProps({
	data: {
		type: Object as PropType<Indicator & any>,
		required: true,
	},
});

const { t } = useTranslation();

interface Indicator {
	have_items: number;
	number_of_items: number;
}

const { number_of_items, have_items } = episodeCounter(props.data);

const percent
  = have_items && number_of_items ? (have_items / number_of_items) * 100 : 0;
const color = getColorFromPercent(percent, redToGreen);

const isMovie = computed(() => {
	return (props.data as InfoResponse).type === 'movie';
});

const value = computed(() => {
	if (have_items === null && number_of_items === null) {
		return;
	}
	if (have_items === 0 && number_of_items === 0) {
		return;
	}

	return `${have_items} ${t('of')} ${number_of_items}`;
});
</script>

<template>
	<span
		v-if="isMovie"
		class="absolute top-4 left-0 z-50 flex h-5 w-2 sm:w-4 place-items-center items-center justify-center overflow-hidden whitespace-nowrap rounded-tr-md rounded-br-md border-r border-b border-gray-900/50 px-1 text-xs text-transparent duration-200 animate-[grow_.3] pill shadow-pill lg:-left-2 lg:text-transparent"
		:class="{
			'bg-[#94f]': number_of_items === 1,
		}"
		:style="`
            background-image: ${
			redToGreen
				? `linear-gradient(90deg, ${color} 0%, ${color} 100%)`
				: ''
		};
				`"
	/>
	<span
		v-else-if="value"
		class="absolute text-white sm:text-transparent w-[var(--width)] sm:w-4 items-center h-5 z-50 left-0 lg:-left-2 top-4 rounded-tr-md rounded-br-md overflow-hidden flex px-1 text-xs whitespace-nowrap animate-[grow_.3] duration-200 place-items-center justify-center border-r border-b border-gray-900/50 pill shadow-pill lg:text-transparent lg:group-hover/card:text-white lg:group-focus/card:text-white group-hover/card:left-0 group-focus-within/card:left-0 group-focus-visible/card:left-0 group-hover/card:w-[var(--width)] group-focus-within/card:w-[var(--width)] group-focus-visible/card:w-[var(--width)] tv:text-white transition-all"
		:class="{
			'bg-[#94f] group-hover/card:text-white': percent === 100,
			'bg-[#4b4] group-hover/card:text-white': percent >= 70 && percent < 100,
			'!text-black sm:!text-transparent group-hover/card:!text-black group-focus-within/card:!text-black font-semibold':
				percent > 30 && percent < 80,
			'bg-[#fb3] sm:group-hover/card:text-white': percent > 0 && percent < 70,
			'bg-[#f44]': percent === 0,
		}"
		:style="`
            background-image: ${
			redToGreen
				? `linear-gradient(90deg, ${color} 0%, ${color} 100%)`
				: ''
		};
            color: ${have_items === null ? 'transparent' : ''};
          --width: calc(${value?.length} * 1ch);
          max-width: calc(${value?.length} * 1ch);
      `"
	>
		{{ value }}
	</span>
</template>
