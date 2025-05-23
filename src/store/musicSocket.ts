import {computed, ref, toRaw, watch} from 'vue';

import SocketClient from '@/lib/clients/socketClient/SocketClient';
import { HubConnection } from '@microsoft/signalr';
import audioPlayer, {
	connectedDevices,
	currentDeviceId,
	currentSong,
	currentTime,
	setCurrentPlaylist
} from "@/store/audioPlayer";
import {deviceId} from "@/store/deviceInfo";
import {Device} from "@/types/server";

export const mc = ref(false);
export const musicSocketIsConnected = computed(() => mc.value);

const si = ref<SocketClient | undefined>();
export const musicSocketInstance = computed(() => si.value);
export const musicSocketConnection = computed(() => si.value?.connection);
export const setMusicSocketInstance = (value: SocketClient) => {
	si.value = value;
}

export const useMusicSocket = () => {
	if (!si.value?.connection) return null;
	return toRaw(si.value?.connection) as HubConnection
};

watch(si, value => {
	if(!value?.connection) return;
	value?.connection?.on('connected', connected);
	value?.connection?.on('disconnected', disconnected);
	value?.connection?.on('error', error);

	value?.connection?.on('PlayerState', handlePlayerState);
	value?.connection?.on('ConnectedDevicesState', handleConnectedDevicesState);
	value?.connection?.on('ChangeDevice', handleBroadcastStatus);

	value?.connection?.invoke('Devices').then(handleConnectedDevicesState);
});

const connected = () => {
	mc.value = true;
	console.log('Connected to Music SignalR');
	document.dispatchEvent(new Event('musicHub-connected'));
};

const disconnected = (err?: Event | void) => {
	mc.value = false;
	console.log('Disconnected from Music SignalR', err);
	document.dispatchEvent(new Event('musicHub-disconnected'));
};

const error = (err: Error) => {
	mc.value = false;
	console.error('Music SignalR Error:', err);
	document.dispatchEvent(new Event('musicHub-error'));
}

export const handleBroadcastStatus = (data: any) => {
	if (!data) return;
	for (const e of data.events) {
		console.raw(e);
		const state = e.deviceBroadcastStatus;

		currentDeviceId.value = state.device_id;

		if (state.device_id == deviceId.value) {
			audioPlayer.unmute();
		} else {
			audioPlayer.mute();
		}
	}
};

export const handlePlayerState = (data: any) => {
	if (!data) return;
	for (const e of data.events) {
		if (e.type !== 'PlayerStateChanged') continue;
		const state = e.event.state;

		console.log(state);

		if(!state?.item) {
			audioPlayer.stop();
			return;
		}

		// const offset = (Date.now() - state.timestamp) / 1000;
		// const seekValue = state.progress_ms >= 1
		// 	? (state.progress_ms + offset) / 1000
		// 	: state.progress_ms / 1000;
		const seekValue = state.progress_ms / 1000;

		currentDeviceId.value = state.device_id;
		setCurrentPlaylist(state.current_list);

		if(state.device_id == deviceId.value) {
			audioPlayer.unmute();
		} else {
			audioPlayer.mute();
		}

		audioPlayer.repeat(state.repeat_state);
		audioPlayer.shuffle(state.shuffle_state);

		if(currentSong.value?.id != state.item?.id) {
			audioPlayer.setQueue([]);
			audioPlayer.setBackLog([]);

			audioPlayer.setCurrentSong(state.item);
			audioPlayer.setQueue(state.playlist);

			setTimeout(() => {
				if (state.device_id && state.is_playing) {
					audioPlayer.play().then();
				} else {
					audioPlayer.pause();
				}

				setTimeout(() => {
					audioPlayer.seek(seekValue);
				}, 300);
			}, 500);
		}

		if(state.device_id == deviceId.value) {
			(!currentTime.value || Math.abs(currentTime.value - seekValue) > 0.75) && audioPlayer.seek(seekValue);
		} else if(state.device_id !== deviceId.value) {
			audioPlayer.seek(seekValue);
		}

		if (state.volume_percentage < 0) state.volume_percentage = 0;
		if (state.volume_percentage > 100) state.volume_percentage = 100;

		audioPlayer.setVolume(state.volume_percentage);

		if (state.device_id && state.is_playing) {
			audioPlayer.play().then();
		} else {
			audioPlayer.pause();
		}
	}
};

const handleConnectedDevicesState = (devices: Device[]) => {
  console.log(devices);
  connectedDevices.value = devices;
};