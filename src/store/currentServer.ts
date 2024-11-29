import {computed, ref} from 'vue';

import type {Server} from '@/types/auth';

const cs = ref<Server | null>(null);
export const currentServer = computed(() => cs.value);

export const setCurrentServer = (server: Server | null): void => {
	cs.value = server;
};

export const getCurrentServer = (): Server | null => {
	return cs.value;
}

export const clearCurrentServer = (): void => {
	cs.value = null;
};
