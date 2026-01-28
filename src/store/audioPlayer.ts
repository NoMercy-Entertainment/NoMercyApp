// noinspection JSUnusedGlobalSymbols

import { ref, toRaw, watch } from 'vue';
import { createAnimation, isPlatform, modalController } from '@ionic/vue';
import type {
	VolumeButtonsCallback,
	VolumeButtonsOptions,
	VolumeButtonsResult,
} from '@capacitor-community/volume-buttons';
import { VolumeButtons } from '@capacitor-community/volume-buttons';
import { PlayerCore as MusicPlayer } from '@nomercy-entertainment/nomercy-music-player';

import type {
	EQBand,
	EQSliderValues,
	EqualizerPreset,
	RepeatState,
} from '@nomercy-entertainment/nomercy-music-player/src/types';

import type { PlaylistItem } from '@/types/musicPlayer';
import { SizeState, VisibilityState } from '@/types/musicPlayer';

import type { Device } from '@/types/server.ts';

import { onDoubleClick } from '@/lib/utils';
import { siteTitle } from '@/config/config';

import { deviceId } from '@/store/deviceInfo';
import { user } from '@/store/user';
import { musicSocketConnection } from '@/store/musicSocket';

export const connectedMusicDevices = ref<Device[]>([]);
export const currentMusicDeviceId = ref<string | null>(null);

export const currentTime = ref<number>(0);
export const duration = ref<number>(0);
export const remainingTime = ref<number>(0);
export const percentage = ref<number>(0);
export const currentSong = ref<PlaylistItem | null>(null);
export const currentPlaylist = ref<string | null>(null);
export const queue = ref<PlaylistItem[]>([]);
export const backlog = ref<PlaylistItem[]>([]);
export const isPlaying = ref<boolean>(false);
export const isMuted = ref<boolean>(false);
export const isShuffling = ref<boolean>(false);
export const isRepeating = ref<RepeatState>('off');
export const volume = ref<number>(0);

export const panning = ref(0);
export const bands = ref<EQBand[]>([]);
export const equalizerPresets = ref<EqualizerPreset[]>([]);
export const equalizerSliderValues = ref<EQSliderValues>(<EQSliderValues>{});

export const equalizerPreset = ref<EqualizerPreset>(<EqualizerPreset>{});

export const lyricsMenuOpen = ref<boolean>(false);
export const hasLyrics = ref<boolean>(false);
export const deviceMenuOpen = ref<boolean>(false);
const modalOpen = ref<boolean>(false);
export const fullPlayerModalOpen = ref<boolean>(modalOpen.value);
export const queueMenuOpen = ref<boolean>(false);
export const equalizerMenuOpen = ref<boolean>(false);

