<script lang="ts" setup>
import { ref } from 'vue';

import type { LibrariesResponse, StatusResponse } from '@/types/api/base/library';
import type { Library } from '@/types/api/dashboard/server';

import { queryClient } from '@/config/tanstack-query';
import serverClient from '@/lib/clients/serverClient';
import useServerClient from '@/lib/clients/useServerClient';
import { currentServer } from '@/store/currentServer';

import DashboardLayout from '@/Layout/Desktop/DashboardLayout.vue';
import LibraryCard from './components/LibraryCard.vue';
import { useToast } from 'primevue/usetoast';
import { translate } from '@/lib/utils/string';

const toast = useToast();

const { data: libraries, error } = useServerClient<LibrariesResponse[]>({
	path: 'dashboard/libraries',
	queryKey: ['dashboard', 'libraries', currentServer.value?.serverBaseUrl],
});

const isCreating = ref(false);

async function handleCreateLibrary() {
	if (isCreating.value)
		return;
	isCreating.value = true;

	try {
		const { data } = await serverClient()
			.post<StatusResponse<Library>>('dashboard/libraries');
		toast.add({
			severity: data.status === 'ok' ? 'success' : 'error',
			summary: translate(data.status === 'ok' ? 'Success' : 'Error'),
			detail: translate(data.message, ...data.args),
			life: 5000,
		});

		queryClient.invalidateQueries({
			queryKey: [
				'dashboard',
				'libraries',
				currentServer.value?.serverBaseUrl,
			],
		});
	}
	catch {
		toast.add({
			severity: 'error',
			summary: translate('Error'),
			detail: translate('An error occurred while creating the library'),
			life: 5000,
		});
	}
	finally {
		isCreating.value = false;
	}
}

const loadingRefresh = ref(false);
function handleRefresh() {
	loadingRefresh.value = true;

	serverClient()
		.post<StatusResponse<string>>('dashboard/libraries/refresh')
		.then(({ data }) => {
			loadingRefresh.value = false;
			toast.add({
				severity: data.status === 'ok' ? 'success' : 'error',
				summary: translate(data.status === 'ok' ? 'Success' : 'Error'),
				detail: translate(data.message, ...data.args),
				life: 5000,
			});
		})
		.catch(() => {
			loadingRefresh.value = false;
			toast.add({
				severity: 'error',
				summary: translate('Error'),
				detail: translate('An error occurred while rescanning the libraries'),
				life: 5000,
			});
		});
}

const loadingMissing = ref(false);
function handleMissing() {
	loadingMissing.value = true;

	serverClient()
		.post<StatusResponse<string>>(`dashboard/libraries/scan-new`)
		.then(({ data }) => {
			loadingMissing.value = false;
			toast.add({
				severity: data.status === 'ok' ? 'success' : 'error',
				summary: translate(data.status === 'ok' ? 'Success' : 'Error'),
				detail: translate(data.message, ...data.args),
				life: 5000,
			});
		})
		.catch(() => {
			loadingMissing.value = false;
			toast.add({
				severity: 'error',
				summary: translate('Error'),
				detail: translate('An error occurred while rescanning the library folders'),
				life: 5000,
			});
		});
}

const loadingRescan = ref(false);
function handleRescan() {
	loadingRescan.value = true;

	serverClient()
		.post<StatusResponse<string>>('dashboard/libraries/rescan')
		.then(({ data }) => {
			loadingRescan.value = false;
			toast.add({
				severity: data.status === 'ok' ? 'success' : 'error',
				summary: translate(data.status === 'ok' ? 'Success' : 'Error'),
				detail: translate(data.message, ...data.args),
				life: 5000,
			});
		})
		.catch(() => {
			loadingRescan.value = false;
			toast.add({
				severity: 'error',
				summary: translate('Error'),
				detail: translate('An error occurred while rescanning the libraries'),
				life: 5000,
			});
		});
}
</script>

<template>
			<DashboardLayout
				:error="error"
				:grid-style="1"
				description="Manage your media libraries and their content here."
				title="Libraries"
			>
				<template #cta>
					<Button
						id="newLibrary"
						:disabled="isCreating"
						color="theme"
						start-icon="folderAdd"
						@click="handleCreateLibrary"
					>
						{{ isCreating ? $t("Creating...") : $t("New library") }}
					</Button>
				</template>

				<template v-for="profile in libraries ?? []" :key="profile.id">
					<LibraryCard :data="profile" />
				</template>

				<template #actions>
					<Button
						id="refresh"
						:class="
							loadingRefresh
								? 'first:children:animate-spin cursor-not-allowed'
								: ''
						"
						:disabled="loadingRefresh"
						start-icon="folderSwap"
						type="button"
						variant="text"
						@click="handleRefresh"
					>
						{{ $t("Refresh all libraries") }}
					</Button>
					<Button
						id="missing"
						:class="
							loadingMissing
								? 'first:children:animate-spin !cursor-not-allowed'
								: ''
						"
						:disabled="loadingMissing"
						color="auto"
						start-icon="folderSwap"
						type="button"
						variant="text"
						@click="handleMissing"
					>
						{{ $t("Find missing") }}
					</Button>
					<Button
						id="rescan"
						:class="
							loadingRefresh
								? 'first:children:animate-spin cursor-not-allowed'
								: ''
						"
						:disabled="loadingRefresh"
						start-icon="folderSwap"
						type="button"
						variant="text"
						@click="handleRescan"
					>
						{{ $t("Rescan all libraries") }}
					</Button>
				</template>
			</DashboardLayout>
</template>
