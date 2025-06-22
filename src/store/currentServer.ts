import { computed, ref, watch } from 'vue';

import type { Server } from '@/types/auth';
import { useOnline } from '@vueuse/core';
import client from '@/lib/clients/client';

const cs = ref<Server | null>(null);
export const currentServer = computed(() => cs.value);

export function setCurrentServer(server: Server | null) {
	server?.id && localStorage.setItem('currentServer', server?.id);
	cs.value = server;
}

export function getCurrentServer(): Server | null {
	return cs.value;
}

export function clearCurrentServer(): void {
	cs.value = null;
}

const isOnline = useOnline();

watch(isOnline, (value) => {
	if (value && cs.value) {
		pingServer(cs.value).then((url) => {
			// @ts-ignore
			cs.value = {
				...cs.value,
				serverBaseUrl: url,
				serverApiUrl: `${url}/api/v1`,
			};
		});
	}
});

async function pingServer(server: Server): Promise<string> {
	return new Promise(async (resolve) => {
		const internalUrl = `https://${server.internal_domain}:${server.internal_port}`;
		const externalUrl = `https://${server.external_domain}:${server.external_port}`;
		await client({ baseUrl: internalUrl })
			.get('/api/v1/dashboard/server')
			.then(() => {
				resolve(internalUrl);
			});
		await client({ baseUrl: externalUrl })
			.get('/api/v1/dashboard/server')
			.then(() => {
				resolve(externalUrl);
			});
	});
}
