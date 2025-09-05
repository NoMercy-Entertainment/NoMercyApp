<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { IonContent, IonPage, onIonViewDidEnter } from '@ionic/vue';

// import type {HomeDataItem} from '@/types/api/music';
// import type {Component} from '@/lib/routerHelper';

import useServerClient from '@/lib/clients/useServerClient';
import type {
	ContinueWatching,
	HomeItem,
	HomeResponse,
} from '@/types/api/base/home';
import useInfiniteServerClient from '@/lib/clients/useInfiniteServerClient';
import TvCarousel2 from '@/views/Base/Home/components/TvCarousel2.vue';
import TvHeader from '@/views/Base/Home/components/TvHeader.vue';

const {
	data: home,
	fetchNextPage,
	hasNextPage,
} = useInfiniteServerClient<{ data: HomeResponse[] }>({
	path: '/',
	queryKey: ['home'],
});

watch(home, () => {
	if (hasNextPage) {
		fetchNextPage();
	}
});

const { data: continueWatching } = useServerClient<ContinueWatching[]>({
	path: 'userdata/continue',
	queryKey: ['continue'],
	refetchInterval: 1000 * 60 * 5,
});

const selected = ref<ContinueWatching | HomeItem | null>();
watch(continueWatching, (value) => {
	if (!value)
		return;
	selected.value = value?.filter(item => item.id)?.at(0);
});

onMounted(() => {
	selected.value = continueWatching.value?.filter(item => item.id)?.at(0);

	setTimeout(() => {
		const target = document.querySelector(
			`[data-card="${selected.value?.id}"]`,
		) as HTMLAnchorElement;
		if (target) {
			target.focus();
		}
	}, 1000);
});

onIonViewDidEnter(() => {
	selected.value = continueWatching.value?.filter(item => item.id)?.at(0);

	setTimeout(() => {
		const target = document.querySelector(
			`[data-card="${selected.value?.id}"]`,
		) as HTMLAnchorElement;
		if (target) {
			target.focus();
		}
	}, 1000);
});

const scrollContainer = ref<HTMLDivElement>();
const locked = ref(false);
const timeout = ref<NodeJS.Timeout>();
const lastFocused = ref<HTMLAnchorElement>();

function handleFocus(event: FocusEvent, item?: ContinueWatching | HomeItem) {
	const target = event.target as HTMLAnchorElement;

	if (target?.nodeName === 'DIV') {
		(lastFocused.value ?? target.querySelector('a'))?.focus();
		return;
	}

	if (item) {
		selected.value = item;
		lastFocused.value = target;
	}
}

function handleDown(event: KeyboardEvent) {
	if (locked.value) {
		event.preventDefault();
		return;
	}

	clearTimeout(timeout.value);
	locked.value = true;

	const target = event.target as HTMLDivElement;
	const targetIndex = target.getAttribute('data-index');
	const closest = target.closest('[data-row]');

	const up = closest?.previousElementSibling as HTMLDivElement;
	const upButton = up?.querySelector(
		`a[data-index="${targetIndex}"]`,
	) as HTMLAnchorElement;

	const down = closest?.nextElementSibling as HTMLDivElement;
	const downButton = down?.querySelector(
		`a[data-index="${targetIndex}"]`,
	) as HTMLAnchorElement;

	const leftButton = target.previousElementSibling as HTMLDivElement;
	const rightButton = target.nextElementSibling as HTMLDivElement;

	if (upButton && event.key === 'ArrowUp') {
		event.preventDefault();
		upButton.focus();
	}
	else if (downButton && event.key === 'ArrowDown') {
		event.preventDefault();
		downButton.focus();
	}
	else if (leftButton && event.key === 'ArrowLeft') {
		event.preventDefault();
		leftButton.focus();
	}
	else if (rightButton && event.key === 'ArrowRight') {
		event.preventDefault();
		rightButton.focus();
	}
	else if (up && event.key === 'ArrowUp') {
		const upButton = Array.from(
			up?.querySelectorAll<HTMLAnchorElement>('a'),
		)?.at(-1);
		if (upButton) {
			upButton.focus();
		}
	}
	else if (down && event.key === 'ArrowDown') {
		const downButton = Array.from(
			down?.querySelectorAll<HTMLAnchorElement>('a'),
		)?.at(-1);
		if (downButton) {
			downButton.focus();
		}
	}
}

