<script lang="ts" setup>
import { showBackdrops } from '@/store/preferences';
</script>

<template>
	<div class="mt-2 sm:mt-6 mb-2 flex w-auto flex-shrink-0 flex-grow-0 flex-col items-start justify-start gap-2 self-stretch text-left">
		<div class="flex w-available flex-1 flex-col gap-2 pb-1">
			<div class="relative ml-2 flex flex-shrink-0 flex-grow-0 items-center self-stretch">
				<div class="ml-3 my-2 h-7 w-48 animate-pulse rounded bg-surface-5" />
			</div>
			<div class="flex gap-3 py-1 pl-5 overflow-hidden">
				<div
					v-for="i in 8"
					:key="i"
					:class="{
						'aspect-backdrop': showBackdrops,
						'aspect-poster': !showBackdrops,
					}"
					:style="{ minWidth: showBackdrops ? '200px' : '130px' }"
					class="animate-pulse rounded-lg bg-surface-5 flex-shrink-0 w-[13%]"
				/>
			</div>
		</div>
	</div>
</template>
