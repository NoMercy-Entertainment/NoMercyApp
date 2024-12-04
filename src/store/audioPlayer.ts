import {computed, ref, toRaw, UnwrapRef, watch} from 'vue';
import {createAnimation, modalController} from '@ionic/vue';

import {SizeState, Song, VisibilityState} from '@/types/musicPlayer';

import type MusicPlayer from '@/lib/MusicPlayer';
import type PlayerCore from '@/lib/MusicPlayer';
import {EQBand, RepeatState, EqualizerPreset, EQSliderValues} from '@/lib/MusicPlayer/lib/types';
import {onDoubleClick} from "@/lib/utils";

const ap = ref<MusicPlayer>();
export const audioPlayer = computed(() => ap.value);
export default audioPlayer;

export const setAudioPlayer = (player: MusicPlayer): void => {
	ap.value = player;
};
export const getAudioPlayer = (): UnwrapRef<PlayerCore> => {
	return ap.value!;
};

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

const fpmo = ref<boolean>(false);
export const fullPlayerModalOpen = ref<boolean>(fpmo.value);
export const setFullPlayerModalOpen = (value: boolean): void => {
	fullPlayerModalOpen.value = value;
};
export const toggleFullPlayerModalOpen = (): void => {
	fpmo.value = !fpmo.value;
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
export const currentSong = ref<Song | null>(null);
export const currentPlaylist = ref<string | null>(null);
export const queue = ref<Song[]>([]);
export const backlog = ref<Song[]>([]);
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

watch(ap, (value) => {
	if (!value) return;

	panning.value = value.equalizerPanning;
	bands.value = value.equalizerBands;
	equalizerPresets.value = value.equalizerPresets;
	equalizerSliderValues.value = value.equalizerSliderValues;

	equalizerPreset.value = equalizerPresets.value.find(preset => preset.name == 'Flat') ?? equalizerPresets.value[0];

	value?.on('time', (timeState) => {
		currentTime.value = timeState.position;
		duration.value = timeState.duration;
		remainingTime.value = timeState.remaining;
		percentage.value = timeState.percentage;
	});
	value?.on('song', (data) => {
		currentSong.value = data;
		if (data) {
			musicVisibility.value = VisibilityState.showing;
		} else {
			musicVisibility.value = VisibilityState.hidden;
		}
	});

	value?.on('queue', (data: Song[]) => {
		queue.value = toRaw(data);
	});

	value?.on('backlog', (data: Song[]) => {
		backlog.value = toRaw(data);
	});

	value?.on('play', () => {
		isPlaying.value = true;
	});
	value?.on('pause', () => {
		isPlaying.value = false;
	});
	value?.on('stop', () => {
		isPlaying.value = false;
	});

	value?.on('mute', (value) => {
		isMuted.value = value;
	});

	value?.on('shuffle', (value) => {
		isShuffling.value = value;
	});

	value?.on('repeat', (value) => {
		isRepeating.value = value;
	});

	value?.on('volume', (value) => {
		volume.value = value;
	});
});

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

export const saveEqualizerSettings = () => {
	localStorage.setItem('equalizer-settings', JSON.stringify(bands.value));
};

export const loadEqualizerSettings = () => {
	const settings = localStorage.getItem('equalizer-settings');
	if (settings) {
		bands.value = JSON.parse(settings);

		for (const band of bands.value) {
			if (band.frequency === 'Pre') {
				audioPlayer.value?.setPreGain(band.gain);
				continue;
			}

			audioPlayer.value?.setFilter(band);
		}
	}
};

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
		audioPlayer.value?.setPanner(value);
		saveEqualizerSettings();
		return;
	}

	if (!band?.gain) return;

	band.gain = value;

	if (band.frequency === 'Pre') {
		audioPlayer.value?.setPreGain(value);
		saveEqualizerSettings();
		return;
	}

	bands.value = [...bands.value.map((b) => {
		if (b.frequency === band.frequency) {
			audioPlayer.value?.setFilter(band);
			return band;
		}
		return b;
	})];

	audioPlayer.value!.equalizerBands = bands.value;

	saveEqualizerSettings();
};

export const handleReset = (type: string, event: MouseEvent, band?: EQBand) => {
	onDoubleClick(event, () => {}, () => {
		if (type === 'panning') {
			panning.value = 0;
			audioPlayer.value?.setPanner(0);
			saveEqualizerSettings();
			return;
		}

		if (!band?.gain) return;

		band.gain = 0;

		if (band.frequency === 'Pre') {
			audioPlayer.value?.setPreGain(0);
			saveEqualizerSettings();
			return;
		}

		bands.value = [...bands.value.map((b) => {
			if (b.frequency === band.frequency) {
				audioPlayer.value?.setFilter(band);
				return band;
			}
			return b;
		})];

		audioPlayer.value!.equalizerBands = bands.value;

		saveEqualizerSettings();
	});
}

export const setEqualizerPreset = (value?: EqualizerPreset) => {
	equalizerPreset.value = equalizerPresets.value.find((p) => p.name === (value?.name ?? 'Flat')) ?? equalizerPresets.value[0];

	bands.value = [
		{ frequency: 'Pre', gain: equalizerSliderValues.value.pre.default },
		...equalizerPreset.value.values
	];

	audioPlayer.value!.equalizerBands = bands.value;

	for (let i = 1; i < bands.value.length; i++) {
		audioPlayer.value?.setFilter(bands.value[i]);
	}

	saveEqualizerSettings();
}