export const audioPlayer = new MusicPlayer<PlaylistItem>({
	motionConfig: {
		canvas: document.getElementById('visualizer') as HTMLCanvasElement,
	},
	motionColors: [
		'#ff0000',
		'#ffff00',
		'#00ff00',
		'#00ffff',
		'#0000ff',
		'#ff00ff',
		'#ff0000',
	],
	siteTitle,
	expose: true,
	disableAutoPlayback: user.value.features?.nomercyConnect ?? false,
	actions: {
		play: () => {
			if (!user.value.features?.nomercyConnect) {
				audioPlayer.play().then();
				return;
			}
			if (!currentMusicDeviceId.value) {
				musicSocketConnection.value
					?.invoke('ChangeDeviceCommand', deviceId.value)
					.then(() => {
						console.log('Switched to device:', deviceId.value);
					})
					.catch((error) => {
						console.error('Error switching device:', error);
					});
			}
			musicSocketConnection.value?.invoke('PlaybackCommand', 'play', null);
		},
		pause: () => {
			if (!user.value.features?.nomercyConnect) {
				audioPlayer.pause();
				return;
			}
			if (!currentMusicDeviceId.value) {
				musicSocketConnection.value
					?.invoke('ChangeDeviceCommand', deviceId.value)
					.then(() => {
						console.log('Switched to device:', deviceId.value);
					})
					.catch((error) => {
						console.error('Error switching device:', error);
					});
			}
			musicSocketConnection.value?.invoke('PlaybackCommand', 'pause', null);
		},
		stop: () => {
			setLyricsMenuOpen(false);
			setQueueMenuOpen(false);
			setDeviceMenuOpen(false);
			if (!user.value.features?.nomercyConnect) {
				audioPlayer.stop();
				return;
			}
			musicSocketConnection.value?.invoke('PlaybackCommand', 'stop', null);
		},
		previous: () => {
			if (!user.value.features?.nomercyConnect) {
				audioPlayer.previous();
				return;
			}
			musicSocketConnection.value?.invoke('PlaybackCommand', 'previous', null);
		},
		next: () => {
			if (!user.value.features?.nomercyConnect) {
				audioPlayer.next();
				return;
			}
			musicSocketConnection.value?.invoke('PlaybackCommand', 'next', null);
		},
		seek: (position: number) => {
			musicSocketConnection.value?.invoke('PlaybackCommand', 'seek', position);
			audioPlayer.seek(position);
		},
	},
});

watch(user, (value) => {
	audioPlayer.setAutoPlayback(value.features?.nomercyConnect ?? false);
});

export default audioPlayer;

export function setLyricsMenuOpen(value: boolean): void {
	lyricsMenuOpen.value = value;
	queueMenuOpen.value = false;
	deviceMenuOpen.value = false;
	equalizerMenuOpen.value = false;
}

export function toggleLyricsMenuOpen(): void {
	lyricsMenuOpen.value = !lyricsMenuOpen.value;
	queueMenuOpen.value = false;
	deviceMenuOpen.value = false;
	equalizerMenuOpen.value = false;
}

export function setHasLyrics(value: boolean): void {
	hasLyrics.value = value;
}

export function setDeviceMenuOpen(value: boolean): void {
	deviceMenuOpen.value = value;
	lyricsMenuOpen.value = false;
	queueMenuOpen.value = false;
	equalizerMenuOpen.value = false;
}

export function toggleDeviceMenuOpen(): void {
	deviceMenuOpen.value = !deviceMenuOpen.value;
	lyricsMenuOpen.value = false;
	queueMenuOpen.value = false;
	equalizerMenuOpen.value = false;
}

export function setFullPlayerModalOpen(value: boolean): void {
	fullPlayerModalOpen.value = value;
	if (value) {
		setMusicSize(SizeState.full);
	}
	else {
		setMusicSize(SizeState.compact);
	}
}

export function toggleFullPlayerModalOpen(): void {
	modalOpen.value = !modalOpen.value;
}

export function openFullPlayer(): void {
	fullPlayerModalOpen.value = true;
	setMusicSize(SizeState.full);
}

export function closeFullPlayer(): void {
	fullPlayerModalOpen.value = false;
	setMusicSize(SizeState.compact);
}

export function setCurrentPlaylist(value: string): void {
	currentPlaylist.value = value;
}

export function setQueueMenuOpen(value: boolean): void {
	queueMenuOpen.value = value;
	lyricsMenuOpen.value = false;
	deviceMenuOpen.value = false;
	equalizerMenuOpen.value = false;
}

export function toggleQueueMenuOpen(): void {
	queueMenuOpen.value = !queueMenuOpen.value;
	lyricsMenuOpen.value = false;
	deviceMenuOpen.value = false;
	equalizerMenuOpen.value = false;
}

export const musicVisibility = ref<VisibilityState>(VisibilityState.hidden);

export function setMusicVisibility(value: VisibilityState): void {
	musicVisibility.value = value;
}

export const musicSize = ref<SizeState>(SizeState.compact);

