// noinspection JSUnusedGlobalSymbols

import {ref, toRaw} from 'vue';
import {createAnimation, modalController} from '@ionic/vue';

import {SizeState, VisibilityState, type PlaylistItem} from '@/types/musicPlayer';

import MusicPlayer from '@nomercy-entertainment/nomercy-music-player';

import {RepeatState, type EQBand, type EqualizerPreset, type EQSliderValues} from '@nomercy-entertainment/nomercy-music-player/src/types';
import {onDoubleClick} from "@/lib/utils";
import {siteTitle} from "@/config/config";

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
});
export default audioPlayer;

export const lyricsMenuOpen = ref<boolean>(false);
export const setLyricsMenuOpen = (value: boolean): void => {
	lyricsMenuOpen.value = value;
	queueMenuOpen.value = false;
	deviceMenuOpen.value = false;
	equalizerMenuOpen.value = false;
};
export const toggleLyricsMenuOpen = (): void => {
	lyricsMenuOpen.value = !lyricsMenuOpen.value;
	queueMenuOpen.value = false;
	deviceMenuOpen.value = false;
	equalizerMenuOpen.value = false;
};

export const hasLyrics = ref<boolean>(false);
export const setHasLyrics = (value: boolean): void => {
	hasLyrics.value = value;
};

export const deviceMenuOpen = ref<boolean>(false);
export const setDeviceMenuOpen = (value: boolean): void => {
	deviceMenuOpen.value = value;
	lyricsMenuOpen.value = false;
	queueMenuOpen.value = false;
	equalizerMenuOpen.value = false;
};
export const toggleDeviceMenuOpen = (): void => {
	deviceMenuOpen.value = !deviceMenuOpen.value;
	lyricsMenuOpen.value = false;
	queueMenuOpen.value = false;
	equalizerMenuOpen.value = false;
};

const modalOpen = ref<boolean>(false);
export const fullPlayerModalOpen = ref<boolean>(modalOpen.value);
export const setFullPlayerModalOpen = (value: boolean): void => {
	fullPlayerModalOpen.value = value;
};
export const toggleFullPlayerModalOpen = (): void => {
	modalOpen.value = !modalOpen.value;
};
export const openFullPlayer = (): void => {
	fullPlayerModalOpen.value = true;
};
export const closeFullPlayer = (): void => {
	fullPlayerModalOpen.value = false;
};

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

export const setCurrentPlaylist = (value: string): void => {
	currentPlaylist.value = value;
};

export const queueMenuOpen = ref<boolean>(false);
export const setQueueMenuOpen = (value: boolean): void => {
	queueMenuOpen.value = value;
	lyricsMenuOpen.value = false;
	deviceMenuOpen.value = false;
	equalizerMenuOpen.value = false;
};
export const toggleQueueMenuOpen = (): void => {
	queueMenuOpen.value = !queueMenuOpen.value;
	lyricsMenuOpen.value = false;
	deviceMenuOpen.value = false;
	equalizerMenuOpen.value = false;
};

export const musicVisibility = ref<VisibilityState>(VisibilityState.hidden);
export const setMusicVisibility = (value: VisibilityState): void => {
	musicVisibility.value = value;
};

export const musicSize = ref<SizeState>(SizeState.compact);
export const setMusicSize = (value: SizeState): void => {
	musicSize.value = value;
};

export const enterAnimation = (baseEl: HTMLElement) => {
	const root = baseEl.shadowRoot as ShadowRoot;

	const backdropAnimation = createAnimation()
		.addElement(root.querySelector('ion-backdrop')!)
		.fromTo('opacity', '0', '0');

	const wrapperAnimation = createAnimation()
		.addElement(root.querySelector('.modal-wrapper')!)
		.keyframes([
			{offset: 0, transform: 'translateY(100%)', opacity: '1'},
			{offset: 1, transform: 'translateY(0%)', opacity: '1'},
		]);

	return createAnimation()
		.addElement(baseEl)
		.easing('ease-out')
		.duration(300)
		.addAnimation([backdropAnimation, wrapperAnimation]);
};

export const leaveAnimation = (baseEl: HTMLElement,) => {
	return enterAnimation(baseEl)
		.direction('normal');
};

