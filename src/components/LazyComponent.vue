<script setup lang="ts">
import { defineAsyncComponent, ref } from 'vue';
import { useIntersectionObserver } from '@vueuse/core';

interface Props {
	component: () => Promise<any>;
	threshold?: number;
	rootMargin?: string;
	once?: boolean;
	loading?: any;
	error?: any;
	eager?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	threshold: 0.1,
	rootMargin: '50px',
	once: true,
	eager: false,
});

const target = ref<HTMLElement>();
const isVisible = ref(props.eager);
const hasLoaded = ref(false);

const { stop } = useIntersectionObserver(
	target,
	([{ isIntersecting }]) => {
		if (isIntersecting && !hasLoaded.value) {
			isVisible.value = true;
			hasLoaded.value = true;
			if (props.once) {
				stop();
			}
		}
		else if (!props.once) {
			isVisible.value = isIntersecting;
		}
	},
	{
		threshold: props.threshold,
		rootMargin: props.rootMargin,
	},
);

const LazyComponent = defineAsyncComponent({
	loader: props.component,
	loadingComponent: props.loading,
	errorComponent: props.error,
	delay: 0,
	timeout: 10000,
});
</script>

<template>
	<div ref="target" class="lazy-component">
		<component :is="LazyComponent" v-if="isVisible" v-bind="$attrs" />
		<component :is="$slots.placeholder" v-else-if="$slots.placeholder" />
		<div
			v-else
			class="lazy-placeholder min-h-32 bg-slate-100 dark:bg-slate-800 animate-pulse rounded"
		/>
	</div>
</template>

<style scoped>
.lazy-component {
	min-height: 1px;
}
</style>
