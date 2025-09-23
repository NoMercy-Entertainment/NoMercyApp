<script lang="ts" setup>
import type { PropType } from 'vue';
import { ref } from 'vue';

import type { ServerUser } from '@/types/auth';

import DashboardCard from '@/components/Cards/DashboardCard.vue';
import Avatar from '@/components/Images/Avatar.vue';

defineProps({
	data: {
		type: Object as PropType<ServerUser>,
		required: true,
	},
});

const error = ref(false);

function onError(e: Event) {
	console.error(e);
	(e.target as HTMLImageElement).onerror = null;
	error.value = true;
}
</script>

<template>
	<DashboardCard
		:line1="data.name"
		:route="`/dashboard/users/${data.user_id}`"
		line2=""
	>
		<template #image>
			<div
				class="backdropCard relative flex aspect-square h-auto w-full flex-col items-center justify-center overflow-clip rounded-lg bg-black"
			>
				<div class="backdropCard-overlay" />
				<img
					v-if="data.avatar && !error"
					:onerror="onError"
					:src="data.avatar"
					alt=""
					class="w-full h-full object-cover rounded-lg backdropCard-image"
				>
				<Avatar v-else :email="data.email" class="w-full backdropCard-image" />
			</div>
		</template>
	</DashboardCard>
</template>
