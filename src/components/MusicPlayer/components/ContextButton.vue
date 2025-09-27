<script lang="ts" setup>
import type { PropType } from 'vue';

import type { PlaylistItem } from '@/types/musicPlayer';

import MusicButton from './MusicButton.vue';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';

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
		:onclick="handleClick"
		class="-outline-offset-1 focus:outline focus:outline-1 focus:outline-white"
		label=""
	>
		<MoooomIcon class="h-5 w-5" icon="menuDotsHorizontal" />
	</MusicButton>
</template>
