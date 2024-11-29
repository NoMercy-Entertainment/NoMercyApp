import client from '@/lib/clients/client';
import {currentServer} from '@/store/currentServer';

export default <T>(timeout?: number) => {

	if (!currentServer.value?.serverApiUrl) {
		throw new Error('Server not selected');
	}

	return client<T>(`${currentServer.value.serverApiUrl}/`, timeout);
};

