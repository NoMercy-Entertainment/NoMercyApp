import apiClient from '../clients/apiClient';

import servers, {setServers} from '@/store/servers';
import {updateUserFromApi} from '@/store/user';
import {setCurrentServer} from '@/store/currentServer';

import type {User} from '@/types/auth';
import {ref} from 'vue';

const done = ref(false);

const getLocations = (): Promise<void> => new Promise((resolve, reject) => {
	if (servers.value.length > 0 && done.value) {
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

			done.value = true;

			resolve();
		})
		.catch((error) => {
			reject(error);
		});
});

export default getLocations;
