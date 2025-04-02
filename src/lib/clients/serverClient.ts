import client from '@/lib/clients/client';
import { currentServer } from '@/store/currentServer';

let baseUrl = currentServer.value?.serverApiUrl;
export default <T>(timeout?: number) => {

	if (!currentServer.value?.serverApiUrl) {
		throw new Error('Server not selected');
	}

	return client<T>({ baseUrl: currentServer.value.serverApiUrl, timeout});
};