function handleUp() {
	timeout.value = setTimeout(() => {
		locked.value = false;
	}, 150);
}
</script>

<template>
	<IonPage>
		<IonContent :fullscreen="true">
			<div class="w-screen h-screen relative overflow-hidden bg-[#131314]">
				<TvHeader v-if="selected" :selected="selected" />

				<div
					ref="scrollContainer"
					tabindex="0"
					class="flex flex-col justify-start items-start w-available -mx-3 px-3 absolute left-14 right-14 top-[264px] h-available overflow-auto scroll-smooth gap-4 flex-1 pb-16"
					@focus="handleFocus($event)"
				>
					<TvCarousel2
						title="Continue watching"
						:data="continueWatching?.filter((i) => !!i.id) ?? []"
						:handle-focus="handleFocus"
						:handle-down="handleDown"
						:handle-up="handleUp"
					/>

					<template v-if="home?.pages">
						<template v-for="(group, index) in home.pages" :key="index">
							<template v-if="group">
								<template
									v-for="(data, index2) in group?.data ?? []"
									:key="index2"
								>
									<TvCarousel2
										:title="data.title"
										:data="data.items"
										:handle-focus="handleFocus"
										:handle-down="handleDown"
										:handle-up="handleUp"
										suffix="/watch"
									/>
								</template>
							</template>
						</template>
					</template>
				</div>
			</div>

			<!--      <template v-for="(item, index) in continueWatching?.filter(item => item.id)" :key="item.id"> -->
			<!--        <img :src="`https://image.tmdb.org/t/p/w1280${item.backdrop}`" width="0" height="0" loading="eager" alt="" -->
			<!--             class="absolute"> -->
			<!--      </template> -->

			<!--      <template v-if="home?.pages"> -->
			<!--        <template v-for="(group, index) in home.pages" :key="index"> -->
			<!--          <template v-if="group"> -->
			<!--            <template v-for="(data, index2) in group?.data ?? []" :key="index2"> -->
			<!--              <template v-for="(item, index) in data.items.slice(0,7)" :key="item.id"> -->
			<!--                <img :src="`https://image.tmdb.org/t/p/w1280${item.backdrop}`" width="0" height="0" loading="eager" -->
			<!--                     alt="" class="absolute"> -->
			<!--              </template> -->
			<!--            </template> -->
			<!--          </template> -->
			<!--        </template> -->
			<!--      </template> -->
			<!--      <div class="flex flex-col flex-1 justify-center items-center mt-16"> -->
			<!--      <template v-if="data"> -->
			<!--        <component -->
			<!--            v-for="(render, index) in data ?? []" -->
			<!--            :index="index" -->
			<!--            :key="render.id" -->
			<!--            :is="render.component" -->
			<!--            v-bind="render.props" -->
			<!--        /> -->
			<!--      </template> -->
			<!--      </div> -->
		</IonContent>
	</IonPage>
</template>

<!-- <script setup lang="ts"> -->
<!-- import {computed, onMounted, onUnmounted, ref, watch} from 'vue'; -->
<!-- import {IonContent, IonPage, onIonViewDidEnter} from '@ionic.scss/vue'; -->

<!-- import {getMutating, getMutation, getQuery} from '@/lib/routerHelper'; -->
<!-- import router from '@/router'; -->

<!-- import type {HomeItem} from '@/types/api/base/home'; -->

<!-- import TvCarousel from '@/views/Base/Home/components/TvCarousel.vue'; -->
<!-- import TvHomeCard from '@/views/Base/Home/components/TvHomeCard.vue'; -->

<!-- const routeName = router.currentRoute.value.name; -->

<!-- const isMutating = getMutating(); -->

<!-- const {data: homeData} = getQuery<HomeItem>(); -->

<!-- const {data: mutatedData, mutate} = getMutation({homeData: homeData}); -->

