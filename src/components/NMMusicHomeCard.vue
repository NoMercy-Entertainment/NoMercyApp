<script lang="ts" setup>
import type { PropType } from 'vue';
import { ref } from 'vue';

import type { HomeDataItem } from '@/types/api/music';

import { pickPaletteColor } from '@/lib/colorHelper';
import MusicCardImage from '@/components/Cards/MusicCardImage.vue';

const props = defineProps({
	title: {
		type: String,
		required: false,
		default: '',
	},
	properties: {
		type: Object as PropType<{ [key: string]: any } | undefined | null>,
		required: false,
	},
	data: {
		type: Object as PropType<HomeDataItem> | undefined | null,
		required: false,
	},
});

const ringColor = ref(
	pickPaletteColor(props.data?.color_palette?.cover)
		// ?.replace('rgb(', '')
		// .replace(')', '')
		.replace(/,/gu, ' ') ?? 'var(--color-primary)',
);

const span = props.properties?.span ?? -1;
</script>

<template>
	<RouterLink
		v-if="data && data?.type !== 'playlists'"
		:style="`
            --color-theme-8: ${ringColor};
            grid-column: span ${span};
            contain: layout style paint;
            will-change: transform;
          `"
		:to="data?.link"
		class="card relative flex flex-grow items-center justify-start gap-4 overflow-clip w-inherit rounded-2xl p-1.5 group/musicCard bg-gradient-to-b from-[#021c37]/[0.08] to-[#05294d]/[0.03] dark:from-[#e2f0fd]/[0.08] dark:to-[#d5feff]/[0.03]"
	>
		<div
			class="flex justify-start items-center w-28 min-w-28 gap-2 rounded-xl bg-[#dfeffe]/[0.14] children:rounded-xl group-hover/musicCard:children:rounded-xl children:children:rounded-md group-hover/musicCard:children:children:rounded-lg"
		>
			<MusicCardImage :data="data" />
		</div>
		<div
			class="relative flex flex-col items-start justify-center gap-2 overflow-clip w-inherit"
		>
			<p class="text-xl font-bold line-clamp-1">
				{{ title }}
			</p>
			<div
				class="relative flex items-center justify-start gap-1 overflow-clip w-available"
			>
				<p class="text-sm font-medium line-clamp-1">
					{{ data?.name }}
				</p>
			</div>
		</div>
	</RouterLink>
	<RouterLink
		v-else-if="data?.type === 'playlists'"
		:style="`--color-theme-8: ${ringColor}; contain: layout style paint; will-change: transform;`"
		:to="data?.link"
		class="relative flex flex-grow items-center justify-start gap-4 overflow-clip rounded-2xl p-1.5 bg-surface-9 dark:bg-surface-4 group/musicCard"
	>
		<div
			class="relative flex w-28 min-w-28 flex-grow-0 items-center justify-start gap-2 rounded-xl flex-shrink-0-0"
		>
			<MusicCardImage :data="data" />
		</div>
		<div
			class="relative flex flex-shrink-0 flex-grow-0 flex-col items-start justify-center gap-2"
		>
			<p
				class="flex-shrink-0 flex-grow-0 text-2xl font-semibold line-clamp-1 overflow-clip w-available"
			>
				{{ $t("Most listened") }}
				{{ data?.type?.replace(/s$/u, "")?.toTitleCase() }}
			</p>
			<div
				class="relative flex flex-shrink-0 flex-grow-0 items-center justify-start gap-1 overflow-clip w-available"
			>
				<p
					class="flex-shrink-0 flex-grow-0 text-base line-clamp-1"
				>
					{{ data?.name }}
				</p>
			</div>
		</div>
	</RouterLink>
</template>
