import serverClient from '../clients/serverClient';

import type { ServerInfo } from '@/types/api/dashboard/server.ts';

import router from '@/router';
import { currentServer } from '@/store/currentServer';
import { serverInfoRequested, serverSetupComplete } from '@/store/servers.ts';
import { redirectUrl } from '@/store/routeState.ts';

function getServerSetup(): Promise<void> {
	return new Promise((resolve, reject) => {
		if (serverInfoRequested.value) {
			resolve();
			return;
		}

		if (!currentServer.value) {
			resolve();
			return;
		}

		serverClient()
			.get<ServerInfo>('dashboard/server/info')
			.then(({ data }) => {
				serverSetupComplete.value = data.setup_complete;
				serverInfoRequested.value = true;

				if (!data.setup_complete) {
					console.log('Server setup not complete, redirecting to post-installation page');
					redirectUrl.value = '/setup/post-install';
					router.replace({ name: 'Post Install' }).then(() => resolve());
					return;
				}

				resolve();
			})
			.catch(() => {
				serverSetupComplete.value = true;
				router.replace({ name: 'Server offline' }).then(() => resolve());
			});
	});
}

export default getServerSetup;
