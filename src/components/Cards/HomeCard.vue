<script lang="ts" setup>
import type { PropType } from 'vue';
import { computed, ref, watch } from 'vue';

import i18next from '@/config/i18next';
import { isMobile } from '@/config/global';
import { pickPaletteColor } from '@/lib/colorHelper';

import TMDBImage from '@/components/Images/TMDBImage.vue';
import HomeCardActions from '@/components/Cards/HomeCardActions.vue';
import type { LibraryResponse } from '@/types/api/base/library';
import { setColorPalette } from '@/store/ui';
import { breakLogoTitle } from '@/lib/utils/string';

const props = defineProps({
	homeItem: {
		type: Object as PropType<LibraryResponse | undefined>,
		required: true,
	},
});

const hasWatched = ref(false);
const endTime = ref<string | 0 | null | undefined>(null);

const ringPosterColor = computed(() => pickPaletteColor(props.homeItem?.color_palette?.poster));

const ringBackdropColor = computed(() => pickPaletteColor(props.homeItem?.color_palette?.backdrop));

function toggleWatched() {
	// if (!homeItem?.value) return;
}

watch(props, (value) => {
	if (!value.homeItem)
		return;

	if (value.homeItem.color_palette) {
		setColorPalette(value.homeItem?.color_palette?.poster);
	}

	endTime.value
		= value.homeItem?.duration
			&& new Date(
				new Date().getTime() + value.homeItem?.duration * 60 * 1000,
			).toLocaleTimeString(i18next.language, {
				hour: '2-digit',
				minute: '2-digit',
			});
});
</script>

