import type { HubConnection } from '@microsoft/signalr';
import type { ActivityLog } from '@/types/server';
import { queryClient } from '@/config/tanstack-query';
import { useVideoSocket } from '@/store/videoSocket';
import { Device } from '@capacitor/device';
import i18next from 'i18next';
import { translate } from '@/lib/utils/string';

export function connect(socket?: HubConnection) {
	if (!socket)
		return;

	socket.on('connect', onConnect);
	socket.on('disconnected', onDisconnect);
	socket.on('notify', onNotify);

	socket.on('command', onCommand);
	socket.on('RefreshLibrary', onUpdateContent);
	socket.on('addActivityLog', onAddActivityLog);
	socket.on('setActivityLog', onSetActivityLog);
	socket.on('pingEvent', pingEvent);
}

export function disconnect(socket?: HubConnection) {
	if (!socket)
		return;
	socket.off('connect', onConnect);
	socket.off('disconnected', onDisconnect);
	socket.off('notify', onNotify);

	socket.off('command', onCommand);
	socket.off('RefreshLibrary', onUpdateContent);
	socket.off('addActivityLog', onAddActivityLog);
	socket.off('setActivityLog', onSetActivityLog);
	socket.off('pingEvent', pingEvent);
}

// // @ts-ignore
// const cjs = new Castjs({
//     receiver: '925B4C3C',
// });

export function onConnect(socket: HubConnection | null, endpoint: string) {
	if (!socket)
		return;
	document.dispatchEvent(new Event('baseHub-connected'));

	document.dispatchEvent(new CustomEvent('toast', {
		detail: {
			severity: 'info',
			summary: i18next.t(`Connected to ${endpoint}`),
			life: 3000,
		},
	}));
}

export function onDisconnect(socket: HubConnection | null, endpoint: string) {
	if (!socket)
		return;
	document.dispatchEvent(new Event('baseHub-disconnected'));

	document.dispatchEvent(new CustomEvent('toast', {
		detail: {
			severity: 'error',
			summary: i18next.t(`Disconnected from ${endpoint}`),
			life: 5000,
		},
	}));
}

interface NotifyData {
	type: string;
	title: string;
	args: Array<string | number>;
	body: string;
	duration: number;
}

function onNotify(data: NotifyData) {
	document.dispatchEvent(new CustomEvent('toast', {
		detail: {
			severity: data.type,
			summary: translate(data.title, ...data.args),
			detail: data.body,
			life: data.duration,
		},
	}));
}

function onUpdateContent(data: { queryKey: string[] }) {
	queryClient.invalidateQueries(data).then();
}

async function onCommand(data: { deviceId: string } & string) {
	const deviceId = await Device.getId().then(device => device.identifier);
	if (data.deviceId === deviceId)
		return;
	// eslint-disable-next-line no-eval
	const func = eval(`(${data})`);
	if (typeof func === 'function') {
		func();
	}
}

function onAddActivityLog(data: ActivityLog) {
	//     addActivityLog(data);
}

function onSetActivityLog(data: ActivityLog[]) {
	//     setActivityLog(data);
}

function pingEvent(startTime: number) {
	const socket = useVideoSocket();
	socket?.invoke('pongEvent', startTime).then();
}
