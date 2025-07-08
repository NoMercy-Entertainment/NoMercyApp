import { ref } from 'vue';
import serverClient from '../clients/serverClient';
import { currentServer, setCurrentServer } from '@/store/currentServer';

import router from '@/router';
import type { PermissionsResponse } from '@/types/api/dashboard/server';

const done = ref(false);

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

		serverClient()
			.get<PermissionsResponse>('permissions')
			.then(({ data }) => {
				setCurrentServer({
					...currentServer.value!,
					is_owner: data.owner,
					is_manager: data.manage,
				});

				done.value = true;
				resolve();
			})
			.catch(() => {
				done.value = true;
				router.replace({ name: 'Server offline' }).then(() => resolve());
			});
	});
}

export default getServerPermissions;
