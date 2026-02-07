<script lang="ts" setup>
import type { PropType } from 'vue';

import type { LibrariesResponse } from '@/types/api/base/library';

import DashboardCard from '@/components/Cards/DashboardCard.vue';
import TMDBImage from '@/components/Images/TMDBImage.vue';

defineProps({
	data: {
		type: Object as PropType<LibrariesResponse>,
		required: true,
	},
});
</script>

<template>
	<DashboardCard
		:line1="data.title"
		:line2="
			data.folder_library && data.folder_library?.length !== 1
				? `${data.folder_library?.length} folders`
				: `${data.folder_library?.length}  folder`
		"
		:route="`/dashboard/libraries/${data.id}`"
	>
		<template #image>
			<div
				class="relative flex aspect-video flex-shrink-0 flex-grow-0 flex-col items-center justify-center self-stretch overflow-clip rounded-lg bg-theme-8"
			>
				<div class="backdropCard-overlay" />
				<TMDBImage v-if="data.image" :path="data.image" aspect="backdrop" class="z-0" />
				<span v-else class="text-xl font-bold text-center">
					{{ data.title }}
				</span>
			</div>
		</template>
	</DashboardCard>
</template>
