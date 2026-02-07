import type { HubConnection, IRetryPolicy, RetryContext } from '@microsoft/signalr';
import { HttpTransportType, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

import { connect, onConnect, onDisconnect } from '@/lib/clients/socketClient/events';
import type { ClientInfo } from '@/lib/clients/socketClient/device';
import { clientInfo } from '@/store/deviceInfo';

class InfiniteRetryPolicy implements IRetryPolicy {
	nextRetryDelayInMilliseconds(retryContext: RetryContext): number | null {
		// Escalate: 0s, 1s, 2s, 5s, then cap at 10s
		const delays = [0, 1000, 2000, 5000];
		return delays[retryContext.previousRetryCount] ?? 10_000;
	}
}

export class SocketClient {
	public connection: HubConnection | null = null;
	private accessToken: string;
	private baseUrl: string;
	private clientInfo: ClientInfo = clientInfo.value!;
	private keepAliveInterval: number = 5;
	private endpoint: string;
	private disposed: boolean = false;

	constructor(
		baseUrl: string,
		accessToken: string,
		endpoint: string = 'socket',
	) {
		this.baseUrl = baseUrl?.replace(/\/$/, '');
		this.accessToken = accessToken;
		this.endpoint = endpoint;

		this.connection = this.connectionBuilder();
	}

	dispose = async () => {
		this.disposed = true;

		if (!this.connection)
			return;

		await this.connection.stop();
	};

	// eslint-disable-next-line ts/no-explicit-any -- SignalR's on() requires (...args: any[]) => void
	on(methodName: string, callback: (...args: any[]) => void) {
		this.connection?.on(methodName, callback);
	}

	// eslint-disable-next-line ts/no-explicit-any -- SignalR's off() requires (...args: any[]) => void
	off(methodName: string, callback?: (...args: any[]) => void) {
		if (callback) {
			this.connection?.off(methodName, callback);
		}
		else {
			this.connection?.off(methodName);
		}
	}

	// eslint-disable-next-line ts/no-explicit-any -- SignalR's invoke() requires any[]
	async invoke(methodName: string, ...args: any[]) {
		if (this.connection?.state === 'Connected') {
			return await this.connection.invoke(methodName, ...args);
		}
		throw new Error('Connection not established');
	};

	setup = async () => {
		if (!this.connection)
			return;

		this.disposed = false;

		this.connection.onreconnecting((error: Error | undefined) => {
			console.log('SignalR Disconnected.', error?.message);
			onDisconnect(this.connection!, this.endpoint);
		});
		this.connection.onreconnected(() => {
			console.log('SignalR Reconnected.');
			onConnect(this.connection!, this.endpoint);
		});
		this.connection.onclose(async (error) => {
			console.log('SignalR Closed.', error);
			onDisconnect(this.connection!, this.endpoint);

			if (!this.connection || this.disposed)
				return;

			await this.startWithRetry();
		});

		await this.startWithRetry();
	};

	private startWithRetry = async () => {
		const delays = [0, 1000, 2000, 5000];

		while (!this.disposed) {
			try {
				await this.connection!.start();
				onConnect(this.connection!, this.endpoint);
				connect(this.connection!);
				return;
			}
			catch (err) {
				if (this.disposed) return;

				const delay = delays.shift() ?? 10_000;
				console.warn(`SignalR ${this.endpoint} connect failed, retrying in ${delay}ms...`, err);
				await new Promise(resolve => setTimeout(resolve, delay));
			}
		}
	};

	private connectionBuilder() {
		const searchParams = this.urlBuilder();

		const url = new URL(`${this.baseUrl}/${this.endpoint}`);
		url.search = searchParams.toString();

		return new HubConnectionBuilder()
			.withUrl(url.toString(), {
				transport: HttpTransportType.WebSockets,
			})
			.withKeepAliveInterval(this.keepAliveInterval * 1000)
			.withAutomaticReconnect(new InfiniteRetryPolicy())
			.withStatefulReconnect()
			.configureLogging(LogLevel.Critical)
			.build();
	}

	private urlBuilder() {
		return new URLSearchParams({
			access_token: this.accessToken,
			client_id: this.clientInfo.id,
			client_name: this.clientInfo.name,
			client_type: this.clientInfo.type ?? 'web',
			client_version: this.clientInfo.version,
			client_os: this.clientInfo.os,
			client_browser: this.clientInfo.browser,
			client_device: this.clientInfo.device,
			client_volume: this.clientInfo.volume_percent.toString(),
		});
	}
}

export default SocketClient;