// eslint-disable-next-line @typescript-eslint/ban-types
export const openModal = async (component: Function | HTMLElement | string | null) => {
	const modal = await modalController.create({
		component: component,
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
			}
		},
	});

	await modal.present();
};

export const equalizerMenuOpen = ref<boolean>(false);
export const setEqualizerMenuOpen = (value: boolean): void => {
	equalizerMenuOpen.value = value;
	lyricsMenuOpen.value = false;
	queueMenuOpen.value = false;
	deviceMenuOpen.value = false;
};
export const toggleEqualizerMenuOpen = (): void => {
	equalizerMenuOpen.value = !equalizerMenuOpen.value;
	lyricsMenuOpen.value = false;
	queueMenuOpen.value = false;
	deviceMenuOpen.value = false;
};

export const closeEqualizerMenu = (): void => {
	equalizerMenuOpen.value = false;
	lyricsMenuOpen.value = false;
	queueMenuOpen.value = false;
	deviceMenuOpen.value = false;
}

export const abbreviateFrequency = (frequency: number) => {
	if (frequency >= 1000) {
		return `${frequency / 1000}k`;
	}
	return frequency;
};

export const convertToPercentage = (value: number, min: number, max: number): number => {
	let percentage = ((value - min) / (max - min)) * 100;

	if (percentage <= 20) {
		percentage += (5 / 20) * percentage;
	}
	else if (percentage >= 80) {
		percentage -= (5 / 20) * (100 - percentage);
	}

	return Math.max(0, Math.min(100, percentage));
}

export const handleFullReset = () => {
	panning.value = 0;
	setEqualizerPreset(equalizerPresets.value.find(preset => preset.name == 'Flat'));
};

export const handleChange = (type: string, event: Event, band?: EQBand) => {
	const value = parseFloat((event.target as HTMLInputElement).value);

	if (type === 'panning') {
		panning.value = value;
		audioPlayer.setPanner(value);
		audioPlayer.saveEqualizerSettings();
		return;
	}

	if (!band?.gain) return;

	band.gain = value;

	if (band.frequency === 'Pre') {
		audioPlayer.setPreGain(value);
		audioPlayer.saveEqualizerSettings();
		return;
	}

	bands.value = [...bands.value.map((b) => {
		if (b.frequency === band.frequency) {
			audioPlayer.setFilter(band);
			return band;
		}
		return b;
	})];

	audioPlayer.equalizerBands = bands.value;

	audioPlayer.saveEqualizerSettings();
};

export const handleReset = (type: string, event: MouseEvent, band?: EQBand) => {
	onDoubleClick(event, () => {}, () => {
		if (type === 'panning') {
			panning.value = 0;
			audioPlayer.setPanner(0);
			audioPlayer.saveEqualizerSettings();
			return;
		}

		if (!band?.gain) return;

		band.gain = 0;

		if (band.frequency === 'Pre') {
			audioPlayer.setPreGain(0);
			audioPlayer.saveEqualizerSettings();
			return;
		}

		bands.value = [...bands.value.map((b) => {
			if (b.frequency === band.frequency) {
				audioPlayer.setFilter(band);
				return band;
			}
			return b;
		})];

		audioPlayer.equalizerBands = bands.value;

		audioPlayer.saveEqualizerSettings();
	});
}

export const setEqualizerPreset = (value?: EqualizerPreset) => {
	equalizerPreset.value = equalizerPresets.value.find((p) => p.name === (value?.name ?? 'Flat')) ?? equalizerPresets.value[0];

	bands.value = [
		{ frequency: 'Pre', gain: equalizerSliderValues.value.pre.default },
		...equalizerPreset.value.values
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

equalizerPreset.value = audioPlayer.equalizerPresets
	.find(preset => preset.name == 'Flat') ?? equalizerPresets.value[0];

audioPlayer.on('time', (timeState) => {
	currentTime.value = timeState.position;
	duration.value = timeState.duration;
	remainingTime.value = timeState.remaining;
	percentage.value = timeState.percentage;
});
audioPlayer.on('song', (data) => {
	currentSong.value = data;
	if (data) {
		musicVisibility.value = VisibilityState.showing;
	} else {
		musicVisibility.value = VisibilityState.hidden;
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
