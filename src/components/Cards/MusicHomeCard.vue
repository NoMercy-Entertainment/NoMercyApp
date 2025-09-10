<script setup lang="ts">
import { ref } from 'vue';
import type { PropType } from 'vue';

import type { HomeDataItem } from '@/types/api/music';

import { pickPaletteColor } from '@/lib/colorHelper';

import MusicCardImage from './MusicCardImage.vue';

const props = defineProps({
	data: {
		type: Object as PropType<HomeDataItem>,
		required: true,
	},
});

const ringColor = ref(
	pickPaletteColor(props.data?.color_palette?.cover)
		?.replace('rgb(', '')
		.replace(')', '')
		.replace(/,/gu, ' ') ?? 'var(--color-primary)',
);
</script>

<template>
	<RouterLink
		v-if="data?.type !== 'playlists'"
		:to="data?.link"
		:style="`
            --color-focus: ${ringColor};
          `"
		class="relative flex flex-grow items-center justify-start gap-4 overflow-clip rounded-2xl p-1.5 group/musicCard bg-gradient-to-b from-[#021c37]/[0.08] to-[#05294d]/[0.03] dark:from-[#e2f0fd]/[0.08] dark:to-[#d5feff]/[0.03]"
	>
		<div
			class="flex justify-start items-center w-28 gap-2 rounded-xl bg-[#dfeffe]/[0.14] children:rounded-xl group-hover/musicCard:children:rounded-xl children:children:rounded-md group-hover/musicCard:children:children:rounded-lg"
		>
			<MusicCardImage :data="data" />
		</div>
		<div
			class="relative flex flex-shrink-0 flex-grow-0 flex-col items-start justify-center gap-2"
		>
			<p class="flex-shrink-0 flex-grow-0 text-2xl font-bold text-auto-12">
				{{ $t("Most listened") }}
				{{ data?.type?.replace(/s$/u, "")?.toTitleCase() }}
			</p>
			<div
				class="relative flex flex-shrink-0 flex-grow-0 items-center justify-start gap-1"
			>
				<p class="flex-shrink-0 flex-grow-0 text-base font-medium text-auto-12">
					{{ data?.name }}
				</p>
			</div>
		</div>
	</RouterLink>
	<RouterLink
		v-else-if="data?.type === 'playlists'"
		:to="data?.link"
		:style="`--color-focus: ${ringColor}`"
		class="relative flex flex-grow items-center justify-start gap-4 overflow-clip rounded-2xl p-1.5 bg-slate-light-9 dark:bg-slate-dark-4 group/musicCard"
	>
		<div
			class="relative flex w-28 flex-grow-0 items-center justify-start gap-2 rounded-xl flex-shrink-0-0"
		>
			<MusicCardImage :data="data" />
		</div>
		<div
			class="relative flex flex-shrink-0 flex-grow-0 flex-col items-start justify-center gap-2"
		>
			<p class="flex-shrink-0 flex-grow-0 text-2xl font-semibold text-auto-12">
				{{ $t("Most listened") }}
				{{ data?.type?.replace(/s$/u, "")?.toTitleCase() }}
			</p>
			<div
				class="relative flex flex-shrink-0 flex-grow-0 items-center justify-start gap-1"
			>
				<p class="flex-shrink-0 flex-grow-0 text-base text-auto-12">
					{{ data?.name }}
				</p>
			</div>
		</div>
	</RouterLink>
</template>
