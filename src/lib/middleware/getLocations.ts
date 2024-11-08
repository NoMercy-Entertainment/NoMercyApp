import apiClient from '../clients/apiClient';

import servers, {setServers} from '@/store/servers';
import {updateUserFromApi} from '@/store/user';
import {setCurrentServer} from '@/store/currentServer';

import type {User} from '@/types/auth';

const getLocations = (): Promise<void> => new Promise((resolve, reject) => {
	if (servers.value.length > 0) {
		resolve();
		return;
	}

	apiClient()
		.get<{ data: User }>('/app_config')
		.then(({data}) => {

			if (!data?.data) reject('No data returned from API');

			updateUserFromApi(data.data);

			setServers(data.data.servers);
			setCurrentServer(data.data.currentServer);

			resolve();
		})
		.catch((error) => {
			reject(error);
		});
});

export default getLocations;
