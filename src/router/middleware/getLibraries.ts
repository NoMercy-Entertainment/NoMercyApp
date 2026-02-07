import { ref } from 'vue';
import { currentServer } from '@/store/currentServer';
import libraries, { setLibraries } from '@/store/libraries';

import type { LibrariesResponse } from '@/types/api/base/library';
import { setupComplete } from '@/store/ui';
import router from '@/router';
import { redirectUrl } from '@/store/routeState';
import { serverLibraries } from '@/store/servers.ts';
import serverClient, { deduplicatedRequest } from '@/lib/clients/serverClient.ts';

const done = ref(false);

function getLibraries(): Promise<void> {
	return new Promise((resolve, reject) => {
		if (done.value) {
			resolve();
			return;
		}

		if (libraries.value.length > 0 || !!serverLibraries.value) {
			resolve();
			return;
		}

		if (!currentServer.value) {
			resolve();
			return;
		}

		deduplicatedRequest('setup/libraries', () =>
			serverClient(5).get<{ data: LibrariesResponse[] }>('setup/libraries'),
		)
			.then(({ data }) => {
				setLibraries(data.data);
				setupComplete.value = true;
				serverLibraries.value = true;
				resolve();
				done.value = true;
				router.replace(redirectUrl.value).then();
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

export default getLibraries;
