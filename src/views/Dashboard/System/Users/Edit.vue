<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import { useQueryClient } from '@tanstack/vue-query';

import type { ServerLibrary, User } from '@/types/server';

import useServerClient from '@/lib/clients/useServerClient';
import serverClient from '@/lib/clients/serverClient';

import DashboardLayout from '@/Layout/Desktop/DashboardLayout.vue';
import DeleteUserModal from '@/views/Dashboard/System/Users/components/DeleteUserModal.vue';
import Button from '@/components/Button.vue';
import Toggle from '@/components/Forms/Toggle.vue';
import useApiClient from '@/lib/clients/useApiClient';
import type { ServerUser } from '@/types/auth';
import Select from '@/components/Forms/Select.vue';
import { currentServer } from '@/store/currentServer';
import { useToast } from 'primevue/usetoast';
import { translate } from '@/lib/stringArray.ts';
import router from '@/router';

const query = useQueryClient();
const route = useRoute();
const toast = useToast();

const { data: libraries } = useServerClient<ServerLibrary[]>({
	path: '/dashboard/libraries',
});

const { data: serverUsers } = useApiClient<ServerUser[]>({
	path: 'server/server-users',
	params: {
		id: currentServer.value?.id,
	},
	queryKey: ['server_users'],
});

const { data: permissions, error } = useServerClient<User>({
	path: `dashboard/users/${route.params.id}/permissions`,
	queryKey: ['userPermissions', route.params.id],
});

const name = computed(
	() => serverUsers.value?.find(u => u.user_id === route.params.id)?.name,
);

const allowed = ref(permissions.value?.allowed);
const manage = ref(permissions.value?.manage);
const audioTranscoding = ref(permissions.value?.audio_transcoding);
const videoTranscoding = ref(permissions.value?.video_transcoding);
const noTranscoding = ref(permissions.value?.no_transcoding);

const allowedAllLibraries = ref(
	libraries.value?.filter(l => permissions.value?.libraries?.includes(l.id))
		.length === libraries.value?.length,
);
const allowedLibraries = ref(
	libraries.value?.filter(l => permissions.value?.libraries?.includes(l.id)),
);

watch(permissions, (value) => {
	allowed.value = value?.allowed;
	manage.value = value?.manage;
	audioTranscoding.value = value?.audio_transcoding;
	videoTranscoding.value = value?.video_transcoding;
	noTranscoding.value = value?.no_transcoding;

	allowedLibraries.value = libraries.value?.filter(l =>
		value?.libraries?.includes(l.id),
	);
	allowedAllLibraries.value = libraries.value?.filter(l => value?.libraries?.includes(l.id)).length === libraries.value?.length;
});

const deleteConfirmOpen = ref(false);

function openDeleteConfirm() {
	deleteConfirmOpen.value = true;
}

function closeDeleteConfirm() {
	deleteConfirmOpen.value = false;
}

function handleCancel() {
	router.back();
}

function handleSave() {
	serverClient()
		.patch<{ message: string; status: string; args: string[] }>(
			`dashboard/users/${route.params.id}/permissions`,
			{
				allowed: allowed.value,
				manage: manage.value,
				audio_transcoding: audioTranscoding.value,
				video_transcoding: videoTranscoding.value,
				no_transcoding: noTranscoding.value,
				libraries: allowedLibraries.value?.map(l => l.id),
			},
		)
		.then(({ data }) => {
			query.invalidateQueries({
				queryKey: ['userPermissions', route.params.id],
			});

			toast.add({
				severity: data.status === 'ok' ? 'success' : 'error',
				summary: translate(data.status === 'ok' ? 'Success' : 'Error'),
				detail: translate(data.message, ...data.args),
				life: 5000,
			});
			handleCancel();
		});
}

watch(allowedAllLibraries, (value) => {
	if (!value)
		return;
	allowedLibraries.value = libraries.value;
});

watch(allowedLibraries, (value) => {
	if (!libraries.value || !value)
		return;

	// allowedAllLibraries.value = value.length === libraries.value.length;
});
</script>

