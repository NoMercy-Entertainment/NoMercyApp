<script lang="ts" setup>
import type { PropType } from 'vue';
import { useTranslation } from 'i18next-vue';

import { useQueryClient } from '@tanstack/vue-query';

import serverClient from '@/lib/clients/serverClient';

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

function handleDelete() {
	serverClient()
		.delete(`dashboard/encoderprofiles/${props.id}`)
		.then(({ data }) => {
			// showNotification({
			// 	title: translate(data.message, ...data.args ?? []),
			// 	type: data.status === 'ok'
			// 		? TYPE.SUCCESS
			// 		: TYPE.ERROR,
			// 	visibleOnly: true,
			// 	duration: 2000,
			// });
			query.invalidateQueries({ queryKey: ['dashboard', 'encoderProfiles'] });

			if (props.noRedirect)
				return;
			window.history.back();
		});

	props.close();
}
</script>

<template>
	<Modal
		:close="close"
		:open="open"
		max-width="max-w-xl"
		:params="{ profile: props.name }"
		title="Delete encoder profile {{profile}}"
	>
		<div class="my-6 text-sm text-auto-10">
			{{ t("Are you sure you want to delete this encoder profile?") }}
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
