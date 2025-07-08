import { ref } from 'vue';

import type { Server } from '@/types/auth';

export const serverSetupComplete = ref<boolean>(false);
export const serverInfoRequested = ref<boolean>(false);
export const serverLibraries = ref<boolean>(false);
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
