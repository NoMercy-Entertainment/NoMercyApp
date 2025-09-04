<script setup lang="ts">
import type { PropType } from 'vue';
import { computed, ref } from 'vue';
import { useTranslation } from 'i18next-vue';

import type { AxiosError } from 'axios';
import type { ServerLibrary } from '@/types/server';

import apiClient from '@/lib/clients/apiClient';
import useServerClient from '@/lib/clients/useServerClient';
import { currentServer } from '@/store/currentServer';
import { queryClient } from '@/config/tanstack-query';

import Modal from '@/components/Modal.vue';
import Button from '@/components/Button.vue';
import type { Nullable } from 'vitest';

const props = defineProps({
	open: {
		type: Boolean,
		required: true,
	},
	close: {
		type: Function as PropType<() => any>,
		required: true,
	},
});

const { t } = useTranslation();

const error = ref(null);
const email = ref<Nullable<string>>('');

const errorBucket = ref<
	{
		type: string;
		place: string;
		message: string;
	}[]
>([]);

const { data: libraries } = useServerClient<ServerLibrary[]>({
	path: '/dashboard/libraries',
});

const allowedLibraries = ref<ServerLibrary[]>();

function closeInviteModal() {
	errorBucket.value = [];
	props.close();
}

function validateEmail(email?: string): boolean {
	const re
    = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/u;
	return re.test(String(email).toLowerCase());
}

function inputChange(field: string) {
	errorBucket.value = errorBucket.value.filter(
		errorBucket => errorBucket.place !== field,
	);
}

const isValidEmail = computed(() => {
	if (!email.value)
		return false;
	return validateEmail(email.value);
});

function handleInvite() {
	if (!email.value) {
		errorBucket.value.push({
			type: 'error',
			place: 'email',
			message: t('Email is required'),
		});
		return;
	}

	if (!validateEmail(email.value)) {
		errorBucket.value.push({
			type: 'error',
			place: 'email',
			message: t('Invalid email address'),
		});
		return;
	}

	apiClient()
		.post('server/server-users', {
			id: currentServer.value?.id,
			email: email.value,
			libraries: allowedLibraries.value?.map(l => l.id),
		})
		.then(() => {
			queryClient.invalidateQueries({ queryKey: ['server_users'] });

			email.value = '';

			props.close();
		})
		.catch(
			({
				response,
			}: AxiosError<{
				status: string;
				message?: string;
				exception?: string;
			}>) => {
				if (response?.status !== 200 && response?.data) {
					errorBucket.value.push({
						message: response.data.message ?? 'An error occurred',
						place: 'email',
						type: response.data.status ?? response.data.exception,
					});
				}
			},
		);
}
</script>

<template>
	<Modal :open="open" :close="closeInviteModal" title="Invite user">
		<div class="flex w-full flex-col justify-start text-left">
			<p class="py-4 text-sm text-auto-10">
				{{
					$t(
						"Enter the email of the friend you want to invite to your server.",
					)
				}}<br>
				{{
					$t(
						"We will send this person an email with a link to join the server, if they accept the invitation they will be automatically shown here.",
					)
				}}
			</p>

			<div class="flex flex-col gap-2 w-full">
				<label for="email">Email</label>
				<InputText id="email" v-model="email" class="mb-4" />
			</div>

			<div
				class="pointer-events-auto mt-2 w-full flex-col gap-1 card flex justify-center"
			>
				<label for="libraries">Allowed libraries</label>
				<MultiSelect
					id="libraries"
					v-model="allowedLibraries"
					display="chip"
					label="libraries"
					placeholder="Select libraries"
					multiple
					:options="libraries"
					option-label="title"
				/>
			</div>
		</div>

		<template #actions>
			<Button
				id="yes"
				type="button"
				color="theme"
				variant="contained"
				end-icon="emailSend"
				:disabled="!isValidEmail"
				@click="handleInvite"
			>
				{{ $t("Send") }}
			</Button>
			<Button id="no" type="button" variant="text" @click="closeInviteModal">
				{{ $t("Cancel") }}
			</Button>
		</template>
	</Modal>
</template>
