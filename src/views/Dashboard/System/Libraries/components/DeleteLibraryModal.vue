<script lang="ts" setup>
import type { PropType } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useQueryClient } from '@tanstack/vue-query';

import type { StatusResponse } from '@/types/api/base/library';

import serverClient from '@/lib/clients/serverClient';
import { translate } from '@/lib/stringArray.ts';

import Modal from '@/components/Modal.vue';
import Button from '@/components/Button.vue';
import router from '@/router';

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

			if (props.noRedirect)
				return;
			router.back();
		});

	props.close();
}
</script>

<template>
	<Modal
		:close="close"
		:open="open"
		max-width="max-w-xl"
		:params="{ library: props.name }"
		title="Delete library {{library}}"
	>
		<div class="my-6 text-sm text-auto-10">
			{{ $t("Are you sure you want to delete this library?") }}
		</div>

		<template #actions>
			<Button
				id="yes"
				:onclick="handleDelete"
				end-icon="trash"
				color="red"
				type="button"
				variant="contained"
			>
				{{ $t("Delete") }}
			</Button>
			<Button
				id="no"
				:onclick="close"
				type="button"
				color="auto-alpha"
				variant="text"
			>
				{{ $t("Cancel") }}
			</Button>
		</template>
	</Modal>
</template>
