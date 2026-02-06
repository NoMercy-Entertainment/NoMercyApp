<script lang="ts" setup>
import type { PropType } from 'vue';
import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useQueryClient } from '@tanstack/vue-query';

import type { StatusResponse } from '@/types/api/base/library';

import serverClient from '@/lib/clients/serverClient';
import { translate } from '@/lib/utils/string';

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
const isDeleting = ref(false);

async function handleDelete() {
	if (isDeleting.value) return;
	isDeleting.value = true;

	try {
		const { data } = await serverClient()
			.delete<StatusResponse<string>>(`dashboard/libraries/${props.id}`);
		toast.add({
			severity: data.status === 'ok' ? 'success' : 'error',
			summary: translate(data.status === 'ok' ? 'Success' : 'Error'),
			detail: translate(data.message, ...data.args ?? []),
			life: 5000,
		});
		query.invalidateQueries({ queryKey: ['dashboard', 'libraries'] });
		props.close();

		if (!props.noRedirect)
			router.back();
	} catch {
		isDeleting.value = false;
	}
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
				:disabled="isDeleting"
				:onclick="handleDelete"
				color="red"
				end-icon="trash"
				type="button"
				variant="contained"
			>
				{{ isDeleting ? $t("Deleting...") : $t("Delete") }}
			</Button>
			<Button
				id="no"
				:disabled="isDeleting"
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
