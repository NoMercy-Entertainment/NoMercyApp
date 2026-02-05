import type { Component } from 'vue';
import { defineAsyncComponent } from 'vue';

export const nmComponentMap: Record<string, Component> = {
	NMCarousel: defineAsyncComponent(() => import('@/components/NMCarousel.vue')),
	NMCarousel2: defineAsyncComponent(() => import('@/components/NMCarousel.vue')),
	NMCard: defineAsyncComponent(() => import('@/components/NMCard.vue')),
	NMContainer: defineAsyncComponent(() => import('@/components/NMContainer.vue')),
	NMGenreCard: defineAsyncComponent(() => import('@/components/NMGenreCard.vue')),
	NMGrid: defineAsyncComponent(() => import('@/components/NMGrid.vue')),
	NMHomeCard: defineAsyncComponent(() => import('@/components/NMHomeCard.vue')),
	NMList: defineAsyncComponent(() => import('@/components/NMList.vue')),
	NMSeasonCard: defineAsyncComponent(() => import('@/components/NMSeasonCard.vue')),
	NMSeasonTitle: defineAsyncComponent(() => import('@/components/NMSeasonTitle.vue')),
	NMMusicCard: defineAsyncComponent(() => import('@/components/NMMusicCard.vue')),
	NMMusicHomeCard: defineAsyncComponent(() => import('@/components/NMMusicHomeCard.vue')),
	NMServerComponent: defineAsyncComponent(() => import('@/components/NMServerComponent.vue')),
	NMTopResultCard: defineAsyncComponent(() => import('@/components/NMTopResultCard.vue')),
	NMTrackRow: defineAsyncComponent(() => import('@/components/NMTrackRow.vue')),
};
