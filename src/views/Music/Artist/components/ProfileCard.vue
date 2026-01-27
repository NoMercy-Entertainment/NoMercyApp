<script lang="ts" setup>
import type { PropType } from 'vue';
import { onMounted, onUnmounted } from 'vue';

import type { ArtistResponse } from '@/types/api/music/artist';

import CoverImage from '@/components/MusicPlayer/components/CoverImage.vue';
import { setBackground, setColorPalette } from '@/store/ui';
import { limitSentenceByCharacters } from '@/lib/stringArray.ts';
import type { ModalData } from '@/types';

const props = defineProps({
	data: {
		type: Object as PropType<ArtistResponse>,
		required: true,
	},
});

onMounted(() => {
	if (props.data?.color_palette) {
		setColorPalette(props.data?.color_palette?.cover);
	}
});

onUnmounted(() => {
	setColorPalette(null);
	setBackground(null);
});

function openEdit() {
	const evt = new CustomEvent('showModal', {
		detail: {
			modalName: 'createPlaylist',
			modalTitle: 'Edit {{name}}',
			modalTitleArgs: {
				name: props.data?.name,
			},
			modalProps: props.data,
		} satisfies ModalData<ArtistResponse | undefined>,
	});
	document.dispatchEvent(evt);
}
</script>

<template>
	<div class="flex w-full flex-col items-start justify-start gap-4">
		<div
			class="flex flex-col items-start justify-start self-stretch overflow-clip rounded-lg relative group/cover"
			@click="openEdit"
		>
			<CoverImage
				:data="data"
				:size="500"
				class="aspect-square h-auto w-full"
			/>
			<div v-if="data?.type !== 'track'" class="absolute grid inset-0 bg-black/40 w-full items-center justify-center flex-col opacity-0 group-hover/cover:opacity-100 transition-all duration-100">
				<span class="p-4 font-semibold text-theme-8 text-lg">
					{{ $t('Change cover') }}
				</span>
			</div>
		</div>
		<div
			class="w-full whitespace-pre-line font-semibold leading-normal"
		>
			{{
				data.disambiguation || data.description
					? limitSentenceByCharacters(data.description ?? data.disambiguation!, 200)
					: ""
			}}
		</div>
	</div>
</template>
