<script lang="ts" setup>
import type { PropType } from 'vue';
import type { EncoderProfile } from '@/types/api/base/library';
import DashboardCard from '@/components/Cards/DashboardCard.vue';

defineProps({
	data: {
		type: Object as PropType<EncoderProfile>,
		required: true,
	},
});
</script>

<template>
	<DashboardCard
		:line1="data.name"
		:route="`/dashboard/encoderprofiles/${data.id}`"
		line2=""
	>
		<template #image>
			<div
				class="relative flex aspect-video flex-shrink-0 flex-grow-0 flex-col items-center justify-center self-stretch overflow-clip rounded-lg bg-theme-8"
			>
				<div class="backdropCard-overlay" />
				<span class="text-xl font-bold">{{ data.name }}</span>
			</div>
		</template>
	</DashboardCard>
</template>
