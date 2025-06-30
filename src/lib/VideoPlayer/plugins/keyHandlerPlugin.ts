import {NMPlayer} from "@nomercy-entertainment/nomercy-video-player/src/types";
import {Plugin} from "@/lib/VideoPlayer";

export interface KeyHandlerPluginArgs {
}

export class KeyHandlerPlugin extends Plugin {
	player: NMPlayer<KeyHandlerPluginArgs> = <NMPlayer<KeyHandlerPluginArgs>>{};
	private boundKeyHandler: (event: KeyboardEvent) => void = () => { };

	initialize(player: NMPlayer<KeyHandlerPluginArgs>) {
		this.player = player;
		this.boundKeyHandler = this.keyHandler.bind(this)
	}

	use() {
		if (this.player.options.disableControls) return;
		document.addEventListener('keyup', this.boundKeyHandler, false);
	}

	dispose() {
		document.removeEventListener('keyup', this.boundKeyHandler);
	}

	/**
	 * Handles keyboard events and executes the corresponding function based on the key binding.
	 * @param {KeyboardEvent} event - The keyboard event to handle.
	 */
	keyHandler(event: KeyboardEvent) {
		if (document.activeElement?.nodeName == 'INPUT') return;

		const keys = this.keyBindings();
		let keyTimeout = false;

		if (this.player.getVideoElement().getBoundingClientRect().width == 0) return;

		if (!keyTimeout && this.player) {
			keyTimeout = true;

			if (keys.some(k => k.key === event.key && k.control === event.ctrlKey)) {
				event.preventDefault();
				keys.find(k => k.key === event.key && k.control === event.ctrlKey)?.function();
			} else {
				// alert(event.key);
			}
		}
		setTimeout(() => {
			keyTimeout = false;
		}, 300);
	}

	hasNoMercyConnect(): boolean {
		return this.player.plugins.has('videoNoMercyConnect');
	}

	getNoMercyConnectSocket() {
		if (this.hasNoMercyConnect()) {
			return this.player.plugins.get('videoNoMercyConnect')?.socket;
		}
		return null;
	}

	sendNoMercyConnectCommand(
		command: string,
		value?: string | number | boolean | null,
	) {
		if (this.hasNoMercyConnect()) {
			try {
				const socket = this.getNoMercyConnectSocket();
				if (socket) {
					socket.invoke('PlaybackCommand', command, value !== null ? value : null);
				} else {
					console.error("No NoMercyConnect socket available");
				}
			} catch (error) {
				console.error("Error invoking PlaybackCommand:", error);
			}
		} else {
			console.warn("No NoMercyConnect plugin available");
		}
	}

	handleForward() {
		if(this.hasNoMercyConnect()){
			this.sendNoMercyConnectCommand("forward");
		} else {
			this.player.rewindVideo();
		}
	}

	handleBackward() {
		if(this.hasNoMercyConnect()){
			this.sendNoMercyConnectCommand("backward");
		} else {
			this.player.rewindVideo();
		}
	}

	handlePlayback() {
		if(this.hasNoMercyConnect()){
			this.sendNoMercyConnectCommand(this.player.isPlaying ? "pause" : "play");
		} else {
			this.player.togglePlayback();
		}
	}

	handlePrevious() {
		if(this.hasNoMercyConnect()){
			this.sendNoMercyConnectCommand("previous");
		} else {
			this.player.previous();
		}
	}

	handleNext() {
		if(this.hasNoMercyConnect()){
			this.sendNoMercyConnectCommand("next");
		} else {
			this.player.next();
		}
	}

	handleCycleCaption() {
		if(this.hasNoMercyConnect()){
			this.sendNoMercyConnectCommand("cycleCaption");
		} else {
			this.player.cycleSubtitles();
		}
	}

	handleCycleAudio() {
		if(this.hasNoMercyConnect()){
			this.sendNoMercyConnectCommand("cycleAudio");
		} else {
			this.player.cycleAudioTracks();
		}
	}


