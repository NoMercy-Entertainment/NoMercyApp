import serverClient from '../clients/serverClient';
import currentServer from '@/store/currentServer';
import libraries, {setLibraries} from '@/store/Libraries';

import type {LibrariesResponse} from '@/types/api/base/library';
import router from '@/router';

const getLibraries = (): Promise<void> => new Promise((resolve, reject) => {
	if (!currentServer.value) {
		router.push('/setup/select-servers').then();
		return;
	}

	if (libraries.value.length > 0) {
		resolve();
		return;
	}

	serverClient()
		.get<{ data: LibrariesResponse[] }>('/libraries')
		.then(({data}) => {
			setLibraries(data.data);

			resolve();
		})
		.catch((error) => {
			reject(error);
		});
});

export default getLibraries;
