import { ref } from 'vue';

import type { ServerInfo } from '@/types/api/dashboard/server.ts';
import type { StatusResponse } from '@/types/api/base/library';

import router from '@/router';
import { currentServer } from '@/store/currentServer';
import { serverInfoRequested, serverSetupComplete } from '@/store/servers.ts';
import { redirectUrl } from '@/store/routeState.ts';
import serverClient, { deduplicatedRequest } from '@/lib/clients/serverClient.ts';

const done = ref(false);

export function resetServerSetup() {
	done.value = false;
	serverInfoRequested.value = false;
	serverSetupComplete.value = false;
}

function getServerSetup(): Promise<void> {
	return new Promise((resolve, reject) => {
		if (done.value) {
			resolve();
			return;
		}

		if (serverInfoRequested.value) {
			resolve();
			return;
		}

		if (!currentServer.value) {
			resolve();
			return;
		}

		deduplicatedRequest('setup/server-info', () =>
			serverClient(5).get<StatusResponse<ServerInfo>>('setup/server-info'),
		)
			.then(({ data }) => {
				serverSetupComplete.value = data.data?.setup_complete ?? false;
				serverInfoRequested.value = true;

				if (!data.data?.setup_complete) {
					console.log('Server setup not complete, redirecting to post-installation page');
					redirectUrl.value = '/setup/post-install';

					router
						.replace({ name: 'Post Install' })
						.then(() => resolve());

					done.value = true;
					return;
				}

				done.value = true;
				resolve();
			})
			.catch(async (error) => {
				serverSetupComplete.value = true;

				done.value = true;

				await router
					.replace({ name: 'Server offline' })
					.then(() => reject(error));

				reject(error);
			});
	});
}

export default getServerSetup;