	keyBindings() {
		return [
			{
				name: 'Play',
				key: 'MediaPlay',
				control: false,
				function: () => {
					if(this.player.options.disableMediaControls) return;
					if(this.hasNoMercyConnect()){
						this.sendNoMercyConnectCommand("play");
					} else {
						this.player.play().then();
					}
				}
			},
			{
				name: 'Pause',
				key: 'MediaPause',
				control: false,
				function: () => {
					if(this.player.options.disableMediaControls) return;
					if(this.hasNoMercyConnect()){
						this.sendNoMercyConnectCommand("pause");
					} else {
						this.player.pause();
					}
				}
			},
			{
				name: 'Toggle playback',
				key: ' ',
				control: false,
				function: () => {
					this.handlePlayback();
				}
			},
			{
				name: 'Toggle playback',
				key: 'MediaPlayPause',
				control: false,
				function: () => {
					if(this.player.options.disableMediaControls) return;
					this.handlePlayback();
				}
			},
			{
				name: 'Stop',
				key: 'MediaStop',
				control: false,
				function: () => {
					if(this.player.options.disableMediaControls) return;
					if(this.hasNoMercyConnect()){
						this.sendNoMercyConnectCommand("stop");
					} else {
						this.player.stop();
					}
				}
			},
			{
				name: 'Rewind',
				key: 'ArrowLeft',
				control: false,
				function: () => this.handleBackward(),
			},
			{
				name: 'Rewind',
				key: 'MediaRewind',
				control: false,
				function: () => {
					if(!this.player.isTv() && this.player.options.disableMediaControls) return;
					this.handleBackward();
				}
			},
			{
				name: 'Fast forward',
				key: 'ArrowRight',
				control: false,
				function: () => this.handleForward(),
			},
			{
				name: 'Fast forward',
				key: 'MediaFastForward',
				control: false,
				function: () => {
					if(this.player.options.disableMediaControls) return;
					this.handleForward();
				}
			},
			{
				name: 'Previous item',
				key: 'MediaTrackPrevious',
				control: false,
				function: () => {
					if(this.player.options.disableMediaControls) return;
					this.handlePrevious();
				}
			},
			{
				name: 'Previous item',
				key: 'p',
				control: false,
				function: () => this.handlePrevious(),
			},
			{
				name: 'Next item',
				key: 'MediaTrackNext',
				control: false,
				function: () => {
					if(this.player.options.disableMediaControls) return;
					this.handleNext();
				}
			},
			{
				name: 'Next item',
				key: 'n',
				control: false,
				function: () => this.handleNext(),
			},
			{
				name: 'Cycle subtitle tracks',
				key: 'Subtitle',
				control: false,
				function: () => this.handleCycleCaption(),
			},
			{
				name: 'Cycle subtitle tracks',
				key: '5',
				control: false,
				function: () => this.handleCycleCaption(),
			},
			{
				name: 'Cycle subtitle tracks',
				key: 'v',
				control: false,
				function: () => this.handleCycleCaption(),
			},
			{
				name: 'Cycle audio tracks',
				key: 'Audio',
				control: false,
				function: () => this.handleCycleAudio(),
			},
			{
				name: 'Cycle audio tracks',
				key: '2',
				control: false,
				function: () => this.handleCycleAudio(),
			},
			{
				name: 'Cycle audio',
				key: 'b',
				control: false,
				function: () => this.handleCycleAudio(),
			},
			{
				name: 'Forward 30 seconds',
				key: 'ColorF0Red',
				control: false,
				function: () => {
					if(this.hasNoMercyConnect()){
						this.sendNoMercyConnectCommand("forward", 30);
					} else {
						this.player.forwardVideo(30);
					}
				}
			},
			{
				name: 'Forward 60 seconds',
				key: 'ColorF1Green',
				control: false,
				function: () => {
					if(this.hasNoMercyConnect()){
						this.sendNoMercyConnectCommand("forward", 60);
					} else {
						this.player.forwardVideo(60);
					}
				}
			},
			{
				name: 'Forward 90 seconds',
				key: 'ColorF2Yellow',
				control: false,
				function: () => {
					if(this.hasNoMercyConnect()){
						this.sendNoMercyConnectCommand("forward", 90);
					} else {
						this.player.forwardVideo(90);
					}
				}
			},
			{
				name: 'Forward 120 seconds',
				key: 'ColorF3Blue',
				control: false,
				function: () => {
					if(this.hasNoMercyConnect()){
						this.sendNoMercyConnectCommand("forward", 120);
					} else {
						this.player.forwardVideo(120);
					}
				}
			},
			{
				name: 'Forward 30 seconds',
				key: '3',
				control: false,
				function: () => {
					if(this.hasNoMercyConnect()){
						this.sendNoMercyConnectCommand("forward", 30);
					} else {
						this.player.forwardVideo(30);
					}
				}
			},
			{
				name: 'Forward 60 seconds',
				key: '6',
				control: false,
				function: () => {
					if(this.hasNoMercyConnect()){
						this.sendNoMercyConnectCommand("forward", 60);
					} else {
						this.player.forwardVideo(60);
					}
				}
			},
			{
				name: 'Forward 90 seconds',
				key: '9',
				control: false,
				function: () => {
					if(this.hasNoMercyConnect()){
						this.sendNoMercyConnectCommand("forward", 90);
					} else {
						this.player.forwardVideo(90);
					}
				}
			},
			{
				name: 'Forward 120 seconds',
				key: '1',
				control: false,
				function: () => {
					if(this.hasNoMercyConnect()){
						this.sendNoMercyConnectCommand("forward", 120);
					} else {
						this.player.forwardVideo(120);
					}
				}
			},
			{
				name: 'Fullscreen',
				key: 'f',
				control: false,
				function: () => {
					this.player.toggleFullscreen();
				}
			},
			{
				name: 'Volume up',
				key: 'ArrowUp',
				control: false,
				function: () => {
					!this.player.isTv() && !this.player.isMobile() && this.player.volumeUp();
				}
			},
			{
				name: 'Volume down',
				key: 'ArrowDown',
				control: false,
				function: () => {
					!this.player.isTv() && !this.player.isMobile() && this.player.volumeDown();
				}
			},
			{
				name: 'Mute',
				key: 'm',
				control: false,
				function: () => {
					this.player.toggleMute();
				}
			},
			{
				name: 'Cycle aspect ratio',
				key: 'BrowserFavorites',
				control: false,
				function: () => {
					this.player.cycleAspectRatio();
				}
			},
			{
				name: 'Cycle aspect ratio',
				key: 'a',
				control: false,
				function: () => {
					this.player.cycleAspectRatio();
				}
			},
			{
				name: 'Show info',
				key: 'Info',
				control: false,
				function: () => {
					// player.showInfo();
				},
			},
		].map((control, i) => ({
			...control,
			id: i,
		}));
	}
}

export default KeyHandlerPlugin;