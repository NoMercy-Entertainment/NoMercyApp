<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { IonContent, IonPage, onIonViewDidEnter } from '@ionic/vue';

import type { HomeItem } from '@/types/api/base/home';

import { getMutating, getMutation, getQuery } from '@/lib/routerHelper';
import router from '@/router';

import TvCarousel from '@/views/Base/Home/components/TvCarousel.vue';
import TvHomeCard from '@/views/Base/Home/components/TvHomeCard.vue';

const routeName = router.currentRoute.value.name;

const isMutating = getMutating();

const { data: homeData } = getQuery<HomeItem>({
	path: '/libraries/tv',
	queryKey: ['libraries', 'tv'],
});

const { data: mutatedData, mutate } = getMutation<HomeItem>({
	homeData,
	queryKey: ['libraries', 'tv'],
});

router.beforeEach(async (to) => {
	if (!homeData.value)
		return;

	if (to.name !== routeName)
		return;

	const mutations
    = homeData.value?.filter?.(item => item?.update?.when === 'pageLoad') ?? [];
	mutate(mutations);
});

watch(homeData, (value) => {
	if (!value)
		return;
	jumpTo('#watch_now');
});

const top = ref<HTMLElement>();
const bottom = ref<HTMLElement>();
const cardsPerScroll = ref(7);

const content = ref<VueDivElement>();
function jumpTo(id: string) {
	const element = document.querySelector<HTMLElement>(id);
	if (element) {
		element.focus();

		content.value?.$el?.scrollToTop(0);

		top.value?.classList.remove('opacity-[0.001]');
		unlockKeys();
	}
}

function scrollToBottom() {
	content.value?.$el?.scrollToBottom(0);
	content.value?.$el?.scrollIntoView({
		behavior: 'smooth',
		block: 'center',
		inline: 'nearest',
	});

	top.value?.classList.add('opacity-[0.001]');

	bottom.value?.querySelector<HTMLAnchorElement>('[data-card]')?.focus();
}

onIonViewDidEnter(() => {
	setTimeout(() => {
		top.value?.focus();
	}, 1000);
});

const scrollIndex = ref(0);
function setScrollIndex(index: number) {
	scrollIndex.value = index;
}
const hasMoreCardsToRight = ref(false);
function setHasMoreCardsToRight(value: boolean) {
	hasMoreCardsToRight.value = value;
}

function scrollToCenter(e: FocusEvent) {
	document.activeElement?.scrollIntoView({
		behavior: 'smooth',
		block: 'center',
		inline: scrollIndex.value === 2 || hasMoreCardsToRight.value
			? 'center'
			: undefined,
	});

	setTimeout(() => {
		const cardIndex
      = (e.target as HTMLAnchorElement)?.getAttribute('index')?.toInt() ?? 0;

		const carouselDiv = (e.target as HTMLAnchorElement).closest(
			'[data-carousel]',
		) as HTMLElement;
		carouselDiv.dataset.focussedIndex = cardIndex.toString();

		const cards = carouselDiv.querySelectorAllArray<HTMLAnchorElement>('a');
		const visibleCards = cards.filter((card: HTMLAnchorElement) =>
			card.isVisible(),
		);

		const currentIndex = visibleCards.indexOf(e.target as HTMLAnchorElement);

		// allow horizontal scroll when the card index is below 3
		if (scrollIndex.value !== currentIndex) {
			hasMoreCardsToRight.value = true;
		}

		setScrollIndex(currentIndex);

		// prevent horizontal scroll when the last or second last card is focused
		if (cardIndex > carouselDiv.childNodes.length - cardsPerScroll.value) {
			hasMoreCardsToRight.value = false;
		}
	}, 400);
	//
	// watch(scrollIndex, () => {
	//   const cardIndex = (e.target as HTMLAnchorElement)?.getAttribute('index')?.toInt() ?? 0;
	//   const carouselDiv = (e.target as HTMLAnchorElement).closest('[data-carousel]') as HTMLElement;
	//
	//   // prevent horizontal scroll when the last or second last card is focused
	//   if (cardIndex > carouselDiv.childNodes.length - 5) {
	//     hasMoreCardsToRight.value = false;
	//   }
	// });
}

const timeout = ref<NodeJS.Timeout>();

const keysLocked = ref(false);
function unlockKeys() {
	clearTimeout(timeout.value);
	keysLocked.value = false;
}

function handleKeyDown(e: KeyboardEvent) {
	if (!(e.target as HTMLElement).dataset.card)
		return;
	if (!keysLocked.value) {
		keysLocked.value = true;
		return;
	}
	else {
		e.preventDefault();
	}

	timeout.value = setTimeout(() => {
		unlockKeys();
	}, 200);
}

onMounted(() => {
	document.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
	document.removeEventListener('keydown', handleKeyDown);
});

const homeCardData = computed(
	() =>
		(mutatedData.value ?? homeData.value)?.filter(
			d => d.component === 'NMHomeCard',
		) ?? [],
);

const carouselsData = computed(
	() =>
		(mutatedData.value ?? homeData.value)?.filter(
			d => d.component === 'NMCarousel',
		) ?? [],
);
</script>

<template>
	<IonPage>
		<IonContent ref="content" :fullscreen="true">
			<div
				v-if="!isMutating"
				id="container"
				class="flex flex-col gap-8 pt-24 pb-4"
			>
				<div
					ref="top"
					tabindex="0"
					class="flex items-center mx-12 w-available min-h-[60vh] relative overflow-hidden rounded-2xl border-2 border-slate-light-9 transition-opacity duration-200"
					@focus="jumpTo('#watch_now')"
				>
					<template
						v-for="carousel in homeCardData"
						:key="carousel.props.title"
					>
						<TvHomeCard :carousel="carousel" :items="carousel.props.items" />
					</template>
				</div>

				<div
					v-if="carouselsData.length > 0"
					ref="bottom"
					tabindex="0"
					class="mx-11 flex flex-col justify-start items-start w-available gap-5 h-[calc(100vh-6rem)] overflow-auto"
					@focus="scrollToBottom"
				>
					<template v-if="!isMutating">
						<template
							v-for="(carousel, index) in carouselsData"
							:key="carousel.props.title"
						>
							<TvCarousel
								v-if="carousel.props.items.length > 0"
								:carousel="carousel"
								:index="index"
								:scroll-to-center="scrollToCenter"
								:scroll-index="scrollIndex"
								:set-scroll-index="setScrollIndex"
								:cards-per-scroll="cardsPerScroll"
								:unlock-keys="unlockKeys"
								:set-has-more-cards-to-right="setHasMoreCardsToRight"
							/>
						</template>
					</template>
				</div>
			</div>
		</IonContent>
	</IonPage>
</template>

<style scoped>
ion-content::part(background) {
	@apply bg-slate-light-3 dark:bg-slate-dark-1;
}
</style>
