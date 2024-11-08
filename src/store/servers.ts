import {ref} from 'vue';

import type {Server} from '@/types/auth';

const servers = ref<Server[]>([]);

export const setServers = (newServers: Server[]): void => {
	servers.value = newServers;
}

export const getServers = (): Server[] => {
	return servers.value;
}

export const clearServers = (): void => {
	servers.value = [];
}

export default servers;
