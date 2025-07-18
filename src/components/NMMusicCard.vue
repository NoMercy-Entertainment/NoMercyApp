<script setup lang="ts">
import { computed, type PropType, ref } from 'vue';
import { useTranslation } from 'i18next-vue';

import type { HomeDataItem } from '@/types/api/music';

import { pickPaletteColor } from '@/lib/colorHelper';
import type { ContextMenuItem } from '@/store/contextMenuItems';

import MusicCardImage from '@/components/Cards/MusicCardImage.vue';

const props = defineProps({
	data: {
		type: Object as PropType<HomeDataItem> | undefined,
		required: true,
	},
	context_menu_items: {
		type: Array as PropType<ContextMenuItem[]>,
		required: false,
		default: () => [],
	},
});

const { t } = useTranslation();

const footText = computed(() => {
	let text = '';

	if (props.data.type === 'playlists') {
		text += t('Playlist');
	}
	else if (props.data.type === 'favorites') {
		text += t('Playlist');
	}
	else if (props.data.type === 'albums') {
		text += t('Album');
	}
	else if (props.data.type === 'artists') {
		text += t('Artist');
	}
	else if (props.data.type === 'release_groups') {
		text += t('Release');
	}
	else if (props.data.type === 'genres') {
		text += t('Genre');
	}

	if (props.data?.tracks) {
		text += ` • ${props.data?.tracks} ${
			(props.data?.tracks ?? 0) > 1 ? t('tracks') : t('track')
		}`;
	}
	else {
		text += ` • ${props.data?.year}`;
	}

	return text;
});

const ringColor = ref(
	pickPaletteColor(props.data.color_palette?.cover)
		?.replace('rgb(', '')
		.replace(')', '')
		.replace(/,/gu, ' ') ?? 'var(--color-primary)',
);
</script>

<template>
	<RouterLink
		v-if="data?.link"
		class="relative flex flex-grow flex-col items-center justify-end transition-transform duration-100 group/musicCard active:scale-[98%] w-full"
		:to="data.link"
		:style="`--color-focus: ${ringColor}`"
	>
		<MusicCardImage :data="data" />
		<div
			class="flex flex-shrink-0 flex-grow-0 items-center justify-start self-stretch py-2 pr-2 pl-2 overflow-clip"
		>
			<div
				class="relative flex flex-grow flex-col items-start justify-center text-left w-available overflow-clip"
			>
				<p
					class="h-6 w-full flex-shrink-0 flex-grow-0 self-stretch text-xs font-semibold line-clamp-1"
					:title="data?.name ?? (data as HomeDataItem)?.title"
				>
					{{ data?.name ?? (data as HomeDataItem)?.title }}
				</p>
				<p
					class="h-6 w-full flex-shrink-0 flex-grow-0 self-stretch whitespace-nowrap text-2xs font-medium text-auto-11 line-clamp-1 empty:hidden dark:font-normal"
				>
					{{ footText }}&nbsp;
				</p>
			</div>
		</div>
	</RouterLink>
</template>
