<script lang="ts" setup>
import type { PropType } from 'vue';
import { onMounted, ref, watch } from 'vue';

import type { Rating } from '@/types/api/base/collection';

const props = defineProps({
	ratings: {
		type: Array as PropType<Rating[]> | undefined,
		required: true,
	},
	size: {
		type: Number,
		default: 10,
	},
});

const rating = ref();

watch(props, (value) => {
	if (!value.ratings)
		return;

	rating.value = value.ratings?.find(
		r => r.iso_3166_1 === window.navigator.language.split('-')[1],
	);

	if (!rating.value) {
		rating.value = value.ratings?.at(0);
	}
});

onMounted(() => {
	if (!props.ratings)
		return;

	rating.value = props.ratings?.find(
		r => r.iso_3166_1 === window.navigator.language.split('-')[1],
	);

	if (!rating.value) {
		rating.value = props.ratings?.at(0);
	}
});
</script>

<template>
	<div
		v-if="rating?.iso_3166_1"
		class="relative flex flex-col items-start justify-center gap-1"
	>
		<div
			id="rating-image"
			:style="`
            height: ${size * 6}px;
            width: ${size * 8}px;
        `"
			class="flex w-auto whitespace-nowrap text-base font-medium text-white"
		>
			<img
				:alt="rating?.iso_3166_1"
				:src="`https://pub-a68768bb5b1045f296df9ea56bd53a7f.r2.dev/kijkwijzer/${rating?.iso_3166_1}/${rating?.iso_3166_1}_${rating?.rating}.svg`"
				class="dark:invert"
			>
		</div>
	</div>
</template>
