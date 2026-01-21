<script lang="ts" setup>
import type { PropType } from 'vue';
import { computed, ref } from 'vue';
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
	className: {
		type: String,
		required: false,
		default: '',
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

	// if (props.data.type === 'playlist') {
	// 	text += t('Playlist');
	// }
	// else if (props.data.type === 'favorite') {
	// 	text += t('Playlist');
	// }
	// else if (props.data.type === 'album') {
	// 	text += t('Album');
	// }
	// else if (props.data.type === 'artist') {
	// 	text += t('Artist');
	// }
	// else if (props.data.type === 'release_group') {
	// 	text += t('Release');
	// }
	// else if (props.data.type === 'genre') {
	// 	text += t('Genre');
	// }

	// text += ' • ';

	if (props.data?.tracks != null) {
		text += `${props.data?.tracks} ${
			(props.data?.tracks ?? 0) === 1 ? t('track') : t('tracks')
		}`;
	}

	if (props.data?.year != null) {
		text += `${props.data?.year}`;
	}

	return text;
});

const ringColor = ref(pickPaletteColor(props.data.color_palette?.cover));
</script>

<template>
	<RouterLink
		v-if="data?.link"
		:style="ringColor ? `--ring-color: ${ringColor}` : ''"
		:to="data.link"
		class="relative flex flex-grow flex-col items-center justify-end transition-transform duration-100 group/musicCard active:scale-[98%] w-full text-surface-12"
	>
		<MusicCardImage :data="data" />
		<div
			class="flex flex-shrink-0 flex-grow-0 items-center justify-start self-stretch py-2 pr-2 pl-2 overflow-clip"
		>
			<div
				class="relative flex flex-grow flex-col items-start justify-center text-left w-available overflow-clip"
			>
				<p
					:title="data?.name ?? (data as HomeDataItem)?.title"
					class="h-6 w-full flex-shrink-0 flex-grow-0 self-stretch text-xs font-semibold line-clamp-1"
				>
					{{ data?.name ?? (data as HomeDataItem)?.title }}
				</p>
				<p
					class="h-6 w-full flex-shrink-0 flex-grow-0 self-stretch whitespace-nowrap text-2xs font-medium text-surface-12/11 line-clamp-1 empty:hidden dark:font-normal"
				>
					{{ footText }}&nbsp;
				</p>
			</div>
		</div>
	</RouterLink>
</template>