<template>
	<DashboardLayout
		:back="true"
		:error="error"
		:params="{ name }"
		title="Server member: {{name}}"
	>
		<template #cta />

		<div v-if="permissions" class="mt-4 flex w-full flex-col sm:w-1/2 px-1">
			<h3 class="mt-4 mb-2">
				{{ $t("Base permissions") }}:
			</h3>
			<div class="flex flex-col gap-2">
				<label
					class="pointer-events-auto inline-flex h-10 w-full touch-none items-center group"
					data-selected="true"
					for="allowed"
				>
					<Toggle
						v-if="allowed !== undefined"
						id="allowed"
						v-model="allowed"
						class="mr-2"
						label="Manage"
					/>
					<span class="whitespace-pre-wrap text-sm font-semibold">
						{{ $t("Allow this user to access content") }}
					</span>
				</label>
				<label
					class="pointer-events-auto inline-flex h-10 w-full touch-none items-center group"
					data-selected="true"
					for="manage"
				>
					<Toggle
						v-if="manage !== undefined"
						id="manage"
						v-model="manage"
						class="mr-2"
						label="Manage"
					/>
					<span class="whitespace-pre-wrap text-sm font-semibold">
						{{ $t("Allow this user to manage the server") }}
					</span>
				</label>
			</div>
			<h3 class="mt-4 mb-2">
				{{ $t("Media playback") }}:
			</h3>
			<div class="flex w-full flex-col gap-2">
				<label
					class="pointer-events-auto inline-flex h-10 w-full touch-none items-center group"
					data-selected="true"
					for="audioTranscoding"
				>
					<Toggle
						v-if="audioTranscoding !== undefined"
						id="audioTranscoding"
						v-model="audioTranscoding"
						class="mr-2"
						label="AudioTranscoding"
					/>
					<span class="whitespace-pre-wrap text-sm font-semibold">
						{{ $t("Allow audio playback that requires transcoding") }}
					</span>
				</label>
				<label
					class="pointer-events-auto inline-flex h-10 w-full touch-none items-center group"
					data-selected="true"
					for="videoTranscoding"
				>
					<Toggle
						v-if="videoTranscoding !== undefined"
						id="videoTranscoding"
						v-model="videoTranscoding"
						class="mr-2"
						label="VideoTranscoding"
					/>
					<span class="whitespace-pre-wrap text-sm font-semibold">
						{{ $t("Allow video playback that requires transcoding") }}
					</span>
				</label>
			</div>
			<h3 class="mt-4 mb-2">
				{{ $t("Library Access") }}:
			</h3>
			<div class="flex w-1/2 flex-col gap-2">
				<label
					class="pointer-events-auto inline-flex h-10 w-full touch-none items-center group"
					data-selected="true"
					for="allowedAllLibraries"
				>
					<Toggle
						v-if="allowedAllLibraries !== undefined"
						id="allowedAllLibraries"
						v-model="allowedAllLibraries"
						class="mr-2"
						label="AllowedAllLibraries"
					/>
					<span class="whitespace-pre-wrap text-sm font-semibold">
						{{ $t("Enable access to all libraries") }}
					</span>
				</label>

				<Select
					v-if="!allowedAllLibraries"
					id="libraries"
					v-model="allowedLibraries"
					:items="libraries"
					label="libraries"
					multiple
					option-label="title"
					placeholder="Select libraries"
				/>
			</div>
		</div>

		<template #actions>
			<Button
				id="yes"
				class="mr-auto"
				color="auto"
				start-icon="userDelete"
				type="button"
				variant="text"
				@click="openDeleteConfirm"
			>
				{{ $t("Remove user") }}
			</Button>
			<Button
				id="cancel"
				color="white"
				type="button"
				variant="text"
				@click="handleCancel"
			>
				{{ $t("Cancel") }}
			</Button>
			<Button id="save" color="theme" type="button" @click="handleSave">
				{{ $t("Save") }}
			</Button>
		</template>

		<DeleteUserModal
			v-if="permissions?.id"
			:id="permissions?.id"
			:close="closeDeleteConfirm"
			:name="permissions?.name"
			:open="deleteConfirmOpen"
		/>
	</DashboardLayout>
</template>

<style scoped></style>
