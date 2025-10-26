<script lang="ts" setup>
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
</script>

<template>
	<RouterLink
		v-if="data?.id && data?.available && !data?.link.startsWith('http')"
		:id="data?.id"
		:class="{
			'cursor-pointer': data?.available,
			'cursor-not-allowed': !data?.available,
		}"
		:onfocus="scrollIntoView()"
		:style="`--color-theme-8: ${pickPaletteColor(props.data?.color_palette?.still)
		// .replace(/,/gu, ' ')
		// .replace(')', '')
		// .replace('rgb(', '')
		};`"
		:to="data?.available ? data?.link : '#'"
		class="frosting border-0 border-[var(--color-theme-8)] flex flex-col h-auto items-center group/season focus-shift focus-outline transition-all duration-200 overflow-clip relative !rounded-lg select-none shadow-[0px_0px_0_1px_rgb(from_var(--color-theme-8,var(--color-theme-6))_r_g_b/70%)] w-full z-0 bg-surface-1/12  text-slate-12/90  dark:text-slate-12/80 col-span-2"
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
				loading="lazy"
				type="image"
			/>
			<div
				:class="{
					hidden: !data?.available,
				}"
				class="absolute inset-0 z-30 grid w-full place-items-center group-focus-visible/season:bg-black opacity-0 group-focus-visible/season:opacity-100 transitioning group-hover/season:opacity-100 [background:radial-gradient(75%_50%_at_50%_50%,_rgba(0,_0,_0,_0.40)_0%,_rgba(0,_0,_0,_0.00)_100%),_rgba(0,_0,_0,_0.09)]"
			>
				<div class="transitioning hover:scale-110" style="--stroke-width: 1">
					<MoooomIcon class-name="w-20" icon="playCircle" stroke="1" />
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
						:style="{
							width: data?.progress >= 99 ? '100%' : `${data?.progress}%`,
						}"
						class="absolute top-0 left-0 h-full bg-[var(--color-theme-8)]"
					/>
				</div>
			</div>
		</div>

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
	</RouterLink>
	<a
		v-else-if="data?.id && data?.available"
		:id="data?.id"
		:class="{
			'cursor-pointer': data?.available,
			'cursor-not-allowed': !data?.available,
		}"
		:href="data?.available ? data?.link : '#'"
		:onfocus="scrollIntoView()"
		:style="`--color-theme-8: ${pickPaletteColor(props.data?.color_palette?.still)
		// .replace(/,/gu, ' ')
		// .replace(')', '')
		// .replace('rgb(', '')
		};`"
		class="frosting border-0 border-[var(--color-theme-8)] flex flex-col h-auto items-center group/season focus-shift focus-outline transition-all duration-200 overflow-clip relative !rounded-lg select-none shadow-[0px_0px_0_1px_rgb(from_var(--color-theme-8,var(--color-theme-6))_r_g_b/70%)] w-full z-0 bg-surface-1/12  text-slate-12/90  dark:text-slate-12/80 col-span-2"
		data-card="true"
		target="_blank"
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
				loading="lazy"
				type="image"
			/>
			<div
				:class="{
					hidden: !data?.available,
				}"
				class="absolute inset-0 z-30 grid w-full place-items-center group-focus-visible/season:bg-black opacity-0 group-focus-visible/season:opacity-100 transitioning group-hover/season:opacity-100 [background:radial-gradient(75%_50%_at_50%_50%,_rgba(0,_0,_0,_0.40)_0%,_rgba(0,_0,_0,_0.00)_100%),_rgba(0,_0,_0,_0.09)]"
			>
				<div class="transitioning hover:scale-110" style="--stroke-width: 1">
					<MoooomIcon class-name="w-20" icon="shareSquare" stroke="1" />
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
						:style="{
							width: data?.progress >= 99 ? '100%' : `${data?.progress}%`,
						}"
						class="absolute top-0 left-0 h-full bg-[var(--color-theme-8)]"
					/>
				</div>
			</div>
		</div>

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
	</a>
	<div
		v-else-if="data?.id"
		:class="{
			'cursor-pointer': data?.available,
			'cursor-not-allowed': !data?.available,
		}"
		:style="`--color-theme-8: ${pickPaletteColor(props.data?.color_palette?.still)
		// .replace(/,/gu, ' ')
		// .replace(')', '')
		// .replace('rgb(', '')
		};`"
		class="border-0 border-[var(--color-theme-8)] flex flex-col h-auto items-center group/season focus-shift focus-outline transition-all duration-200 overflow-clip relative !rounded-lg select-none shadow-[0px_0px_0_1px_rgb(from_var(--color-theme-8,var(--color-theme-6))_r_g_b/70%)] w-full z-0 bg-surface-1/12 col-span-2"
		data-card="true"
		@focus="scrollIntoView()"
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
				loading="lazy"
				type="image"
			/>
			<div
				:class="`absolute inset-0 z-30 grid w-full place-items-center group-focus-visible/season:bg-black opacity-0 group-focus-visible/season:opacity-100 transitioning group-hover/season:opacity-100 [background:radial-gradient(75%_50%_at_50%_50%,_rgba(0,_0,_0,_0.40)_0%,_rgba(0,_0,_0,_0.00)_100%),_rgba(0,_0,_0,_0.09)] ${
					data?.available ? '' : 'hidden'
				}`"
			>
				<div class="transitioning hover:scale-110" style="--stroke-width: 1">
					<MoooomIcon class-name="w-20" icon="playCircle" stroke="1" />
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
						:style="{
							width: data?.progress >= 99 ? '100%' : `${data?.progress}%`,
						}"
						class="absolute top-0 left-0 h-full bg-[var(--color-theme-8)]"
					/>
				</div>
			</div>
		</div>

		<div
			class="grid w-full items-stretch gap-1 rounded-b-md p-2 transitioning text-left"
		>
			<p
				:title="`${data?.episode_number ? `S${data?.season_number}E${data?.episode_number} - ` : ''}${data?.title}`"
				class="z-10 w-auto flex-shrink-0 flex-grow-0 self-stretch text-2xs sm:text-sm font-bold !leading-5 line-clamp-2 sm:line-clamp-1"
			>
				{{ data?.episode_number ? `S${pad(data?.season_number, 2)}E${pad(data?.episode_number, 2)} - ` : "" }}{{
					data?.title }}
			</p>
			<p
				:title="data?.overview"
				class="z-10 h-8 w-auto flex-shrink-0 flex-grow-0 whitespace-normal self-stretch hidden sm:flex text-xs min-h-8 line-clamp-2 leading-[1.2]"
			>
				{{ data?.overview }}
			</p>
		</div>
	</div>

	<div
		v-else
		class="frosting border-0 border-[var(--color-theme-8)] flex flex-col h-auto items-center group/season focus-shift focus-outline transition-all duration-200 overflow-clip relative !rounded-lg select-none shadow-[0px_0px_0_1px_rgb(from_var(--color-theme-8,var(--color-theme-6))_r_g_b/70%)] w-full z-0 bg-surface-1/12  text-slate-12/90  dark:text-slate-12/80 cursor-not-allowed col-span-2"
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
				type="image"
			/>
			<div
				class="absolute inset-0 z-30 w-full place-items-center group-focus-visible/season:bg-black opacity-0 group-focus-visible/season:opacity-100 transitioning group-hover/season:opacity-100 [background:radial-gradient(75%_50%_at_50%_50%,_rgba(0,_0,_0,_0.40)_0%,_rgba(0,_0,_0,_0.00)_100%),_rgba(0,_0,_0,_0.09)] hidden"
			>
				<div class="transitioning hover:scale-110" style="--stroke-width: 1">
					<MoooomIcon class-name="w-20" icon="playCircle" stroke="1" />
				</div>
			</div>
		</div>

		<div
			class="grid w-full items-stretch gap-1 rounded-b-md p-2 transitioning text-left text-surface-12"
		>
			<p
				class="z-10 w-auto flex-shrink-0 flex-grow-0 self-stretch text-2xs sm:text-sm font-bold !leading-5 h-11 line-clamp-2 sm:line-clamp-1"
			>
				{{ data?.title }}
			</p>
			<p
				:title="data?.overview"
				class="z-10 h-8 w-auto flex-shrink-0 flex-grow-0 whitespace-normal self-stretch hidden sm:flex text-xs min-h-8 line-clamp-2 leading-[1.2]"
			>
				{{ data?.overview }}
			</p>
		</div>
	</div>
</template>
