<script setup lang="ts">
import { computed } from 'vue';
import type { PropType } from 'vue';
import { twMerge } from 'tailwind-merge';
import type { MoooomIcons } from '@Icons/icons';

// Import sprite as fallback for non-extracted icons
import spriteIcons from '/resources/mooooom-icons.svg';

const props = defineProps({
	icon: {
		type: String as PropType<keyof typeof MoooomIcons>,
		required: true,
	},
	className: {
		type: String,
		required: false,
		default: '',
	},
});

const classes = computed(() =>
	twMerge(
		'w-6 h-auto aspect-square flex-shrink-0 flex pointer-events-none',
		props.className,
	),
);
</script>

<template>
	<svg :class="classes">
		<use :xlink:href="`${spriteIcons}#${icon}`" />
	</svg>
</template>
