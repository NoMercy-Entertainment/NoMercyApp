<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue';
import { RouterLink, useRoute } from 'vue-router';

import { isMobile, isNative } from '@/config/global';
import { keyHandler, scrollToDiv } from '@/lib/scrollHandlers';
import { alphaNumericRange } from '@/lib/stringArray';
import router from '@/router';
import indexer, { setIndexerOpen } from '@/store/indexer';

const openPaths = ['Libraries', 'Library', 'Collections', 'Albums', 'Artists'];

const queryPaths = [
	new RegExp('music/albums'),
	new RegExp('music/artists'),
	new RegExp('libraries/[a-zA-Z0-9]+/letter/[a-zA-Z0-9_]'),
];

function indexerState(route: string) {
	return openPaths.some(path => route.startsWith(path));
}

function isQueryPath(route: string) {
	return queryPaths.some(path => route.match(path));
}

const route = useRoute();

function updateScrollableTargets() {
	setTimeout(() => {
		document
			.querySelector(
				isMobile.value
					? 'ion-tabs ion-router-outlet  div.ion-page:not(.ion-page-hidden) [indexer]'
					: '[indexer]',
			)
			?.querySelectorAll<HTMLDivElement>('[data-indexer]')
			.forEach((el) => {
				let target;
				if (el.dataset.indexer === '#') {
					target = document.querySelector?.(
						'ion-tabs ion-router-outlet div.ion-page:not(.ion-page-hidden) [data-scroll]',
					);
				}
				else {
					target = document.querySelector?.(
						`ion-tabs ion-router-outlet div.ion-page:not(.ion-page-hidden) [data-scroll='scroll_${el.dataset.indexer}']`,
					);
				}

				if (!!target || isQueryPath(router.currentRoute.value.path)) {
					el.classList.remove('opacity-20', '!cursor-not-allowed');
				}
				else {
					el.classList.add('opacity-20', '!cursor-not-allowed');
				}
			});
	}, 500);
}

function disableScrollableTargets() {
	document
		.querySelector(
			isMobile.value
				? 'ion-tabs ion-router-outlet  div.ion-page:not(.ion-page-hidden) [indexer]'
				: '[indexer]',
		)
		?.querySelectorAll<HTMLDivElement>('[data-indexer]')
		.forEach((el) => {
			el.classList.add('opacity-20', '!cursor-not-allowed');
		});
}

function triggerIndexer(route: string) {
	setIndexerOpen(indexerState(route));
	updateScrollableTargets();
}

router.afterEach((to) => {
	setTimeout(() => {
		triggerIndexer((to.name as string) ?? to.path);
	}, 150);
});

router.beforeEach(() => {
	if (!isQueryPath(router.currentRoute.value.path)) {
		disableScrollableTargets();
	}
});

onMounted(() => {
	setTimeout(() => {
		triggerIndexer(
			(router.currentRoute.value.name as string)
			?? (router.currentRoute.value.path as string),
		);
	}, 150);
	document.addEventListener('indexer', updateScrollableTargets);
	document.addEventListener('keydown', keyHandler);
});

onUnmounted(() => {
	document.removeEventListener('indexer', updateScrollableTargets);
	document.removeEventListener('keydown', keyHandler);
});
</script>

<template>
	<div
		:class="{
			'w-8': indexer,
			'w-0': !indexer,
			'sm:ml-2': !isNative && indexer,
			'bottom-0': isNative,
		}"
		class="pointer-events-none z-0 h-available sm:h-available flex flex-col items-center justify-between self-stretch overflow-clip transition-width duration-200  sm:-translate-x-3 pt-2"
		indexer
	>
		<template v-for="letter in alphaNumericRange('#', 'Z')" :key="letter">
			<template v-if="isQueryPath(route.path)">
				<RouterLink
					:data-indexer="letter"
					:to="`${letter.replace('#', '_')}`"
					class="pointer-events-auto relative flex p-1.5 size-6 sm:size-8 aspect-square rounded-lg overflow-clip cursor-pointer flex-col items-center justify-center hover:bg-surface-5"
					tabindex="-1"
				>
					<p
						class="flex-shrink-0 flex-grow-0 text-center text-xs sm:text-base font-semibold leading-none"
					>
						{{ letter }}
					</p>
				</RouterLink>
			</template>
			<button
				v-else
				:data-indexer="letter"
				class="pointer-events-auto relative flex p-1.5 size-6 sm:size-8 aspect-square rounded-lg overflow-clip cursor-pointer flex-col items-center justify-center hover:bg-surface-alpha-5"
				tabindex="-1"
				@click="scrollToDiv(letter)"
			>
				<p
					class="flex-shrink-0 flex-grow-0 text-center text-xs sm:text-base font-semibold leading-none"
				>
					{{ letter }}
				</p>
			</button>
		</template>
	</div>
</template>

<style scoped>
html.plt-mobileweb:has(#miniPlayer) .indexer {
	@apply pb-16;
}
</style>
