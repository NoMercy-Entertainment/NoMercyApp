<script setup lang="ts">

import {showBackdrops} from '@/store/preferences';

import NoResultImage from '@/components/Images/NoResultImage.vue';

</script>

<template>
    <div
        class="group/card flex flex-col h-full items-center overflow-clip relative rounded-lg select-none shadow-[0px_0px_0_1px_rgb(var(--color-focus,var(--color-theme-6))/70%)] w-full z-0 bg-auto-1/12 flex-grow-0"
        :class="showBackdrops ? 'aspect-backdrop' : 'aspect-poster'"
		>
        <div class="backdropCard-overlay"></div>

				<div class="flex h-full w-full items-center justify-center bg-focus/9">
					<NoResultImage :width="100" class="brightness-150" />
				</div>

        <div
            class="absolute bottom-0 left-0 z-0 flex h-12 w-full flex-shrink-0 flex-grow-0 flex-col items-start justify-center px-2 py-1 transition-transform duration-300">
            <div class="absolute inset-0 z-0 opacity-100 transition-transform duration-300 bg-auto-1/60"></div>
            <p class="z-10 w-auto flex-shrink-0 flex-grow-0 self-stretch text-xs font-semibold line-clamp-2 leading-[1.2] text-auto-12 empty:hidden dark:font-medium">
                {{ $t('No items') }}
            </p>
        </div>
    </div>
</template>
