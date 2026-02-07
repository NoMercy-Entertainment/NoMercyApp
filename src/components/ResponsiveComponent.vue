<script setup lang="ts">
import type { Component } from 'vue';
import { computed, defineAsyncComponent } from 'vue';
import { useResponsiveComponent } from '@/composables/useResponsiveComponent';

interface Props {
	basePath: string;
	fallback?: Component;
	loading?: Component;
	error?: Component;
}

const props = defineProps<Props>();

const { currentLayout } = useResponsiveComponent();

const currentComponent = computed(() => {
	const layout = currentLayout.value;
	const capitalizedLayout = layout.charAt(0).toUpperCase() + layout.slice(1);

	return defineAsyncComponent({
		loader: () =>
			import(`${props.basePath}/${capitalizedLayout}.vue`).catch(() => {
				// Fallback to Desktop if the specific layout doesn't exist
				if (layout !== 'desktop') {
					return import(`${props.basePath}/Desktop.vue`);
				}
				throw new Error(
					`Component not found: ${props.basePath}/${capitalizedLayout}.vue`,
				);
			}),
		loadingComponent: props.loading,
		errorComponent: props.error || (() => import('@/components/EmptyCard.vue')),
		delay: 0,
		timeout: 5000,
	});
});
</script>

<template>
	<component :is="currentComponent" v-bind="$attrs" />
</template>
