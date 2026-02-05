import type { Component } from 'vue';
import { defineAsyncComponent } from 'vue';

import NMCardSkeleton from '@/components/Loading/NMCardSkeleton.vue';

export const nmComponentMap: Record<string, Component> = {
	NMCarousel: defineAsyncComponent(() => import('@/components/NMCarousel.vue')),
	NMCarousel2: defineAsyncComponent(() => import('@/components/NMCarousel.vue')),
	NMCard: defineAsyncComponent({
		loader: () => import('@/components/NMCard.vue'),
		loadingComponent: NMCardSkeleton,
	}),
	NMContainer: defineAsyncComponent(() => import('@/components/NMContainer.vue')),
	NMGenreCard: defineAsyncComponent({
		loader: () => import('@/components/NMGenreCard.vue'),
		loadingComponent: NMCardSkeleton,
	}),
	NMGrid: defineAsyncComponent(() => import('@/components/NMGrid.vue')),
	NMHomeCard: defineAsyncComponent({
		loader: () => import('@/components/NMHomeCard.vue'),
		loadingComponent: NMCardSkeleton,
	}),
	NMList: defineAsyncComponent(() => import('@/components/NMList.vue')),
	NMSeasonCard: defineAsyncComponent({
		loader: () => import('@/components/NMSeasonCard.vue'),
		loadingComponent: NMCardSkeleton,
	}),
	NMSeasonTitle: defineAsyncComponent(() => import('@/components/NMSeasonTitle.vue')),
	NMMusicCard: defineAsyncComponent({
		loader: () => import('@/components/NMMusicCard.vue'),
		loadingComponent: NMCardSkeleton,
	}),
	NMMusicHomeCard: defineAsyncComponent({
		loader: () => import('@/components/NMMusicHomeCard.vue'),
		loadingComponent: NMCardSkeleton,
	}),
	NMServerComponent: defineAsyncComponent(() => import('@/components/NMServerComponent.vue')),
	NMTopResultCard: defineAsyncComponent({
		loader: () => import('@/components/NMTopResultCard.vue'),
		loadingComponent: NMCardSkeleton,
	}),
	NMTrackRow: defineAsyncComponent(() => import('@/components/NMTrackRow.vue')),
};
