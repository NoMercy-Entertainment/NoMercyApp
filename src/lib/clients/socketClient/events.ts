import { ref } from 'vue';
import type { HubConnection } from '@microsoft/signalr';
import type { ActivityLog } from '@/types/server';
import { queryClient } from '@/config/tanstack-query';
import { useVideoSocket } from '@/store/videoSocket';
import { Device } from '@capacitor/device';

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

const timeout = ref<NodeJS.Timeout>();

export function onConnect(socket?: HubConnection | null) {
	if (!socket)
		return;
	document.dispatchEvent(new Event('baseHub-connected'));
	clearTimeout(timeout.value);

	// timeout.value = setTimeout(() => {
	// showNotification({
	// 	title: i18next.t('Connected to server'),
	// 	type: TYPE.SUCCESS,
	// 	visibleOnly: true,
	// 	duration: 2000,
	// });
	// }, 500);
}

export function onDisconnect(socket?: HubConnection | null) {
	if (!socket)
		return;
	document.dispatchEvent(new Event('baseHub-disconnected'));

	// showNotification({
	// 	title: i18next.t('Disconnected from server'),
	// 	type: TYPE.ERROR,
	// 	visibleOnly: true,
	// 	duration: 2000,
	// });
}

function onNotify(data: any) {
	// showNotification({
	// 	title: translate(data.title, ...data.args),
	// 	body: data.body,
	// 	type: data.type,
	// 	visibleOnly: data.visibleOnly,
	// 	duration: data.duration,
	// });
}

function onUpdateContent(data: any) {
	queryClient.invalidateQueries(data).then();

	// const currentSong = useStore(store, state => state.music.currentSong);
	// if (data?.id === currentSong.value?.id) {
	// 	setCurrentSong(currentSong.value);
	// }
}

async function onCommand(data: any) {
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