<!-- router.beforeEach(async (to) => { -->
<!--  if (!homeData.value) return; -->

<!--  if (to.name !== routeName) return; -->

<!--  const mutations = homeData.value?.filter?.(item => item?.update?.when === 'pageLoad') ?? []; -->
<!--  mutate(mutations); -->
<!-- }); -->

<!-- watch(homeData, (value) => { -->
<!--  if (!value) return; -->
<!--  jumpTo('#watch_now'); -->
<!-- }); -->

<!-- const top = ref<HTMLElement>(); -->
<!-- const bottom = ref<HTMLElement>(); -->
<!-- const cardsPerScroll = ref(7); -->

<!-- const jumpTo = (id: string) => { -->
<!--  const element = document.querySelector<HTMLElement>(id); -->
<!--  if (element) { -->
<!--    element.focus(); -->

<!--    content.value?.$el?.scrollToTop(0); -->

<!--    top.value?.classList.remove('opacity-[0.001]'); -->
<!--    unlockKeys(); -->
<!--  } -->
<!-- }; -->

<!-- const content = ref<VueDivElement>(); -->
<!-- const scrollToBottom = () => { -->
<!--  content.value?.$el?.scrollToBottom(0); -->
<!--  content.value?.$el?.scrollIntoView({ -->
<!--    behavior: 'smooth', -->
<!--    block: 'center', -->
<!--    inline: 'nearest', -->
<!--  }); -->

<!--  top.value?.classList.add('opacity-[0.001]'); -->

<!--  bottom.value?.querySelector<HTMLAnchorElement>('[data-card]')?.focus(); -->
<!-- }; -->

<!-- onIonViewDidEnter(() => { -->
<!--  setTimeout(() => { -->
<!--    top.value?.focus(); -->
<!--  }, 1000); -->
<!-- }); -->

<!-- const scrollIndex = ref(0); -->
<!-- const setScrollIndex = (index: number) => { -->
<!--  scrollIndex.value = index; -->
<!-- }; -->
<!-- const hasMoreCardsToRight = ref(false); -->
<!-- const setHasMoreCardsToRight = (value: boolean) => { -->
<!--  hasMoreCardsToRight.value = value; -->
<!-- }; -->

<!-- const scrollToCenter = (e: FocusEvent) => { -->

<!--  document.activeElement?.scrollIntoView({ -->
<!--    behavior: 'smooth', -->
<!--    block: 'center', -->
<!--    inline: scrollIndex.value === 2 || hasMoreCardsToRight.value ? 'center' : undefined, -->
<!--  }); -->

<!--  setTimeout(() => { -->
<!--    const cardIndex = (e.target as HTMLAnchorElement)?.getAttribute('index')?.toInt() ?? 0; -->

<!--    const carouselDiv = (e.target as HTMLAnchorElement).closest('[data-carousel]') as HTMLElement; -->
<!--    carouselDiv.dataset.focussedIndex = cardIndex.toString(); -->

<!--    const cards = carouselDiv.querySelectorAllArray<HTMLAnchorElement>('a'); -->
<!--    const visibleCards = cards.filter((card: HTMLAnchorElement) => card.isVisible()); -->

<!--    const currentIndex = visibleCards.indexOf(e.target as HTMLAnchorElement); -->

<!--    // allow horizontal scroll when the card index is below 3 -->
<!--    if (scrollIndex.value !== currentIndex) { -->
<!--      hasMoreCardsToRight.value = true; -->
<!--    } -->

<!--    setScrollIndex(currentIndex); -->

<!--    // prevent horizontal scroll when the last or second last card is focused -->
<!--    if (cardIndex > carouselDiv.childNodes.length - cardsPerScroll.value) { -->
<!--      hasMoreCardsToRight.value = false; -->
<!--    } -->
<!--  }, 400); -->
<!--  // -->
<!--  // watch(scrollIndex, () => { -->
<!--  //   const cardIndex = (e.target as HTMLAnchorElement)?.getAttribute('index')?.toInt() ?? 0; -->
<!--  //   const carouselDiv = (e.target as HTMLAnchorElement).closest('[data-carousel]') as HTMLElement; -->
<!--  // -->
<!--  //   // prevent horizontal scroll when the last or second last card is focused -->
<!--  //   if (cardIndex > carouselDiv.childNodes.length - 5) { -->
<!--  //     hasMoreCardsToRight.value = false; -->
<!--  //   } -->
<!--  // }); -->

<!-- }; -->

