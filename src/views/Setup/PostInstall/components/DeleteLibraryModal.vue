<script lang="ts" setup>
import type { PropType } from 'vue';
import { useQueryClient } from '@tanstack/vue-query';

import serverClient from '@/lib/clients/serverClient';

import Modal from '@/components/Modal.vue';
import Button from '@/components/Button.vue';
import { useToast } from 'primevue/usetoast';
import { translate } from '@/lib/utils/string';
import type { StatusResponse } from '@/types/api/base/library';

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
const toast = useToast();

function handleDelete() {
	serverClient()
		.delete<StatusResponse<string>>(`dashboard/libraries/${props.id}`)
		.then(({ data }) => {
			toast.add({
				severity: data.status === 'ok' ? 'success' : 'error',
				summary: translate(data.status === 'ok' ? 'Success' : 'Error'),
				detail: translate(data.message, ...data.args ?? []),
				life: 5000,
			});
			query.invalidateQueries({ queryKey: ['dashboard', 'libraries'] });
		});

	props.close();
}
</script>

<template>
	<Modal
		:close="close"
		:open="open"
		:params="{ library: props.name }"
		max-width="max-w-xl"
		title="Delete library {{library}}"
	>
		<div class="my-6 text-sm text-surface-10">
			{{ $t("Are you sure you want to delete this library?") }}
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
