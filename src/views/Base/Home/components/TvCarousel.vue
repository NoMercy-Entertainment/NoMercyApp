<script setup lang="ts">
import type { PropType } from 'vue';
import { onMounted, ref } from 'vue';

import TvCard from '@/views/Base/Home/components/TvCard.vue';

const props = defineProps({
	carousel: {
		type: Object,
		required: true,
	},
	scrollToCenter: {
		type: Function,
		required: true,
	},
	scrollIndex: {
		type: Number,
		required: true,
	},
	setScrollIndex: {
		type: Function as PropType<(index: number) => void>,
		required: true,
	},
	cardsPerScroll: {
		type: Number,
		required: true,
	},
	unlockKeys: {
		type: Function as PropType<() => void>,
		required: true,
	},
	index: {
		type: Number,
		required: true,
	},
	setHasMoreCardsToRight: {
		type: Function as PropType<(hasMore: boolean) => void>,
		required: true,
	},
});

const carouselDiv = ref<HTMLDivElement>();
function focusCard() {
	const cards = Array.from(
		carouselDiv.value?.querySelectorAll<HTMLAnchorElement>('a') ?? [],
	);
	const visibleCards = cards.filter((card: HTMLAnchorElement) =>
		card.isVisible(),
	);
	const card = visibleCards.at(props.scrollIndex);

	if (card) {
		card?.focus();
	}
	else if (visibleCards.length > 0) {
		visibleCards.at(-1)?.focus();
	}
	else if (cards.at(props.scrollIndex)?.href) {
		cards.at(props.scrollIndex)?.focus();
		props.setHasMoreCardsToRight(true);
	}
	else {
		cards.at(-1)?.focus();
		props.setHasMoreCardsToRight(true);
	}
}

function handleKeysLocked() {
	setTimeout(() => {
		props.unlockKeys();
	}, 200);
}

const visible = ref(false);
onMounted(() => {
	setTimeout(() => {
		visible.value = true;
	}, 50 * props.index);
});
</script>

<template>
	<div v-if="visible" class="flex flex-col gap-1 w-full">
		<h3
			v-if="carousel.props.title ?? carousel.title"
			class="text-lg font-bold text-auto-12 text-slate-light-1 ml-2"
		>
			{{ carousel.props.title ?? carousel.title }}
		</h3>

		<div
			ref="carouselDiv"
			tabindex="1"
			class="flex flex-nowrap w-full p-1 snap-x snap-mandatory overflow-x-auto pointer-events-none scroll-mr-20"
			:data-carousel="carousel.props.title ?? carousel.title"
			@focus="focusCard"
		>
			<template
				v-for="(item, index) in carousel.props?.items as any ?? []"
				:key="item"
			>
				<TvCard
					tabindex="0"
					:item="item"
					:index="index"
					:scroll-to-center="scrollToCenter"
					:style="`flex-basis: calc(100% / ${cardsPerScroll} - 0.70rem)`"
					@focus="handleKeysLocked()"
				/>
			</template>
		</div>
	</div>
</template>
