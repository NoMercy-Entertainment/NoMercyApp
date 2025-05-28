import {
    HttpTransportType,
    HubConnection,
    HubConnectionBuilder,
    LogLevel,
} from '@microsoft/signalr';

import { connect, onConnect, onDisconnect } from '@/lib/clients/socketClient/events';
import {ClientInfo} from "@/lib/clients/socketClient/device";
import {clientInfo} from "@/store/deviceInfo";

export class SocketClient {
    public connection: HubConnection | null = null;
    private accessToken: string;
    private baseUrl: string;
    private clientInfo: ClientInfo = clientInfo.value!;
    private keepAliveInterval: number = 5;
    private endpoint: string;

    constructor(baseUrl: string, accessToken: string, endpoint: string = 'socket') {
        this.baseUrl = baseUrl;
        this.accessToken = accessToken;
        this.endpoint = endpoint;

        this.connection = this.connectionBuilder();
    }

    dispose = async () => {
        if (!this.connection) return;

        await this.connection.stop();
    }

    setup = async () => {
        if (!this.connection) return;

        try {
            this.connection.onreconnecting((error: Error | undefined) => {
                console.log('SignalR Disconnected.', error?.message);
                onDisconnect(this.connection!);
            });
            this.connection.onreconnected(() => {
                console.log('SignalR Reconnected.');
                onConnect(this.connection!);
            });
            this.connection.onclose(async () => {
                console.log('SignalR Closed.');
                onDisconnect(this.connection!);

                if (!this.connection) return;

                await this.connection.start();
                onConnect(this.connection);
                connect(this.connection);
            });

            await this.connection.start();
            onConnect(this.connection);
            connect(this.connection);
        } catch (err) {
            console.error(err);
        }
    };

    private connectionBuilder() {
        const urlString = this.urlBuilder();

        return new HubConnectionBuilder()
            .withUrl(`${this.baseUrl}/${this.endpoint}`, {
                accessTokenFactory: () => this.accessToken + urlString,
                // skipNegotiation: true,
                transport: HttpTransportType.WebSockets,
            })
            .withKeepAliveInterval(this.keepAliveInterval * 1000)
            .withAutomaticReconnect()
            .withStatefulReconnect()
            .configureLogging(LogLevel.Critical)
            .build();
    }

    private urlBuilder() {
        const urlParams = new URLSearchParams({
            client_id: this.clientInfo.id,
            client_name: this.clientInfo.name,
            client_type: this.clientInfo.type ?? 'web',
            client_version: this.clientInfo.version,
            client_os: this.clientInfo.os,
            client_browser: this.clientInfo.browser,
            client_device: this.clientInfo.device,
            client_volume: this.clientInfo.volume_percent.toString(),
        });

        return `&${urlParams.toString()}`;
    }
}

export default SocketClient;
