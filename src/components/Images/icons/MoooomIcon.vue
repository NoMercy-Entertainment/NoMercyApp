<script setup lang="ts">
import { computed, type PropType, ref } from 'vue';
import { twMerge } from 'tailwind-merge';
import type { MoooomIcons } from '@Icons/icons';

// Import sprite as fallback
import icons from '/resources/mooooom-icons.svg';

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

// State for optimized loading
const iconContent = ref<string>('');
const useSprite = ref(true);

const classes = computed(() =>
	twMerge(
		'w-6 h-auto aspect-square flex-shrink-0 flex pointer-events-none',
		props.className,
	),
);
</script>

<template>
	<!-- Optimized individual SVG for extracted icons -->
	<div v-if="!useSprite && iconContent" :class="classes" v-html="iconContent" />

	<!-- Fallback to sprite for non-extracted icons -->
	<svg v-else :class="classes">
		<use :xlink:href="`${icons}#${icon}`" />
	</svg>
</template>
