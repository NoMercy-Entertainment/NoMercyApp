<script lang="ts" setup>
import { showBackdrops } from '@/store/preferences';

import NoResultImage from '@/components/Images/NoResultImage.vue';
</script>

<template>
	<div
		:class="showBackdrops ? 'aspect-backdrop' : 'aspect-poster'"
		class="group/card flex flex-col h-full items-center overflow-clip relative rounded-lg select-none shadow-[0px_0px_0_1px_rgb(from_var(--color-theme-8,var(--color-theme-6))_r_g_b/70%)] w-full z-0 bg-surface-1/12 flex-grow-0"
	>
		<div class="backdropCard-overlay" />

		<div class="flex h-full w-full items-center justify-center bg-focus/9">
			<NoResultImage :width="100" class="brightness-150" />
		</div>

		<div
			class="absolute bottom-0 left-0 z-0 flex h-12 w-full flex-shrink-0 flex-grow-0 flex-col items-start justify-center px-2 py-1 transition-transform duration-200"
		>
			<div
				class="absolute inset-0 z-0 opacity-100 transition-transform duration-200 bg-surface-1/60"
			/>
			<p
				class="z-10 w-auto flex-shrink-0 flex-grow-0 self-stretch text-xs font-semibold line-clamp-2 leading-[1.2] empty:hidden dark:font-medium text-wrap"
			>
				{{ $t("No items") }}
			</p>
		</div>
	</div>
</template>
