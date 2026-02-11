<script lang="ts" setup>
import { computed } from 'vue';

import { showBackdrops } from '@/store/preferences';

import AppLogo from '@/components/Images/icons/AppLogo.vue';

const colors = computed(() => {
	// if (useGradientPercentageColors.value) {
	// 	return [50, 90, 20, 40, 20, 30, 10, 100, 90, 70, 50, 70, 30, 80, 100, 40, 10, 60, 80, 60]
	// 		.map(i => (getColorFromPercent(i, percentColors)));
	// }

	return [
		'#F79009',
		'#f44',
		'#F79009',
		'#12B76A',
		'#94f',
		'#F79009',
		'#94f',
		'#f44',
		'#f44',
		'#F79009',
		'#12B76A',
		'#f44',
		'#f44',
		'#94f',
		'#12B76A',
		'#F79009',
		'#12B76A',
		'#94f',
		'#12B76A',
		'#94f',
	];
});

// Sidebar menu items
const menuItems = [
	{ active: true, bgClass: 'bg-theme-7', widthClass: 'w-14' },
	{ active: false, bgClass: 'bg-surface-12/8', widthClass: 'w-4/6' },
	{ active: false, bgClass: 'bg-surface-12/5', widthClass: 'w-2/5' },
	{ active: false, bgClass: 'bg-surface-2/10', widthClass: 'w-5/6' },
];
</script>

<template>
	<section
		class="mb-4 hidden sm:flex tv:!hidden xl:col-start-1 xl:col-span-2 xl:row-start-2 xl:row-span-2 2xl:col-start-1 2xl:col-span-2 2xl:row-start-2 2xl:row-span-2"
	>
		<div class="relative flex select-none flex-col gap-3 w-available">
			<h3 class="font-bold">
				{{ $t("Theme preview") }}
			</h3>

			<article
				class="relative grid grid-cols-[96px_1fr] gap-2 h-auto overflow-hidden rounded-2xl border-2 aspect-[16/10] bg-surface-1 dark:bg-surface-2 border-surface-12/6 px-2"
			>
				<!-- Header -->
				<header class="col-span-2 mt-1 flex h-8 items-center justify-start gap-4 before:content-[''] before:absolute before:right-3 before:top-1.5 before:w-auto before:h-[7%] before:aspect-square before:rounded-full before:bg-[#51525C] before:z-10">
					<AppLogo class="z-10 mr-4 ml-1 w-20" />
					<div class="w-12 rounded-full h-1.5 bg-surface-12/60" />
					<div class="w-6 rounded-full h-1.5 bg-theme-8" />
					<div class="w-9 rounded-full h-1.5 bg-surface-12/5" />
				</header>

				<!-- Sidebar -->
				<nav class="flex flex-col items-start justify-start gap-4 pr-4 pl-1 mt-4">
					<div
						v-for="(item, index) in menuItems"
						:key="index"
						class="relative flex w-full items-center justify-start gap-2"
					>
						<div
							:class="item.bgClass"
							class="aspect-square h-auto w-3 rounded-full"
						/>
						<div :class="[item.widthClass, item.bgClass]" class="h-1.5 rounded-[8.48px]" />
					</div>
				</nav>

				<!-- Main Content -->
				<main class="relative rounded-lg mb-1.5 mt-2 overflow-hidden">
					<div
						class="w-full h-full px-2 pt-2 gap-2.5 flex flex-col overflow-hidden rounded-xl bg-surface-12/5 bg-cover border-2 border-transparent text-start transition-transform duration-200"
					>
						<!-- Hero Banner -->
						<div class="mx-auto h-24 w-full rounded-sm min-h-[5.5rem] bg-surface-12/7" />

						<!-- Carousel Grid -->
						<div
							:class="showBackdrops ? '-mr-[54.2%] gap-y-2' : '-mr-[23.3%] gap-y-2'"
							class="flex w-auto flex-wrap overflow-hidden transition-transform duration-500"
						>
							<div
								v-for="(item, index) in colors"
								:key="index"
								:class="showBackdrops ? 'w-1/6' : 'w-1/6'"
								:style="`--item-color: ${item}; ${
									showBackdrops
										? (index !== 0 && (index % 6 === 4 || index % 6 === 5) ? '--item-opacity: 0' : '--item-opacity: 1')
										: (index !== 0 && (index % 6 === 5 || index % 6 === 6) ? '--item-opacity: 0' : '--item-opacity: 1')
								}`"
								class="relative h-auto pr-2 transition-transform duration-500 before:content-[''] before:absolute before:left-0 before:top-1.5 before:w-[2.5px] before:h-2.5 before:rounded-tr-[2.5px] before:rounded-br-[2.5px] before:transition-transform before:duration-500"
							>
								<div
									:class="[
										showBackdrops ? 'aspect-backdrop' : 'aspect-poster',
										showBackdrops
											? (index !== 0 && index % 6 === 4 ? 'bg-surface-5/0' : 'bg-surface-12/10')
											: (index !== 0 && index % 6 === 5 ? 'bg-surface-5/0' : 'bg-surface-12/10'),
									]"
									class="flex h-auto w-full overflow-clip transition-transform duration-500 rounded-[3px] bg-surface-12/2"
								/>
							</div>
						</div>
					</div>
				</main>
			</article>
		</div>
	</section>
</template>

<style scoped>
div[style*='--item-color']::before {
	background-color: var(--item-color);
	opacity: var(--item-opacity, 1);
}
</style>
