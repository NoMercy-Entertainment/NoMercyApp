<script setup lang="ts">
import { ref } from 'vue';
import { IonContent, IonPage } from '@ionic/vue';

import type {
	LibrariesResponse,
	StatusResponse,
} from '@/types/api/base/library';
import type { Library } from '@/types/api/dashboard/server';

import { queryClient } from '@/config/tanstack-query';
import serverClient from '@/lib/clients/serverClient';
import useServerClient from '@/lib/clients/useServerClient';
import { currentServer } from '@/store/currentServer';

import DashboardLayout from '@/Layout/Desktop/DashboardLayout.vue';
import LibraryCard from './components/LibraryCard.vue';
import { useToast } from 'primevue/usetoast';
import { translate } from '@/lib/stringArray.ts';

const toast = useToast();

const { data: libraries, error } = useServerClient<LibrariesResponse[]>({
	path: 'dashboard/libraries',
	queryKey: ['dashboard', 'libraries', currentServer.value?.serverBaseUrl],
});

function handleCreateLibrary() {
	serverClient()
		.post<StatusResponse<Library>>('dashboard/libraries')
		.then(({ data }) => {
			toast.add({
				severity: data.status === 'ok' ? 'success' : 'error',
				summary: translate(data.message, ...data.args),
				life: 2000,
			});

			queryClient.invalidateQueries({
				queryKey: [
					'dashboard',
					'libraries',
					currentServer.value?.serverBaseUrl,
				],
			});
		});
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
				summary: translate(data.message, ...data.args),
				life: 2000,
			});
		})
		.catch(() => {
			loadingRefresh.value = false;
			toast.add({
				severity: 'error',
				summary: translate('An error occurred while rescanning the libraries'),
				life: 2000,
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
				summary: translate(data.message, ...data.args),
				life: 2000,
			});
		})
		.catch(() => {
			loadingRescan.value = false;
			toast.add({
				severity: 'error',
				summary: translate('An error occurred while rescanning the libraries'),
				life: 2000,
			});
		});
}
</script>

<template>
	<IonPage>
		<IonContent :fullscreen="true">
			<DashboardLayout
				:error="error"
				:grid-style="1"
				title="Libraries"
				description="Manage your media libraries and their content here."
			>
				<template #cta>
					<Button
						id="newLibrary"
						color="theme"
						start-icon="folderAdd"
						@click="handleCreateLibrary"
					>
						{{ $t("New library") }}
					</Button>
				</template>

				<template v-for="profile in libraries ?? []" :key="profile.id">
					<LibraryCard :data="profile" />
				</template>

				<template #actions>
					<Button
						id="refresh"
						type="button"
						variant="text"
						start-icon="folderSwap"
						:disabled="loadingRefresh"
						:class="
							loadingRefresh
								? 'first:children:animate-spin cursor-not-allowed'
								: ''
						"
						@click="handleRefresh"
					>
						{{ $t("Refresh all libraries") }}
					</Button>
					<Button
						id="rescan"
						type="button"
						variant="text"
						start-icon="folderSwap"
						:disabled="loadingRefresh"
						:class="
							loadingRefresh
								? 'first:children:animate-spin cursor-not-allowed'
								: ''
						"
						@click="handleRescan"
					>
						{{ $t("Rescan all libraries") }}
					</Button>
				</template>
			</DashboardLayout>
		</IonContent>
	</IonPage>
</template>
