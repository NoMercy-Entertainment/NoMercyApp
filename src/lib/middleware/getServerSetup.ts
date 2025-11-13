import { ref } from 'vue';
import serverClient from '../clients/serverClient';

import type { ServerInfo } from '@/types/api/dashboard/server.ts';

import router from '@/router';
import { currentServer } from '@/store/currentServer';
import { serverInfoRequested, serverSetupComplete } from '@/store/servers.ts';
import { redirectUrl } from '@/store/routeState.ts';

const done = ref(false);

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

		serverClient(5)
			.get<ServerInfo>('dashboard/server/info')
			.then(({ data }) => {
				serverSetupComplete.value = data.setup_complete;
				serverInfoRequested.value = true;

				if (!data.setup_complete) {
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
			.catch(async () => {
				serverSetupComplete.value = true;

				await router
					.replace({ name: 'Server offline' })
					.then(() => resolve());

				done.value = true;
				resolve();
			});
	});
}

export default getServerSetup;
