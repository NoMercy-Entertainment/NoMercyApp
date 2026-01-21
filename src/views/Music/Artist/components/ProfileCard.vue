<script lang="ts" setup>
import type { PropType } from 'vue';
import { onMounted, onUnmounted } from 'vue';

import type { ArtistResponse } from '@/types/api/music/artist';

import CoverImage from '@/components/MusicPlayer/components/CoverImage.vue';
import { setBackground, setColorPalette } from '@/store/ui';
import ClickUploadModal from '@/components/ClickUploadModal.vue';
import { limitSentenceByCharacters } from '@/lib/stringArray.ts';

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
</script>

<template>
	<div class="flex w-full flex-col items-start justify-start gap-4">
		<div
			v-if="data.cover"
			class="flex flex-col items-start justify-start self-stretch overflow-clip rounded-lg relative group/cover"
		>
			<ClickUploadModal :data="data" :url="`${data.link}/cover`">
				<template #default="{ data: data2, ref: ref }">
					<CoverImage
						:data="data2"
						:img-ref="ref"
						:size="500"
						class="aspect-square h-auto w-full"
					/>
				</template>
			</ClickUploadModal>
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
