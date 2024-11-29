import serverClient from '../clients/serverClient';
import {currentServer} from '@/store/currentServer';
import libraries, {setLibraries} from '@/store/Libraries';

import type {LibrariesResponse} from '@/types/api/base/library';
import {setupComplete} from '@/store/ui';

const getLibraries = (): Promise<void> => new Promise((resolve, reject) => {

	if (libraries.value.length > 0) {
		resolve();
		return;
	}

	if (!currentServer.value) {
		resolve();
		return;
	}

	serverClient()
		.get<{ data: LibrariesResponse[] }>('/libraries')
		.then(({data}) => {
			setLibraries(data.data);
			setupComplete.value = true;
			resolve();
		})
		.catch((error) => {
			reject(error);
		});
});

export default getLibraries;
