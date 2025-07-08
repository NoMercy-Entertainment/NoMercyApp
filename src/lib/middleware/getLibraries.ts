import serverClient from '../clients/serverClient';
import { currentServer } from '@/store/currentServer';
import libraries, { setLibraries } from '@/store/Libraries';

import type { LibrariesResponse } from '@/types/api/base/library';
import { setupComplete } from '@/store/ui';
import router from '@/router';
import { redirectUrl } from '@/store/routeState';
import { serverLibraries } from '@/store/servers.ts';

function getLibraries(): Promise<void> {
	return new Promise((resolve, reject) => {
		if (libraries.value.length > 0 || !!serverLibraries.value) {
			resolve();
			return;
		}

		if (!currentServer.value) {
			resolve();
			return;
		}

		serverClient()
			.get<{ data: LibrariesResponse[] }>('libraries')
			.then(({ data }) => {
				setLibraries(data.data);
				setupComplete.value = true;
				serverLibraries.value = true;
				resolve();
				router.push(redirectUrl.value).then();
			})
			.catch(() => {
				router.replace({ name: 'Server offline' }).then(() => resolve());
			});
	});
}

export default getLibraries;
