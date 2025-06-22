import { ref } from 'vue';

import type { Server } from '@/types/auth';

const servers = ref<Server[]>([]);

export function setServers(newServers: Server[]): void {
	servers.value = newServers;
}

export function getServers(): Server[] {
	return servers.value;
}

export function clearServers(): void {
	servers.value = [];
}

export default servers;
