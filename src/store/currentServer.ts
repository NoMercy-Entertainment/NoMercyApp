import {computed, ref, watch} from 'vue';

import type { Server } from '@/types/auth';
import {useOnline} from "@vueuse/core";
import client from "@/lib/clients/client";

const cs = ref<Server | null>(null);
export const currentServer = computed(() => cs.value);

export const setCurrentServer = (server: Server | null): void => {
	server?.id && localStorage.setItem('currentServer', server?.id);
	cs.value = server;
};

export const getCurrentServer = (): Server | null => {
	return cs.value;
}

export const clearCurrentServer = (): void => {
	cs.value = null;
};

const isOnline = useOnline();

watch(isOnline, (value) => {
	if (value && cs.value) {
		pingServer(cs.value)
			.then((url) => {
				// @ts-ignore
				cs.value = {
					...cs.value,
					serverBaseUrl: url,
					serverApiUrl: url + '/api/v1',
				};
			});
	}
});

const pingServer = async (server: Server): Promise<string> => {
	// eslint-disable-next-line no-async-promise-executor
	return new Promise(async (resolve) => {
		const internalUrl = `https://${server.internal_domain}:${server.internal_port}`;
		const externalUrl = `https://${server.external_domain}:${server.external_port}`;
		await client(internalUrl)
			.get('/api/v1/dashboard/server')
			.then(() => {
				resolve(internalUrl);
				return;
			});
		await client(externalUrl)
			.get('/api/v1/dashboard/server')
			.then(() => {
				resolve(externalUrl);
				return;
			});
	});
}