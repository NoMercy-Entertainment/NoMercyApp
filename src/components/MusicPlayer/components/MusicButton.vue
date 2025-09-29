<script lang="ts" setup>
import type { PropType } from 'vue';
import { useTranslation } from 'i18next-vue';
import Button from 'primevue/button';

import { musicVisibility } from '@/store/audioPlayer';
import { buttonClasses } from '@/config/global.ts';

defineProps({
	onclick: {
		type: Function as PropType<(e?: MouseEvent) => void>,
		required: true,
	},
	label: {
		type: String,
		required: true,
	},
	noBackground: {
		type: Boolean,
		required: false,
		default: false,
	},
	noTooltip: {
		type: Boolean,
		required: false,
		default: false,
	},
});

const { t } = useTranslation();
</script>

<template>
	<Button
		v-tooltip.top="{
			showDelay: 1500,
			hideDelay: 300,
			value: $t(label),
			disabled: noTooltip,
		}"
		:aria-label="t(label)"
		:class="{
			'!bg-transparent hover:!bg-surface-3/50': noBackground,
			[buttonClasses]: true,
		}"
		:data-state="musicVisibility"
		:onclick="onclick"
		:unstyled="true"
		tabindex="1"
	>
		<slot />
	</Button>
</template>
