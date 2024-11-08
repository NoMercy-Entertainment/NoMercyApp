import {ref} from 'vue';

import type {Server} from '@/types/auth';

const currentServer = ref<Server | null>(null);

export const setCurrentServer = (server: Server | null): void => {
	currentServer.value = server;
};

export const getCurrentServer = (): Server | null => {
	return currentServer.value;
}

export const clearCurrentServer = (): void => {
	currentServer.value = null;
};

export default currentServer;
