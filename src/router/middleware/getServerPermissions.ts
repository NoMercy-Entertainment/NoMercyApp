import { ref } from 'vue';

import type { PermissionsResponse } from '@/types/api/dashboard/server';

import { currentServer, setCurrentServer } from '@/store/currentServer';
import router from '@/router';
import serverClient, { deduplicatedRequest } from '@/lib/clients/serverClient.ts';

const done = ref(false);

export function resetServerPermissions() {
	done.value = false;
}

function getServerPermissions(): Promise<void> {
	return new Promise((resolve, reject) => {
		if (done.value) {
			resolve();
			return;
		}

		if (!currentServer.value) {
			resolve();
			return;
		}

		deduplicatedRequest('setup/permissions', () =>
			serverClient(5).get<PermissionsResponse>('setup/permissions'),
		)
			.then(({ data }) => {
				setCurrentServer({
					...currentServer.value!,
					is_owner: data.owner,
					is_manager: data.manager,
				});

				done.value = true;
				resolve();
			})
			.catch(async () => {
				done.value = true;
				await router
					.replace({ name: 'Server offline' })
					.then(() => resolve());
				resolve();
			});
	});
}

export default getServerPermissions;
