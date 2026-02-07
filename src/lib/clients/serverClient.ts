import client from '@/lib/clients/client';
import { currentServer } from '@/store/currentServer';

export default <T>(timeout?: number) => {
	if (!currentServer.value?.serverApiUrl) {
		throw new Error('Server not selected');
	}

	return client<T>({ baseUrl: currentServer.value.serverApiUrl, timeout });
};

const pendingRequests = new Map<string, Promise<unknown>>();

export function deduplicatedRequest<T>(key: string, requestFn: () => Promise<T>): Promise<T> {
	if (pendingRequests.has(key)) {
		return pendingRequests.get(key) as Promise<T>;
	}

	const promise = requestFn().finally(() => {
		pendingRequests.delete(key);
	});

	pendingRequests.set(key, promise);
	return promise;
}
