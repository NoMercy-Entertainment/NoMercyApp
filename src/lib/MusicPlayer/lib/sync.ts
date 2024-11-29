// import type MusicPlayer from '@/lib/MusicPlayer';
// import {
// 	CurrentItem,
// 	IsMuted,
// 	IsShuffling,
// 	RepeatState,
// 	Time,
// 	type TimeState,
// 	Volume
// } from '@/lib/MusicPlayer/lib/types';
// import type {Song} from '@/types/api/music/musicPlayer';
// import type {Device} from '@/types/server';
// import {useSocket} from '@/store/socket';
//
// interface Actions {
// 	setCurrentDevice?: (value: any) => void;
// 	setDevices?: (value: any) => void;
// }
//
// interface Socket {
// 	on(event: string, callback: (...args: any[]) => any): void;
//
// 	off(event: string, callback: (...args: any[]) => any): void;
//
// 	invoke(event: string, payload?: any): Promise<any>;
// }
//
// class MusicSync {
// 	protected _player: MusicPlayer;
// 	protected _actions: Actions;
// 	protected _deviceId: string = '';
// 	protected _devices: Device[] = [];
// 	protected _currentDevice: Device | undefined;
// 	protected _hasEvents = false;
// 	protected _isCurrentDevice: boolean = false;
//
// 	constructor(player: MusicPlayer, actions: Actions, deviceId: string) {
// 		this._player = player;
// 		this._deviceId = deviceId;
// 		this._actions = actions;
//
// 		this.#_setup();
//
// 		this.#_socketOnConnect();
// 	}
//
// 	#_setup() {
// 		const socket = useSocket();
// 		if (!socket) return;
// 		socket.on('connect', this.#_socketOnConnect.bind(this));
// 		socket.on('ConnectedDevices', this.#_socketOnConnectedDevices.bind(this));
// 		socket.on('CurrentDevice', this.#_socketOnCurrentDevice.bind(this));
// 		// socket.on('State', this.#_socketOnState.bind(this));
// 		// socket.on('Play', this.#_socketOnPlay.bind(this));
// 		// socket.on('Pause', this.#_socketOnPause.bind(this));
// 		// socket.on('Stop', this.#_socketOnStop.bind(this));
// 		// socket.on('Next', this.#_socketOnNext.bind(this));
// 		// socket.on('Previous', this.#_socketOnPrevious.bind(this));
// 		// socket.on('Shuffle', this.#_socketOnShuffle.bind(this));
// 		// socket.on('Repeat', this.#_socketOnRepeat.bind(this));
// 		// socket.on('Mute', this.#_socketOnMute.bind(this));
// 		// socket.on('Volume', this.#_socketOnVolume.bind(this));
// 		// socket.on('SeekTo', this.#_socketOnSeekTo.bind(this));
// 		// socket.on('CurrentTime', this.#_socketOnCurrentTime.bind(this));
// 		// socket.on('Queue', this.#_socketOnQueue.bind(this));
// 		// socket.on('Backlog', this.#_socketOnBacklog.bind(this));
// 		// socket.on('CurrentItem', this.#_socketOnCurrentItem.bind(this));
//
// 		this._player.on('volume', this.#_playerVolume.bind(this));
// 		this._player.on('queue', this.#_playerQueue.bind(this));
// 		this._player.on('backlog', this.#_playerBacklog.bind(this));
// 		this._player.on('song', this.#_playerCurrentItem.bind(this));
// 		this._player.on('duration', this.#_playerSeekTo.bind(this));
// 		this._player.on('time', this.#_playerCurrentTime.bind(this));
// 		this._player.on('repeat', this.#_playerRepeat.bind(this));
// 		this._player.on('shuffle', this.#_playerShuffle.bind(this));
// 		this._player.on('mute', this.#_playerMute.bind(this));
// 		this._player.on('play', this.#_playerPlay.bind(this));
// 		this._player.on('pause', this.#_playerPause.bind(this));
// 		this._player.on('stop', this.#_playerStop.bind(this));
// 	}
//
// 	dispose() {
// 		const socket = useSocket();
// 		if (!socket) return;
// 		socket.off('connect', this.#_socketOnConnect.bind(this));
// 		socket.off('ConnectedDevices', this.#_socketOnConnectedDevices.bind(this));
// 		socket.off('CurrentDevice', this.#_socketOnCurrentDevice.bind(this));
// 		// socket.off('State', this.#_socketOnState.bind(this));
// 		// socket.off('Play', this.#_socketOnPlay.bind(this));
// 		// socket.off('Pause', this.#_socketOnPause.bind(this));
// 		// socket.off('Stop', this.#_socketOnStop.bind(this));
// 		// socket.off('Next', this.#_socketOnNext.bind(this));
// 		// socket.off('Previous', this.#_socketOnPrevious.bind(this));
// 		// socket.off('Shuffle', this.#_socketOnShuffle.bind(this));
// 		// socket.off('Repeat', this.#_socketOnRepeat.bind(this));
// 		// socket.off('Mute', this.#_socketOnMute.bind(this));
// 		// socket.off('Volume', this.#_socketOnVolume.bind(this));
// 		// socket.off('SeekTo', this.#_socketOnSeekTo.bind(this));
// 		// socket.off('CurrentTime', this.#_socketOnCurrentTime.bind(this));
// 		// socket.off('Queue', this.#_socketOnQueue.bind(this));
// 		// socket.off('Backlog', this.#_socketOnBacklog.bind(this));
// 		// socket.off('CurrentItem', this.#_socketOnCurrentItem.bind(this));
//
// 		this._player.off('volume', this.#_playerVolume.bind(this));
// 		this._player.off('queue', this.#_playerQueue.bind(this));
// 		this._player.off('backlog', this.#_playerBacklog.bind(this));
// 		this._player.off('song', this.#_playerCurrentItem.bind(this));
// 		this._player.off('duration', this.#_playerSeekTo.bind(this));
// 		this._player.off('time', this.#_playerCurrentTime.bind(this));
// 		this._player.off('repeat', this.#_playerRepeat.bind(this));
// 		this._player.off('shuffle', this.#_playerShuffle.bind(this));
// 		this._player.off('mute', this.#_playerMute.bind(this));
// 		this._player.off('play', this.#_playerPlay.bind(this));
// 		this._player.off('pause', this.#_playerPause.bind(this));
// 		this._player.off('stop', this.#_playerStop.bind(this));
//
// 	}
//
// 	#_socketOnConnect() {
// 		const socket = useSocket();
// 		if (!socket) return;
// 		// socket.invoke('State')
// 		// 	.then((data: any) => this.#_socketOnState(data));
// 	}
//
// 	#_socketOnConnectedDevices(devices: Device[]) {
// 		this._devices = devices;
//
// 		if (typeof this._actions.setDevices != 'undefined')
// 			this._actions.setDevices(devices);
// 	}
//
// 	#_socketOnCurrentDevice(deviceId: string) {
// 		if (!deviceId) return;
//
// 		this._isCurrentDevice = deviceId === this._deviceId;
//
// 		if (typeof this._actions.setCurrentDevice != 'undefined')
// 			this._actions.setCurrentDevice(deviceId);
//
// 		// if (this._isCurrentDevice) {
// 		window.musicPlayer.unmute();
// 		// } else {
// 		//     window.musicPlayer.mute();
// 		// }
// 	}
//
// 	#_socketOnState(data: any) {
// 		if (data.currentDevice) {
// 			if (typeof this._actions.setCurrentDevice != 'undefined') {
// 				if (this._devices.some(device => device.device_id === data.currentDevice)) {
// 					this._actions.setCurrentDevice(data.currentDevice);
// 					this._isCurrentDevice = data.currentDevice === this._deviceId;
// 				} else {
// 					this._actions.setCurrentDevice(this._deviceId);
// 					this._isCurrentDevice = true;
// 				}
// 			}
// 		} else {
// 			const socket = useSocket();
// 			if (!socket) return;
// 			socket.invoke('SetCurrentDevice', {
// 				deviceId: this._deviceId
// 			}).then();
//
// 			this._isCurrentDevice = true;
// 		}
//
// 		console.log(data);
// 		this._player.setVolume(data.volume);
//
// 		// if (data.mute || data.currentDevice !== this._deviceId) {
// 		//     this._player.mute();
// 		// } else {
// 		//     this._player.unmute();
// 		// }
//
// 		// this._player.setQueue(data.queue);
// 		// this._player.setBackLog(data.backlog);
//
// 		// if (data.currentItem) {
// 		//     this._player.setCurrentSong(data.currentItem);
// 		// }
//
// 		if (data.shuffle) {
// 			this._player.shuffle(data.shuffle);
// 		}
//
// 		if (data.repeat) {
// 			this._player.repeat(data.repeat);
// 		}
//
// 		if (data.time) {
// 			this._player.once('time', () => {
// 				this._player.seek(data.time);
//
// 				this._player.once('time', () => {
// 					if (data.playState === 'play') {
// 						this._player.play().then();
// 					} else {
// 						// this._player.pause();
// 					}
// 				});
// 			});
// 		}
// 	}
//
// 	#_socketOnPlay() {
// 		this._player.play().then();
// 	}
//
// 	#_socketOnPause() {
// 		this._player.pause();
// 	}
//
// 	#_socketOnStop() {
// 		this._player.stop();
// 	}
//
// 	#_socketOnNext() {
// 		this._player.next();
// 	}
//
// 	#_socketOnPrevious() {
// 		this._player.previous();
// 	}
//
// 	#_socketOnShuffle(value: IsShuffling) {
// 		this._player.shuffle(value);
// 	}
//
// 	#_socketOnRepeat(state: RepeatState) {
// 		this._player.repeat(state);
// 	}
//
// 	#_socketOnMute(value: IsMuted) {
// 		// if (value || !this._isCurrentDevice) {
// 		//     this._player.mute();
// 		// } else {
// 		//     this._player.unmute();
// 		// }
// 	}
//
// 	#_socketOnVolume(volume: Volume) {
// 		this._player.setVolume(volume);
// 	}
//
// 	#_socketOnSeekTo(time: Time) {
// 		this._player.seek(time);
// 	}
//
// 	#_socketOnCurrentTime(time: Time) {
// 		this._player.seek(time);
// 	}
//
// 	#_socketOnQueue(queue: Song[]) {
// 		this._player.setQueue(queue);
// 	}
//
// 	#_socketOnBacklog(backlog: Song[]) {
// 		this._player.setBackLog(backlog);
// 	}
//
// 	#_socketOnCurrentItem(item: Song) {
// 		this._player.setCurrentSong(item);
// 	}
//
//
// 	#_playerPlay() {
// 		if (!this._isCurrentDevice) return;
// 		// const socket = useSocket();
// 		// socket.invoke('Play').then();
// 	}
//
// 	#_playerPause() {
// 		if (!this._isCurrentDevice) return;
// 		// const socket = useSocket();
// 		// socket.invoke('Pause').then();
// 	}
//
// 	#_playerStop() {
// 		if (!this._isCurrentDevice) return;
// 		// const socket = useSocket();
// 		// socket.invoke('Stop').then();
// 	}
//
// 	#_playerShuffle(value: IsShuffling) {
// 		if (!this._isCurrentDevice) return;
// 		// const socket = useSocket();
// 		// socket.invoke('Shuffle', value).then();
// 	}
//
// 	#_playerRepeat(state: RepeatState) {
// 		if (!this._isCurrentDevice) return;
// 		// const socket = useSocket();
// 		// socket.invoke('Repeat', state).then();
// 	}
//
// 	#_playerMute(value: IsMuted) {
// 		if (!this._isCurrentDevice) return;
// 		// const socket = useSocket();
// 		// socket.invoke('Mute', value).then();
// 	}
//
// 	#_playerVolume(volume: Volume) {
// 		if (!this._isCurrentDevice) return;
// 		// const socket = useSocket();
// 		// socket.invoke('Volume', volume).then();
// 	}
//
// 	#_playerSeekTo(time: Time) {
// 		if (!this._isCurrentDevice) return;
// 		// const socket = useSocket();
// 		// socket.invoke('SeekTo', time).then();
// 	}
//
// 	#_playerCurrentTime(time: TimeState) {
// 		if (!this._isCurrentDevice) return;
// 		const socket = useSocket();
// 		if (!socket) return;
// 		socket.invoke('CurrentTime', time.position).then();
// 	}
//
// 	#_playerQueue(queue: Song[]) {
// 		if (!this._isCurrentDevice) return;
// 		const socket = useSocket();
// 		if (!socket) return;
// 		socket.invoke('Queue', queue).then();
// 	}
//
// 	#_playerBacklog(backlog: Song[]) {
// 		if (!this._isCurrentDevice) return;
// 		const socket = useSocket();
// 		if (!socket) return;
// 		socket.invoke('Backlog', backlog).then();
// 	}
//
// 	#_playerCurrentItem(item: CurrentItem) {
// 		if (!this._isCurrentDevice) return;
// 		const socket = useSocket();
// 		if (!socket) return;
// 		socket.invoke('CurrentItem', item).then();
// 	}
//
//
// 	setCurrentDevice(deviceId: string) {
// 		const socket = useSocket();
// 		if (!socket) return;
// 		socket.invoke('SetCurrentDevice', {
// 			deviceId
// 		}).then();
// 	}
//
// 	togglePlayback() {
// 		if (this._player.isPlaying) {
// 			this.pause();
// 		} else {
// 			this.play();
// 		}
// 	}
//
// 	play() {
// 		this._player.play().then();
// 		const socket = useSocket();
// 		if (!socket) return;
// 		socket.invoke('Play').then();
// 	}
//
// 	stop() {
// 		this._player.stop();
// 		const socket = useSocket();
// 		if (!socket) return;
// 		socket.invoke('Stop').then();
// 	}
//
// 	pause() {
// 		this._player.pause();
// 		const socket = useSocket();
// 		if (!socket) return;
// 		socket.invoke('Pause').then();
// 	}
//
// 	next() {
// 		this._player.next();
// 		const socket = useSocket();
// 		if (!socket) return;
// 		socket.invoke('Next').then();
// 		socket.invoke('CurrentItem', this._player.currentSong).then();
//
// 	}
//
// 	previous() {
// 		this._player.previous();
// 		const socket = useSocket();
// 		if (!socket) return;
// 		socket.invoke('Previous').then();
// 		socket.invoke('CurrentItem', this._player.currentSong).then();
//
// 	}
//
// 	shuffle(value: IsShuffling) {
// 		this._player.shuffle(value);
// 		const socket = useSocket();
// 		if (!socket) return;
// 		socket.invoke('Shuffle').then();
// 	}
//
// 	repeat(value: RepeatState) {
// 		this._player.repeat(value);
// 		const socket = useSocket();
// 		if (!socket) return;
// 		socket.invoke('Repeat').then();
// 	}
//
// 	toggleMute() {
// 		if (this._player.isMuted) {
// 			this.unmute();
// 		} else {
// 			this.mute();
// 		}
//
// 	}
//
// 	mute() {
// 		this._player.mute();
// 		const socket = useSocket();
// 		if (!socket) return;
// 		socket.invoke('Mute', true).then();
// 	}
//
// 	unmute() {
// 		this._player.unmute();
// 		const socket = useSocket();
// 		if (!socket) return;
// 		socket.invoke('Mute', false).then();
// 	}
//
// 	setVolume(volume: Volume) {
// 		this._player.setVolume(volume);
// 		const socket = useSocket();
// 		if (!socket) return;
// 		socket.invoke('Volume', volume).then();
//
// 	}
//
// 	seek(time: Time) {
// 		this._player.seek(time);
// 		const socket = useSocket();
// 		if (!socket) return;
// 		socket.invoke('SeekTo', time).then();
// 	}
//
// 	getDuration() {
// 		return this._player.getDuration();
// 	}
// }
//
// export default MusicSync;
