import { computed, ref, toRaw, watch } from 'vue';

import type SocketClient from '@/lib/clients/socketClient/SocketClient';
import type { HubConnection } from '@microsoft/signalr';
import audioPlayer, {
	connectedMusicDevices,
	currentMusicDeviceId,
	currentSong,
	currentTime,
	setCurrentPlaylist,
	volume,
} from '@/store/audioPlayer';
import { deviceId } from '@/store/deviceInfo';
import type { Device } from '@/types/server';
import type { MusicPlayerState, StateEvents } from '@/types/musicPlayer';

export const mc = ref(false);
export const musicSocketIsConnected = computed(() => mc.value);

const si = ref<SocketClient | undefined | null>();
export const musicSocketInstance = computed(() => si.value);
export const musicSocketConnection = computed(() => si.value?.connection);
export function setMusicSocketInstance(value: SocketClient | null) {
	si.value = value;
}

const ps = ref<MusicPlayerState>();
export const playerState = computed(() => ps.value);

export function useMusicSocket() {
	if (!si.value?.connection)
		return null;
	return toRaw(si.value?.connection) as HubConnection;
}

watch(si, (value) => {
	if (!value?.connection)
		return;
	value?.connection?.on('connected', connected);
	value?.connection?.on('disconnected', disconnected);
	value?.connection?.on('error', error);

	value?.connection?.on('MusicPlayerState', handleMusicPlayerState);
	value?.connection?.on(
		'ConnectedDevicesState',
		handleMusicConnectedDevicesState,
	);
	value?.connection?.on('ChangeDevice', handleMusicBroadcastStatus);

	value?.connection?.invoke('Devices').then(handleMusicConnectedDevicesState).catch((err) => {
		console.error('Failed to invoke Devices:', err);
	});

	window.addEventListener(
		'beforeunload',
		() => {
			value?.connection?.stop();
		},
		{ once: true },
	);

	window.addEventListener(
		'unload',
		() => {
			value?.connection?.stop();
		},
		{ once: true },
	);
});

function connected() {
	mc.value = true;
	console.log('Connected to Music SignalR');
	document.dispatchEvent(new Event('musicHub-connected'));
}

function disconnected(err?: Event | void) {
	mc.value = false;
	console.log('Disconnected from Music SignalR', err);
	document.dispatchEvent(new Event('musicHub-disconnected'));
}

function error(err: Error) {
	mc.value = false;
	console.error('Music SignalR Error:', err);
	document.dispatchEvent(new Event('musicHub-error'));
}

interface BroadcastStatusData {
	events: { deviceBroadcastStatus: { device_id: string } }[];
}

export function handleMusicBroadcastStatus(data: BroadcastStatusData): void {
	if (!data)
		return;
	for (const e of data.events) {
		// console.raw(e);
		const state = e.deviceBroadcastStatus;

		currentMusicDeviceId.value = state.device_id;

		if (state.device_id === deviceId.value) {
			audioPlayer.unmute();
		}
		else {
			audioPlayer.mute();
		}
	}
}

export function handleMusicPlayerState(data: StateEvents) {
	if (!data)
		return;

	for (const e of data.events) {
		if (e.type !== 'PlayerStateChanged')
			continue;

		const state = e.event.state;
		if (!state)
			continue;

		// Handle stop case
		if (!state.item) {
			audioPlayer.stop();
			currentMusicDeviceId.value = null;
			continue; // Not return - process other events
		}

		// Set current device from server state if not yet known
		if (!currentMusicDeviceId.value && state.device_id) {
			currentMusicDeviceId.value = state.device_id;
		}

		// Calculate seek position (all in milliseconds, then convert)
		const latencyCompensationMs = (Date.now() - state.timestamp) / 2;
		const adjustedProgressMs = state.progress_ms + latencyCompensationMs;
		const seekValueSeconds = adjustedProgressMs / 1000;

		// Update state refs
		setCurrentPlaylist(state.current_list);

		// Determine if this device is active (use currentMusicDeviceId which is
		// only changed by explicit ChangeDevice events, not by track changes)
		const isActiveDevice = currentMusicDeviceId.value === deviceId.value;

		// Mute/unmute based on active device
		if (isActiveDevice && !state.muted_state) {
			audioPlayer.unmute();
		}
		else {
			audioPlayer.mute();
		}

		// Apply settings - only update if values actually changed
		const clampedVolume = Math.max(0, Math.min(100, state.volume_percentage));
		if (volume.value !== clampedVolume) {
			audioPlayer.setVolume(clampedVolume);
			volume.value = clampedVolume;
		}

		audioPlayer.repeat(state.repeat_state);
		audioPlayer.shuffle(state.shuffle_state);
		audioPlayer.setQueue(state.playlist);

		// Track change handling
		const isTrackChange = currentSong.value?.id !== state.item.id;

		if (isTrackChange) {
			audioPlayer.setCurrentSong(state.item);

			// Handle load error
			audioPlayer.once('error', () => {
				console.error('Failed to load track:', state.item.name);
				// Maybe skip to next or show error UI
			});

			audioPlayer.once('canplay', () => {
				audioPlayer.seek(seekValueSeconds);
				if (state.is_playing) {
					audioPlayer.play().catch((err: unknown) => {
						console.error('Failed to play after canplay:', err);
					});
				}
				else {
					audioPlayer.pause();
				}
			});
		}
		else {
			// Same track - only update metadata if it actually changed (e.g., favorite toggled)
			// Avoid assigning new object references when data is identical to prevent cascading re-renders
			if (state.item.favorite_track !== currentSong.value?.favorite_track) {
				currentSong.value = state.item;
			}

			const drift = Math.abs((currentTime.value || 0) - seekValueSeconds);
			const shouldSeek = isActiveDevice ? drift > 0.75 : drift > 2.0;

			if (shouldSeek) {
				audioPlayer.seek(seekValueSeconds);
			}

			// Sync play/pause state
			if (state.is_playing) {
				audioPlayer.play().catch((err: unknown) => {
					console.error('Failed to sync play state:', err);
				});
			}
			else {
				audioPlayer.pause();
			}
		}
	}
}

function handleMusicConnectedDevicesState(devices: Device[]) {
	// console.log(devices);
	connectedMusicDevices.value = devices.toSorted((a, b) => a?.device_id.localeCompare(b?.device_id));
}
