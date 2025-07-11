<script setup lang="ts">
import type { PropType } from 'vue';
import type { ContinueWatching, HomeItem } from '@/types/api/base/home';

defineProps({
	data: {
		type: Array as PropType<Array<ContinueWatching | HomeItem>>,
		required: true,
	},
	title: {
		type: String,
		required: true,
	},
	handleFocus: {
		type: Function as PropType<
			(event: FocusEvent, item?: ContinueWatching | HomeItem) => void
		>,
		required: true,
	},
	handleDown: {
		type: Function as PropType<(event: KeyboardEvent) => void>,
		required: true,
	},
	handleUp: {
		type: Function as PropType<(event: KeyboardEvent) => void>,
		required: true,
	},
	suffix: {
		type: String,
		required: false,
		default: '',
	},
});
</script>

<template>
	<div
		v-if="data.length"
		data-row
		class="grid grid-rows-[auto_1fr] grid-cols-7 relative justify-start flex-1 w-full gap-3 mb-2"
	>
		<h3
			class="row-start-1 col-span-7 pointer-events-none font-semibold font-3xl"
		>
			{{ title }}
		</h3>
		<template v-for="(item, index) in data.slice(0, 7)" :key="item.id">
			<RouterLink
				:to="`${item.link}${suffix}`"
				:data-card="item.id"
				:data-index="index"
				class="row-start-2 w-full h-auto rounded-xl bg-cover aspect-poster focus:scale-105 focus:outline outline-[2.2px] outline-white transition-transform duration-200 scroll-mb-20 scroll-mt-12 snap-center snap-mandatory"
				:style="`background-image: url('https://app.nomercy.tv/tmdb-images${item.poster}?width=300&type=avif&aspect_ratio=null')`"
				@focus="handleFocus($event, item)"
				@keydown="handleDown($event)"
				@keyup="handleUp($event)"
			/>
		</template>
	</div>

	<Teleport to=".image-preload-container">
		<template v-for="item in data?.slice(0, 7)" :key="item.id">
			<img
				:src="`https://app.nomercy.tv/tmdb-images${item.backdrop}?width=2160&type=avif&aspect_ratio=null`"
				width="0"
				height="0"
				loading="eager"
				alt=""
				class="absolute"
			>
		</template>
	</Teleport>
</template>
