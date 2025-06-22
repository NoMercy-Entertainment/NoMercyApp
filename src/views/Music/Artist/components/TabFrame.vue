<script setup lang="ts">
import type { PropType } from 'vue';

import type { ArtistResponse } from '@/types/api/music/artist';

import ProfileCard from './ProfileCard.vue';
import GenresCard from './GenresCard.vue';
import FeaturedCard from './FeaturedCard.vue';

defineProps({
	data: {
		type: Object as PropType<ArtistResponse>,
		required: true,
	},
	activeTab: {
		type: String,
		required: true,
	},
});
</script>

<template>
	<div
		class="flex flex-row items-start justify-start gap-8 overflow-clip w-available"
	>
		<div
			class="inline-flex flex-col items-start justify-start gap-8 w-[clamp(200px,25%,500px)]"
		>
			<ProfileCard :data="data" />
			<GenresCard v-if="activeTab !== 'About'" :data="data" class="max-w-md" />
			<FeaturedCard v-if="activeTab !== 'About'" :data="data" />
		</div>

		<div
			class="z-0 flex h-min w-0 flex-1 flex-col gap-x-2 gap-y-8 overflow-clip"
			:class="activeTab === 'About' ? 'ml-8 w-[60%]' : ''"
		>
			<slot />
		</div>
	</div>
</template>
