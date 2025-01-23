<script lang="ts" setup>
import { PropType } from 'vue';
import { useTranslation } from 'i18next-vue';
import { useQueryClient } from '@tanstack/vue-query';

import serverClient from '@/lib/clients/serverClient';

import Modal from '@/components/Modal.vue';
import Button from '@/components/Button.vue';

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

const handleDelete = () => {
	serverClient()
		.delete(`dashboard/libraries/${props.id}`)
		.then(({ data }) => {

			// showNotification({
			// 	title: translate(data.message, ...data.args ?? []),
			// 	type: data.status == 'ok'
			// 		? TYPE.SUCCESS
			// 		: TYPE.ERROR,
			// 	visibleOnly: true,
			// 	duration: 2000,
			// });
			query.invalidateQueries({ queryKey: ['dashboard', 'libraries'] });

			if (props.noRedirect) return;
			window.history.back();
		});

	props.close();
};

</script>
<template>
	<Modal :close="close" :open="open" maxWidth="max-w-xl" :params="{ library: props.name }"
		:title="`Delete library {{library}}`">

		<div class="my-6 text-sm text-auto-10">
			{{ t('Are you sure you want to delete this library?') }}
		</div>

		<template v-slot:actions>
			<Button id="yes" :onclick="handleDelete" endIcon="trash" color="red" type="button" variant="contained">
				{{ t('Delete') }}
			</button>
			<Button id="no" :onClick="close" type="button" color="text-auto-alpha-11" variant="text">
				{{ t('Cancel') }}
			</button>
		</template>
	</Modal>
</template>
