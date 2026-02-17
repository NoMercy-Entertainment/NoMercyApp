<script lang="ts" setup>
import type { PropType } from 'vue';
import { computed } from 'vue';

import type { PersonResponseItem } from '@/types/api/base/person';
import type { InfoCredit } from '@/types/api/base/info';

import { pickPaletteColor } from '@/lib/colorHelper';

import TMDBImage from '@/components/Images/TMDBImage.vue';

const props = defineProps({
	data: {
		type: Object as PropType<PersonResponseItem | InfoCredit> | undefined,
		required: true,
	},
	index: {
		type: Number as PropType<number>,
		required: false,
		default: 0,
	},
});

const scrollLetter = computed(
	() => `scroll_${props.data?.titleSort?.[0]?.toUpperCase?.()}`,
);

const color = pickPaletteColor(props.data?.color_palette?.profile, 0, 255);

const borderColor = computed(() => {
	if (props.data?.deathday)
		return '#fff';
	if (color)
		return color;
	return '';
});
</script>

<template>
	<RouterLink
		v-if="data?.link"
		:class="{
			'border-2': !!data.deathday,
		}"
		:data-scroll="scrollLetter"
		:style="`--color-theme-8: ${borderColor};` "
		:to="data?.link"
		class="frosting group/card border-0 border-focus focus-shift focus-outline transition-all duration-200 flex flex-col h-full items-center relative select-none shadow-[0px_0px_0_1px_rgb(from_var(--color-theme-8,var(--color-theme-6))_r_g_b/70%)] w-full z-0 bg-surface-50/70 aspect-poster flex-grow-0 [flex:1_1_162px] rounded-lg overflow-hidden"
		once
	>
		<div class="w-full h-full inset-0 absolute">
			<TMDBImage
				:color-palette="data?.color_palette?.profile"
				:path="(data as any)?.profile"
				:size="180"
				:title="data?.name"
				aspect="poster"
				class-name="h-full"
			/>
			<div
				class="absolute bottom-0 left-0 z-0 grid w-full items-stretch px-1 sm:px-2 py-2 text-left overflow-clip text-surface-12/70"
			>
				<div class="absolute inset-0 z-0 bg-surface-1/80" />
				<p
					class="z-10 text-2xs sm:text-xs font-bold !leading-[0.8rem] h-6 sm:h-7 line-clamp-2 w-available"
				>
					{{ data?.name }}
					<span v-if="data.deathday" class="-mr-1 text-xs leading-3 h-5">&#8224;</span>
				</p>
				<p
					:title="data?.character ?? data?.job as string"
					class="z-10 text-2xs sm:text-2xs !leading-none h-6 sm:h-6 line-clamp-2 w-available empty:hidden -mr-1"
				>
					{{ (data?.character ?? data?.job)?.replace("(voice)", "") }}
				</p>
			</div>
		</div>
	</RouterLink>
</template>
