<script lang="ts" setup>
import { computed } from 'vue';
import type { PropType } from 'vue';

import type { Episode } from '@/types/api/base/info';

import { scrollIntoView } from '@/lib/utils';
import { pickPaletteColor } from '@/lib/colorHelper';
import type { ContextMenuItem } from '@/store/contextMenuItems.ts';

import TMDBImage from '@/components/Images/TMDBImage.vue';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';

const props = defineProps({
	data: {
		type: Object as PropType<Episode> | undefined,
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

// Determine wrapper component and props based on data
const wrapperComponent = computed(() => {
	if (!props.data?.id)
		return 'div';
	if (!props.data?.available)
		return 'div';
	if (props.data?.link?.startsWith('http'))
		return 'a';
	return 'RouterLink';
});

const wrapperProps = computed(() => {
	const base = {
		id: props.data?.id,
		class: {
			'cursor-pointer': props.data?.available,
			'cursor-not-allowed': !props.data?.available,
			'frosting': wrapperComponent.value !== 'div' || !props.data?.id,
		},
		style: `--color-theme-8: ${pickPaletteColor(props.data?.color_palette?.still)};`,
	};

	if (wrapperComponent.value === 'RouterLink' && props.data?.available) {
		return { ...base, to: props.data?.link };
	}

	if (wrapperComponent.value === 'a' && props.data?.available) {
		return { ...base, href: props.data?.link, target: '_blank' };
	}

	return base;
});

const iconName = computed(() => {
	return props.data?.link?.startsWith('http') ? 'shareSquare' : 'playCircle';
});

const colorThemeStyle = computed(() =>
	`--color-theme-8: ${pickPaletteColor(props.data?.color_palette?.still)};`,
);
</script>

<template>
	<component
		:is="wrapperComponent"
		v-bind="wrapperProps"
		:onfocus="scrollIntoView()"
		:style="`${colorThemeStyle} contain: layout style paint; will-change: transform;`"
		class="border-0 border-[var(--color-theme-8)] flex flex-col h-auto items-center group/season focus-shift focus-outline transition-all duration-200 overflow-clip relative !rounded-lg select-none shadow-[0px_0px_0_1px_rgb(from_var(--color-theme-8,var(--color-theme-6))_r_g_b/70%)] w-full z-0 bg-surface-1/12 text-slate-12/90 dark:text-slate-12/80 col-span-2"
		data-card="true"
	>
		<div
			class="relative mb-1 h-auto w-full overflow-clip rounded-t-md group-focus-visible/season:rounded-b-none group-hover/season:rounded-b-none aspect-backdrop bg-surface-1"
		>
			<TMDBImage
				:color-palette="data?.color_palette?.still"
				:path="data?.still"
				:size="660"
				:title="data?.title"
				aspect="backdrop"
				class="h-40"
				class-name="pointer-events-none absolute z-20 flex h-full w-full select-none object-cover transitioning trickle-div"
				:loading="data?.id ? 'lazy' : undefined"
				type="image"
			/>

			<!-- Overlay with play/share icon -->
			<div
				v-if="data?.available"
				class="absolute inset-0 z-30 grid w-full place-items-center group-focus-visible/season:bg-black opacity-0 group-focus-visible/season:opacity-100 transitioning group-hover/season:opacity-100 [background:radial-gradient(75%_50%_at_50%_50%,_rgba(0,_0,_0,_0.40)_0%,_rgba(0,_0,_0,_0.00)_100%),_rgba(0,_0,_0,_0.09)]"
			>
				<MoooomIcon
					class-name="w-20 transitioning hover:scale-110"
					:icon="iconName"
					stroke="1"
					style="--stroke-width: 1"
				/>
			</div>

			<!-- Progress bar -->
			<div
				v-if="data?.progress"
				class="absolute bottom-0 left-0 z-40 mb-3 w-full px-3"
			>
				<div
					:id="`episode-${data?.id}-slider-container`"
					class="relative z-40 flex h-1 w-full overflow-clip rounded-full pt-2 pr-8 bg-gray-dark-12 before:absolute before:top-0 before:left-0 before:h-full before:bg-[var(--color-theme-8)]"
					:style="{
						'--progress-width': data?.progress >= 99 ? '100%' : `${data?.progress}%`,
					}"
				>
					<div
						:id="`episode-${data?.id}-progress-bar`"
						:style="{ width: data?.progress >= 99 ? '100%' : `${data?.progress}%` }"
						class="absolute top-0 left-0 h-full bg-[var(--color-theme-8)]"
					/>
				</div>
			</div>
		</div>

		<!-- Text content -->
		<div
			class="grid w-full items-stretch gap-1 rounded-b-md p-2 transitioning text-left text-surface-12"
		>
			<p
				:title="`${data?.episode_number ? `S${data?.season_number}E${data?.episode_number} - ` : ''}${data?.title}`"
				class="z-10 w-auto flex-shrink-0 flex-grow-0 self-stretch text-2xs sm:text-sm font-bold !leading-5 h-11 line-clamp-2 sm:line-clamp-1"
			>
				{{ data?.episode_number ? `S${data?.season_number}E${data?.episode_number} - ` : "" }}{{ data?.title }}
			</p>
			<p
				:title="data?.overview"
				class="z-10 h-8 w-auto flex-shrink-0 flex-grow-0 whitespace-normal self-stretch hidden sm:flex text-xs min-h-8 line-clamp-2 leading-[1.2]"
			>
				{{ data?.overview }}
			</p>
		</div>
	</component>
</template>
