import apiClient from '../clients/apiClient';

import servers, { setServers } from '@/store/servers';
import {updateUserFromApi, user} from '@/store/user';
import { setCurrentServer } from '@/store/currentServer';

import type { User } from '@/types/auth';
import { ref } from 'vue';
import router from '@/router';
import { setMessages } from "@/store/messages";
import { setNotifications } from "@/store/notifications";

const done = ref(false);

const getLocations = (): Promise<void> => new Promise((resolve, reject) => {
	if (done.value) {
		resolve();
		return;
	}

	apiClient()
		.get<{ data: User }>('/app_config')
		.then(async ({ data }) => {

			if (!data?.data) reject('No data returned from API');

			updateUserFromApi(data.data);

			setServers(data.data.servers);

			setMessages(data.data.receivedMessages);
			setNotifications(data.data.notifications);

			user.value = {
				...user.value,
				locale: data.data.locale,
				name: data.data.name,
				avatarUrl: data.data.avatarUrl,
			};

			done.value = true;

			if (servers.value.length == 0) {
				await router.push({ name: 'No Servers' });
			}
			else if (servers.value.length == 1) {
				setCurrentServer(servers.value[0]);
			}
			else if (servers.value.length > 1 && !!localStorage.getItem('currentServer')) {
				setCurrentServer(servers.value.find(server => server.id == localStorage.getItem('currentServer'))!);
			}
			else if (servers.value.length > 1) {
				await router.push({ name: 'Select Server' });
			}

			resolve();
		})
		.catch((error) => {
			reject(error);
		});
});

export default getLocations;
