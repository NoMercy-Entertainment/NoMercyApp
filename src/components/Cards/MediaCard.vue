<script lang="ts" setup>
import type { PropType } from 'vue';
import { computed } from 'vue';

import type { ContinueWatching, HomeItem } from '@/types/api/base/home';
import type { Collection } from '@/types/api/base/collection';
import type { KnownFor } from '@/types/api/base/person';
import type { LibraryResponse } from '@/types/api/base/library';
import type { InfoResponse } from '@/types/api/base/info';

import { pickPaletteColor } from '@/lib/colorHelper';
import { setBackground, setColorPalette, setPoster, setTitle } from '@/store/ui.ts';
import { showBackdrops } from '@/store/preferences';

import TMDBImage from '@/components/Images/TMDBImage.vue';
import CardIndicator from '@/components/Cards/CardIndicator.vue';
import { prefetchOnHover } from '@/services/PrefetchService';

const props = defineProps({
	data: {
		type: Object as
		| PropType<
			| LibraryResponse
			| InfoResponse
			| HomeItem
			| ContinueWatching
			| Collection
			| KnownFor
		>
		| undefined,
		required: true,
	},
	index: {
		type: Number as PropType<number>,
		required: false,
		default: 0,
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
});

const scrollLetter = computed(
	() => `scroll_${props.data?.titleSort?.[0]?.toUpperCase?.()}`,
);

const backdropStyle = computed(() => {
	return showBackdrops.value && !props.disableAutoAspect;
});

const image = computed(() => {
	return props.data?.[backdropStyle.value ? 'backdrop' : 'poster'] as string;
});

const color = computed(() => {
	return props.data?.color_palette?.[
		backdropStyle.value ? 'backdrop' : 'poster'
	]
		? pickPaletteColor(
				props.data?.color_palette?.[backdropStyle.value ? 'backdrop' : 'poster'],
			)
		: '';
});

function onHover(event: Event) {
	if (props.data?.link) {
		prefetchOnHover(props.data.link);
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
		:class="backdropStyle ? 'aspect-backdrop' : 'aspect-poster'"
		:data-scroll="scrollLetter"
		:onclick="() => handleClick(data)"
		:style="color ? `
			--color-theme-8: ${color};
			` : ''"
		:to="data?.link"
		class="group/card flex flex-col h-full items-center focus-outline relative rounded-lg select-none shadow-[0px_0px_0_1px_rgb(from_var(--color-theme-8,var(--color-theme-6))_r_g_b/70%)] w-full z-0 bg-surface-50/70 flex-grow-0"
		@mouseenter="onHover($event)"
		@focusin="onHover($event)"
	>
		<div class="w-full h-full overflow-clip rounded-lg inset-0 absolute">
			<div class="backdropCard-overlay" />

			<TMDBImage
				:aspect="backdropStyle ? 'backdrop' : 'poster'"
				:color-palette="
					data?.color_palette?.[backdropStyle ? 'backdrop' : 'poster']
				"
				:path="image"
				:size="backdropStyle ? 330 : 180"
				:title="data?.title"
				class-name="h-full overflow-clip rounded-lg"
				loading="lazy"
			/>

			<template v-if="backdropStyle">
				<div
					v-if="!!(data as HomeItem)?.logo"
					class="absolute inset-0 h-full w-full"
				>
					<div
						class="pointer-events-none absolute inset-0 z-0 mt-auto h-4/5 bg-gradient-to-t from-surface-1 via-surface-1/80"
					/>
					<div
						class="absolute bottom-0 left-0 h-full max-h-24 w-full max-w-[66%]"
					>
						<TMDBImage
							:color-palette="data?.color_palette?.logo"
							:path="(data as HomeItem)?.logo"
							:size="500"
							:title="data?.title"
							class="w-auto object-contain h-available object-[0_0%] max-h-inherit !duration-700 children:!duration-700"
							class-name="mr-auto p-4 !duration-700 children:!duration-700"
							loading="lazy"
							type="logo"
						/>
					</div>
				</div>
				<div v-else class="absolute inset-0 h-full w-full">
					<div
						class="pointer-events-none absolute inset-0 z-0 mt-auto h-4/5 bg-gradient-to-t from-surface-1 via-surface-1/80"
					/>
					<div class="absolute bottom-4 left-4 w-full max-w-[66%]">
						<p
							class="z-10 w-auto text-2xl font-bold line-clamp-2 leading-[1.2] empty:hidden dark:font-medium"
						>
							{{ data?.title }}
						</p>
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
					<p
						class="z-10 w-auto flex-shrink-0 flex-grow-0 self-stretch text-xs font-semibold line-clamp-2 leading-[1.2] text-slate-900 dark:text-slate-100 empty:hidden dark:font-medium text-wrap"
					>
						{{ data.title }}
					</p>
				</div>
			</template>

			<CardIndicator :data="data" />
		</div>
	</RouterLink>
</template>