export function setMusicSize(value: SizeState): void {
	musicSize.value = value;
}

export function enterAnimation(baseEl: HTMLElement) {
	const root = baseEl.shadowRoot as ShadowRoot;

	const backdropAnimation = createAnimation()
		.addElement(root.querySelector('ion-backdrop')!)
		.fromTo('opacity', '0', '0');

	const wrapperAnimation = createAnimation()
		.addElement(root.querySelector('.modal-wrapper')!)
		.keyframes([
			{ offset: 0, transform: 'translateY(100%)', opacity: '1' },
			{ offset: 1, transform: 'translateY(0%)', opacity: '1' },
		]);

	return createAnimation()
		.addElement(baseEl)
		.easing('ease-out')
		.duration(300)
		.addAnimation([backdropAnimation, wrapperAnimation]);
}

export function leaveAnimation(baseEl: HTMLElement) {
	return enterAnimation(baseEl).direction('normal');
}

export async function openModal(
	component: Function | HTMLElement | string | null,
) {
	const modal = await modalController.create({
		component,
		// animated: true,
		enterAnimation,
		leaveAnimation,
		canDismiss: () => {
			return new Promise((resolve) => {
				resolve(true);
			});
		},
		// breakpoints: [0, 1],
		// initialBreakpoint: 0,
		componentProps: {
			closeModal: async () => {
				await modal.dismiss();
			},
		},
	});

	await modal.present();
}

export function setEqualizerMenuOpen(value: boolean): void {
	equalizerMenuOpen.value = value;
	lyricsMenuOpen.value = false;
	queueMenuOpen.value = false;
	deviceMenuOpen.value = false;
}

export function toggleEqualizerMenuOpen(): void {
	equalizerMenuOpen.value = !equalizerMenuOpen.value;
	lyricsMenuOpen.value = false;
	queueMenuOpen.value = false;
	deviceMenuOpen.value = false;
}

export function closeEqualizerMenu(): void {
	equalizerMenuOpen.value = false;
	lyricsMenuOpen.value = false;
	queueMenuOpen.value = false;
	deviceMenuOpen.value = false;
}

export function abbreviateFrequency(frequency: number) {
	if (frequency >= 1000) {
		return `${frequency / 1000}k`;
	}
	return frequency;
}

export function convertToPercentage(
	value: number,
	min: number,
	max: number,
): number {
	let percentage = ((value - min) / (max - min)) * 100;

	if (percentage <= 20) {
		percentage += (5 / 20) * percentage;
	}
	else if (percentage >= 80) {
		percentage -= (5 / 20) * (100 - percentage);
	}

	return Math.max(0, Math.min(100, percentage));
}

export function handleFullReset() {
	panning.value = 0;
	setEqualizerPreset(
		equalizerPresets.value.find(
			(preset: EqualizerPreset) => preset.name === 'Flat',
		),
	);
}

export function handleChange(type: string, event: Event, band?: EQBand) {
	const value = Number.parseFloat((event.target as HTMLInputElement).value);

	if (type === 'panning') {
		panning.value = value;
		audioPlayer.setPanner(value);
		audioPlayer.saveEqualizerSettings();
		return;
	}

	if (!band?.gain)
		return;

	band.gain = value;

	if (band.frequency === 'Pre') {
		audioPlayer.setPreGain(value);
		audioPlayer.saveEqualizerSettings();
		return;
	}

	bands.value = [
		...bands.value.map((b: EQBand) => {
			if (b.frequency === band.frequency) {
				audioPlayer.setFilter(band);
				return band;
			}
			return b;
		}),
	];

	audioPlayer.equalizerBands = bands.value;

	audioPlayer.saveEqualizerSettings();
}

