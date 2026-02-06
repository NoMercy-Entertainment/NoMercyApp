<script lang="ts" setup>
import type { PropType } from 'vue';
import { useQueryClient } from '@tanstack/vue-query';

import serverClient from '@/lib/clients/serverClient';

import Modal from '@/components/Modal.vue';
import { translate } from '@/lib/utils/string';
import { useToast } from 'primevue/usetoast';

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
	libraryId: {
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
const toast = useToast();

function handleDelete() {
	serverClient()
		.delete<{
		message: string;
		status: string;
		args: string[];
	}>(`dashboard/libraries/${props.libraryId}/folders/${props.id}`)
		.then(({ data }) => {
			query.invalidateQueries({ queryKey: ['dashboard', 'libraries'] });

			toast.add({
				severity: data.status === 'ok' ? 'success' : 'error',
				summary: translate(data.status === 'ok' ? 'Success' : 'Error'),
				detail: translate(data.message, ...data.args ?? []),
				life: 5000,
			});

			props.close();
		})
		.catch((err) => {
			toast.add({
				severity: 'error',
				summary: translate('Error'),
				detail: err.message,
				life: 5000,
			});

			props.close();
		});
}
</script>

<template>
	<Modal
		:close="close"
		:open="open"
		:params="{ folder: name }"
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
