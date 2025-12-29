<script lang="ts" setup>
import { useIsFetching, useIsMutating } from '@tanstack/vue-query';

import { sidebar } from '@/store/sidebar';
import indexer from '@/store/indexer';
import { searchResultLoading } from '@/store/search';

const isFetching = useIsFetching();
const isMutating = useIsMutating();
</script>

<template>
	<div
		id="gradientBorder"
		:class="{
			'sm:ml-[1.35rem]': sidebar === 'hidden',
			'sm:mr-[1.35rem]': !indexer,
			'busy sm:border-4 gradient-border border-transparent':
				isFetching > 0 || isMutating > 0 || searchResultLoading,
			'sm:border-4 border-surface-4 gradient-border':
				isFetching === 0 && isMutating === 0 && !searchResultLoading,
		}"
		class="relative flex flex-1 overflow-clip text-start outline-none transition-all duration-200 h-available w-available scrollbar-none sm:rounded-3xl"
		no-ring
		tabindex="-1"
	>
		<slot />
	</div>
</template>
