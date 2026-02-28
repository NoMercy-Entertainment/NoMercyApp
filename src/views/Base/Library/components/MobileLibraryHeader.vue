<script lang="ts" setup>
import { nextTick, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import router from '@/router';
import libraries from '@/store/libraries';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';

const shownRoutes = ['/libraries/', '/genre'];
const endsWithRoutes = ['/collection', '/specials', '/person'];
const route = useRoute();

const scrollContainer = ref<HTMLDivElement>();

const show = ref(
	shownRoutes.some(r => route.fullPath.startsWith(r))
	|| endsWithRoutes.some(r => route.fullPath.endsWith(r)),
);

function scrollActiveToCenter() {
	nextTick(() => {
		const container = scrollContainer.value;
		if (!container) return;
		const active = container.querySelector<HTMLElement>('.bg-focus\\/65');
		if (!active) return;
		const containerCenter = container.clientWidth / 2;
		const buttonCenter = active.offsetLeft + active.offsetWidth / 2;
		container.scrollTo({ left: buttonCenter - containerCenter, behavior: 'smooth' });
	});
}

router.afterEach((to) => {
	show.value
		= shownRoutes.some(route => to.fullPath.startsWith(route))
			|| endsWithRoutes.some(route => to.fullPath.endsWith(route));
	scrollActiveToCenter();
});

onMounted(() => {
	scrollActiveToCenter();
});

function isActiveSegment(path: string) {
	return route.fullPath.startsWith(path);
}

function libraryIcon(type: string) {
	if (type === 'movie') return 'film';
	if (type === 'tv' || type === 'anime') return 'tv';
	return 'folder';
}
</script>

<template>
	<div v-if="show" class="bg-surface-1 shrink-0 z-30">
		<div ref="scrollContainer" class="flex items-center gap-2 px-4 py-4 overflow-x-auto scrollbar-hide">
			<template
				v-for="library in libraries?.filter((l) => l.type !== 'music') ?? []"
				:key="library.id"
			>
				<button
					:class="isActiveSegment(`/libraries/${library.id}`)
						? 'bg-focus/65 font-bold'
						: 'bg-surface-3 dark:bg-surface-4 font-medium'"
					class="flex items-center gap-2 px-2 py-1 rounded-lg text-sm text-surface-12 whitespace-nowrap transition-colors duration-150 shrink-0"
					@click="router.push(`/libraries/${library.id}`)"
				>
					<MoooomIcon class-name="w-[18px] h-[18px]" :icon="libraryIcon(library.type)" />
					{{ library.title }}
				</button>
			</template>

			<button
				v-if="libraries?.some?.((l) => l.type === 'movie')"
				:class="isActiveSegment('/collection')
					? 'bg-focus/65 font-bold'
					: 'bg-surface-3 dark:bg-surface-4 font-medium'"
				class="flex items-center gap-2 px-2 py-1 rounded-lg text-sm text-surface-12 whitespace-nowrap transition-colors duration-150 shrink-0"
				@click="router.push('/collection')"
			>
				<MoooomIcon class-name="w-[18px] h-[18px]" icon="collection1" />
				{{ $t("Collections") }}
			</button>

			<button
				:class="isActiveSegment('/specials')
					? 'bg-focus/65 font-bold'
					: 'bg-surface-3 dark:bg-surface-4 font-medium'"
				class="flex items-center gap-2 px-2 py-1 rounded-lg text-sm text-surface-12 whitespace-nowrap transition-colors duration-150 shrink-0"
				@click="router.push('/specials')"
			>
				<MoooomIcon class-name="w-[18px] h-[18px]" icon="sparkles" />
				{{ $t("Specials") }}
			</button>

			<button
				:class="isActiveSegment('/genre')
					? 'bg-focus/65 font-bold'
					: 'bg-surface-3 dark:bg-surface-4 font-medium'"
				class="flex items-center gap-2 px-2 py-1 rounded-lg text-sm text-surface-12 whitespace-nowrap transition-colors duration-150 shrink-0"
				@click="router.push('/genre')"
			>
				<MoooomIcon class-name="w-[18px] h-[18px]" icon="witchHat" />
				{{ $t("Genres") }}
			</button>

			<button
				:class="isActiveSegment('/person')
					? 'bg-focus/65 font-bold'
					: 'bg-surface-3 dark:bg-surface-4 font-medium'"
				class="flex items-center gap-2 px-2 py-1 rounded-lg text-sm text-surface-12 whitespace-nowrap transition-colors duration-150 shrink-0"
				@click="router.push('/person')"
			>
				<MoooomIcon class-name="w-[18px] h-[18px]" icon="user" />
				{{ $t("People") }}
			</button>
		</div>
	</div>
</template>

<style scoped>
.scrollbar-hide {
	-ms-overflow-style: none;
	scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
	display: none;
}
</style>
