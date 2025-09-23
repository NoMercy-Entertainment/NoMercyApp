<script lang="ts" setup>
import type { PropType } from 'vue';
import { ref, watch } from 'vue';

import type { QueueResponse } from '@/types/api/dashboard/server';
import OptimizedIcon from '@/components/OptimizedIcon.vue';
import serverClient from '@/lib/clients/serverClient';
import { Card } from 'primevue';

const props = defineProps({
	data: {
		type: Object as PropType<QueueResponse>,
		required: true,
	},
});

const priority = ref<number>(props.data.priority ?? 0);

function updatePriority(value: number) {
	serverClient()
		.patch(`/dashboard/tasks/queue/${props.data.id}`, {
			id: props.data.id,
			priority: value,
		})
		.then(() => {
			console.log('Priority updated');
		});
}

function deleteItem() {
	serverClient()
		.delete(`/dashboard/tasks/queue/${props.data.id}`)
		.then(() => {
			console.log('Item deleted');
		});
}

watch(priority, (value) => {
	console.log(value);
	updatePriority(value);
});
</script>

<template>
	<Card>
		<template #title>
			<span class="flex flex-nowrap w-full justify-between">
				<span class="text-surface-12">
					{{ data.title.replace(/NoMercy/giu, "") }}
				</span>
				<button
					class="float-right flex items-center justify-center gap-2 overflow-hidden rounded-lg bg-transparent w-10 -mt-1.5 -mr-1.5 aspect-square"
					@click="deleteItem"
				>
					<OptimizedIcon
						class="relative h-5 w-5 flex-shrink-0 flex-grow-1"
						icon="cross"
					/>
				</button>
			</span>
		</template>
		<template #content>
			<div class="flex flex-col text-surface-12">
				<p class="flex-shrink-0 flex-grow-1 self-stretch text-sm">
					{{ $t("Id") }}:
					<span class="text-surface-12/11">
						{{ data.id }}
					</span>
				</p>
				<span class="flex-shrink-0 flex-grow-1 self-stretch text-sm flex justify-between">
					<span class="mr-auto">
						{{ $t("Priority") }}:
					</span>
					<InputNumber
						v-model="priority"
						:max="100"
						:min="0"
						:step="1"
						class="ml-auto h-8 first:children:!w-12 last:children:!w-4 children:last:children:!w-4 overflow-clip -mb-2"
						show-buttons
						size="small"
						variant="filled"
					/>
				</span>
				<span class="flex-shrink-0 flex-grow-1 self-stretch text-sm">
					{{ $t("Profile") }}:
					<span class="text-surface-12/11">
						{{ data.profile }}
					</span>
				</span>
				<span class="flex-shrink-0 flex-grow-1 self-stretch text-sm">
					{{ $t("File") }}:
					<span class="text-surface-12/11">
						{{ data.input_file }}
					</span>
				</span>
			</div>
		</template>
	</Card>
</template>

<style scoped>
.p-inputnumber .p-inputnumber-button {
	--p-inputnumber-button-width: 1rem;
}
</style>
