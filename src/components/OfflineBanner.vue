<script lang="ts" setup>
import { useOnline } from '@vueuse/core';

const isOnline = useOnline();
</script>

<template>
	<Transition name="offline-banner">
		<div
			v-if="!isOnline"
			class="fixed top-0 left-0 right-0 z-[9999] flex items-center justify-center gap-2 bg-amber-600 px-4 py-1.5 text-sm font-medium text-white shadow-lg"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-4 w-4 shrink-0"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<line x1="1" y1="1" x2="23" y2="23" />
				<path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
				<path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
				<path d="M10.71 5.05A16 16 0 0 1 22.56 9" />
				<path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
				<path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
				<line x1="12" y1="20" x2="12.01" y2="20" />
			</svg>
			{{ $t('You are offline. Some features may be unavailable.') }}
		</div>
	</Transition>
</template>

<style scoped>
.offline-banner-enter-active,
.offline-banner-leave-active {
	transition: transform 0.3s ease, opacity 0.3s ease;
}

.offline-banner-enter-from,
.offline-banner-leave-to {
	transform: translateY(-100%);
	opacity: 0;
}
</style>
