<script setup lang="ts">
import { ref } from 'vue';
import type { PropType } from 'vue';

import type { MediaItem } from '@/types/api/base/info';

import { scrollIntoView } from '@/lib/utils';
import { pickPaletteColor } from '@/lib/colorHelper';

import TMDBImage from '@/components/Images/TMDBImage.vue';

const props = defineProps({
	data: {
		type: Object as PropType<MediaItem> | undefined,
		required: true,
	},
	aspect: {
		type: String as PropType<'poster' | 'backdrop'>,
		required: false,
		default: 'poster',
	},
	setData: {
		type: Function as PropType<(data: MediaItem) => void>,
		required: true,
	},
	limitCardCountBy: {
		type: Number,
		required: false,
	},
});

const ringColor = ref(
	pickPaletteColor(props.data?.color_palette?.image)
		?.replace('rgb(', '')
		.replace(')', '')
		.replace(/,/gu, ' ') ?? 'var(--color-primary)',
);
</script>

<template>
	<button
		v-if="data"
		:onfocus="scrollIntoView"
		:style="`--color-focus: ${ringColor};`"
		data-card="true"
		class="frosting border-0 border-[rgb(var(--color-focus))] flex flex-col h-auto items-center focus-shift focus-outline transition-all duration-200 relative !rounded-lg select-none shadow-[0px_0px_0_1px_rgb(var(--color-focus,var(--color-theme-6))/70%)] w-full z-0 bg-auto-1/8"
		@click="setData(data)"
	>
		<span
			class="relative h-auto w-full cursor-pointer overflow-clip rounded-lg"
			:class="aspect === 'poster' ? ' aspect-poster' : 'aspect-backdrop'"
		>
			<TMDBImage
				class-name="inset-0 h-full w-full overflow-clip rounded-lg"
				class="!relative"
				:aspect="aspect"
				:path="data?.src"
				type="image"
				:title="data?.name"
				:color-palette="data?.color_palette?.image"
				:size="aspect === 'poster' ? 162 : 660"
			/>
		</span>
	</button>
</template>
