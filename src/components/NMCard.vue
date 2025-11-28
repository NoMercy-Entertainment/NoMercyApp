<script lang="ts" setup>
import type { PropType } from 'vue';
import { computed } from 'vue';

import type { LibraryResponse } from '@/types/api/base/library';

import { pickPaletteColor } from '@/lib/colorHelper';
import { showBackdrops } from '@/store/preferences';
import type { ContextMenuItem } from '@/store/contextMenuItems';
import { contextMenu, makeContextMenu, setContextMenu, setContextMenuContext } from '@/store/contextMenuItems';
import { setBackground, setColorPalette, setPoster, setTitle } from '@/store/ui';

import TMDBImage from '@/components/Images/TMDBImage.vue';
import CardIndicator from '@/components/Cards/CardIndicator.vue';
import { breakTitle } from '@/lib/stringArray.ts';

const props = defineProps({
	data: {
		type: Object as PropType<LibraryResponse> | undefined,
		required: true,
	},
	watch: {
		type: Boolean,
		required: false,
		default: false,
	},
	disableAutoAspect: {
		type: Boolean,
		required: false,
		default: false,
	},
	contextMenuItems: {
		type: Array as PropType<ContextMenuItem[]>,
		required: false,
		default: () => [],
	},
});

const scrollLetter = computed(
	() => `scroll_${props.data.titleSort?.[0]?.toUpperCase?.()}`,
);

const backdropStyle = computed(() => {
	return showBackdrops.value && !props.disableAutoAspect;
});

const image = computed(() => {
	return props.data[showBackdrops.value ? 'backdrop' : 'poster'] as string;
});

const focusColor = computed(() => {
	return props.data?.color_palette?.[
		backdropStyle.value ? 'backdrop' : 'poster'
	]
		? pickPaletteColor(
				props.data?.color_palette?.[backdropStyle.value ? 'backdrop' : 'poster'],
			)
	// .replace(/,/gu, ' ')
	// .replace(')', '')
	// .replace('rgb(', '')
		: '';
});

function onRightClick(event: Event) {
	if (props.contextMenuItems) {
		setContextMenu(makeContextMenu(props.contextMenuItems));
		setContextMenuContext(props.data);
		contextMenu.value.show(event);
	}
}

function handleClick(item: any) {
	if (props.data?.link.includes('watch'))
		return;

	setTimeout(() => {
		if (item?.backdrop) {
			setBackground(item?.backdrop);
		}
		if (item?.poster) {
			setPoster(item.poster);
		}
		if (item.title) {
			setTitle(item.title);
		}
		if (item.color_palette) {
			setColorPalette(item.color_palette.poster);
		}
	}, 30);
}
</script>

<template>
	<RouterLink
		v-if="data?.link"
		:class="{
			'border-2': !!data.deathday,
			'aspect-backdrop': showBackdrops,
			'aspect-poster': !showBackdrops,
		}"
		:data-card="data?.link"
		:data-scroll="scrollLetter"
		:onclick="() => handleClick(data)"
		:style="focusColor ? `
       --color-theme-8: ${data.deathday ? '#fff' : focusColor};
    ` : ''"
		:to="data.link"
		class="group/card frosting flex flex-col h-full items-center focus-outline relative rounded-lg select-none shadow-[0px_0px_0_1px_rgb(from_var(--color-theme-8,var(--color-theme-6))_r_g_b/70%)] w-full z-0 bg-surface-50/70 flex-grow-0"
		no-ring
		@contextmenu="onRightClick($event)"
	>
		<div class="w-full h-full overflow-clip rounded-lg inset-0 absolute">
			<div class="backdropCard-overlay" />

			<TMDBImage
				:aspect="showBackdrops ? 'backdrop' : 'poster'"
				:color-palette="
					data.color_palette?.[showBackdrops ? 'backdrop' : 'poster']
				"
				:path="image"
				:size="showBackdrops ? 330 : 180"
				:title="data.title"
				class-name="h-full overflow-clip rounded-lg"
				loading="lazy"
			/>

			<template v-if="backdropStyle">
				<div v-if="!!data.logo" class="absolute inset-0 h-full w-full">
					<div
						class="pointer-events-none absolute inset-0 z-0 mt-auto h-4/5 bg-gradient-to-t from-surface-12 via-surface-12 dark:from-surface-1 dark:via-surface-1/60"
					/>
					<div
						class="absolute bottom-0 left-0 h-full max-h-24 w-full max-w-[66%]"
					>
						<TMDBImage
							:color-palette="data.color_palette?.logo"
							:path="data.logo"
							:size="500"
							:title="data.title"
							class="w-auto object-contain h-available object-[0_0%] max-h-inherit !duration-700 children:!duration-700"
							class-name="mr-auto p-4 !duration-700 children:!duration-700"
							loading="lazy"
							type="logo"
						/>
					</div>
				</div>
				<div v-else class="absolute inset-0 h-full w-full">
					<div
						class="pointer-events-none absolute inset-0 z-0 mt-auto h-4/5 bg-gradient-to-t from-surface-12 via-surface-12 dark:from-surface-1 dark:via-surface-1/60"
					/>
					<div class="absolute bottom-4 left-4 w-full">
						<div class="z-10 w-available text-xl font-bold line-clamp-2 leading-[1.2] text-surface-12 dark:text-slate-1 empty:hidden dark:font-medium text-xl font-semibold whitespace-pre-line flex-col flex"
							v-html="breakTitle(data.title, 'text-sm')"
						/>
					</div>
				</div>
			</template>
			<template v-else>
				<div
					:class="{
						'-bottom-20': image,
						'bottom-0': !image,
					}"
					class="flex flex-col justify-start items-start w-full h-12 z-0 absolute left-0 transition-all duration-200 px-2 py-1 group-hover/card:-bottom-0 text-left"
				>
					<div
						:class="{
							'opacity-0 group-hover/card:opacity-100': image,
						}"
						class="absolute inset-0 z-0 transition-all duration-200 bg-surface-1/80"
					/>
					<div class="z-10 w-available text-xl font-bold line-clamp-2 leading-[1.2] text-surface-12 dark:text-slate-1 empty:hidden dark:font-medium font-semibold whitespace-pre-line text-xs">
						{{ data.title }}
					</div>
				</div>
			</template>
			<CardIndicator :data="data" />
		</div>
	</RouterLink>
</template>
