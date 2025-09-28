<script lang="ts" setup>
import type { PropType } from 'vue';

import type { Genre } from '@/types/api/base/genre';
import type { CollectionGenre } from '@/types/api/base/collection';

import { genreColors } from '@/config/global';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';

defineProps({
	genre: {
		type: Object as PropType<Genre | CollectionGenre>,
		required: true,
	},
});
</script>

<template>
	<RouterLink
		:class="genreColors(genre?.name).iconBg"
		:to="`/genre/${genre?.id}`"
		class="relative flex flex-shrink-0 flex-grow-0 items-center justify-start rounded-2xl px-2 py-0.5 hover:!grayscale-0 bg-theme-5 border-theme-3 border-1 text-surface-12/12 hover:shadow-[0px_0px_0_3px_var(--color-theme-6)]"
	>
		<MoooomIcon
			:icon="genreColors(genre?.name).icon"
			class-name="relative w-5 flex-shrink-0 flex-grow-0 group-hover/card:text-theme-5"
		/>
		<div
			class="relative flex flex-shrink-0 flex-grow-0 items-center justify-start gap-2 px-1"
		>
			<p class="flex-shrink-0 flex-grow-0 text-center text-sm font-medium">
				{{ genre?.name }}
			</p>
		</div>
	</RouterLink>
</template>
