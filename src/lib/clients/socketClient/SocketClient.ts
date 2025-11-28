import type { HubConnection } from '@microsoft/signalr';
import { HttpTransportType, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

import { connect, onConnect, onDisconnect } from '@/lib/clients/socketClient/events';
import type { ClientInfo } from '@/lib/clients/socketClient/device';
import { clientInfo } from '@/store/deviceInfo';

export class SocketClient {
	public connection: HubConnection | null = null;
	private accessToken: string;
	private baseUrl: string;
	private clientInfo: ClientInfo = clientInfo.value!;
	private keepAliveInterval: number = 5;
	private endpoint: string;

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
		if (!this.connection)
			return;

		await this.connection.stop();
	};

	on(methodName: string, callback: (...args: any[]) => void) {
		this.connection?.on(methodName, callback);
	}

	off(methodName: string, callback?: (...args: any[]) => void) {
		if (callback) {
			this.connection?.off(methodName, callback);
		}
		else {
			this.connection?.off(methodName);
		}
	}

	async invoke(methodName: string, ...args: any[]) {
		if (this.connection?.state === 'Connected') {
			return await this.connection.invoke(methodName, ...args);
		}
		throw new Error('Connection not established');
	};

	setup = async () => {
		if (!this.connection)
			return;

		try {
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

				if (!this.connection || !error)
					return;

				await this.connection.start();
				onConnect(this.connection, this.endpoint);
				connect(this.connection);
			});

			await this.connection.start();
			onConnect(this.connection, this.endpoint);
			connect(this.connection);
		}
		catch (err) {
			console.error(err);
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
			.withAutomaticReconnect()
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
