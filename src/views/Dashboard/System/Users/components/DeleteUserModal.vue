<script lang="ts" setup>
import type { PropType } from 'vue';
import { ref } from 'vue';
import { useTranslation } from 'i18next-vue';

import { useQueryClient } from '@tanstack/vue-query';

import apiClient from '@/lib/clients/apiClient';
import { currentServer } from '@/store/currentServer';
import router from '@/router';

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

const isDeleting = ref(false);
const errorBucket = ref<
	{
		type: string;
		place: string;
		message: string;
	}[]
>([]);

async function handleDelete() {
	if (!props.id) {
		errorBucket.value.push({
			type: 'error',
			place: 'email',
			message: t('Email is required'),
		});
		return;
	}

	if (isDeleting.value) return;
	isDeleting.value = true;

	try {
		await apiClient().post('server/server-users', {
			_method: 'delete',
			id: currentServer.value?.id,
			user_id: props.id,
		});
		await query.invalidateQueries({ queryKey: ['server_users'] });
		props.close();
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
		:params="{ name }"
		style="max-width: 36rem;"
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
				:disabled="isDeleting"
				color="red"
				end-icon="userRemove"
				type="button"
				variant="contained"
				@click="handleDelete"
			>
				{{ isDeleting ? $t("Deleting...") : $t("Yes") }}
			</Button>
			<Button id="no" :disabled="isDeleting" color="white" type="button" variant="text" @click="close">
				{{ $t("Cancel") }}
			</Button>
		</template>
	</Modal>
</template>
