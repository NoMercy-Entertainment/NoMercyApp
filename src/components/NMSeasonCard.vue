<script setup lang="ts">
import type { PropType } from 'vue';

import type { Episode } from '@/types/api/base/info';

import { scrollIntoView } from '@/lib/utils';
import { pickPaletteColor } from '@/lib/colorHelper';
import type { ContextMenuItem } from '@/store/contextMenuItems.ts';

import TMDBImage from '@/components/Images/TMDBImage.vue';
import OptimizedIcon from '@/components/OptimizedIcon.vue';
import { pad } from '@/lib/stringArray.ts';
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

console.raw(props);
</script>

<template>
	<RouterLink
		v-if="data?.id && data?.available && !data?.link.startsWith('http')"
		:id="data?.id"
		class="frosting border-0 border-[rgb(var(--color-focus))] flex flex-col h-auto items-center group/season focus-shift focus-outline transition-all duration-200 overflow-clip relative !rounded-lg select-none shadow-[0px_0px_0_1px_rgb(var(--color-focus,var(--color-theme-6))/70%)] w-full z-0 bg-auto-1/12  text-slate-lightA-12/90  dark:text-slate-darkA-12/80 col-span-2"
		:class="{
			'cursor-pointer': data?.available,
			'cursor-not-allowed': !data?.available,
		}"
		:onfocus="scrollIntoView()"
		:style="`--color-focus: ${pickPaletteColor(props.data?.color_palette?.still)
			.replace(/,/gu, ' ')
			.replace(')', '')
			.replace('rgb(', '')};`"
		data-card="true"
		:to="data?.available ? data?.link : '#'"
	>
		<div
			class="relative mb-1 h-auto w-full overflow-clip rounded-t-md group-focus-visible/season:rounded-b-none group-hover/season:rounded-b-none aspect-backdrop bg-auto-1"
		>
			<TMDBImage
				:path="data?.still"
				:title="data?.title"
				:color-palette="data?.color_palette?.still"
				class="h-40"
				:size="660"
				loading="lazy"
				aspect="backdrop"
				class-name="pointer-events-none absolute z-20 flex h-full w-full select-none object-cover transitioning trickle-div"
				type="image"
			/>
			<div
				class="absolute inset-0 z-30 grid w-full text-white place-items-center group-focus-visible/season:bg-black opacity-0 group-focus-visible/season:opacity-100 transitioning group-hover/season:opacity-100 [background:radial-gradient(75%_50%_at_50%_50%,_rgba(0,_0,_0,_0.40)_0%,_rgba(0,_0,_0,_0.00)_100%),_rgba(0,_0,_0,_0.09)]"
				:class="{
					hidden: !data?.available,
				}"
			>
				<div class="transitioning hover:scale-110" style="--stroke-width: 1">
					<OptimizedIcon icon="playCircle" class-name="w-20" stroke="1" />
				</div>
			</div>
			<div
				v-if="data?.progress"
				class="absolute bottom-0 left-0 z-40 mb-3 w-full px-3"
			>
				<div
					:id="`episode-${data?.id}-slider-container`"
					class="relative z-40 flex h-1 w-full overflow-clip rounded-full pt-2 pr-8 bg-gray-dark-12"
				>
					<div
						:id="`episode-${data?.id}-progress-bar`"
						class="absolute top-0 left-0 h-full bg-[rgb(var(--color-focus))]"
						:style="{
							width: data?.progress >= 99 ? '100%' : `${data?.progress}%`,
						}"
					/>
				</div>
			</div>
		</div>

		<div
			class="grid w-full items-stretch gap-1 rounded-b-md p-2 transitioning text-left"
		>
			<p
				class="z-10 w-auto flex-shrink-0 flex-grow-0 self-stretch text-2xs sm:text-sm font-bold !leading-5 h-11 line-clamp-2 sm:line-clamp-1"
				:title="`${data?.episode_number ? `S${data?.season_number}E${data?.episode_number} - ` : ''}${data?.title}`"
			>
				{{ data?.episode_number ? `S${data?.season_number}E${data?.episode_number} - ` : "" }}{{ data?.title }}
			</p>
			<p
				class="z-10 h-8 w-auto flex-shrink-0 flex-grow-0 whitespace-normal self-stretch hidden sm:flex text-xs min-h-8 line-clamp-2 leading-[1.2] text-auto-12/80"
				:title="data?.overview"
			>
				{{ data?.overview }}
			</p>
		</div>
	</RouterLink>
	<a
		v-else-if="data?.id && data?.available"
		:id="data?.id"
		class="frosting border-0 border-[rgb(var(--color-focus))] flex flex-col h-auto items-center group/season focus-shift focus-outline transition-all duration-200 overflow-clip relative !rounded-lg select-none shadow-[0px_0px_0_1px_rgb(var(--color-focus,var(--color-theme-6))/70%)] w-full z-0 bg-auto-1/12  text-slate-lightA-12/90  dark:text-slate-darkA-12/80 col-span-2"
		:class="{
			'cursor-pointer': data?.available,
			'cursor-not-allowed': !data?.available,
		}"
		:onfocus="scrollIntoView()"
		:style="`--color-focus: ${pickPaletteColor(props.data?.color_palette?.still)
			.replace(/,/gu, ' ')
			.replace(')', '')
			.replace('rgb(', '')};`"
		data-card="true"
		target="_blank"
		:href="data?.available ? data?.link : '#'"
	>
		<div
			class="relative mb-1 h-auto w-full overflow-clip rounded-t-md group-focus-visible/season:rounded-b-none group-hover/season:rounded-b-none aspect-backdrop bg-auto-1"
		>
			<TMDBImage
				:path="data?.still"
				:title="data?.title"
				:color-palette="data?.color_palette?.still"
				class="h-40"
				:size="660"
				aspect="backdrop"
				loading="lazy"
				class-name="pointer-events-none absolute z-20 flex h-full w-full select-none object-cover transitioning trickle-div"
				type="image"
			/>
			<div
				class="absolute inset-0 z-30 grid w-full text-white place-items-center group-focus-visible/season:bg-black opacity-0 group-focus-visible/season:opacity-100 transitioning group-hover/season:opacity-100 [background:radial-gradient(75%_50%_at_50%_50%,_rgba(0,_0,_0,_0.40)_0%,_rgba(0,_0,_0,_0.00)_100%),_rgba(0,_0,_0,_0.09)]"
				:class="{
					hidden: !data?.available,
				}"
			>
				<div class="transitioning hover:scale-110" style="--stroke-width: 1">
					<MoooomIcon icon="shareSquare" class-name="w-20" stroke="1" />
				</div>
			</div>
			<div
				v-if="data?.progress"
				class="absolute bottom-0 left-0 z-40 mb-3 w-full px-3"
			>
				<div
					:id="`episode-${data?.id}-slider-container`"
					class="relative z-40 flex h-1 w-full overflow-clip rounded-full pt-2 pr-8 bg-gray-dark-12"
				>
					<div
						:id="`episode-${data?.id}-progress-bar`"
						class="absolute top-0 left-0 h-full bg-[rgb(var(--color-focus))]"
						:style="{
							width: data?.progress >= 99 ? '100%' : `${data?.progress}%`,
						}"
					/>
				</div>
			</div>
		</div>

		<div
			class="grid w-full items-stretch gap-1 rounded-b-md p-2 transitioning text-left"
		>
			<p
				class="z-10 w-auto flex-shrink-0 flex-grow-0 self-stretch text-2xs sm:text-sm font-bold !leading-5 h-11 line-clamp-2 sm:line-clamp-1"
				:title="`${data?.episode_number ? `S${data?.season_number}E${data?.episode_number} - ` : ''}${data?.title}`"
			>
				{{ data?.episode_number ? `S${data?.season_number}E${data?.episode_number} - ` : "" }}{{ data?.title }}
			</p>
			<p
				class="z-10 h-8 w-auto flex-shrink-0 flex-grow-0 whitespace-normal self-stretch hidden sm:flex text-xs min-h-8 line-clamp-2 leading-[1.2] text-auto-12/80"
				:title="data?.overview"
			>
				{{ data?.overview }}
			</p>
		</div>
	</a>
	<div
		v-else-if="data?.id"
		class="border-0 border-[rgb(var(--color-focus))] flex flex-col h-auto items-center group/season focus-shift focus-outline transition-all duration-200 overflow-clip relative !rounded-lg select-none shadow-[0px_0px_0_1px_rgb(var(--color-focus,var(--color-theme-6))/70%)] w-full z-0 bg-auto-1/12 col-span-2"
		:class="{
			'cursor-pointer': data?.available,
			'cursor-not-allowed': !data?.available,
		}"
		:style="`--color-focus: ${pickPaletteColor(props.data?.color_palette?.still)
			.replace(/,/gu, ' ')
			.replace(')', '')
			.replace('rgb(', '')};`"
		data-card="true"
		@focus="scrollIntoView()"
	>
		<div
			class="relative mb-1 h-auto w-full overflow-clip rounded-t-md group-focus-visible/season:rounded-b-none group-hover/season:rounded-b-none aspect-backdrop bg-auto-1"
		>
			<TMDBImage
				:path="data?.still"
				:title="data?.title"
				:color-palette="data?.color_palette?.still"
				class="h-40"
				:size="660"
				loading="lazy"
				aspect="backdrop"
				class-name="pointer-events-none absolute z-20 flex h-full w-full select-none object-cover transitioning trickle-div"
				type="image"
			/>
			<div
				:class="`absolute inset-0 z-30 grid w-full text-white place-items-center group-focus-visible/season:bg-black opacity-0 group-focus-visible/season:opacity-100 transitioning group-hover/season:opacity-100 [background:radial-gradient(75%_50%_at_50%_50%,_rgba(0,_0,_0,_0.40)_0%,_rgba(0,_0,_0,_0.00)_100%),_rgba(0,_0,_0,_0.09)] ${
					data?.available ? '' : 'hidden'
				}`"
			>
				<div class="transitioning hover:scale-110" style="--stroke-width: 1">
					<OptimizedIcon icon="playCircle" class-name="w-20" stroke="1" />
				</div>
			</div>
			<div
				v-if="data?.progress"
				class="absolute bottom-0 left-0 z-40 mb-3 w-full px-3"
			>
				<div
					:id="`episode-${data?.id}-slider-container`"
					class="relative z-40 flex h-1 w-full overflow-clip rounded-full pt-2 pr-8 bg-gray-dark-12"
				>
					<div
						:id="`episode-${data?.id}-progress-bar`"
						class="absolute top-0 left-0 h-full bg-[rgb(var(--color-focus))]"
						:style="{
							width: data?.progress >= 99 ? '100%' : `${data?.progress}%`,
						}"
					/>
				</div>
			</div>
		</div>

		<div
			class="grid w-full items-stretch gap-1 rounded-b-md p-2 transitioning text-left"
		>
			<p
				class="z-10 w-auto flex-shrink-0 flex-grow-0 self-stretch text-2xs sm:text-sm font-bold !leading-5 line-clamp-2 sm:line-clamp-1"
				:title="`${data?.episode_number ? `S${data?.season_number}E${data?.episode_number} - ` : ''}${data?.title}`"
			>
				{{ data?.episode_number ? `S${pad(data?.season_number, 2)}E${pad(data?.episode_number, 2)} - ` : "" }}{{ data?.title }}
			</p>
			<p
				class="z-10 h-8 w-auto flex-shrink-0 flex-grow-0 whitespace-normal self-stretch hidden sm:flex text-xs min-h-8 line-clamp-2 leading-[1.2] text-auto-12/80"
				:title="data?.overview"
			>
				{{ data?.overview }}
			</p>
		</div>
	</div>

	<div
		v-else
		class="frosting border-0 border-[rgb(var(--color-focus))] flex flex-col h-auto items-center group/season focus-shift focus-outline transition-all duration-200 overflow-clip relative !rounded-lg select-none shadow-[0px_0px_0_1px_rgb(var(--color-focus,var(--color-theme-6))/70%)] w-full z-0 bg-auto-1/12  text-slate-lightA-12/90  dark:text-slate-darkA-12/80 cursor-not-allowed col-span-2"
		data-card="true"
	>
		<div
			class="relative mb-1 h-auto w-full overflow-clip rounded-t-md group-focus-visible/season:rounded-b-none group-hover/season:rounded-b-none aspect-backdrop bg-auto-1"
		>
			<TMDBImage
				:path="data?.still"
				:title="data?.title"
				:color-palette="data?.color_palette?.still"
				class="h-40"
				:size="660"
				aspect="backdrop"
				class-name="pointer-events-none absolute z-20 flex h-full w-full select-none object-cover transitioning trickle-div"
				type="image"
			/>
			<div
				class="absolute inset-0 z-30 w-full text-white place-items-center group-focus-visible/season:bg-black opacity-0 group-focus-visible/season:opacity-100 transitioning group-hover/season:opacity-100 [background:radial-gradient(75%_50%_at_50%_50%,_rgba(0,_0,_0,_0.40)_0%,_rgba(0,_0,_0,_0.00)_100%),_rgba(0,_0,_0,_0.09)] hidden"
			>
				<div class="transitioning hover:scale-110" style="--stroke-width: 1">
					<OptimizedIcon icon="playCircle" class-name="w-20" stroke="1" />
				</div>
			</div>
		</div>

		<div
			class="grid w-full items-stretch gap-1 rounded-b-md p-2 transitioning text-left"
		>
			<p
				class="z-10 w-auto flex-shrink-0 flex-grow-0 self-stretch text-2xs sm:text-sm font-bold !leading-5 h-11 line-clamp-2 sm:line-clamp-1"
			>
				{{ data?.title }}
			</p>
			<p
				class="z-10 h-8 w-auto flex-shrink-0 flex-grow-0 whitespace-normal self-stretch hidden sm:flex text-xs min-h-8 line-clamp-2 leading-[1.2] text-auto-12/80"
				:title="data?.overview"
			>
				{{ data?.overview }}
			</p>
		</div>
	</div>
</template>
