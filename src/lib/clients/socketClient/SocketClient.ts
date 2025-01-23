import {
    HttpTransportType,
    HubConnection,
    HubConnectionBuilder,
    LogLevel,
} from '@microsoft/signalr';

import { deviceInfo } from '@/lib/clients/socketClient/device';
import { connect, onConnect, onDisconnect } from '@/lib/clients/socketClient/events';

export class SocketClient {
    public connection: HubConnection | null = null;
    private accessToken: string;
    private baseUrl: string;
    private deviceInfo: ReturnType<typeof deviceInfo> = deviceInfo();
    private keepAliveInterval: number = 10;
    private endpoint: string;

    constructor(baseUrl: string, accessToken: string, endpoint: string = 'socket') {
        this.baseUrl = baseUrl;
        this.accessToken = accessToken;
        this.endpoint = endpoint;

        this.connection = this.connectionBuilder();
    }

    dispose = async () => {
        if (!this.connection) return;

        // await this.connection.stop();
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
            // console.log(err);
        }
    };

    private connectionBuilder() {
        const urlString = this.urlBuilder();

        return new HubConnectionBuilder()
            .withUrl(`${this.baseUrl}/${this.endpoint}`, {
                accessTokenFactory: () => this.accessToken + urlString,
                skipNegotiation: true,
                transport: HttpTransportType.WebSockets,
            })
            .withKeepAliveInterval(this.keepAliveInterval * 1000)
            .withAutomaticReconnect()
            .withStatefulReconnect()
            .configureLogging(LogLevel.Error)
            .build();
    }

    private urlBuilder() {
        const urlParams = new URLSearchParams([
            ['client_id', this.deviceInfo.id],
            ['client_name', this.deviceInfo.name],
            ['client_type', this.deviceInfo.type ?? 'web'],
            ['client_version', this.deviceInfo.version],
            ['client_os', this.deviceInfo.os],
            ['client_browser', this.deviceInfo.browser],
            ['client_device', this.deviceInfo.device],
        ]);

        return `&${urlParams.toString()}`;
    }
}

export default SocketClient;
