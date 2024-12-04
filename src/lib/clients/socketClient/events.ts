import createUUID from '@/lib/uuidHelper';
import {ref} from 'vue';
import { HubConnection } from '@microsoft/signalr';
import {ActivityLog} from '@/types/server';
import {queryClient} from "@/config/tanstack-query";
import {useSocket} from '@/store/socket';
import {connection, dashboardSocketIsConnected} from "@/lib/clients/dashboardSocket";

export const connect = (socket?: HubConnection) => {
    if (!socket) return

    socket.on('connect', onConnect);
    socket.on('disconnected', onDisconnect);
    socket.on('notify', onNotify);

    socket.on('command', onCommand);
    socket.on('RefreshLibrary', onUpdateContent);
    socket.on('addActivityLog', onAddActivityLog);
    socket.on('setActivityLog', onSetActivityLog);
    socket.on('pingEvent', pingEvent);

};

export const disconnect = (socket?: HubConnection) => {
    if (!socket) return
    socket.off('connect', onConnect);
    socket.off('disconnected', onDisconnect);
    socket.off('notify', onNotify);

    socket.off('command', onCommand);
    socket.off('RefreshLibrary', onUpdateContent);
    socket.off('addActivityLog', onAddActivityLog);
    socket.off('setActivityLog', onSetActivityLog);
    socket.off('pingEvent', pingEvent);
};

// // @ts-ignore
// const cjs = new Castjs({
//     receiver: '925B4C3C',
// });

const timeout = ref<NodeJS.Timeout>();

export const onConnect = (socket?: HubConnection | null) => {
    if (!socket) return
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
};

export const onDisconnect = (socket?: HubConnection | null) => {
    if (!socket) return
    document.dispatchEvent(new Event('baseHub-disconnected'));

    // showNotification({
    // 	title: i18next.t('Disconnected from server'),
    // 	type: TYPE.ERROR,
    // 	visibleOnly: true,
    // 	duration: 2000,
    // });
};

const onNotify = (data: any) => {
    // showNotification({
    // 	title: translate(data.title, ...data.args),
    // 	body: data.body,
    // 	type: data.type,
    // 	visibleOnly: data.visibleOnly,
    // 	duration: data.duration,
    // });
};

const onUpdateContent = (data: any) => {
    queryClient.invalidateQueries(data.queryKey);

    // const currentSong = useStore(store, state => state.music.currentSong);
    // if (data?.id === currentSong.value?.id) {
    // 	setCurrentSong(currentSong.value);
    // }
};

const uuid = createUUID();
const deviceId = uuid.deviceId;
const onCommand = (data: any) => {
    if (data.deviceId == deviceId) return;
    const func = eval(`(${data})`);
    if (typeof func === 'function') {
        func();
    }
};

const onAddActivityLog = (data: ActivityLog) => {
//     addActivityLog(data);
};

const onSetActivityLog = (data: ActivityLog[]) => {
//     setActivityLog(data);
};

const pingEvent = (startTime: number) => {
    const socket = useSocket();
    socket.invoke('pongEvent', startTime).then()
};
