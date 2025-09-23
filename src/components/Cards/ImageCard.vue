<script lang="ts" setup>
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

const color = pickPaletteColor(props.data?.color_palette?.poster ?? props.data?.color_palette?.backdrop);
</script>

<template>
	<button
		v-if="data"
		v-once
		:onfocus="scrollIntoView"
		:style="color ? `
       --color-theme-8: ${color};
    ` : ''"
		class="frosting border-0 border-[var(--color-theme-8)] flex flex-col h-auto items-center focus-shift focus-outline transition-all duration-200 relative !rounded-lg select-none shadow-[0px_0px_0_1px_rgb(from_var(--color-theme-8,var(--color-theme-6))_r_g_b/70%)] w-full z-0 bg-surface-1/8"
		data-card="true"
		@click="setData(data)"
	>
		<span
			:class="aspect === 'poster' ? ' aspect-poster' : 'aspect-backdrop'"
			class="relative h-auto w-full cursor-pointer overflow-clip rounded-lg"
		>
			<TMDBImage
				:aspect="aspect"
				:color-palette="data?.color_palette?.image"
				:path="data?.src"
				:size="aspect === 'poster' ? 162 : 660"
				:title="data?.name"
				class="!relative"
				class-name="inset-0 h-full w-full overflow-clip rounded-lg"
				type="image"
			/>
		</span>
	</button>
</template>