<!-- const timeout = ref<NodeJS.Timeout>(); -->

<!-- const keysLocked = ref(false); -->
<!-- const unlockKeys = () => { -->
<!--  clearTimeout(timeout.value); -->
<!--  keysLocked.value = false; -->
<!-- }; -->

<!-- const handleKeyDown = (e: KeyboardEvent) => { -->
<!--  if(!(e.target as HTMLElement).dataset.card) return; -->
<!--  if (!keysLocked.value) { -->
<!--    keysLocked.value = true; -->
<!--    return; -->
<!--  } else { -->
<!--    e.preventDefault(); -->
<!--  } -->

<!--  timeout.value = setTimeout(() => { -->
<!--    unlockKeys(); -->
<!--  }, 200); -->
<!-- }; -->

<!-- onMounted(() => { -->
<!--  document.addEventListener('keydown', handleKeyDown); -->
<!-- }); -->

<!-- onUnmounted(() => { -->
<!--  document.removeEventListener('keydown', handleKeyDown); -->
<!-- }); -->

<!-- const homeCardData = computed(() => (mutatedData.value ?? homeData.value) -->
<!--    ?.filter( d => d.component === 'NMHomeCard') ?? []) -->

<!-- const carouselsData = computed(() => (mutatedData.value ?? homeData.value) -->
<!--    ?.filter( d => d.component === 'NMCarousel') ?? []) -->

<!-- </script> -->

<!-- <template> -->
<!--  <ion-page> -->
<!--    <ion-content :fullscreen="true" ref="content"> -->

<!--      <div v-if="!isMutating" class="flex flex-col gap-8 pt-24 pb-4" id="container"> -->
<!--        <div -->
<!--            tabindex="0" ref="top" -->
<!--            @focus="jumpTo('#watch_now')" -->
<!--            class="flex items-center mx-12 w-available min-h-[60vh] relative overflow-hidden rounded-2xl border-2 border-slate-light-9 transition-opacity duration-200" -->
<!--        > -->
<!--          <template v-for="(carousel) in homeCardData" -->
<!--                    :key="carousel.props.title"> -->
<!--            <TvHomeCard  :carousel="carousel" :items="carousel.props.items" /> -->
<!--          </template> -->
<!--        </div> -->

<!--        <div v-if="carouselsData.length > 0" -->
<!--            tabindex="0" ref="bottom" -->
<!--            @focus="scrollToBottom" -->
<!--            class="mx-11 flex flex-col justify-start items-start w-available gap-5 h-[calc(100vh-6rem)] overflow-auto" -->
<!--        > -->
<!--          <template v-if="!isMutating"> -->
<!--            <template v-for="(carousel, index) in carouselsData" -->
<!--                      :key="carousel.props.title"> -->
<!--              <TvCarousel -->
<!--                  v-if="carousel.props.items.length > 0" -->
<!--                  :carousel="carousel" -->
<!--                  :index="index" -->
<!--                  :scrollToCenter="scrollToCenter" -->
<!--                  :scrollIndex="scrollIndex" -->
<!--                  :setScrollIndex="setScrollIndex" -->
<!--                  :cardsPerScroll="cardsPerScroll" -->
<!--                  :unlockKeys="unlockKeys" -->
<!--                  :setHasMoreCardsToRight="setHasMoreCardsToRight" -->
<!--              /> -->
<!--            </template> -->
<!--          </template> -->
<!--        </div> -->
<!--      </div> -->
<!--    </ion-content> -->
<!--  </ion-page> -->
<!-- </template> -->

<!-- <style scoped> -->
<!-- ion-content::part(background) { -->
<!--  @apply bg-slate-light-3 dark:bg-slate-dark-1; -->
<!-- } -->
<!-- </style> -->
