import apiClient from '../clients/apiClient';

import servers, { setServers } from '@/store/servers';
import {setUser, user} from '@/store/user';
import { setCurrentServer } from '@/store/currentServer';

import { ref } from 'vue';
import router from '@/router';
import {AppConfig} from "@/types/config";
import {setMessages} from "@/store/messages";
import {setNotifications} from "@/store/notifications";

const done = ref(false);

const getLocations = (): Promise<void> => new Promise((resolve, reject) => {
	if (done.value) {
		return resolve();
	}

	apiClient()
		.get<AppConfig>('/app_config')
		.then(async ({ data }) => {

			if (!data?.data) reject('No data returned from API');

			setServers(data.data.servers);

			setMessages(data.data.messages ?? []);
			setNotifications(data.data.notifications ?? []);

			setUser({
				...user.value,
				locale: data.data.locale,
				name: data.data.name,
				avatarUrl: data.data.avatarUrl,
				features: data.data.features,
				moderator: !!data.data.moderator,
			});

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

			return resolve();
		})
		.catch((error) => {
			reject(error);
		});
});

export default getLocations;
