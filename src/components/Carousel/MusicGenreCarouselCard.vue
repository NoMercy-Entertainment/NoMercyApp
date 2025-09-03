<script setup lang="ts">
import type { PropType } from 'vue';
import { ref } from 'vue';

import { pickPaletteColor } from '@/lib/colorHelper';
import type { GenreItem } from '@/types/api/music/genres';
import PlayerIcon from '@/components/Images/icons/PlayerIcon.vue';

const props = defineProps({
	data: {
		type: Object as PropType<GenreItem> | undefined,
		required: true,
	},
	index: {
		type: Number,
		required: true,
	},
});

const ringColor = ref(
	pickPaletteColor(props.data?.color_palette?.poster)
		?.replace('rgb(', '')
		.replace(')', '')
		.replace(/,/gu, ' ') ?? 'var(--color-primary)',
);
</script>

<template>
	<RouterLink
		v-if="data"
		:id="data?.id"
		class="pointer-events-auto relative mr-2 w-full transition-all duration-200 group trickle-div changing focus-outline-child"
		:to="data?.link"
		data-card="true"
		:style="`--color-focus: ${ringColor};`"
		:data-scroll="`scroll_${data?.name?.[0]?.toUpperCase()}`"
		data-target="navigate"
	>
		<div
			class="relative flex h-full flex-col overflow-clip rounded-lg bg-frame shadow-card transitioning group-hover:bg-auto-200"
		>
			<div
				class="pointer-events-none absolute inset-0 z-10 aspect-square h-auto w-full rounded-lg shadow-top"
			/>
			<div class="relative z-0 aspect-square h-auto w-full overflow-hidden">
				<!-- <CoverImage :data="data"
                    :colorPalette="data?.color_palette"
                    class="h-full overflow-clip children:overflow-clip rounded-t-lg children:rounded-t-lg"
                    type="image" /> -->

				<div
					class="absolute top-0 flex items-center justify-center w-full h-auto aspect-square !text-white p-10 bg-black/30"
					:style="{
						'--c-1': 'rgb(var(--color-focus))',
						'--c-2': 'rgb(var(--color-focus) / 3%)',
						'--c-3': 'rgb(var(--color-focus) / 14%)',
						'--c-4': 'rgb(var(--color-focus) / 1%)',

						'backgroundImage': `
                            radial-gradient(
                                farthest-corner at top left,
                                    var(--c-1),
                                    hsl(0 0% 100% / 4%) 300px
                                ),
                                radial-gradient(
                                    farthest-corner at top right,
                                    var(--c-2),
                                    hsl(0 0% 100% / 4%) 300px
                                ),
                                radial-gradient(
                                    farthest-corner at bottom left,
                                    var(--c-3),
                                    hsl(0 0% 100% / 4%)
                                ),
                                radial-gradient(
                                    farthest-corner at bottom right,
                                    var(--c-4),
                                hsl(0 0% 100% / 4%) 300px
                            )
                        `,
					}"
				>
					<!--                    <PianoOutlined v-if="index % 7 === 0" -->
					<!--                                   class="stroke-2" /> -->
					<!--                    <CelebrationOutlined v-if="index % 7 === 1" -->
					<!--                                         class="stroke-2" /> -->
					<!--                    <AttractionsOutlined v-if="index % 7 === 2" -->
					<!--                                         class="stroke-2" /> -->
					<!--                    <WbSunnyOutlined v-if="index % 7 === 3" -->
					<!--                                     class="stroke-2" /> -->
					<!--                    <PoolOutlined v-if="index % 7 === 4" -->
					<!--                                  class="stroke-2" /> -->
					<!--                    <HeartBrokenOutlined v-if="index % 7 === 5" -->
					<!--                                         class="stroke-2" /> -->
					<!--                    <FavoriteBorderOutlined v-if="index % 7 === 6" -->
					<!--                                            class="stroke-2" /> -->
				</div>

				<div
					class="absolute right-2 bottom-2 z-30 flex h-12 w-12 origin-center cursor-pointer items-center justify-center rounded-full border-none opacity-0 outline-transparent transitioning p-1.5 bg-theme-500 group-hover:opacity-100 hover:scale-110"
					data-target="play"
				>
					<PlayerIcon icon="nmPlay" class="h-14 w-14" />
				</div>
			</div>
			<div class="flex flex-col justify-evenly gap-2 px-4 py-2 min-h-[60px]">
				<div
					class="relative z-10 inline-block max-w-full overflow-clip text-ellipsis whitespace-nowrap align-middle text-sm font-bold"
				>
					{{ $t(data?.name) }}
				</div>
				<div
					v-if="data?.musicGenre_track"
					class="overflow-hidden text-ellipsis whitespace-nowrap font-semibold line-clamp-2 text-2xs"
				>
					{{ data?.musicGenre_track.length }}
					{{ data.musicGenre_track.length > 1 ? t("Tracks") : t("Track") }}
          &nbsp;
				</div>
			</div>
		</div>
	</RouterLink>
</template>
