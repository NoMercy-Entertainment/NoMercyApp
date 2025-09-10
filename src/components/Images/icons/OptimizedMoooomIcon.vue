<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue';
import type { PropType } from 'vue';
import { twMerge } from 'tailwind-merge';
import type { MoooomIcons } from '@Icons/icons';
import { ExtractedMoooomIcons } from '@Icons/mooooom/index';

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

const iconContent = ref<string>('');
const useSprite = ref<boolean>(false);
const isLoading = ref<boolean>(true);

// Check if the icon is available as an extracted individual file
const isExtractedIcon = computed(() => {
	return Object.prototype.hasOwnProperty.call(ExtractedMoooomIcons, props.icon);
});

// Cache for loaded icons to avoid repeated requests
const iconCache = new Map<string, string>();

async function loadOptimizedIcon(iconName: string): Promise<string> {
	// Check cache first
	if (iconCache.has(iconName)) {
		return iconCache.get(iconName)!;
	}

	try {
		// Try to load the individual optimized SVG file
		const iconModule = await import(
			`/resources/icons/mooooom/${iconName}.svg?import`,
		);
		const svgContent = iconModule.default;

		// Cache the result
		iconCache.set(iconName, svgContent);
		return svgContent;
	}
	catch (error) {
		console.warn(`Failed to load optimized icon: ${iconName}`, error);
		throw error;
	}
}

watchEffect(async () => {
	isLoading.value = true;

	if (isExtractedIcon.value) {
		try {
			// Load the optimized individual icon
			iconContent.value = await loadOptimizedIcon(props.icon);
			useSprite.value = false;
		}
		catch (error) {
			// Fallback to sprite if individual icon fails to load
			console.warn(`Falling back to sprite for icon: ${props.icon}`);
			useSprite.value = true;
		}
	}
	else {
		// Use sprite for non-extracted icons
		useSprite.value = true;
	}

	isLoading.value = false;
});

const classes = computed(() =>
	twMerge(
		'w-6 h-auto aspect-square flex-shrink-0 flex pointer-events-none',
		props.className,
	),
);
</script>

<template>
	<!-- Loading state -->
	<div v-if="isLoading" :class="classes" />

	<!-- Optimized individual SVG -->
	<div v-else-if="!useSprite" :class="classes" v-html="iconContent" />

	<!-- Fallback to sprite -->
	<svg v-else :class="classes">
		<use :xlink:href="`${spriteIcons}#${icon}`" />
	</svg>
</template>
