<script lang="ts" setup>
import type { PropType } from 'vue';
import { useTranslation } from 'i18next-vue';
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

const { t } = useTranslation();
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
		max-width="max-w-xl"
		:params="{ folder: props.name }"
		title="Delete folder {{folder}}"
	>
		<div class="my-6 text-sm text-auto-10">
			{{ t("Are you sure you want to delete this folder?") }}
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
				{{ t("Delete") }}
			</Button>
			<Button
				id="no"
				:on-click="close"
				type="button"
				color="text-auto-alpha-11"
				variant="text"
			>
				{{ t("Cancel") }}
			</Button>
		</template>
	</Modal>
</template>
