<script lang="ts" setup>
import type { PropType } from 'vue';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

import type { HomeItem } from '@/types/api/base/home';

import i18next from '@/config/i18next';
import { isMobile } from '@/config/global';
import { pickPaletteColor } from '@/lib/colorHelper';

import TMDBImage from '@/components/Images/TMDBImage.vue';
import HomeCardActions from '@/components/Cards/HomeCardActions.vue';
import { scrollContainerElement, setBackground, setColorPalette, title } from '@/store/ui';
import CardShadow from '@/components/Cards/CardShadow.vue';
import { breakLogoTitle, breakTitle2 } from '@/lib/utils/string';

const props = defineProps({
	data: {
		type: Object as PropType<HomeItem> | undefined,
		required: false,
	},
});

const hasWatched = ref(false);

const endTime = computed(() => {
	return (
		props.data?.duration
		&& new Date(
			new Date().getTime() + props.data?.duration * 60 * 1000,
		).toLocaleTimeString(i18next.language, {
			hour: '2-digit',
			minute: '2-digit',
		})
	);
});

const ringPosterColor = computed(
	() =>
		pickPaletteColor(props.data?.color_palette?.poster)
			.replace(/,/gu, ' ') ?? 'var(--color-primary)',
);

const ringBackdropColor = computed(
	() =>
		pickPaletteColor(props.data?.color_palette?.backdrop)
			?.replace(/,/gu, ' ') ?? 'var(--color-primary)',
);

function toggleWatched() {
	// Toggle watched logic
}

onMounted(() => {
	if (props.data?.color_palette) {
		setColorPalette(props.data?.color_palette?.backdrop);
	}
});

onBeforeUnmount(() => {
	setColorPalette(null);
	setBackground(null);
});

function scrollToTop() {
	scrollContainerElement.value?.scrollTo({
		top: 0,
		behavior: 'smooth',
	});
}
</script>

<template>
	<!-- Desktop Version -->
	<article
		v-if="!isMobile"
		class="card scheme-dark relative m-4 pb-0 mb-0 flex flex-col justify-end gap-4 rounded-md bg-black/50 p-4 min-h-[65vh] overflow-clip text-surface-12 before:content-[''] before:pointer-events-none before:absolute before:inset-0 before:z-0 before:mt-auto before:h-4/5 before:bg-gradient-to-t before:from-black before:via-black/60 before:bottom-0"
		data-scroll
		style="contain: layout style paint;"
	>
		<TMDBImage
			v-if="data"
			:color-palette="data?.color_palette?.backdrop"
			:path="data?.backdrop"
			:style="`--color-theme-8: ${ringBackdropColor};`"
			:title="data?.title"
			:width="null"
			aspect="backdrop"
			class="!absolute !inset-0 children:!w-available flex overflow-clip border-2 border-focus rounded-md items-start justify-start"
			class-name="relative flex w-available items-end justify-start gap-4 self-stretch overflow-clip transition-opacity duration-700 bg-surface-1"
			loading="eager"
			priority="high"
		/>

		<header class="z-10 flex flex-col gap-4 p-4">
			<div
				class="pointer-events-none absolute inset-0 z-0 mt-auto h-4/5 bg-gradient-to-t from-black via-black/60 bottom-0"
			/>

			<div class="flex items-end justify-between gap-4 w-full">
				<TMDBImage
					v-if="data?.logo"
					:color-palette="data?.color_palette?.backdrop"
					:left="true"
					:path="data?.logo"
					:title="data?.title"
					:width="500"
					class="h-screen max-h-40 max-w-md ml-0 mr-4 translate-y-[5%]"
					class-name="px-4 py-4"
					loading="eager"
					type="logo"
				/>

				<p
					v-else
					class="h-screen max-h-40 flex-grow content-end text-5xl font-bold z-10"
					v-html="breakTitle2(data?.title || title || '', 'text-3xl line-clamp-2')"
				/>

				<HomeCardActions
					:data="data"
					:end-time="endTime"
					:has-watched="hasWatched"
					:link="data?.link ?? ''"
					:on-focus="scrollToTop"
					:on-toggle-watched="toggleWatched"
				/>
			</div>

			<p class="max-w-4xl text-lg font-medium line-clamp-4 leading-8 mt-4 z-10">
				{{ data?.overview }}
			</p>
		</header>
	</article>

	<!-- Mobile Version -->
	<article
		v-else
		class="flex w-full px-[18px] pt-4 pb-0"
		style="contain: layout style paint;"
	>
		<div
			:style="`--color-theme-8: ${ringPosterColor};`"
			class="frosting relative flex h-auto w-full flex-col justify-end overflow-hidden rounded-xl bg-cover bg-center aspect-poster bg-focus max-h-[75vh]"
			style="box-shadow: 0 8px 24px 0 rgba(0, 0, 0, 0.08)"
		>
			<TMDBImage
				v-if="data"
				:color-palette="data?.color_palette?.poster"
				:path="data?.poster"
				:title="data?.title"
				:width="null"
				class="children:!w-available flex overflow-clip border-2 border-focus rounded-xl z-0 absolute inset-0"
				class-name="relative flex h-auto aspect-poster !w-available min-h-full items-end justify-start gap-4 overflow-clip transition-opacity duration-700 bg-surface-50 max-h-available"
				loading="eager"
			/>

			<CardShadow class-name="top-auto bottom-0 w-full" colored />

			<div class="relative z-10 flex flex-col items-center gap-4 p-6">
				<h1 class="w-full text-center text-2xl font-bold">
					{{ breakLogoTitle(data?.title ?? "") }}
				</h1>

				<HomeCardActions
					:data="data"
					:is-mobile="true"
					:link="data?.link ?? ''"
					class="w-full"
				/>
			</div>
		</div>
	</article>
</template>
