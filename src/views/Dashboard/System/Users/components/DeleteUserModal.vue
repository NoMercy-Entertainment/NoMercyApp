<script lang="ts" setup>
import type { PropType } from 'vue';
import { ref } from 'vue';
import { useTranslation } from 'i18next-vue';

import { useQueryClient } from '@tanstack/vue-query';

import apiClient from '@/lib/clients/apiClient';
import { currentServer } from '@/store/currentServer';

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

const errorBucket = ref<
	{
		type: string;
		place: string;
		message: string;
	}[]
>([]);

function handleDelete() {
	if (!props.id) {
		errorBucket.value.push({
			type: 'error',
			place: 'email',
			message: t('Email is required'),
		});
		return;
	}

	apiClient()
		.post('server/server-users', {
			_method: 'delete',
			id: currentServer.value?.id,
			user_id: props.id,
		})
		.then(() => {
			query.invalidateQueries({ queryKey: ['users'] }).then(() => {
				history.back();
			});
		});

	props.close();
}
</script>

<template>
	<Modal
		:close="close"
		:open="open"
		:params="{ name }"
		title="Delete server member {{name}}"
	>
		<p class="my-6 text-sm text-surface-10">
			{{ $t("Are you sure you want to delete this server member?") }}<br>
			{{
				$t(
					"They won't be able to access your content anymore until you re-invite them",
				)
			}}.
		</p>

		<template #actions>
			<Button
				id="yes"
				color="red"
				end-icon="userRemove"
				type="button"
				variant="contained"
				@click="handleDelete"
			>
				{{ $t("Yes") }}
			</Button>
			<Button id="no" color="white" type="button" variant="text" @click="close">
				{{ $t("Cancel") }}
			</Button>
		</template>
	</Modal>
</template>
