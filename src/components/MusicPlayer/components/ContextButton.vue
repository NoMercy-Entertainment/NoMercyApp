<script setup lang="ts">
import type { PropType } from 'vue';

import type { PlaylistItem } from '@/types/musicPlayer';

import MusicButton from './MusicButton.vue';
import OptimizedIcon from '@/components/OptimizedIcon.vue';

defineProps({
	data: {
		type: Object as PropType<PlaylistItem>,
		required: true,
	},
	className: {
		type: String as PropType<string>,
		required: false,
	},
	color: {
		type: String as PropType<string>,
		required: false,
	},
});

function handleClick(e?: MouseEvent) {
	e?.stopPropagation();
}
</script>

<template>
	<MusicButton
		label=""
		:onclick="handleClick"
		class="-outline-offset-1 focus:outline focus:outline-1 focus:outline-white"
	>
		<OptimizedIcon icon="menuDotsHorizontal" class="h-5 w-5" />
	</MusicButton>
</template>
