<script setup lang="ts">
import { computed, type PropType } from 'vue';

import type { LibraryResponse } from '@/types/api/base/library';

import { pickPaletteColor } from '@/lib/colorHelper';
import { showBackdrops } from '@/store/preferences';
import {
	contextMenu,
	type ContextMenuItem,
	makeContextMenu,
	setContextMenu,
	setContextMenuContext,
} from '@/store/contextMenuItems';
import {
	setBackground,
	setColorPalette,
	setPoster,
	setTitle,
} from '@/store/ui';

import TMDBImage from '@/components/Images/TMDBImage.vue';
import CardIndicator from '@/components/Cards/CardIndicator.vue';

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
	context_menu_items: {
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
				.replace(/,/gu, ' ')
				.replace(')', '')
				.replace('rgb(', '')
		: '';
});

function onRightClick(event: Event) {
	if (props.context_menu_items) {
		setContextMenu(makeContextMenu(props.context_menu_items));
		setContextMenuContext(props.data);
		contextMenu.value.show(event);
	}
}

function handleClick(item: any) {
	if (props.data?.link.includes('watch'))
		return;
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
}
</script>

<template>
	<RouterLink
		v-if="data?.link"
		:data-scroll="scrollLetter"
		:data-card="data?.link"
		:onclick="() => handleClick(data)"
		:to="data.link"
		class="group/card frosting flex flex-col h-full items-center focus-outline relative rounded-lg select-none shadow-[0px_0px_0_1px_rgb(var(--color-focus,var(--color-theme-6))/70%)] w-full z-0 bg-auto-50/70 flex-grow-0"
		:class="showBackdrops ? 'aspect-backdrop' : 'aspect-poster'"
		:style="`--color-focus: ${focusColor};`"
		@contextmenu="onRightClick($event)"
	>
		<div class="w-full h-full overflow-clip rounded-lg inset-0 absolute">
			<div class="backdropCard-overlay" />

			<TMDBImage
				:path="image"
				:title="data.title"
				loading="lazy"
				:size="showBackdrops ? 330 : 180"
				:aspect="showBackdrops ? 'backdrop' : 'poster'"
				:color-palette="
					data.color_palette?.[showBackdrops ? 'backdrop' : 'poster']
				"
				class-name="h-full overflow-clip rounded-lg"
			/>

			<template v-if="showBackdrops">
				<div v-if="!!data.logo" class="absolute inset-0 h-full w-full">
					<div
						class="pointer-events-none absolute inset-0 z-0 mt-auto h-4/5 bg-gradient-to-t from-auto-1 via-auto-1/60"
					/>
					<div
						class="absolute bottom-0 left-0 h-full max-h-24 w-full max-w-[66%]"
					>
						<TMDBImage
							:path="data.logo"
							:title="data.title"
							:color-palette="data.color_palette?.logo"
							:size="500"
							loading="lazy"
							class="w-auto object-contain h-available object-[0_0%] max-h-inherit !duration-700 children:!duration-700"
							class-name="mr-auto p-4 !duration-700 children:!duration-700"
							type="logo"
						/>
					</div>
				</div>
				<div v-else class="absolute inset-0 h-full w-full">
					<div
						class="pointer-events-none absolute inset-0 z-0 mt-auto h-4/5 bg-gradient-to-t from-auto-1 via-auto-1/60"
					/>
					<div class="absolute bottom-4 left-4 w-full max-w-[66%]">
						<p
							class="z-10 w-auto text-xl font-bold line-clamp-2 leading-[1.2] text-auto-12 empty:hidden dark:font-medium"
						>
							{{ data.title }}
						</p>
					</div>
				</div>
			</template>
			<div
				v-else
				:class="`flex flex-col justify-start items-start w-full h-12 z-0 absolute left-0 transition-all duration-200 px-2 py-1 group-hover/card:-bottom-0 text-left ${
					image ? '-bottom-20' : 'bottom-0'
				}`"
			>
				<div
					class="absolute inset-0 z-0 opacity-0 group-hover/card:opacity-100 transition-all duration-200 bg-auto-1/80"
				/>
				<p
					class="z-10 w-auto flex-shrink-0 flex-grow-0 self-stretch text-xs font-semibold line-clamp-2 leading-[1.2] text-auto-12 empty:hidden dark:font-medium text-wrap"
				>
					{{ data.title }}
				</p>
			</div>
			<CardIndicator :data="data" />
		</div>
	</RouterLink>
</template>
