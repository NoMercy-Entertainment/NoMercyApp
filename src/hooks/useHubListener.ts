import { type ComputedRef } from 'vue';

import useMounted from '@/hooks/useMounted';
import { HubConnection } from '@microsoft/signalr';

const useHubListener = (
	connection: ComputedRef<HubConnection | null | undefined>,
	eventName: string,
	callback: (...args: any[]) => any
) => {
	const connectToHub = async () => {
		setTimeout(() => {
			try {
				connection.value?.on(eventName, callback);
			} catch (err) {
				console.error(`Error getting ${eventName}:`, err);
			}
		}, 1000);
	};

	const disconnectFromHub = async () => {
		try {
			connection.value?.off(eventName, callback);
		} catch (err) {
			console.error(`Error stopping log ${eventName}:`, err);
		}
	};

	useMounted(connectToHub, disconnectFromHub, 10);
}

export default useHubListener;
