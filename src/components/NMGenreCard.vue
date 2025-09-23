<script lang="ts" setup>
import type { PropType } from 'vue';
import { computed } from 'vue';

import { genreColors } from '@/config/global';
import OptimizedIcon from '@/components/OptimizedIcon.vue';
import type { LibraryResponse } from '@/types/api/base/library';
import type { ContextMenuItem } from '@/store/contextMenuItems';

const props = defineProps({
	data: {
		type: Object as PropType<LibraryResponse> | undefined,
		required: true,
	},
	index: {
		type: Number as PropType<number>,
		required: false,
		default: 0,
	},
	contextMenuItems: {
		type: Array as PropType<ContextMenuItem[]>,
		required: false,
		default: () => [],
	},
});

const scrollLetter = computed(
	() => `scroll_${props.data?.titleSort?.[0]?.toUpperCase?.()}`,
);

const rotate = computed(() => {
	return {
		0: 'group-hover/card:rotate-[-4deg] group-hover/card:scale-[1.1]',
		1: 'group-hover/card:rotate-[4deg] group-hover/card:scale-[1.1]',
	}[props.index % 2];
});

const genreColor = computed(() => genreColors(props.data.title));
</script>

<template>
	<RouterLink
		:class="`flex flex-col relative justify-start items-center w-full h-auto aspect-poster flex-grow flex-shrink-0 overflow-hidden rounded-lg border-1-light transition-all duration-200 select-none group/card ${genreColor.bg} bg-theme-6 hover:bg-theme-8 dark:bg-theme-5 dark:hover:bg-theme-7 hover:shadow-[0px_0px_0_3px_var(--color-theme-9)]`"
		:data-scroll="scrollLetter"
		:to="data.have_items > 1 ? data.link : '#'"
	>
		<div class="backdropCard-overlay" />
		<div
			class="relative flex flex-shrink-0 flex-grow-0 flex-col items-center justify-center h-[75%]"
		>
			<div
				:class="`flex items-center justify-center w-auto h-auto aspect-square p-4 object-cover rounded-3xl overflow-clip transition-all duration-200 ${rotate} ${genreColor.iconBg}
          bg-theme-5 group-hover/card:bg-theme-7
          dark:bg-theme-8 dark:group-hover/card:bg-theme-8
          rounded-3xl
            shadow-[0_1px_0_0_rgba(255,255,255,0.20)_inset,0_-1px_0_0_rgb(from_var(--color-slate-9)_r_g_b/60%)_inset,0_22px_30px_-4px_rgb(from_var(--color-slate-9)_r_g_b/70%)]
            hover:!shadow-[0_1px_0_0_rgba(255,255,255,0.20)_inset,0_-1px_0_0_rgb(from_var(--color-slate-11)_r_g_b/60%)_inset,0_22px_30px_-4px_rgb(from_var(--color-slate-11)_r_g_b/70%)]
            dark:shadow-[0_1px_0_0_rgba(255,255,255,0.20)_inset,0_-1px_0_0_rgb(from_var(--color-slate-1)_r_g_b/30%)_inset,0_22px_30px_-4px_rgb(from_var(--color-slate-1)_r_g_b/70%)]
            dark:hover:!shadow-[0_1px_0_0_rgba(255,255,255,0.20)_inset,0_-1px_0_0_rgb(from_var(--color-slate-1)_r_g_b/30%)_inset,0_22px_30px_-4px_rgb(from_var(--color-slate-1)_r_g_b/70%)]`"
				style="
          background-image: radial-gradient(
              50% 50% at 50% 100%,
              rgba(255, 255, 255, 0.09) 0%,
              rgba(255, 255, 255, 0.06) 40%,
              rgba(255, 255, 255, 0) 100%
            ),
            linear-gradient(
              180deg,
              rgba(255, 255, 255, 0) 0%,
              rgba(255, 255, 255, 0.12) 100%
            ),
            rgb(from var(--color-theme-7) r g b / 20%));
          background-blend-mode: normal, overlay, normal;
        "
			>
				<OptimizedIcon :icon="genreColor.icon" class-name="w-20" />
			</div>
		</div>
		<div
			class="relative flex flex-shrink-0 flex-grow-0 flex-col items-start justify-center self-stretch px-4 pb-0 text-theme-12/12"
		>
			<p
				class="flex-shrink-0 flex-grow-0 self-stretch text-sm font-semibold w-available line-clamp-1"
			>
				{{ $t(data.title) }}
			</p>
			<p
				class="flex-shrink-0 flex-grow-0 self-stretch text-xs opacity-60 w-available"
			>
				{{ data.have_items }} {{ data.have_items > 1 ? "items" : "item" }}
			</p>
		</div>
	</RouterLink>
</template>