export function handleReset(type: string, event: MouseEvent, band?: EQBand) {
	onDoubleClick(
		event,
		() => {
		},
		() => {
			if (type === 'panning') {
				panning.value = 0;
				audioPlayer.setPanner(0);
				audioPlayer.saveEqualizerSettings();
				return;
			}

			if (!band?.gain)
				return;

			band.gain = 0;

			if (band.frequency === 'Pre') {
				audioPlayer.setPreGain(0);
				audioPlayer.saveEqualizerSettings();
				return;
			}

			bands.value = [
				...bands.value.map((b: EQBand) => {
					if (b.frequency === band.frequency) {
						audioPlayer.setFilter(band);
						return band;
					}
					return b;
				}),
			];

			audioPlayer.equalizerBands = bands.value;

			audioPlayer.saveEqualizerSettings();
		},
	);
}

export function setEqualizerPreset(value?: EqualizerPreset) {
	equalizerPreset.value
		= equalizerPresets.value.find(
			(p: EqualizerPreset) => p.name === (value?.name ?? 'Flat'),
		) ?? equalizerPresets.value[0];

	bands.value = [
		{ frequency: 'Pre', gain: equalizerSliderValues.value.pre.default },
		...equalizerPreset.value.values,
	];

	audioPlayer.equalizerBands = bands.value;

	for (let i = 1; i < bands.value.length; i++) {
		audioPlayer.setFilter(bands.value[i]);
	}

	audioPlayer.saveEqualizerSettings();
}

panning.value = audioPlayer.equalizerPanning;
bands.value = audioPlayer.equalizerBands;
equalizerPresets.value = audioPlayer.equalizerPresets;
equalizerSliderValues.value = audioPlayer.equalizerSliderValues;

equalizerPreset.value = audioPlayer.equalizerPresets.find(preset => preset.name === 'Flat')
	?? equalizerPresets.value[0];

let lastTime = 0;
audioPlayer.on('time', (timeState) => {
	currentTime.value = timeState.position;
	duration.value = timeState.duration;
	remainingTime.value = timeState.remaining;
	percentage.value = timeState.percentage;

	if (
		currentMusicDeviceId.value === deviceId.value
		&& timeState.position - lastTime > 5
	) {
		lastTime = timeState.position;
		// musicSocketConnection.value?.invoke('CurrentTimeCommand', timeState.position);
	}
});
audioPlayer.on('song', (data) => {
	currentSong.value = data;
	lastTime = 0;
	if (data) {
		musicVisibility.value = VisibilityState.showing;
	}
	else {
		musicVisibility.value = VisibilityState.hidden;
		lyricsMenuOpen.value = false;
		queueMenuOpen.value = false;
		deviceMenuOpen.value = false;
		equalizerMenuOpen.value = false;
	}
});

audioPlayer.on('queue', (data) => {
	queue.value = toRaw(data);
});

audioPlayer.on('backlog', (data) => {
	backlog.value = toRaw(data);
});

audioPlayer.on('play', () => {
	isPlaying.value = true;
});
audioPlayer.on('pause', () => {
	isPlaying.value = false;
});
audioPlayer.on('stop', () => {
	isPlaying.value = false;
});

audioPlayer.on('mute', (value) => {
	isMuted.value = value;
});

audioPlayer.on('shuffle', (value) => {
	isShuffling.value = value;
});

audioPlayer.on('repeat', (value) => {
	isRepeating.value = value;
});

audioPlayer.on('volume', (value) => {
	volume.value = value;
});

if (isPlatform('capacitor')) {
	const options: VolumeButtonsOptions = {};
	const callback: VolumeButtonsCallback = (
		result: VolumeButtonsResult,
		err?: any,
	) => {
		if (!result)
			return;
		audioPlayer.setVolume(
			result.direction === 'up' ? volume.value + 10 : volume.value - 10,
		);
	};

	options.disableSystemVolumeHandler = false;
	options.suppressVolumeIndicator = false;

	VolumeButtons.watchVolume(options, callback).then();
	VolumeButtons.isWatching().then((result) => {
		console.log(result);
	});
}