<template>
	<!-- Desktop Version -->
	<article
		v-if="!isMobile"
		v-once
		class="scheme-dark relative m-4 mt-0 sm:mt-4 flex flex-col justify-end gap-4 rounded-2xl bg-black/50 p-4 h-[65vh] overflow-clip before:content-[''] before:pointer-events-none before:absolute before:inset-0 before:z-0 before:mt-auto before:h-4/5 before:bg-gradient-to-t before:from-surface-1 before:via-surface-1/60"
		data-scroll
	>
		<TMDBImage
			v-if="homeItem"
			:color-palette="homeItem?.color_palette?.backdrop"
			:path="homeItem?.backdrop"
			:style="ringBackdropColor ? `--color-theme-8: ${ringBackdropColor};` : ''"
			:title="homeItem?.title"
			:width="null"
			class="!absolute !inset-0 children:!w-available overflow-clip border-2 border-focus rounded-2xl"
			class-name="relative flex !w-available min-h-full items-end justify-start gap-4 self-stretch overflow-clip transition-opacity duration-700 bg-surface-1 h-full"
			loading="eager"
			priority="high"
		/>

		<header class="relative z-10 flex flex-col gap-4 p-4 rounded-3xl">
			<div class="flex items-end justify-between gap-4 w-full">
				<TMDBImage
					v-if="homeItem?.logo"
					:path="homeItem?.logo"
					:title="homeItem?.title"
					:width="500"
					class="h-screen max-h-40 max-w-md mr-4 translate-y-[5%]"
					class-name="h-auto w-auto self-start px-4 py-4"
					loading="eager"
					type="logo"
				/>

				<p
					v-else
					class="h-screen max-h-40 flex-grow content-end text-5xl font-bold mb-4"
				>
					{{ homeItem?.title }}
				</p>

				<HomeCardActions
					:data="homeItem"
					:end-time="endTime"
					:has-watched="hasWatched"
					:link="homeItem?.link ?? ''"
					:on-toggle-watched="toggleWatched"
				/>
			</div>

			<p class="max-w-4xl text-lg font-medium line-clamp-4">
				{{ homeItem?.overview }}
			</p>
		</header>
	</article>

	<!-- Mobile Version -->
	<article
		v-else
		class="flex w-full p-6 pb-0 -mb-6"
	>
		<div
			class="relative flex h-auto w-full flex-col justify-end overflow-hidden rounded-lg bg-cover bg-center aspect-poster bg-focus before:content-[''] before:absolute before:inset-0 before:z-[1] before:pt-10 before:bg-gradient-to-b before:from-[#0d0402]/0 before:to-[#0d0402]/60"
			style="box-shadow: 0 8px 24px 0 rgba(0, 0, 0, 0.08)"
		>
			<TMDBImage
				v-if="homeItem"
				:color-palette="homeItem?.color_palette?.poster"
				:path="homeItem?.poster"
				:style="ringPosterColor ? `--color-theme-8: ${ringPosterColor};` : ''"
				:title="homeItem?.title"
				:width="null"
				class="children:!w-available flex overflow-clip border-2 border-focus rounded-lg z-0 absolute inset-0"
				class-name="relative flex h-auto aspect-poster !w-available min-h-full items-end justify-start gap-4 overflow-clip transition-opacity duration-700 bg-surface-50"
				loading="eager"
			/>

			<!-- SVG Shadow Effect -->
			<svg
				class="absolute inset-0 top-auto bottom-0 z-0 h-2/5 w-full blur-xl"
				fill="none"
				preserveAspectRatio="none"
				viewBox="0 0 343 178"
				xmlns="http://www.w3.org/2000/svg"
			>
				<g filter="url(#filter0_bf_5147_33391)">
					<rect
						fill="#1B1B1B"
						fill-opacity="0.2"
						height="177"
						transform="matrix(1 0 0 -1 0 178)"
						width="100%"
					/>
				</g>
				<g filter="url(#filter1_bf_5147_33391)">
					<rect
						fill="#1B1B1B"
						fill-opacity="0.2"
						height="161"
						transform="matrix(1 0 0 -1 0 178)"
						width="100%"
					/>
				</g>
				<g filter="url(#filter2_bf_5147_33391)">
					<rect
						fill="#1B1B1B"
						fill-opacity="0.2"
						height="145"
						transform="matrix(1 0 0 -1 0 178)"
						width="100%"
					/>
				</g>
				<g filter="url(#filter3_bf_5147_33391)">
					<rect
						fill="#1B1B1B"
						fill-opacity="0.2"
						height="129"
						transform="matrix(1 0 0 -1 0 178)"
						width="100%"
					/>
				</g>
				<g filter="url(#filter4_bf_5147_33391)">
					<rect
						fill="#1B1B1B"
						fill-opacity="0.2"
						height="113"
						transform="matrix(1 0 0 -1 0 178)"
						width="100%"
					/>
				</g>
				<g filter="url(#filter5_bf_5147_33391)">
					<rect
						fill="#1B1B1B"
						fill-opacity="0.2"
						height="97"
						transform="matrix(1 0 0 -1 0 178)"
						width="100%"
					/>
				</g>
				<defs>
					<filter
						id="filter0_bf_5147_33391"
						color-interpolation-filters="sRGB"
						filterUnits="userSpaceOnUse"
						height="179"
						width="100%"
						x="-1"
						y="0"
					>
						<feFlood flood-opacity="0" result="BackgroundImageFix" />
						<feGaussianBlur
							in="BackgroundImageFix"
							stdDeviation="0.5"
						/>
						<feComposite
							in2="SourceAlpha"
							operator="in"
							result="effect1_backgroundBlur_5147_33391"
						/>
						<feBlend
							in="SourceGraphic"
							in2="effect1_backgroundBlur_5147_33391"
							mode="normal"
							result="shape"
						/>
						<feGaussianBlur
							result="effect2_foregroundBlur_5147_33391"
							stdDeviation="0.5"
						/>
					</filter>
					<filter
						id="filter1_bf_5147_33391"
						color-interpolation-filters="sRGB"
						filterUnits="userSpaceOnUse"
						height="165"
						width="100%"
						x="-2"
						y="15"
					>
						<feFlood flood-opacity="0" result="BackgroundImageFix" />
						<feGaussianBlur
							in="BackgroundImageFix"
							stdDeviation="1"
						/>
						<feComposite
							in2="SourceAlpha"
							operator="in"
							result="effect1_backgroundBlur_5147_33391"
						/>
						<feBlend
							in="SourceGraphic"
							in2="effect1_backgroundBlur_5147_33391"
							mode="normal"
							result="shape"
						/>
						<feGaussianBlur
							result="effect2_foregroundBlur_5147_33391"
							stdDeviation="1"
						/>
					</filter>
					<filter
						id="filter2_bf_5147_33391"
						color-interpolation-filters="sRGB"
						filterUnits="userSpaceOnUse"
						height="151"
						width="100%"
						x="-3"
						y="30"
					>
						<feFlood flood-opacity="0" result="BackgroundImageFix" />
						<feGaussianBlur
							in="BackgroundImageFix"
							stdDeviation="1.5"
						/>
						<feComposite
							in2="SourceAlpha"
							operator="in"
							result="effect1_backgroundBlur_5147_33391"
						/>
						<feBlend
							in="SourceGraphic"
							in2="effect1_backgroundBlur_5147_33391"
							mode="normal"
							result="shape"
						/>
						<feGaussianBlur
							result="effect2_foregroundBlur_5147_33391"
							stdDeviation="1.5"
						/>
					</filter>
					<filter
						id="filter3_bf_5147_33391"
						color-interpolation-filters="sRGB"
						filterUnits="userSpaceOnUse"
						height="137"
						width="100%"
						x="-4"
						y="45"
					>
						<feFlood flood-opacity="0" result="BackgroundImageFix" />
						<feGaussianBlur
							in="BackgroundImageFix"
							stdDeviation="2"
						/>
						<feComposite
							in2="SourceAlpha"
							operator="in"
							result="effect1_backgroundBlur_5147_33391"
						/>
						<feBlend
							in="SourceGraphic"
							in2="effect1_backgroundBlur_5147_33391"
							mode="normal"
							result="shape"
						/>
						<feGaussianBlur
							result="effect2_foregroundBlur_5147_33391"
							stdDeviation="2"
						/>
					</filter>
					<filter
						id="filter4_bf_5147_33391"
						color-interpolation-filters="sRGB"
						filterUnits="userSpaceOnUse"
						height="123"
						width="100%"
						x="-5"
						y="60"
					>
						<feFlood flood-opacity="0" result="BackgroundImageFix" />
						<feGaussianBlur
							in="BackgroundImageFix"
							stdDeviation="2.5"
						/>
						<feComposite
							in2="SourceAlpha"
							operator="in"
							result="effect1_backgroundBlur_5147_33391"
						/>
						<feBlend
							in="SourceGraphic"
							in2="effect1_backgroundBlur_5147_33391"
							mode="normal"
							result="shape"
						/>
						<feGaussianBlur
							result="effect2_foregroundBlur_5147_33391"
							stdDeviation="2.5"
						/>
					</filter>
					<filter
						id="filter5_bf_5147_33391"
						color-interpolation-filters="sRGB"
						filterUnits="userSpaceOnUse"
						height="109"
						width="100%"
						x="-6"
						y="75"
					>
						<feFlood flood-opacity="0" result="BackgroundImageFix" />
						<feGaussianBlur
							in="BackgroundImageFix"
							stdDeviation="3"
						/>
						<feComposite
							in2="SourceAlpha"
							operator="in"
							result="effect1_backgroundBlur_5147_33391"
						/>
						<feBlend
							in="SourceGraphic"
							in2="effect1_backgroundBlur_5147_33391"
							mode="normal"
							result="shape"
						/>
						<feGaussianBlur
							result="effect2_foregroundBlur_5147_33391"
							stdDeviation="3"
						/>
					</filter>
				</defs>
			</svg>

			<header
				class="relative z-10 flex flex-col items-center gap-3 p-3"
				style="filter: drop-shadow(0px 1px 4px rgba(0, 0, 0, 0.08))"
			>
				<h1 class="w-full text-center text-3xl font-bold">
					{{ breakLogoTitle(homeItem?.title ?? "") }}
				</h1>

				<div class="flex flex-wrap justify-center gap-1 text-center text-sm">
					<p
						v-for="(tag, index) in homeItem?.tags?.slice(0, 4) ?? []"
						:key="tag"
						class="whitespace-nowrap"
					>
						{{ tag.toTitleCase() }}{{ index < 3 ? ", " : "" }}
					</p>
				</div>
			</header>

			<HomeCardActions
				:data="homeItem"
				:link="homeItem?.link ?? ''"
				:is-mobile="true"
				class="relative z-10 p-6"
			/>
		</div>
	</article>
</template>
