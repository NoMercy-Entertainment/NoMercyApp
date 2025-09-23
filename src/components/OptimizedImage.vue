<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { useIntersectionObserver } from '@vueuse/core';

interface Props {
	src: string;
	alt?: string;
	placeholder?: string;
	loading?: 'lazy' | 'eager';
	sizes?: string;
	srcset?: string;
	width?: number;
	height?: number;
	quality?: number;
	format?: 'webp' | 'avif' | 'auto';
	class?: string;
	objectFit?: 'cover' | 'contain' | 'fill' | 'scale-down' | 'none';
}

const props = withDefaults(defineProps<Props>(), {
	alt: '',
	loading: 'lazy',
	quality: 85,
	format: 'auto',
	objectFit: 'cover',
});

const emit = defineEmits<{
	load: [event: Event];
	error: [event: Event];
}>();

const imgRef = ref<HTMLImageElement>();
const isLoaded = ref(false);
const hasError = ref(false);
const isVisible = ref(props.loading === 'eager');

// Intersection observer for lazy loading
const { stop } = useIntersectionObserver(
	imgRef,
	([{ isIntersecting }]) => {
		if (isIntersecting && !isVisible.value) {
			isVisible.value = true;
			stop();
		}
	},
	{
		threshold: 0.1,
		rootMargin: '50px',
	},
);

// Generate optimized image URLs
const optimizedSrc = computed(() => {
	if (!props.src)
		return '';

	// If it's already a NoMercy CDN URL with optimization
	if (props.src.includes('nomercy.tv') && props.src.includes('/images/')) {
		const url = new URL(props.src);
		const params = new URLSearchParams();

		if (props.width)
			params.set('w', props.width.toString());
		if (props.height)
			params.set('h', props.height.toString());
		if (props.quality)
			params.set('q', props.quality.toString());
		if (props.format !== 'auto')
			params.set('f', props.format);

		return `${url.origin}${url.pathname}?${params.toString()}`;
	}

	return props.src;
});

const optimizedSrcSet = computed(() => {
	if (!props.src || !props.width)
		return props.srcset;

	const densities = [1, 1.5, 2, 3];
	const srcSetEntries = densities.map((density) => {
		const width = Math.round(props.width! * density);
		const url = optimizedSrc.value.replace(/[?&]w=\d+/, `&w=${width}`);
		return `${url} ${density}x`;
	});

	return srcSetEntries.join(', ');
});

function handleLoad(event: Event) {
	isLoaded.value = true;
	emit('load', event);
}

function handleError(event: Event) {
	hasError.value = true;
	emit('error', event);
}

// Preload critical images
onMounted(() => {
	if (props.loading === 'eager' && optimizedSrc.value) {
		const link = document.createElement('link');
		link.rel = 'preload';
		link.as = 'image';
		link.href = optimizedSrc.value;
		if (optimizedSrcSet.value) {
			link.setAttribute('imagesrcset', optimizedSrcSet.value);
		}
		document.head.appendChild(link);
	}
});
</script>

<template>
	<div :class="props.class" class="optimized-image-container">
		<!-- Loading placeholder -->
		<div
			v-if="!isLoaded && !hasError && isVisible"
			:style="{
				aspectRatio: width && height ? `${width}/${height}` : undefined,
			}"
			class="image-placeholder animate-pulse bg-surface-200 dark:bg-surface-700"
		>
			<div v-if="placeholder" class="placeholder-content">
				{{ placeholder }}
			</div>
		</div>

		<!-- Actual image -->
		<img
			v-show="isLoaded && !hasError"
			ref="imgRef"
			:alt="alt"
			:height="height"
			:loading="loading"
			:sizes="sizes"
			:src="isVisible ? optimizedSrc : undefined"
			:srcset="isVisible ? optimizedSrcSet : undefined"
			:style="{ objectFit }"
			:width="width"
			class="optimized-image"
			decoding="async"
			@error="handleError"
			@load="handleLoad"
		>

		<!-- Error fallback -->
		<div
			v-if="hasError"
			:style="{
				aspectRatio: width && height ? `${width}/${height}` : undefined,
			}"
			class="image-error flex items-center justify-center bg-surface-1 text-slate-11"
		>
			<svg
				class="w-8 h-8"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
				/>
			</svg>
		</div>
	</div>
</template>

<style scoped>
.optimized-image-container {
	position: relative;
	overflow: hidden;
}

.optimized-image,
.image-placeholder,
.image-error {
	width: 100%;
	height: 100%;
}

.optimized-image {
	transition: opacity 0.3s ease;
}

.placeholder-content {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100%;
	font-size: 0.875rem;
	color: rgb(107 114 128);
}
</style>
