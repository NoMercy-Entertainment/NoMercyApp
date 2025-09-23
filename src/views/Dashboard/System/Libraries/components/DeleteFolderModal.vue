<script lang="ts" setup>
import type { PropType } from 'vue';
import { useRoute } from 'vue-router';
import { useQueryClient } from '@tanstack/vue-query';

import serverClient from '@/lib/clients/serverClient';

import Modal from '@/components/Modal.vue';

const props = defineProps({
	open: {
		type: Boolean,
		required: true,
	},
	close: {
		type: Function as PropType<() => any>,
		required: true,
	},
	id: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	noRedirect: {
		type: Boolean,
		default: false,
	},
});

const query = useQueryClient();
const route = useRoute();

function handleDelete() {
	serverClient()
		.delete<{
		message: string;
		status: string;
		args: string[];
	}>(`dashboard/libraries/${route.params.id}/folders/${props.id}`)
		.then(({ data }) => {
			query.invalidateQueries({ queryKey: ['dashboard', 'libraries'] });

			// showNotification({
			//     title: translate(data.message, ...data.args),
			//     type: data.status === 'ok'
			//         ? TYPE.SUCCESS
			//         : TYPE.ERROR,
			//     visibleOnly: true,
			//     duration: 2000,
			// });
		});

	props.close();
}
</script>

<template>
	<Modal
		:close="close"
		:open="open"
		:params="{ folder: props.name }"
		max-width="max-w-xl"
		title="Delete folder {{folder}}"
	>
		<div class="my-6 text-sm text-surface-10">
			{{ $t("Are you sure you want to delete this folder?") }}
		</div>

		<template #actions>
			<Button
				id="yes"
				:onclick="handleDelete"
				color="red"
				end-icon="trash"
				type="button"
				variant="contained"
			>
				{{ $t("Delete") }}
			</Button>
			<Button
				id="no"
				:onclick="close"
				color="auto"
				type="button"
				variant="text"
			>
				{{ $t("Cancel") }}
			</Button>
		</template>
	</Modal>
</template>
