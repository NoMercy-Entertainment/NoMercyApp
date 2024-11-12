import {computed, ref, UnwrapRef, watch} from 'vue';
import {createAnimation, modalController} from '@ionic/vue';

import {SizeState, Song, VisibilityState} from '@/types/musicPlayer';

import type MusicPlayer from '@/lib/MusicPlayer';
import type PlayerCore from '@/lib/MusicPlayer';
import {RepeatState} from '@/lib/MusicPlayer/lib/types';

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
};
export const toggleLyricsMenuOpen = (): void => {
	lyricsMenuOpen.value = !lyricsMenuOpen.value;
};

export const hasLyrics = ref<boolean>(false);
export const setHasLyrics = (value: boolean): void => {
	hasLyrics.value = value;
};

export const deviceMenuOpen = ref<boolean>(false);
export const setDeviceMenuOpen = (value: boolean): void => {
	deviceMenuOpen.value = value;
};
export const toggleDeviceMenuOpen = (): void => {
	deviceMenuOpen.value = !deviceMenuOpen.value;
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
export const queue = ref<Song[]>([
	{
		"color_palette": {
			"cover": {
				"dominant": "#E0F0F0FF",
				"primary": "#CEE1C4FF",
				"lightVibrant": "#3EFE00FF",
				"darkVibrant": "#2C7100FF",
				"lightMuted": "#C5C7C6FF",
				"darkMuted": "#7F7F81FF"
			}
		},
		"cover": "/34243807556-500.jpg",
		"date": "2011-10-31T00:00:00",
		"disc": 1,
		"duration": "08:38",
		"favorite": true,
		"filename": "/1-01 Insomnia (Monster mix) [Faithless].mp3",
		"folder": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6",
		"id": "c516a77e-c87f-3c4b-b053-b5afe057844f",
		"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
		"folder_id": "01HQ5W84R600G31Q038AGNSKGT",
		"name": "Insomnia (Monster mix)",
		"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
		"path": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6//1-01 Insomnia (Monster mix) [Faithless].mp3",
		"quality": 321,
		"track": 1,
		"type": "tracks",
		"lyrics": [
			{
				"text": "Yeah, I only smoke weed when I need to",
				"time": {
					"total": 326.37,
					"minutes": 5,
					"seconds": 26,
					"hundredths": 37
				}
			},
			{
				"text": "And I need to get some rest yo, where's the cess?",
				"time": {
					"total": 329.85,
					"minutes": 5,
					"seconds": 29,
					"hundredths": 85
				}
			},
			{
				"text": "I confess, I burnt a hole in the mattress",
				"time": {
					"total": 333.99,
					"minutes": 5,
					"seconds": 33,
					"hundredths": 99
				}
			},
			{
				"text": "Yes, yes, it was me, I plead guilty",
				"time": {
					"total": 337.92,
					"minutes": 5,
					"seconds": 37,
					"hundredths": 92
				}
			},
			{
				"text": "And at the count of three I pull back the duvet",
				"time": {
					"total": 341.36,
					"minutes": 5,
					"seconds": 41,
					"hundredths": 36
				}
			},
			{
				"text": "Make my way to the refrigerator",
				"time": {
					"total": 345.57,
					"minutes": 5,
					"seconds": 45,
					"hundredths": 57
				}
			},
			{
				"text": "One dry potato inside, no lie, not even bread, jam",
				"time": {
					"total": 348.55,
					"minutes": 5,
					"seconds": 48,
					"hundredths": 55
				}
			},
			{
				"text": "When the light above my head went bam!",
				"time": {
					"total": 354.16,
					"minutes": 5,
					"seconds": 54,
					"hundredths": 16
				}
			},
			{
				"text": "I can't sleep, something's all over me",
				"time": {
					"total": 357.9,
					"minutes": 5,
					"seconds": 57,
					"hundredths": 90
				}
			},
			{
				"text": "Greasy, insomnia please release me",
				"time": {
					"total": 360.77,
					"minutes": 6,
					"seconds": 0,
					"hundredths": 77
				}
			},
			{
				"text": "And let me dream about making mad love on the heath",
				"time": {
					"total": 363.93,
					"minutes": 6,
					"seconds": 3,
					"hundredths": 93
				}
			},
			{
				"text": "Tearing off tights with my teeth, but there's no relief",
				"time": {
					"total": 368.6,
					"minutes": 6,
					"seconds": 8,
					"hundredths": 60
				}
			},
			{
				"text": "I'm wide awake in my kitchen, it's black and I'm lonely",
				"time": {
					"total": 373.07,
					"minutes": 6,
					"seconds": 13,
					"hundredths": 7
				}
			},
			{
				"text": "Oh, if I could only get some sleep",
				"time": {
					"total": 377.35,
					"minutes": 6,
					"seconds": 17,
					"hundredths": 35
				}
			},
			{
				"text": "Creeky noises make my skin creep",
				"time": {
					"total": 380.42,
					"minutes": 6,
					"seconds": 20,
					"hundredths": 42
				}
			},
			{
				"text": "I need to get some sleep",
				"time": {
					"total": 383.2,
					"minutes": 6,
					"seconds": 23,
					"hundredths": 20
				}
			},
			{
				"text": "I can't get no sleep",
				"time": {
					"total": 386.05,
					"minutes": 6,
					"seconds": 26,
					"hundredths": 5
				}
			},
			{
				"text": "",
				"time": {
					"total": 387.61,
					"minutes": 6,
					"seconds": 27,
					"hundredths": 61
				}
			}
		],
		"artist_track": [
			{
				"id": "23d9d74d-c95e-46a6-be26-a6075c49747a",
				"name": "Faithless",
				"disambiguation": null,
				"description": null,
				"cover": "/faithless-4fb53c6a006f0.jpg",
				"folder": "/F/Faithless",
				"color_palette": {
					"cover": {
						"dominant": "#000000FF",
						"primary": "#4F4242FF",
						"lightVibrant": "#B37D37FF",
						"darkVibrant": "#321100FF",
						"lightMuted": "#C7C7C5FF",
						"darkMuted": "#817F80FF"
					}
				},
				"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
				"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
				"type": "artists"
			}
		],
		"album_track": [
			{
				"color_palette": {
					"cover": {
						"dominant": "#E0F0F0FF",
						"primary": "#CEE1C4FF",
						"lightVibrant": "#3EFE00FF",
						"darkVibrant": "#2C7100FF",
						"lightMuted": "#C5C7C6FF",
						"darkMuted": "#7F7F81FF"
					}
				},
				"cover": "/34243807556-500.jpg",
				"disambiguation": null,
				"description": null,
				"folder": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6",
				"id": "e22a0b68-0011-42d0-a78d-293f66e6c1c3",
				"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
				"name": "A State of Trance: Classics, Volume 6",
				"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
				"type": "albums",
				"tracks": 35,
				"year": 2011,
				"album_artist": "89ad4ac3-39f7-470e-963a-56509c546377"
			}
		]
	},
	{
		"color_palette": {
			"cover": {
				"dominant": "#E0F0F0FF",
				"primary": "#CEE1C4FF",
				"lightVibrant": "#3EFE00FF",
				"darkVibrant": "#2C7100FF",
				"lightMuted": "#C5C7C6FF",
				"darkMuted": "#7F7F81FF"
			}
		},
		"cover": "/34243807556-500.jpg",
		"date": "2011-10-31T00:00:00",
		"disc": 1,
		"duration": "06:49",
		"favorite": true,
		"filename": "/1-02 Rock Your Body Rock [Ferry Corsten].mp3",
		"folder": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6",
		"id": "5d7a3eef-a539-34f5-9d7a-936092877789",
		"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
		"folder_id": "01HQ5W84R600G31Q038AGNSKGT",
		"name": "Rock Your Body Rock",
		"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
		"path": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6//1-02 Rock Your Body Rock [Ferry Corsten].mp3",
		"quality": 321,
		"track": 2,
		"type": "tracks",
		"lyrics": [
			{
				"text": "I'm on a mission,",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "Let me take you back and forth,",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "I got a jam that's gonna make you scream for more.",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "From New York London to Amsterdam,",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "Let's rock, I wanna rock your body rock.",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "I'm on a mission,",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "Let me take you back and forth,",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "I got a jam that's gonna make you scream for more.",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "From New York London to Amsterdam,",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "Let's rock, I wanna rock your body rock.",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "I'm on a mission,",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "Let me take you back and forth,",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "I got a jam that's gonna make you scream for more.",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "From New York London to Amsterdam,",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "Let's rock, I wanna rock your body rock.",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			}
		],
		"artist_track": [
			{
				"id": "47347cb8-ac34-4916-84b6-d85d4e5e5384",
				"name": "Ferry Corsten",
				"disambiguation": "Dutch DJ and producer",
				"description": null,
				"cover": "/corsten-ferry-50f9eb5379889.jpg",
				"folder": "/F/Ferry Corsten",
				"color_palette": {
					"cover": {
						"dominant": "#B0B0A0FF",
						"primary": "#AA9E97FF",
						"lightVibrant": "#A28259FF",
						"darkVibrant": "#090003FF",
						"lightMuted": "#C7C7C5FF",
						"darkMuted": "#7E807FFF"
					}
				},
				"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
				"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
				"type": "artists"
			}
		],
		"album_track": [
			{
				"color_palette": {
					"cover": {
						"dominant": "#E0F0F0FF",
						"primary": "#CEE1C4FF",
						"lightVibrant": "#3EFE00FF",
						"darkVibrant": "#2C7100FF",
						"lightMuted": "#C5C7C6FF",
						"darkMuted": "#7F7F81FF"
					}
				},
				"cover": "/34243807556-500.jpg",
				"disambiguation": null,
				"description": null,
				"folder": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6",
				"id": "e22a0b68-0011-42d0-a78d-293f66e6c1c3",
				"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
				"name": "A State of Trance: Classics, Volume 6",
				"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
				"type": "albums",
				"tracks": 35,
				"year": 2011,
				"album_artist": "89ad4ac3-39f7-470e-963a-56509c546377"
			}
		]
	},
	{
		"color_palette": {
			"cover": {
				"dominant": "#E0F0F0FF",
				"primary": "#CEE1C4FF",
				"lightVibrant": "#3EFE00FF",
				"darkVibrant": "#2C7100FF",
				"lightMuted": "#C5C7C6FF",
				"darkMuted": "#7F7F81FF"
			}
		},
		"cover": "/34243807556-500.jpg",
		"date": "2011-10-31T00:00:00",
		"disc": 1,
		"duration": "07:03",
		"favorite": false,
		"filename": "/1-03 Take Me Away (Into the Night) (original vocal mix) [4 Strings].mp3",
		"folder": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6",
		"id": "2f242ad5-9f38-3b2f-9ee4-864ef0b1594d",
		"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
		"folder_id": "01HQ5W84R600G31Q038AGNSKGT",
		"name": "Take Me Away (Into the Night) (original vocal mix)",
		"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
		"path": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6//1-03 Take Me Away (Into the Night) (original vocal mix) [4 Strings].mp3",
		"quality": 321,
		"track": 3,
		"type": "tracks",
		"lyrics": [
			{
				"text": "Shining light",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "Another day turns into night",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "Eternal fire",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "Waited all my life",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "Take me away",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "A million miles away from here",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "Take me away",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "Find a place for you and me",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "You're taking me higher",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "High as I could be",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "Take me away",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "Forever you and me",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "Take me away",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "Tears I cried",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "Kept them all inside",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "I needed time",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "To make up my mind",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "[To make up my mind]",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "Take me away",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "A million miles away from here",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "Take me away",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "Find a place for you and me",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "You're taking me higher",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "High as I could be",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "Take me away",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "Forever you and me",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "Take me away",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "Tears I cried",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "Kept them all inside",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "I needed time",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "To make up my mind",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "[To make up my mind]",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "Take me away",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "A million miles away from here",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "Take me away",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "Find a place for you and me",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "You're taking me higher",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "High as I could be",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "Take me away",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "Forever you and me",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "Take me away",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			}
		],
		"artist_track": [
			{
				"id": "fa6521a7-56b5-4e56-b946-fda469becba9",
				"name": "4 Strings",
				"disambiguation": "Netherlands dance duo",
				"description": null,
				"cover": null,
				"folder": "/#/4 Strings",
				"color_palette": null,
				"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
				"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
				"type": "artists"
			}
		],
		"album_track": [
			{
				"color_palette": {
					"cover": {
						"dominant": "#E0F0F0FF",
						"primary": "#CEE1C4FF",
						"lightVibrant": "#3EFE00FF",
						"darkVibrant": "#2C7100FF",
						"lightMuted": "#C5C7C6FF",
						"darkMuted": "#7F7F81FF"
					}
				},
				"cover": "/34243807556-500.jpg",
				"disambiguation": null,
				"description": null,
				"folder": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6",
				"id": "e22a0b68-0011-42d0-a78d-293f66e6c1c3",
				"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
				"name": "A State of Trance: Classics, Volume 6",
				"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
				"type": "albums",
				"tracks": 35,
				"year": 2011,
				"album_artist": "89ad4ac3-39f7-470e-963a-56509c546377"
			}
		]
	},
	{
		"color_palette": {
			"cover": {
				"dominant": "#E0F0F0FF",
				"primary": "#CEE1C4FF",
				"lightVibrant": "#3EFE00FF",
				"darkVibrant": "#2C7100FF",
				"lightMuted": "#C5C7C6FF",
				"darkMuted": "#7F7F81FF"
			}
		},
		"cover": "/34243807556-500.jpg",
		"date": "2011-10-31T00:00:00",
		"disc": 1,
		"duration": "06:51",
		"favorite": false,
		"filename": "/1-04 Freeloader [Driftwood].mp3",
		"folder": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6",
		"id": "92f5e805-d126-3add-9031-41188e93806b",
		"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
		"folder_id": "01HQ5W84R600G31Q038AGNSKGT",
		"name": "Freeloader",
		"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
		"path": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6//1-04 Freeloader [Driftwood].mp3",
		"quality": 321,
		"track": 4,
		"type": "tracks",
		"lyrics": null,
		"artist_track": [
			{
				"id": "be8fe8fa-545f-4bc6-b848-5800c9075213",
				"name": "Driftwood",
				"disambiguation": "Dutch house/dance project",
				"description": null,
				"cover": null,
				"folder": "/D/Driftwood",
				"color_palette": null,
				"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
				"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
				"type": "artists"
			}
		],
		"album_track": [
			{
				"color_palette": {
					"cover": {
						"dominant": "#E0F0F0FF",
						"primary": "#CEE1C4FF",
						"lightVibrant": "#3EFE00FF",
						"darkVibrant": "#2C7100FF",
						"lightMuted": "#C5C7C6FF",
						"darkMuted": "#7F7F81FF"
					}
				},
				"cover": "/34243807556-500.jpg",
				"disambiguation": null,
				"description": null,
				"folder": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6",
				"id": "e22a0b68-0011-42d0-a78d-293f66e6c1c3",
				"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
				"name": "A State of Trance: Classics, Volume 6",
				"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
				"type": "albums",
				"tracks": 35,
				"year": 2011,
				"album_artist": "89ad4ac3-39f7-470e-963a-56509c546377"
			}
		]
	},
	{
		"color_palette": {
			"cover": {
				"dominant": "#E0F0F0FF",
				"primary": "#CEE1C4FF",
				"lightVibrant": "#3EFE00FF",
				"darkVibrant": "#2C7100FF",
				"lightMuted": "#C5C7C6FF",
				"darkMuted": "#7F7F81FF"
			}
		},
		"cover": "/34243807556-500.jpg",
		"date": "2011-10-31T00:00:00",
		"disc": 1,
		"duration": "07:48",
		"favorite": true,
		"filename": "/1-05 Green Heaven [Vincent de Moor].mp3",
		"folder": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6",
		"id": "89d33031-d4dd-38f5-b252-9c519ca252b9",
		"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
		"folder_id": "01HQ5W84R600G31Q038AGNSKGT",
		"name": "Green Heaven",
		"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
		"path": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6//1-05 Green Heaven [Vincent de Moor].mp3",
		"quality": 321,
		"track": 5,
		"type": "tracks",
		"lyrics": null,
		"artist_track": [
			{
				"id": "20ad1571-631c-41f3-b212-569b37bcca79",
				"name": "Vincent de Moor",
				"disambiguation": null,
				"description": null,
				"cover": null,
				"folder": "/V/Vincent de Moor",
				"color_palette": null,
				"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
				"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
				"type": "artists"
			}
		],
		"album_track": [
			{
				"color_palette": {
					"cover": {
						"dominant": "#E0F0F0FF",
						"primary": "#CEE1C4FF",
						"lightVibrant": "#3EFE00FF",
						"darkVibrant": "#2C7100FF",
						"lightMuted": "#C5C7C6FF",
						"darkMuted": "#7F7F81FF"
					}
				},
				"cover": "/34243807556-500.jpg",
				"disambiguation": null,
				"description": null,
				"folder": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6",
				"id": "e22a0b68-0011-42d0-a78d-293f66e6c1c3",
				"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
				"name": "A State of Trance: Classics, Volume 6",
				"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
				"type": "albums",
				"tracks": 35,
				"year": 2011,
				"album_artist": "89ad4ac3-39f7-470e-963a-56509c546377"
			}
		]
	},
	{
		"color_palette": {
			"cover": {
				"dominant": "#E0F0F0FF",
				"primary": "#CEE1C4FF",
				"lightVibrant": "#3EFE00FF",
				"darkVibrant": "#2C7100FF",
				"lightMuted": "#C5C7C6FF",
				"darkMuted": "#7F7F81FF"
			}
		},
		"cover": "/34243807556-500.jpg",
		"date": "2011-10-31T00:00:00",
		"disc": 1,
		"duration": "10:14",
		"favorite": false,
		"filename": "/1-06 From the Heart [Armin van Buuren feat. System F].mp3",
		"folder": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6",
		"id": "063be7b5-4328-335b-805f-b08349f94ff8",
		"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
		"folder_id": "01HQ5W84R600G31Q038AGNSKGT",
		"name": "From the Heart",
		"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
		"path": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6//1-06 From the Heart [Armin van Buuren feat. System F].mp3",
		"quality": 321,
		"track": 6,
		"type": "tracks",
		"lyrics": null,
		"artist_track": [
			{
				"id": "477b8c0c-c5fc-4ad2-b5b2-191f0bf2a9df",
				"name": "Armin van Buuren",
				"disambiguation": null,
				"description": null,
				"cover": "/buuren-van-armin-4fdeea478c2c5.jpg",
				"folder": "/A/Armin van Buuren",
				"color_palette": {
					"cover": {
						"dominant": "#201010FF",
						"primary": "#483227FF",
						"lightVibrant": "#C87839FF",
						"darkVibrant": "#3A1700FF",
						"lightMuted": "#94908FFF",
						"darkMuted": "#787677FF"
					}
				},
				"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
				"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
				"type": "artists"
			},
			{
				"id": "4bee86b5-95c4-429a-8489-353516f815ab",
				"name": "System F",
				"disambiguation": null,
				"description": null,
				"cover": null,
				"folder": "/S/System F",
				"color_palette": null,
				"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
				"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
				"type": "artists"
			}
		],
		"album_track": [
			{
				"color_palette": {
					"cover": {
						"dominant": "#E0F0F0FF",
						"primary": "#CEE1C4FF",
						"lightVibrant": "#3EFE00FF",
						"darkVibrant": "#2C7100FF",
						"lightMuted": "#C5C7C6FF",
						"darkMuted": "#7F7F81FF"
					}
				},
				"cover": "/34243807556-500.jpg",
				"disambiguation": null,
				"description": null,
				"folder": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6",
				"id": "e22a0b68-0011-42d0-a78d-293f66e6c1c3",
				"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
				"name": "A State of Trance: Classics, Volume 6",
				"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
				"type": "albums",
				"tracks": 35,
				"year": 2011,
				"album_artist": "89ad4ac3-39f7-470e-963a-56509c546377"
			}
		]
	},
	{
		"color_palette": {
			"cover": {
				"dominant": "#E0F0F0FF",
				"primary": "#CEE1C4FF",
				"lightVibrant": "#3EFE00FF",
				"darkVibrant": "#2C7100FF",
				"lightMuted": "#C5C7C6FF",
				"darkMuted": "#7F7F81FF"
			}
		},
		"cover": "/34243807556-500.jpg",
		"date": "2011-10-31T00:00:00",
		"disc": 1,
		"duration": "08:24",
		"favorite": false,
		"filename": "/1-07 Morning Light [Team Deep].mp3",
		"folder": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6",
		"id": "4ce84ccd-443f-3afb-b7ce-73d82bd3e272",
		"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
		"folder_id": "01HQ5W84R600G31Q038AGNSKGT",
		"name": "Morning Light",
		"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
		"path": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6//1-07 Morning Light [Team Deep].mp3",
		"quality": 321,
		"track": 7,
		"type": "tracks",
		"lyrics": null,
		"artist_track": [
			{
				"id": "b2de93c2-0693-4221-a854-f236805eb151",
				"name": "Team Deep",
				"disambiguation": null,
				"description": null,
				"cover": null,
				"folder": "/T/Team Deep",
				"color_palette": null,
				"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
				"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
				"type": "artists"
			}
		],
		"album_track": [
			{
				"color_palette": {
					"cover": {
						"dominant": "#E0F0F0FF",
						"primary": "#CEE1C4FF",
						"lightVibrant": "#3EFE00FF",
						"darkVibrant": "#2C7100FF",
						"lightMuted": "#C5C7C6FF",
						"darkMuted": "#7F7F81FF"
					}
				},
				"cover": "/34243807556-500.jpg",
				"disambiguation": null,
				"description": null,
				"folder": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6",
				"id": "e22a0b68-0011-42d0-a78d-293f66e6c1c3",
				"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
				"name": "A State of Trance: Classics, Volume 6",
				"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
				"type": "albums",
				"tracks": 35,
				"year": 2011,
				"album_artist": "89ad4ac3-39f7-470e-963a-56509c546377"
			}
		]
	},
	{
		"color_palette": {
			"cover": {
				"dominant": "#E0F0F0FF",
				"primary": "#CEE1C4FF",
				"lightVibrant": "#3EFE00FF",
				"darkVibrant": "#2C7100FF",
				"lightMuted": "#C5C7C6FF",
				"darkMuted": "#7F7F81FF"
			}
		},
		"cover": "/34243807556-500.jpg",
		"date": "2011-10-31T00:00:00",
		"disc": 1,
		"duration": "09:35",
		"favorite": false,
		"filename": "/1-08 Meet Her at the Loveparade [Da Hool].mp3",
		"folder": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6",
		"id": "8a7ef15d-e910-3920-a22d-36a9b2a649e9",
		"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
		"folder_id": "01HQ5W84R600G31Q038AGNSKGT",
		"name": "Meet Her at the Loveparade",
		"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
		"path": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6//1-08 Meet Her at the Loveparade [Da Hool].mp3",
		"quality": 321,
		"track": 8,
		"type": "tracks",
		"lyrics": null,
		"artist_track": [
			{
				"id": "08e6bef1-633e-41d8-8201-a65e1ac8ec64",
				"name": "Da Hool",
				"disambiguation": null,
				"description": null,
				"cover": null,
				"folder": "/D/Da Hool",
				"color_palette": null,
				"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
				"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
				"type": "artists"
			}
		],
		"album_track": [
			{
				"color_palette": {
					"cover": {
						"dominant": "#E0F0F0FF",
						"primary": "#CEE1C4FF",
						"lightVibrant": "#3EFE00FF",
						"darkVibrant": "#2C7100FF",
						"lightMuted": "#C5C7C6FF",
						"darkMuted": "#7F7F81FF"
					}
				},
				"cover": "/34243807556-500.jpg",
				"disambiguation": null,
				"description": null,
				"folder": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6",
				"id": "e22a0b68-0011-42d0-a78d-293f66e6c1c3",
				"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
				"name": "A State of Trance: Classics, Volume 6",
				"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
				"type": "albums",
				"tracks": 35,
				"year": 2011,
				"album_artist": "89ad4ac3-39f7-470e-963a-56509c546377"
			}
		]
	},
	{
		"color_palette": {
			"cover": {
				"dominant": "#E0F0F0FF",
				"primary": "#CEE1C4FF",
				"lightVibrant": "#3EFE00FF",
				"darkVibrant": "#2C7100FF",
				"lightMuted": "#C5C7C6FF",
				"darkMuted": "#7F7F81FF"
			}
		},
		"cover": "/34243807556-500.jpg",
		"date": "2011-10-31T00:00:00",
		"disc": 1,
		"duration": "07:52",
		"favorite": false,
		"filename": "/1-09 Choose Freedom [Ultravibe].mp3",
		"folder": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6",
		"id": "163c6ae3-76f9-3c58-96d3-e2932b31d2e6",
		"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
		"folder_id": "01HQ5W84R600G31Q038AGNSKGT",
		"name": "Choose Freedom",
		"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
		"path": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6//1-09 Choose Freedom [Ultravibe].mp3",
		"quality": 321,
		"track": 9,
		"type": "tracks",
		"lyrics": null,
		"artist_track": [
			{
				"id": "059a05e4-cc63-4cb0-93d6-463740448da7",
				"name": "Ultra Vibe",
				"disambiguation": "Mike Dierickx & Laurent Véronnez",
				"description": null,
				"cover": null,
				"folder": "/U/Ultra Vibe",
				"color_palette": null,
				"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
				"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
				"type": "artists"
			}
		],
		"album_track": [
			{
				"color_palette": {
					"cover": {
						"dominant": "#E0F0F0FF",
						"primary": "#CEE1C4FF",
						"lightVibrant": "#3EFE00FF",
						"darkVibrant": "#2C7100FF",
						"lightMuted": "#C5C7C6FF",
						"darkMuted": "#7F7F81FF"
					}
				},
				"cover": "/34243807556-500.jpg",
				"disambiguation": null,
				"description": null,
				"folder": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6",
				"id": "e22a0b68-0011-42d0-a78d-293f66e6c1c3",
				"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
				"name": "A State of Trance: Classics, Volume 6",
				"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
				"type": "albums",
				"tracks": 35,
				"year": 2011,
				"album_artist": "89ad4ac3-39f7-470e-963a-56509c546377"
			}
		]
	},
	{
		"color_palette": {
			"cover": {
				"dominant": "#E0F0F0FF",
				"primary": "#CEE1C4FF",
				"lightVibrant": "#3EFE00FF",
				"darkVibrant": "#2C7100FF",
				"lightMuted": "#C5C7C6FF",
				"darkMuted": "#7F7F81FF"
			}
		},
		"cover": "/34243807556-500.jpg",
		"date": "2011-10-31T00:00:00",
		"disc": 2,
		"duration": "10:30",
		"favorite": false,
		"filename": "/2-01 Fallen (Gabriel & Dresden Anti-Gravity mix) [Sarah McLachlan].mp3",
		"folder": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6",
		"id": "74e361a7-f0c6-373f-bc09-dff6a14213bc",
		"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
		"folder_id": "01HQ5W84R600G31Q038AGNSKGT",
		"name": "Fallen (Gabriel & Dresden Anti-Gravity mix)",
		"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
		"path": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6//2-01 Fallen (Gabriel & Dresden Anti-Gravity mix) [Sarah McLachlan].mp3",
		"quality": 321,
		"track": 1,
		"type": "tracks",
		"lyrics": [
			{
				"text": "Heaven bend to take my hand",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "And lead me through the fire",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "Be the long awaited answer",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "To a long and painful fight",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "Truth be told I've tried my best",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "But somewhere 'long the way",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "I got caught up in all there was to offer",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "And the cost was so much more than I could bear",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "Though I've tried I've fallen",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "I have sunk so low",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "I messed up",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "Better I should know",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "So don't come 'round here and",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "Tell me I told you so",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "We all begin with good intent",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "When love was raw and young",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "We believe that we can change ourselves",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "The past can be undone",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "But we carry on our back the burden time always reveals",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "In the lonely light of morning",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "In the wound that would not heal",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "It's the bitter taste of losing everything",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "That I've held so dear",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "I've fallen",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "I have sunk so low",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "I messed up",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "Better I should know",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "So don't come 'round here and",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "Tell me I told you so",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "Heaven bend to take my hand",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "I've nowhere left to turn",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "I'm lost to those I thought were friends",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "To everyone I know",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "Oh they turn their heads embarrassed",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "Pretend that they don't see",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "That it's one missed step one slip before you know it",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "And there doesn't seem a way to be redeemed",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "Though I've tried I've fallen",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "I have sunk so low",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "I messed up",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "Better I should know",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "So don't come 'round here and",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "Tell me I told you so",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "I messed up",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "Better I should know",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "So don't come round here and",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "Tell me I told you so",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			}
		],
		"artist_track": [
			{
				"id": "ce58d854-7430-4231-aa44-97f0144b3372",
				"name": "Sarah McLachlan",
				"disambiguation": null,
				"description": null,
				"cover": "/mclachlan-sarah-50f78f1d00154.jpg",
				"folder": "/S/Sarah McLachlan",
				"color_palette": {
					"cover": {
						"dominant": "#203050FF",
						"primary": "#7B7287FF",
						"lightVibrant": "#2C97A7FF",
						"darkVibrant": "#080002FF",
						"lightMuted": "#C5C7C6FF",
						"darkMuted": "#7E7E80FF"
					}
				},
				"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
				"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
				"type": "artists"
			}
		],
		"album_track": [
			{
				"color_palette": {
					"cover": {
						"dominant": "#E0F0F0FF",
						"primary": "#CEE1C4FF",
						"lightVibrant": "#3EFE00FF",
						"darkVibrant": "#2C7100FF",
						"lightMuted": "#C5C7C6FF",
						"darkMuted": "#7F7F81FF"
					}
				},
				"cover": "/34243807556-500.jpg",
				"disambiguation": null,
				"description": null,
				"folder": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6",
				"id": "e22a0b68-0011-42d0-a78d-293f66e6c1c3",
				"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
				"name": "A State of Trance: Classics, Volume 6",
				"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
				"type": "albums",
				"tracks": 35,
				"year": 2011,
				"album_artist": "89ad4ac3-39f7-470e-963a-56509c546377"
			}
		]
	},
	{
		"color_palette": {
			"cover": {
				"dominant": "#E0F0F0FF",
				"primary": "#CEE1C4FF",
				"lightVibrant": "#3EFE00FF",
				"darkVibrant": "#2C7100FF",
				"lightMuted": "#C5C7C6FF",
				"darkMuted": "#7F7F81FF"
			}
		},
		"cover": "/34243807556-500.jpg",
		"date": "2011-10-31T00:00:00",
		"disc": 2,
		"duration": "08:03",
		"favorite": false,
		"filename": "/2-03 C_del_.mp3 [Marco V].mp3",
		"folder": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6",
		"id": "6d2c3de1-b11e-3a41-8902-d507822effba",
		"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
		"folder_id": "01HQ5W84R600G31Q038AGNSKGT",
		"name": "C:\\del*.mp3",
		"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
		"path": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6//2-03 C_del_.mp3 [Marco V].mp3",
		"quality": 321,
		"track": 3,
		"type": "tracks",
		"lyrics": null,
		"artist_track": [
			{
				"id": "95e7f9cd-d774-4200-8337-cf27cb18d836",
				"name": "Marco V",
				"disambiguation": "Dutch DJ Marco Verkuylen",
				"description": null,
				"cover": "/marco-v-4fe60b2842ee8.jpg",
				"folder": "/M/Marco V",
				"color_palette": {
					"cover": {
						"dominant": "#000000FF",
						"primary": "#5D4D48FF",
						"lightVibrant": "#A6786BFF",
						"darkVibrant": "#070200FF",
						"lightMuted": "#C0C0C2FF",
						"darkMuted": "#817F80FF"
					}
				},
				"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
				"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
				"type": "artists"
			}
		],
		"album_track": [
			{
				"color_palette": {
					"cover": {
						"dominant": "#E0F0F0FF",
						"primary": "#CEE1C4FF",
						"lightVibrant": "#3EFE00FF",
						"darkVibrant": "#2C7100FF",
						"lightMuted": "#C5C7C6FF",
						"darkMuted": "#7F7F81FF"
					}
				},
				"cover": "/34243807556-500.jpg",
				"disambiguation": null,
				"description": null,
				"folder": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6",
				"id": "e22a0b68-0011-42d0-a78d-293f66e6c1c3",
				"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
				"name": "A State of Trance: Classics, Volume 6",
				"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
				"type": "albums",
				"tracks": 35,
				"year": 2011,
				"album_artist": "89ad4ac3-39f7-470e-963a-56509c546377"
			}
		]
	},
	{
		"color_palette": {
			"cover": {
				"dominant": "#E0F0F0FF",
				"primary": "#CEE1C4FF",
				"lightVibrant": "#3EFE00FF",
				"darkVibrant": "#2C7100FF",
				"lightMuted": "#C5C7C6FF",
				"darkMuted": "#7F7F81FF"
			}
		},
		"cover": "/34243807556-500.jpg",
		"date": "2011-10-31T00:00:00",
		"disc": 2,
		"duration": "08:55",
		"favorite": false,
		"filename": "/2-04 We Came [Vimana].mp3",
		"folder": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6",
		"id": "7abd3f0e-4a55-3ce6-bc19-e8fed661952d",
		"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
		"folder_id": "01HQ5W84R600G31Q038AGNSKGT",
		"name": "We Came",
		"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
		"path": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6//2-04 We Came [Vimana].mp3",
		"quality": 321,
		"track": 4,
		"type": "tracks",
		"lyrics": null,
		"artist_track": [
			{
				"id": "e5393a75-9580-4fd0-8649-6d60cfb4c79f",
				"name": "Vimana",
				"disambiguation": "Dutch electronic dance music project",
				"description": null,
				"cover": null,
				"folder": "/V/Vimana",
				"color_palette": null,
				"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
				"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
				"type": "artists"
			}
		],
		"album_track": [
			{
				"color_palette": {
					"cover": {
						"dominant": "#E0F0F0FF",
						"primary": "#CEE1C4FF",
						"lightVibrant": "#3EFE00FF",
						"darkVibrant": "#2C7100FF",
						"lightMuted": "#C5C7C6FF",
						"darkMuted": "#7F7F81FF"
					}
				},
				"cover": "/34243807556-500.jpg",
				"disambiguation": null,
				"description": null,
				"folder": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6",
				"id": "e22a0b68-0011-42d0-a78d-293f66e6c1c3",
				"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
				"name": "A State of Trance: Classics, Volume 6",
				"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
				"type": "albums",
				"tracks": 35,
				"year": 2011,
				"album_artist": "89ad4ac3-39f7-470e-963a-56509c546377"
			}
		]
	},
	{
		"color_palette": {
			"cover": {
				"dominant": "#E0F0F0FF",
				"primary": "#CEE1C4FF",
				"lightVibrant": "#3EFE00FF",
				"darkVibrant": "#2C7100FF",
				"lightMuted": "#C5C7C6FF",
				"darkMuted": "#7F7F81FF"
			}
		},
		"cover": "/34243807556-500.jpg",
		"date": "2011-10-31T00:00:00",
		"disc": 2,
		"duration": "08:44",
		"favorite": false,
		"filename": "/2-05 Dream Machine [DJ Ton T.B.].mp3",
		"folder": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6",
		"id": "4124e8a9-f095-3782-b7f1-707ca3a12ec3",
		"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
		"folder_id": "01HQ5W84R600G31Q038AGNSKGT",
		"name": "Dream Machine",
		"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
		"path": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6//2-05 Dream Machine [DJ Ton T.B.].mp3",
		"quality": 321,
		"track": 5,
		"type": "tracks",
		"lyrics": null,
		"artist_track": [
			{
				"id": "b91ac2fc-e3eb-409c-96ca-24eb0fb2e18a",
				"name": "DJ Ton T.B.",
				"disambiguation": null,
				"description": null,
				"cover": null,
				"folder": "/D/DJ Ton T.B.",
				"color_palette": null,
				"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
				"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
				"type": "artists"
			}
		],
		"album_track": [
			{
				"color_palette": {
					"cover": {
						"dominant": "#E0F0F0FF",
						"primary": "#CEE1C4FF",
						"lightVibrant": "#3EFE00FF",
						"darkVibrant": "#2C7100FF",
						"lightMuted": "#C5C7C6FF",
						"darkMuted": "#7F7F81FF"
					}
				},
				"cover": "/34243807556-500.jpg",
				"disambiguation": null,
				"description": null,
				"folder": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6",
				"id": "e22a0b68-0011-42d0-a78d-293f66e6c1c3",
				"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
				"name": "A State of Trance: Classics, Volume 6",
				"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
				"type": "albums",
				"tracks": 35,
				"year": 2011,
				"album_artist": "89ad4ac3-39f7-470e-963a-56509c546377"
			}
		]
	},
	{
		"color_palette": {
			"cover": {
				"dominant": "#E0F0F0FF",
				"primary": "#CEE1C4FF",
				"lightVibrant": "#3EFE00FF",
				"darkVibrant": "#2C7100FF",
				"lightMuted": "#C5C7C6FF",
				"darkMuted": "#7F7F81FF"
			}
		},
		"cover": "/34243807556-500.jpg",
		"date": "2011-10-31T00:00:00",
		"disc": 2,
		"duration": "08:25",
		"favorite": false,
		"filename": "/2-06 Lift [Sean Tyas].mp3",
		"folder": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6",
		"id": "ef704196-f3d9-31e7-9677-874ea913dcdf",
		"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
		"folder_id": "01HQ5W84R600G31Q038AGNSKGT",
		"name": "Lift",
		"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
		"path": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6//2-06 Lift [Sean Tyas].mp3",
		"quality": 321,
		"track": 6,
		"type": "tracks",
		"lyrics": null,
		"artist_track": [
			{
				"id": "7146c066-58bf-4160-94e3-0cb8dd0c9976",
				"name": "Sean Tyas",
				"disambiguation": null,
				"description": null,
				"cover": "/tyas-sean-5068764420b72.jpg",
				"folder": "/S/Sean Tyas",
				"color_palette": {
					"cover": {
						"dominant": "#100000FF",
						"primary": "#6F5146FF",
						"lightVibrant": "#C4744FFF",
						"darkVibrant": "#020001FF",
						"lightMuted": "#FCFFFFFF",
						"darkMuted": "#787677FF"
					}
				},
				"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
				"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
				"type": "artists"
			}
		],
		"album_track": [
			{
				"color_palette": {
					"cover": {
						"dominant": "#E0F0F0FF",
						"primary": "#CEE1C4FF",
						"lightVibrant": "#3EFE00FF",
						"darkVibrant": "#2C7100FF",
						"lightMuted": "#C5C7C6FF",
						"darkMuted": "#7F7F81FF"
					}
				},
				"cover": "/34243807556-500.jpg",
				"disambiguation": null,
				"description": null,
				"folder": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6",
				"id": "e22a0b68-0011-42d0-a78d-293f66e6c1c3",
				"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
				"name": "A State of Trance: Classics, Volume 6",
				"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
				"type": "albums",
				"tracks": 35,
				"year": 2011,
				"album_artist": "89ad4ac3-39f7-470e-963a-56509c546377"
			}
		]
	},
	{
		"color_palette": {
			"cover": {
				"dominant": "#E0F0F0FF",
				"primary": "#CEE1C4FF",
				"lightVibrant": "#3EFE00FF",
				"darkVibrant": "#2C7100FF",
				"lightMuted": "#C5C7C6FF",
				"darkMuted": "#7F7F81FF"
			}
		},
		"cover": "/34243807556-500.jpg",
		"date": "2011-10-31T00:00:00",
		"disc": 2,
		"duration": "08:13",
		"favorite": false,
		"filename": "/2-07 Miss a Day [ATN].mp3",
		"folder": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6",
		"id": "0dc7b073-c37c-3c65-8702-954ccf630c56",
		"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
		"folder_id": "01HQ5W84R600G31Q038AGNSKGT",
		"name": "Miss a Day",
		"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
		"path": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6//2-07 Miss a Day [ATN].mp3",
		"quality": 321,
		"track": 7,
		"type": "tracks",
		"lyrics": null,
		"artist_track": [
			{
				"id": "3a624e92-91d3-4a48-a7af-26c07b0b0a2c",
				"name": "ATN",
				"disambiguation": null,
				"description": null,
				"cover": null,
				"folder": "/A/ATN",
				"color_palette": null,
				"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
				"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
				"type": "artists"
			}
		],
		"album_track": [
			{
				"color_palette": {
					"cover": {
						"dominant": "#E0F0F0FF",
						"primary": "#CEE1C4FF",
						"lightVibrant": "#3EFE00FF",
						"darkVibrant": "#2C7100FF",
						"lightMuted": "#C5C7C6FF",
						"darkMuted": "#7F7F81FF"
					}
				},
				"cover": "/34243807556-500.jpg",
				"disambiguation": null,
				"description": null,
				"folder": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6",
				"id": "e22a0b68-0011-42d0-a78d-293f66e6c1c3",
				"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
				"name": "A State of Trance: Classics, Volume 6",
				"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
				"type": "albums",
				"tracks": 35,
				"year": 2011,
				"album_artist": "89ad4ac3-39f7-470e-963a-56509c546377"
			}
		]
	},
	{
		"color_palette": {
			"cover": {
				"dominant": "#E0F0F0FF",
				"primary": "#CEE1C4FF",
				"lightVibrant": "#3EFE00FF",
				"darkVibrant": "#2C7100FF",
				"lightMuted": "#C5C7C6FF",
				"darkMuted": "#7F7F81FF"
			}
		},
		"cover": "/34243807556-500.jpg",
		"date": "2011-10-31T00:00:00",
		"disc": 2,
		"duration": "06:18",
		"favorite": false,
		"filename": "/2-08 Protect the Innocent [The Matrix].mp3",
		"folder": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6",
		"id": "75599433-c821-3753-8138-56d537a0c14b",
		"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
		"folder_id": "01HQ5W84R600G31Q038AGNSKGT",
		"name": "Protect the Innocent",
		"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
		"path": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6//2-08 Protect the Innocent [The Matrix].mp3",
		"quality": 321,
		"track": 8,
		"type": "tracks",
		"lyrics": null,
		"artist_track": [
			{
				"id": "81bb1da2-101b-44cf-8af8-183d25cb765b",
				"name": "The Matrix",
				"disambiguation": "trance duo, Tom Peters & Viktor Van Ophuizen, track \"The Matrix\"",
				"description": null,
				"cover": null,
				"folder": "/T/The Matrix",
				"color_palette": null,
				"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
				"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
				"type": "artists"
			}
		],
		"album_track": [
			{
				"color_palette": {
					"cover": {
						"dominant": "#E0F0F0FF",
						"primary": "#CEE1C4FF",
						"lightVibrant": "#3EFE00FF",
						"darkVibrant": "#2C7100FF",
						"lightMuted": "#C5C7C6FF",
						"darkMuted": "#7F7F81FF"
					}
				},
				"cover": "/34243807556-500.jpg",
				"disambiguation": null,
				"description": null,
				"folder": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6",
				"id": "e22a0b68-0011-42d0-a78d-293f66e6c1c3",
				"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
				"name": "A State of Trance: Classics, Volume 6",
				"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
				"type": "albums",
				"tracks": 35,
				"year": 2011,
				"album_artist": "89ad4ac3-39f7-470e-963a-56509c546377"
			}
		]
	},
	{
		"color_palette": {
			"cover": {
				"dominant": "#E0F0F0FF",
				"primary": "#CEE1C4FF",
				"lightVibrant": "#3EFE00FF",
				"darkVibrant": "#2C7100FF",
				"lightMuted": "#C5C7C6FF",
				"darkMuted": "#7F7F81FF"
			}
		},
		"cover": "/34243807556-500.jpg",
		"date": "2011-10-31T00:00:00",
		"disc": 2,
		"duration": "06:02",
		"favorite": true,
		"filename": "/2-09 The First Rebirth [Jones & Stephenson].mp3",
		"folder": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6",
		"id": "655c17c9-9474-33ae-8a9e-82c8ad387457",
		"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
		"folder_id": "01HQ5W84R600G31Q038AGNSKGT",
		"name": "The First Rebirth",
		"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
		"path": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6//2-09 The First Rebirth [Jones & Stephenson].mp3",
		"quality": 321,
		"track": 9,
		"type": "tracks",
		"lyrics": null,
		"artist_track": [
			{
				"id": "6acad922-23d5-4cbf-9e2f-a029117bf8e7",
				"name": "Jones & Stephenson",
				"disambiguation": "Belgian techno / hard trance act",
				"description": null,
				"cover": null,
				"folder": "/J/Jones & Stephenson",
				"color_palette": null,
				"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
				"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
				"type": "artists"
			}
		],
		"album_track": [
			{
				"color_palette": {
					"cover": {
						"dominant": "#E0F0F0FF",
						"primary": "#CEE1C4FF",
						"lightVibrant": "#3EFE00FF",
						"darkVibrant": "#2C7100FF",
						"lightMuted": "#C5C7C6FF",
						"darkMuted": "#7F7F81FF"
					}
				},
				"cover": "/34243807556-500.jpg",
				"disambiguation": null,
				"description": null,
				"folder": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6",
				"id": "e22a0b68-0011-42d0-a78d-293f66e6c1c3",
				"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
				"name": "A State of Trance: Classics, Volume 6",
				"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
				"type": "albums",
				"tracks": 35,
				"year": 2011,
				"album_artist": "89ad4ac3-39f7-470e-963a-56509c546377"
			}
		]
	},
	{
		"color_palette": {
			"cover": {
				"dominant": "#E0F0F0FF",
				"primary": "#CEE1C4FF",
				"lightVibrant": "#3EFE00FF",
				"darkVibrant": "#2C7100FF",
				"lightMuted": "#C5C7C6FF",
				"darkMuted": "#7F7F81FF"
			}
		},
		"cover": "/34243807556-500.jpg",
		"date": "2011-10-31T00:00:00",
		"disc": 3,
		"duration": "10:20",
		"favorite": false,
		"filename": "/3-01 Sky Falls Down (Armin van Buuren remix) [Above & Beyond presents OceanLab].mp3",
		"folder": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6",
		"id": "9b25dd40-c1de-3347-a52b-f38d5aaf5e0f",
		"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
		"folder_id": "01HQ5W84R600G31Q038AGNSKGT",
		"name": "Sky Falls Down (Armin van Buuren remix)",
		"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
		"path": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6//3-01 Sky Falls Down (Armin van Buuren remix) [Above & Beyond presents OceanLab].mp3",
		"quality": 321,
		"track": 1,
		"type": "tracks",
		"lyrics": null,
		"artist_track": [
			{
				"id": "370bd5a3-4abf-4356-8576-3a8fc0c11d65",
				"name": "Above & Beyond",
				"disambiguation": null,
				"description": null,
				"cover": "/above--beyond-5062a7ef74351.jpg",
				"folder": "/A/Above & Beyond",
				"color_palette": {
					"cover": {
						"dominant": "#000000FF",
						"primary": "#41332CFF",
						"lightVibrant": "#C97658FF",
						"darkVibrant": "#080300FF",
						"lightMuted": "#C5C5C7FF",
						"darkMuted": "#7E7E80FF"
					}
				},
				"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
				"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
				"type": "artists"
			},
			{
				"id": "a558ed3c-ab7d-49b8-a52d-14071b95fa4f",
				"name": "OceanLab",
				"disambiguation": null,
				"description": null,
				"cover": null,
				"folder": "/O/OceanLab",
				"color_palette": null,
				"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
				"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
				"type": "artists"
			}
		],
		"album_track": [
			{
				"color_palette": {
					"cover": {
						"dominant": "#E0F0F0FF",
						"primary": "#CEE1C4FF",
						"lightVibrant": "#3EFE00FF",
						"darkVibrant": "#2C7100FF",
						"lightMuted": "#C5C7C6FF",
						"darkMuted": "#7F7F81FF"
					}
				},
				"cover": "/34243807556-500.jpg",
				"disambiguation": null,
				"description": null,
				"folder": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6",
				"id": "e22a0b68-0011-42d0-a78d-293f66e6c1c3",
				"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
				"name": "A State of Trance: Classics, Volume 6",
				"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
				"type": "albums",
				"tracks": 35,
				"year": 2011,
				"album_artist": "89ad4ac3-39f7-470e-963a-56509c546377"
			}
		]
	},
	{
		"color_palette": {
			"cover": {
				"dominant": "#E0F0F0FF",
				"primary": "#CEE1C4FF",
				"lightVibrant": "#3EFE00FF",
				"darkVibrant": "#2C7100FF",
				"lightMuted": "#C5C7C6FF",
				"darkMuted": "#7F7F81FF"
			}
		},
		"cover": "/34243807556-500.jpg",
		"date": "2011-10-31T00:00:00",
		"disc": 3,
		"duration": "07:32",
		"favorite": false,
		"filename": "/3-02 Automanual [Marco V].mp3",
		"folder": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6",
		"id": "c16bc017-4f3a-379d-b4a0-145c8c9875bb",
		"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
		"folder_id": "01HQ5W84R600G31Q038AGNSKGT",
		"name": "Automanual",
		"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
		"path": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6//3-02 Automanual [Marco V].mp3",
		"quality": 321,
		"track": 2,
		"type": "tracks",
		"lyrics": null,
		"artist_track": [
			{
				"id": "95e7f9cd-d774-4200-8337-cf27cb18d836",
				"name": "Marco V",
				"disambiguation": "Dutch DJ Marco Verkuylen",
				"description": null,
				"cover": "/marco-v-4fe60b2842ee8.jpg",
				"folder": "/M/Marco V",
				"color_palette": {
					"cover": {
						"dominant": "#000000FF",
						"primary": "#5D4D48FF",
						"lightVibrant": "#A6786BFF",
						"darkVibrant": "#070200FF",
						"lightMuted": "#C0C0C2FF",
						"darkMuted": "#817F80FF"
					}
				},
				"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
				"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
				"type": "artists"
			}
		],
		"album_track": [
			{
				"color_palette": {
					"cover": {
						"dominant": "#E0F0F0FF",
						"primary": "#CEE1C4FF",
						"lightVibrant": "#3EFE00FF",
						"darkVibrant": "#2C7100FF",
						"lightMuted": "#C5C7C6FF",
						"darkMuted": "#7F7F81FF"
					}
				},
				"cover": "/34243807556-500.jpg",
				"disambiguation": null,
				"description": null,
				"folder": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6",
				"id": "e22a0b68-0011-42d0-a78d-293f66e6c1c3",
				"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
				"name": "A State of Trance: Classics, Volume 6",
				"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
				"type": "albums",
				"tracks": 35,
				"year": 2011,
				"album_artist": "89ad4ac3-39f7-470e-963a-56509c546377"
			}
		]
	},
	{
		"color_palette": {
			"cover": {
				"dominant": "#E0F0F0FF",
				"primary": "#CEE1C4FF",
				"lightVibrant": "#3EFE00FF",
				"darkVibrant": "#2C7100FF",
				"lightMuted": "#C5C7C6FF",
				"darkMuted": "#7F7F81FF"
			}
		},
		"cover": "/34243807556-500.jpg",
		"date": "2011-10-31T00:00:00",
		"disc": 3,
		"duration": "09:11",
		"favorite": false,
		"filename": "/3-03 The White Room [Adam White & Andy Moor present Whiteroom].mp3",
		"folder": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6",
		"id": "73624956-809b-39e1-afb1-62637e382168",
		"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
		"folder_id": "01HQ5W84R600G31Q038AGNSKGT",
		"name": "The White Room",
		"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
		"path": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6//3-03 The White Room [Adam White & Andy Moor present Whiteroom].mp3",
		"quality": 321,
		"track": 3,
		"type": "tracks",
		"lyrics": null,
		"artist_track": [
			{
				"id": "89ea7d93-86b7-4876-8d36-1119678aeba1",
				"name": "Adam White",
				"disambiguation": "UK trance DJ/producer",
				"description": null,
				"cover": null,
				"folder": "/A/Adam White",
				"color_palette": null,
				"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
				"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
				"type": "artists"
			},
			{
				"id": "4c815fc0-2cac-457f-90a7-5f57c9dc3dcf",
				"name": "Andy Moor",
				"disambiguation": "UK artist/DJ/producer, member of Tilt",
				"description": null,
				"cover": "/moor-andy-50632004ac764.jpg",
				"folder": "/A/Andy Moor",
				"color_palette": {
					"cover": {
						"dominant": "#101010FF",
						"primary": "#5F5E5AFF",
						"lightVibrant": "#977D6EFF",
						"darkVibrant": "#020200FF",
						"lightMuted": "#C5C7C6FF",
						"darkMuted": "#7E807FFF"
					}
				},
				"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
				"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
				"type": "artists"
			},
			{
				"id": "2e746f7e-06ed-4fc3-915e-9d9f2bd93e7a",
				"name": "Whiteroom",
				"disambiguation": "trance duo",
				"description": null,
				"cover": null,
				"folder": "/W/Whiteroom",
				"color_palette": null,
				"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
				"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
				"type": "artists"
			}
		],
		"album_track": [
			{
				"color_palette": {
					"cover": {
						"dominant": "#E0F0F0FF",
						"primary": "#CEE1C4FF",
						"lightVibrant": "#3EFE00FF",
						"darkVibrant": "#2C7100FF",
						"lightMuted": "#C5C7C6FF",
						"darkMuted": "#7F7F81FF"
					}
				},
				"cover": "/34243807556-500.jpg",
				"disambiguation": null,
				"description": null,
				"folder": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6",
				"id": "e22a0b68-0011-42d0-a78d-293f66e6c1c3",
				"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
				"name": "A State of Trance: Classics, Volume 6",
				"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
				"type": "albums",
				"tracks": 35,
				"year": 2011,
				"album_artist": "89ad4ac3-39f7-470e-963a-56509c546377"
			}
		]
	},
	{
		"color_palette": {
			"cover": {
				"dominant": "#E0F0F0FF",
				"primary": "#CEE1C4FF",
				"lightVibrant": "#3EFE00FF",
				"darkVibrant": "#2C7100FF",
				"lightMuted": "#C5C7C6FF",
				"darkMuted": "#7F7F81FF"
			}
		},
		"cover": "/34243807556-500.jpg",
		"date": "2011-10-31T00:00:00",
		"disc": 3,
		"duration": "09:10",
		"favorite": false,
		"filename": "/3-04 Eye of Horus (Ronski Speed remix) [Aly & Fila].mp3",
		"folder": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6",
		"id": "82f60a23-80b4-3194-8e2d-a8410e1f47b6",
		"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
		"folder_id": "01HQ5W84R600G31Q038AGNSKGT",
		"name": "Eye of Horus (Ronski Speed remix)",
		"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
		"path": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6//3-04 Eye of Horus (Ronski Speed remix) [Aly & Fila].mp3",
		"quality": 321,
		"track": 4,
		"type": "tracks",
		"lyrics": null,
		"artist_track": [
			{
				"id": "045bc733-e2f0-4f3b-8807-6a6d84505ea8",
				"name": "Aly & Fila",
				"disambiguation": "trance duo",
				"description": null,
				"cover": "/aly--fila-5062a9ea474e0.jpg",
				"folder": "/A/Aly & Fila",
				"color_palette": {
					"cover": {
						"dominant": "#F0F0D0FF",
						"primary": "#796951FF",
						"lightVibrant": "#C4810CFF",
						"darkVibrant": "#401800FF",
						"lightMuted": "#C7C7C5FF",
						"darkMuted": "#7E7E7CFF"
					}
				},
				"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
				"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
				"type": "artists"
			}
		],
		"album_track": [
			{
				"color_palette": {
					"cover": {
						"dominant": "#E0F0F0FF",
						"primary": "#CEE1C4FF",
						"lightVibrant": "#3EFE00FF",
						"darkVibrant": "#2C7100FF",
						"lightMuted": "#C5C7C6FF",
						"darkMuted": "#7F7F81FF"
					}
				},
				"cover": "/34243807556-500.jpg",
				"disambiguation": null,
				"description": null,
				"folder": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6",
				"id": "e22a0b68-0011-42d0-a78d-293f66e6c1c3",
				"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
				"name": "A State of Trance: Classics, Volume 6",
				"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
				"type": "albums",
				"tracks": 35,
				"year": 2011,
				"album_artist": "89ad4ac3-39f7-470e-963a-56509c546377"
			}
		]
	},
	{
		"color_palette": {
			"cover": {
				"dominant": "#E0F0F0FF",
				"primary": "#CEE1C4FF",
				"lightVibrant": "#3EFE00FF",
				"darkVibrant": "#2C7100FF",
				"lightMuted": "#C5C7C6FF",
				"darkMuted": "#7F7F81FF"
			}
		},
		"cover": "/34243807556-500.jpg",
		"date": "2011-10-31T00:00:00",
		"disc": 3,
		"duration": "07:16",
		"favorite": false,
		"filename": "/3-05 Far From in Love [Above & Beyond].mp3",
		"folder": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6",
		"id": "3daf70e0-55b7-3d43-9f1d-be994c825b74",
		"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
		"folder_id": "01HQ5W84R600G31Q038AGNSKGT",
		"name": "Far From in Love",
		"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
		"path": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6//3-05 Far From in Love [Above & Beyond].mp3",
		"quality": 321,
		"track": 5,
		"type": "tracks",
		"lyrics": [
			{
				"text": "Sailing away from me like melting snow in my hair",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "I miss your touch,",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "Trying to sew up a love that was built on the sun",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "I miss you so much",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "Like a fire burns to embers",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "I know this is where it ends",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "In the ashes we are dying",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "almost strangers only friends",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "Far from in love x4",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "Far from in love (So far from love)",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "Far from in love",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "Far from in love (So away from love yeah yeah.)",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "Far from in love (From all the loving that I knew)",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "I can see behind your eyes that you're afraid of who you are",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "Only silence now between us",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "I'm amazed we've come this far",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "Far from in love x4",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "Far from in love (So far from love)",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "Far from in love",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "Far from in love (So away from love yeah yeah.)",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "Far from in love (From all the loving that I knew)",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			}
		],
		"artist_track": [
			{
				"id": "370bd5a3-4abf-4356-8576-3a8fc0c11d65",
				"name": "Above & Beyond",
				"disambiguation": null,
				"description": null,
				"cover": "/above--beyond-5062a7ef74351.jpg",
				"folder": "/A/Above & Beyond",
				"color_palette": {
					"cover": {
						"dominant": "#000000FF",
						"primary": "#41332CFF",
						"lightVibrant": "#C97658FF",
						"darkVibrant": "#080300FF",
						"lightMuted": "#C5C5C7FF",
						"darkMuted": "#7E7E80FF"
					}
				},
				"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
				"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
				"type": "artists"
			}
		],
		"album_track": [
			{
				"color_palette": {
					"cover": {
						"dominant": "#E0F0F0FF",
						"primary": "#CEE1C4FF",
						"lightVibrant": "#3EFE00FF",
						"darkVibrant": "#2C7100FF",
						"lightMuted": "#C5C7C6FF",
						"darkMuted": "#7F7F81FF"
					}
				},
				"cover": "/34243807556-500.jpg",
				"disambiguation": null,
				"description": null,
				"folder": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6",
				"id": "e22a0b68-0011-42d0-a78d-293f66e6c1c3",
				"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
				"name": "A State of Trance: Classics, Volume 6",
				"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
				"type": "albums",
				"tracks": 35,
				"year": 2011,
				"album_artist": "89ad4ac3-39f7-470e-963a-56509c546377"
			}
		]
	},
	{
		"color_palette": {
			"cover": {
				"dominant": "#E0F0F0FF",
				"primary": "#CEE1C4FF",
				"lightVibrant": "#3EFE00FF",
				"darkVibrant": "#2C7100FF",
				"lightMuted": "#C5C7C6FF",
				"darkMuted": "#7F7F81FF"
			}
		},
		"cover": "/34243807556-500.jpg",
		"date": "2011-10-31T00:00:00",
		"disc": 3,
		"duration": "08:20",
		"favorite": false,
		"filename": "/3-06 Divine [Selu Vibra].mp3",
		"folder": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6",
		"id": "64ac67ec-3fa2-3616-a28c-7d5c91e70b16",
		"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
		"folder_id": "01HQ5W84R600G31Q038AGNSKGT",
		"name": "Divine",
		"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
		"path": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6//3-06 Divine [Selu Vibra].mp3",
		"quality": 321,
		"track": 6,
		"type": "tracks",
		"lyrics": null,
		"artist_track": [
			{
				"id": "dbb6cf85-a13e-4325-947b-ca6061556782",
				"name": "Selu Vibra",
				"disambiguation": null,
				"description": null,
				"cover": null,
				"folder": "/S/Selu Vibra",
				"color_palette": null,
				"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
				"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
				"type": "artists"
			}
		],
		"album_track": [
			{
				"color_palette": {
					"cover": {
						"dominant": "#E0F0F0FF",
						"primary": "#CEE1C4FF",
						"lightVibrant": "#3EFE00FF",
						"darkVibrant": "#2C7100FF",
						"lightMuted": "#C5C7C6FF",
						"darkMuted": "#7F7F81FF"
					}
				},
				"cover": "/34243807556-500.jpg",
				"disambiguation": null,
				"description": null,
				"folder": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6",
				"id": "e22a0b68-0011-42d0-a78d-293f66e6c1c3",
				"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
				"name": "A State of Trance: Classics, Volume 6",
				"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
				"type": "albums",
				"tracks": 35,
				"year": 2011,
				"album_artist": "89ad4ac3-39f7-470e-963a-56509c546377"
			}
		]
	},
	{
		"color_palette": {
			"cover": {
				"dominant": "#E0F0F0FF",
				"primary": "#CEE1C4FF",
				"lightVibrant": "#3EFE00FF",
				"darkVibrant": "#2C7100FF",
				"lightMuted": "#C5C7C6FF",
				"darkMuted": "#7F7F81FF"
			}
		},
		"cover": "/34243807556-500.jpg",
		"date": "2011-10-31T00:00:00",
		"disc": 3,
		"duration": "07:49",
		"favorite": false,
		"filename": "/3-07 Tranceformation [Push vs. globe].mp3",
		"folder": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6",
		"id": "5efe6e14-b5e5-36c5-adec-420991d13149",
		"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
		"folder_id": "01HQ5W84R600G31Q038AGNSKGT",
		"name": "Tranceformation",
		"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
		"path": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6//3-07 Tranceformation [Push vs. globe].mp3",
		"quality": 321,
		"track": 7,
		"type": "tracks",
		"lyrics": null,
		"artist_track": [
			{
				"id": "1b9e6350-f7f8-483f-9917-a8c9fcf52e99",
				"name": "Push",
				"disambiguation": "techno/trance artist Mike Dierickx",
				"description": null,
				"cover": null,
				"folder": "/P/Push",
				"color_palette": null,
				"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
				"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
				"type": "artists"
			},
			{
				"id": "431edbb0-1093-4f43-9b6d-be123466a8f5",
				"name": "globe",
				"disambiguation": "Japanese dance-pop group",
				"description": null,
				"cover": null,
				"folder": "/G/globe",
				"color_palette": null,
				"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
				"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
				"type": "artists"
			}
		],
		"album_track": [
			{
				"color_palette": {
					"cover": {
						"dominant": "#E0F0F0FF",
						"primary": "#CEE1C4FF",
						"lightVibrant": "#3EFE00FF",
						"darkVibrant": "#2C7100FF",
						"lightMuted": "#C5C7C6FF",
						"darkMuted": "#7F7F81FF"
					}
				},
				"cover": "/34243807556-500.jpg",
				"disambiguation": null,
				"description": null,
				"folder": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6",
				"id": "e22a0b68-0011-42d0-a78d-293f66e6c1c3",
				"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
				"name": "A State of Trance: Classics, Volume 6",
				"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
				"type": "albums",
				"tracks": 35,
				"year": 2011,
				"album_artist": "89ad4ac3-39f7-470e-963a-56509c546377"
			}
		]
	},
	{
		"color_palette": {
			"cover": {
				"dominant": "#E0F0F0FF",
				"primary": "#CEE1C4FF",
				"lightVibrant": "#3EFE00FF",
				"darkVibrant": "#2C7100FF",
				"lightMuted": "#C5C7C6FF",
				"darkMuted": "#7F7F81FF"
			}
		},
		"cover": "/34243807556-500.jpg",
		"date": "2011-10-31T00:00:00",
		"disc": 3,
		"duration": "07:45",
		"favorite": false,
		"filename": "/3-08 Amsterdam (Smith & Pledger remix) [Luminary].mp3",
		"folder": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6",
		"id": "7d86d4f7-5445-392a-ad7f-bd3d3ce32405",
		"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
		"folder_id": "01HQ5W84R600G31Q038AGNSKGT",
		"name": "Amsterdam (Smith & Pledger remix)",
		"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
		"path": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6//3-08 Amsterdam (Smith & Pledger remix) [Luminary].mp3",
		"quality": 321,
		"track": 8,
		"type": "tracks",
		"lyrics": [
			{
				"text": "Underground or Aeroplane",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "Doesn't matter in the end",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "I know it has to be this way",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "You're leaving me again",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "So I'll write my little love song",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "And sing it to the wind",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "You're out there on the road tonight",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "London, New York, Amsterdam",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "And I'm lonely here without you",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "Miss your breath against my skin",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "You love me then you leave me",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "Still I lie here pressing fingers where your kisses have been",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "And I miss you",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "And I miss you",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "And I miss you",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "And I miss you",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "And I miss you",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "And I miss you",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "I know I should be in bed",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "And its almost 3am",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "But when I close my eyes I can only see miles of headlights",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "Flashing out the distance",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "'Cause I know that its been calling to you",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "London, New York, Amsterdam",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "So I'll sing my little lonely songs",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "Amsterdam",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "So I'll sing my little lonely songs",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "And sing it to the wind",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "You're out there on the road tonight",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "London, New York, Amsterdam",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "And I miss you",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "And I miss you",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "And I miss you",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "And I miss you",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "And I miss you",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "And I miss you",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "And I miss you",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "And I miss you",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "And I miss you",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			}
		],
		"artist_track": [
			{
				"id": "6026ad9e-35b8-48ef-912b-49ac6eec7ac0",
				"name": "Luminary",
				"disambiguation": "trance",
				"description": null,
				"cover": null,
				"folder": "/L/Luminary",
				"color_palette": null,
				"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
				"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
				"type": "artists"
			}
		],
		"album_track": [
			{
				"color_palette": {
					"cover": {
						"dominant": "#E0F0F0FF",
						"primary": "#CEE1C4FF",
						"lightVibrant": "#3EFE00FF",
						"darkVibrant": "#2C7100FF",
						"lightMuted": "#C5C7C6FF",
						"darkMuted": "#7F7F81FF"
					}
				},
				"cover": "/34243807556-500.jpg",
				"disambiguation": null,
				"description": null,
				"folder": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6",
				"id": "e22a0b68-0011-42d0-a78d-293f66e6c1c3",
				"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
				"name": "A State of Trance: Classics, Volume 6",
				"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
				"type": "albums",
				"tracks": 35,
				"year": 2011,
				"album_artist": "89ad4ac3-39f7-470e-963a-56509c546377"
			}
		]
	},
	{
		"color_palette": {
			"cover": {
				"dominant": "#E0F0F0FF",
				"primary": "#CEE1C4FF",
				"lightVibrant": "#3EFE00FF",
				"darkVibrant": "#2C7100FF",
				"lightMuted": "#C5C7C6FF",
				"darkMuted": "#7F7F81FF"
			}
		},
		"cover": "/34243807556-500.jpg",
		"date": "2011-10-31T00:00:00",
		"disc": 3,
		"duration": "09:18",
		"favorite": false,
		"filename": "/3-09 Top Gear [Rank 1].mp3",
		"folder": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6",
		"id": "b8943adf-2332-3e5b-99a1-9b73abc6a641",
		"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
		"folder_id": "01HQ5W84R600G31Q038AGNSKGT",
		"name": "Top Gear",
		"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
		"path": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6//3-09 Top Gear [Rank 1].mp3",
		"quality": 321,
		"track": 9,
		"type": "tracks",
		"lyrics": null,
		"artist_track": [
			{
				"id": "bd5d07eb-dcb8-4d11-b873-908401e92ee4",
				"name": "Rank 1",
				"disambiguation": null,
				"description": null,
				"cover": "/rank-1-5eaab0486c2b4.jpg",
				"folder": "/R/Rank 1",
				"color_palette": {
					"cover": {
						"dominant": "#101010FF",
						"primary": "#5C514CFF",
						"lightVibrant": "#B77662FF",
						"darkVibrant": "#020200FF",
						"lightMuted": "#C7C5C6FF",
						"darkMuted": "#817F80FF"
					}
				},
				"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
				"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
				"type": "artists"
			}
		],
		"album_track": [
			{
				"color_palette": {
					"cover": {
						"dominant": "#E0F0F0FF",
						"primary": "#CEE1C4FF",
						"lightVibrant": "#3EFE00FF",
						"darkVibrant": "#2C7100FF",
						"lightMuted": "#C5C7C6FF",
						"darkMuted": "#7F7F81FF"
					}
				},
				"cover": "/34243807556-500.jpg",
				"disambiguation": null,
				"description": null,
				"folder": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6",
				"id": "e22a0b68-0011-42d0-a78d-293f66e6c1c3",
				"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
				"name": "A State of Trance: Classics, Volume 6",
				"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
				"type": "albums",
				"tracks": 35,
				"year": 2011,
				"album_artist": "89ad4ac3-39f7-470e-963a-56509c546377"
			}
		]
	},
	{
		"color_palette": {
			"cover": {
				"dominant": "#E0F0F0FF",
				"primary": "#CEE1C4FF",
				"lightVibrant": "#3EFE00FF",
				"darkVibrant": "#2C7100FF",
				"lightMuted": "#C5C7C6FF",
				"darkMuted": "#7F7F81FF"
			}
		},
		"cover": "/34243807556-500.jpg",
		"date": "2011-10-31T00:00:00",
		"disc": 4,
		"duration": "05:26",
		"favorite": false,
		"filename": "/4-01 9 PM (Till I Come) (club mix) [ATB].mp3",
		"folder": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6",
		"id": "1dc35304-43fe-3deb-87b6-f3ab79f775af",
		"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
		"folder_id": "01HQ5W84R600G31Q038AGNSKGT",
		"name": "9 PM (Till I Come) (club mix)",
		"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
		"path": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6//4-01 9 PM (Till I Come) (club mix) [ATB].mp3",
		"quality": 321,
		"track": 1,
		"type": "tracks",
		"lyrics": [
			{
				"text": "Till I Come!",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "Change it and say 'Till I Come'!",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "Don't Stop:",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "Don't stop... it's the real sound.",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "The Summer:",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "The summer is here...",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "You wanna feel somebody",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "Irrational impulses",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "The Fields Of Love:",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "Have you ever seen the fields of love?",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "Have you ever felt the seeds of love?",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "Killer:",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "So you want to be free, to live your life the way you wanna be.",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "Will you give if we cry?",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "Will we live... or will we die?",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "Tainted hearts heal with time.",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "Shoot that love so we can stop the end aha",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "Solitary brother",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "Is there still a part of you that wants to live?",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "Solitary Sister",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "Is there still a part of you that wants to give?",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "If we try and live your lives the way you wanna be, yeah.",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "Racism in among future kings can only lead to no good.",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			},
			{
				"text": "Besides, all our sons and daughters already know how that feels yeah yeah yeah",
				"time": {
					"total": 0,
					"minutes": 0,
					"seconds": 0,
					"hundredths": 0
				}
			}
		],
		"artist_track": [
			{
				"id": "22a096ef-c70d-4d70-ae19-4fc2412d4986",
				"name": "ATB",
				"disambiguation": "German EDM DJ, musician & producer André Tanneberger",
				"description": null,
				"cover": "/atb-50bfc037d9653.jpg",
				"folder": "/A/ATB",
				"color_palette": {
					"cover": {
						"dominant": "#000000FF",
						"primary": "#4F403BFF",
						"lightVibrant": "#B27A6BFF",
						"darkVibrant": "#030200FF",
						"lightMuted": "#C7C7C5FF",
						"darkMuted": "#817F80FF"
					}
				},
				"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
				"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
				"type": "artists"
			}
		],
		"album_track": [
			{
				"color_palette": {
					"cover": {
						"dominant": "#E0F0F0FF",
						"primary": "#CEE1C4FF",
						"lightVibrant": "#3EFE00FF",
						"darkVibrant": "#2C7100FF",
						"lightMuted": "#C5C7C6FF",
						"darkMuted": "#7F7F81FF"
					}
				},
				"cover": "/34243807556-500.jpg",
				"disambiguation": null,
				"description": null,
				"folder": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6",
				"id": "e22a0b68-0011-42d0-a78d-293f66e6c1c3",
				"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
				"name": "A State of Trance: Classics, Volume 6",
				"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
				"type": "albums",
				"tracks": 35,
				"year": 2011,
				"album_artist": "89ad4ac3-39f7-470e-963a-56509c546377"
			}
		]
	},
	{
		"color_palette": {
			"cover": {
				"dominant": "#E0F0F0FF",
				"primary": "#CEE1C4FF",
				"lightVibrant": "#3EFE00FF",
				"darkVibrant": "#2C7100FF",
				"lightMuted": "#C5C7C6FF",
				"darkMuted": "#7F7F81FF"
			}
		},
		"cover": "/34243807556-500.jpg",
		"date": "2011-10-31T00:00:00",
		"disc": 4,
		"duration": "07:05",
		"favorite": false,
		"filename": "/4-02 Access [DJ Misjah & DJ Tim].mp3",
		"folder": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6",
		"id": "8388e00d-9073-3e6a-9d4b-8c921f3d37f6",
		"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
		"folder_id": "01HQ5W84R600G31Q038AGNSKGT",
		"name": "Access",
		"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
		"path": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6//4-02 Access [DJ Misjah & DJ Tim].mp3",
		"quality": 321,
		"track": 2,
		"type": "tracks",
		"lyrics": null,
		"artist_track": [
			{
				"id": "f4702a49-ff74-4d49-89a8-f19a808ad9d4",
				"name": "DJ Misjah & DJ Tim",
				"disambiguation": "duo",
				"description": null,
				"cover": null,
				"folder": "/D/DJ Misjah & DJ Tim",
				"color_palette": null,
				"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
				"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
				"type": "artists"
			}
		],
		"album_track": [
			{
				"color_palette": {
					"cover": {
						"dominant": "#E0F0F0FF",
						"primary": "#CEE1C4FF",
						"lightVibrant": "#3EFE00FF",
						"darkVibrant": "#2C7100FF",
						"lightMuted": "#C5C7C6FF",
						"darkMuted": "#7F7F81FF"
					}
				},
				"cover": "/34243807556-500.jpg",
				"disambiguation": null,
				"description": null,
				"folder": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6",
				"id": "e22a0b68-0011-42d0-a78d-293f66e6c1c3",
				"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
				"name": "A State of Trance: Classics, Volume 6",
				"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
				"type": "albums",
				"tracks": 35,
				"year": 2011,
				"album_artist": "89ad4ac3-39f7-470e-963a-56509c546377"
			}
		]
	},
	{
		"color_palette": {
			"cover": {
				"dominant": "#E0F0F0FF",
				"primary": "#CEE1C4FF",
				"lightVibrant": "#3EFE00FF",
				"darkVibrant": "#2C7100FF",
				"lightMuted": "#C5C7C6FF",
				"darkMuted": "#7F7F81FF"
			}
		},
		"cover": "/34243807556-500.jpg",
		"date": "2011-10-31T00:00:00",
		"disc": 4,
		"duration": "07:44",
		"favorite": false,
		"filename": "/4-03 Hale Bopp [Der Dritte Raum].mp3",
		"folder": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6",
		"id": "d205a22c-2d23-3e2d-b9ed-91dfbae66451",
		"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
		"folder_id": "01HQ5W84R600G31Q038AGNSKGT",
		"name": "Hale Bopp",
		"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
		"path": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6//4-03 Hale Bopp [Der Dritte Raum].mp3",
		"quality": 321,
		"track": 3,
		"type": "tracks",
		"lyrics": null,
		"artist_track": [
			{
				"id": "432a7d01-b55a-49de-b909-4b93d48a556f",
				"name": "Der Dritte Raum",
				"disambiguation": null,
				"description": null,
				"cover": null,
				"folder": "/D/Der Dritte Raum",
				"color_palette": null,
				"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
				"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
				"type": "artists"
			}
		],
		"album_track": [
			{
				"color_palette": {
					"cover": {
						"dominant": "#E0F0F0FF",
						"primary": "#CEE1C4FF",
						"lightVibrant": "#3EFE00FF",
						"darkVibrant": "#2C7100FF",
						"lightMuted": "#C5C7C6FF",
						"darkMuted": "#7F7F81FF"
					}
				},
				"cover": "/34243807556-500.jpg",
				"disambiguation": null,
				"description": null,
				"folder": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6",
				"id": "e22a0b68-0011-42d0-a78d-293f66e6c1c3",
				"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
				"name": "A State of Trance: Classics, Volume 6",
				"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
				"type": "albums",
				"tracks": 35,
				"year": 2011,
				"album_artist": "89ad4ac3-39f7-470e-963a-56509c546377"
			}
		]
	},
	{
		"color_palette": {
			"cover": {
				"dominant": "#E0F0F0FF",
				"primary": "#CEE1C4FF",
				"lightVibrant": "#3EFE00FF",
				"darkVibrant": "#2C7100FF",
				"lightMuted": "#C5C7C6FF",
				"darkMuted": "#7F7F81FF"
			}
		},
		"cover": "/34243807556-500.jpg",
		"date": "2011-10-31T00:00:00",
		"disc": 4,
		"duration": "07:58",
		"favorite": false,
		"filename": "/4-04 Beautiful [Ferry Corsten].mp3",
		"folder": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6",
		"id": "dd8641fa-4796-3821-84aa-3673a703d8eb",
		"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
		"folder_id": "01HQ5W84R600G31Q038AGNSKGT",
		"name": "Beautiful",
		"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
		"path": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6//4-04 Beautiful [Ferry Corsten].mp3",
		"quality": 321,
		"track": 4,
		"type": "tracks",
		"lyrics": null,
		"artist_track": [
			{
				"id": "47347cb8-ac34-4916-84b6-d85d4e5e5384",
				"name": "Ferry Corsten",
				"disambiguation": "Dutch DJ and producer",
				"description": null,
				"cover": "/corsten-ferry-50f9eb5379889.jpg",
				"folder": "/F/Ferry Corsten",
				"color_palette": {
					"cover": {
						"dominant": "#B0B0A0FF",
						"primary": "#AA9E97FF",
						"lightVibrant": "#A28259FF",
						"darkVibrant": "#090003FF",
						"lightMuted": "#C7C7C5FF",
						"darkMuted": "#7E807FFF"
					}
				},
				"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
				"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
				"type": "artists"
			}
		],
		"album_track": [
			{
				"color_palette": {
					"cover": {
						"dominant": "#E0F0F0FF",
						"primary": "#CEE1C4FF",
						"lightVibrant": "#3EFE00FF",
						"darkVibrant": "#2C7100FF",
						"lightMuted": "#C5C7C6FF",
						"darkMuted": "#7F7F81FF"
					}
				},
				"cover": "/34243807556-500.jpg",
				"disambiguation": null,
				"description": null,
				"folder": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6",
				"id": "e22a0b68-0011-42d0-a78d-293f66e6c1c3",
				"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
				"name": "A State of Trance: Classics, Volume 6",
				"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
				"type": "albums",
				"tracks": 35,
				"year": 2011,
				"album_artist": "89ad4ac3-39f7-470e-963a-56509c546377"
			}
		]
	},
	{
		"color_palette": {
			"cover": {
				"dominant": "#E0F0F0FF",
				"primary": "#CEE1C4FF",
				"lightVibrant": "#3EFE00FF",
				"darkVibrant": "#2C7100FF",
				"lightMuted": "#C5C7C6FF",
				"darkMuted": "#7F7F81FF"
			}
		},
		"cover": "/34243807556-500.jpg",
		"date": "2011-10-31T00:00:00",
		"disc": 4,
		"duration": "10:23",
		"favorite": false,
		"filename": "/4-05 Clear Blue Moon [Armin van Buuren presents Rising Star].mp3",
		"folder": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6",
		"id": "5dd70948-d426-349f-99f1-0e94adf70a36",
		"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
		"folder_id": "01HQ5W84R600G31Q038AGNSKGT",
		"name": "Clear Blue Moon",
		"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
		"path": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6//4-05 Clear Blue Moon [Armin van Buuren presents Rising Star].mp3",
		"quality": 321,
		"track": 5,
		"type": "tracks",
		"lyrics": null,
		"artist_track": [
			{
				"id": "477b8c0c-c5fc-4ad2-b5b2-191f0bf2a9df",
				"name": "Armin van Buuren",
				"disambiguation": null,
				"description": null,
				"cover": "/buuren-van-armin-4fdeea478c2c5.jpg",
				"folder": "/A/Armin van Buuren",
				"color_palette": {
					"cover": {
						"dominant": "#201010FF",
						"primary": "#483227FF",
						"lightVibrant": "#C87839FF",
						"darkVibrant": "#3A1700FF",
						"lightMuted": "#94908FFF",
						"darkMuted": "#787677FF"
					}
				},
				"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
				"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
				"type": "artists"
			},
			{
				"id": "dccce2ad-20e2-458e-924f-474845befb7e",
				"name": "Rising Star",
				"disambiguation": "Armin van Buuren",
				"description": null,
				"cover": null,
				"folder": "/R/Rising Star",
				"color_palette": null,
				"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
				"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
				"type": "artists"
			}
		],
		"album_track": [
			{
				"color_palette": {
					"cover": {
						"dominant": "#E0F0F0FF",
						"primary": "#CEE1C4FF",
						"lightVibrant": "#3EFE00FF",
						"darkVibrant": "#2C7100FF",
						"lightMuted": "#C5C7C6FF",
						"darkMuted": "#7F7F81FF"
					}
				},
				"cover": "/34243807556-500.jpg",
				"disambiguation": null,
				"description": null,
				"folder": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6",
				"id": "e22a0b68-0011-42d0-a78d-293f66e6c1c3",
				"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
				"name": "A State of Trance: Classics, Volume 6",
				"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
				"type": "albums",
				"tracks": 35,
				"year": 2011,
				"album_artist": "89ad4ac3-39f7-470e-963a-56509c546377"
			}
		]
	},
	{
		"color_palette": {
			"cover": {
				"dominant": "#E0F0F0FF",
				"primary": "#CEE1C4FF",
				"lightVibrant": "#3EFE00FF",
				"darkVibrant": "#2C7100FF",
				"lightMuted": "#C5C7C6FF",
				"darkMuted": "#7F7F81FF"
			}
		},
		"cover": "/34243807556-500.jpg",
		"date": "2011-10-31T00:00:00",
		"disc": 4,
		"duration": "07:36",
		"favorite": false,
		"filename": "/4-06 5 [Super8 & P.O.S. present Aalto].mp3",
		"folder": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6",
		"id": "06a8d637-981d-3c91-8e34-9811300df14e",
		"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
		"folder_id": "01HQ5W84R600G31Q038AGNSKGT",
		"name": "5",
		"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
		"path": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6//4-06 5 [Super8 & P.O.S. present Aalto].mp3",
		"quality": 321,
		"track": 6,
		"type": "tracks",
		"lyrics": null,
		"artist_track": [
			{
				"id": "d8b22cb4-f5e1-469e-868c-f251476ac3f1",
				"name": "Super8",
				"disambiguation": "Finnish trance DJ/producer Miika Eloranta",
				"description": null,
				"cover": null,
				"folder": "/S/Super8",
				"color_palette": null,
				"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
				"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
				"type": "artists"
			},
			{
				"id": "d344e2f3-46cc-4390-8e78-3a55f3cd4563",
				"name": "P.O.S.",
				"disambiguation": "trance artist Paavo Olavi Siljamäki",
				"description": null,
				"cover": "/pos-65d7496673b5b.jpg",
				"folder": "/P/P.O.S.",
				"color_palette": {
					"cover": {
						"dominant": "#205060FF",
						"primary": "#4C4F4CFF",
						"lightVibrant": "#D48631FF",
						"darkVibrant": "#000E15FF",
						"lightMuted": "#B5B7B6FF",
						"darkMuted": "#80807EFF"
					}
				},
				"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
				"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
				"type": "artists"
			},
			{
				"id": "6a1f8396-83e8-4b04-920b-77de86705b96",
				"name": "Aalto",
				"disambiguation": "trance duo from Finland",
				"description": null,
				"cover": null,
				"folder": "/A/Aalto",
				"color_palette": null,
				"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
				"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
				"type": "artists"
			}
		],
		"album_track": [
			{
				"color_palette": {
					"cover": {
						"dominant": "#E0F0F0FF",
						"primary": "#CEE1C4FF",
						"lightVibrant": "#3EFE00FF",
						"darkVibrant": "#2C7100FF",
						"lightMuted": "#C5C7C6FF",
						"darkMuted": "#7F7F81FF"
					}
				},
				"cover": "/34243807556-500.jpg",
				"disambiguation": null,
				"description": null,
				"folder": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6",
				"id": "e22a0b68-0011-42d0-a78d-293f66e6c1c3",
				"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
				"name": "A State of Trance: Classics, Volume 6",
				"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
				"type": "albums",
				"tracks": 35,
				"year": 2011,
				"album_artist": "89ad4ac3-39f7-470e-963a-56509c546377"
			}
		]
	},
	{
		"color_palette": {
			"cover": {
				"dominant": "#E0F0F0FF",
				"primary": "#CEE1C4FF",
				"lightVibrant": "#3EFE00FF",
				"darkVibrant": "#2C7100FF",
				"lightMuted": "#C5C7C6FF",
				"darkMuted": "#7F7F81FF"
			}
		},
		"cover": "/34243807556-500.jpg",
		"date": "2011-10-31T00:00:00",
		"disc": 4,
		"duration": "07:05",
		"favorite": false,
		"filename": "/4-07 Trance & Acid [Kai Tracid].mp3",
		"folder": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6",
		"id": "b4e63660-041f-33db-b251-38f999a61b7b",
		"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
		"folder_id": "01HQ5W84R600G31Q038AGNSKGT",
		"name": "Trance & Acid",
		"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
		"path": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6//4-07 Trance & Acid [Kai Tracid].mp3",
		"quality": 321,
		"track": 7,
		"type": "tracks",
		"lyrics": null,
		"artist_track": [
			{
				"id": "6546b116-81c8-4783-9219-19f6e8f3c020",
				"name": "Kai Tracid",
				"disambiguation": null,
				"description": null,
				"cover": "/tracid-kai-4fe58d9876e06.jpg",
				"folder": "/K/Kai Tracid",
				"color_palette": {
					"cover": {
						"dominant": "#909090FF",
						"primary": "#787873FF",
						"lightVibrant": "#818376FF",
						"darkVibrant": "#030200FF",
						"lightMuted": "#C5C5C3FF",
						"darkMuted": "#80807EFF"
					}
				},
				"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
				"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
				"type": "artists"
			}
		],
		"album_track": [
			{
				"color_palette": {
					"cover": {
						"dominant": "#E0F0F0FF",
						"primary": "#CEE1C4FF",
						"lightVibrant": "#3EFE00FF",
						"darkVibrant": "#2C7100FF",
						"lightMuted": "#C5C7C6FF",
						"darkMuted": "#7F7F81FF"
					}
				},
				"cover": "/34243807556-500.jpg",
				"disambiguation": null,
				"description": null,
				"folder": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6",
				"id": "e22a0b68-0011-42d0-a78d-293f66e6c1c3",
				"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
				"name": "A State of Trance: Classics, Volume 6",
				"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
				"type": "albums",
				"tracks": 35,
				"year": 2011,
				"album_artist": "89ad4ac3-39f7-470e-963a-56509c546377"
			}
		]
	},
	{
		"color_palette": {
			"cover": {
				"dominant": "#E0F0F0FF",
				"primary": "#CEE1C4FF",
				"lightVibrant": "#3EFE00FF",
				"darkVibrant": "#2C7100FF",
				"lightMuted": "#C5C7C6FF",
				"darkMuted": "#7F7F81FF"
			}
		},
		"cover": "/34243807556-500.jpg",
		"date": "2011-10-31T00:00:00",
		"disc": 4,
		"duration": "05:22",
		"favorite": false,
		"filename": "/4-08 Tempo Fiesta (Roll Fiesta) [Itty Bitty Boozy Woozy].mp3",
		"folder": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6",
		"id": "12fb0a53-82bf-3848-b26e-a8ff78c0607f",
		"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
		"folder_id": "01HQ5W84R600G31Q038AGNSKGT",
		"name": "Tempo Fiesta (Roll Fiesta)",
		"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
		"path": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6//4-08 Tempo Fiesta (Roll Fiesta) [Itty Bitty Boozy Woozy].mp3",
		"quality": 321,
		"track": 8,
		"type": "tracks",
		"lyrics": null,
		"artist_track": [
			{
				"id": "1884a9de-d8c4-403a-a6d0-75589821c5fb",
				"name": "Itty Bitty Boozy Woozy",
				"disambiguation": null,
				"description": null,
				"cover": null,
				"folder": "/I/Itty Bitty Boozy Woozy",
				"color_palette": null,
				"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
				"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
				"type": "artists"
			}
		],
		"album_track": [
			{
				"color_palette": {
					"cover": {
						"dominant": "#E0F0F0FF",
						"primary": "#CEE1C4FF",
						"lightVibrant": "#3EFE00FF",
						"darkVibrant": "#2C7100FF",
						"lightMuted": "#C5C7C6FF",
						"darkMuted": "#7F7F81FF"
					}
				},
				"cover": "/34243807556-500.jpg",
				"disambiguation": null,
				"description": null,
				"folder": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6",
				"id": "e22a0b68-0011-42d0-a78d-293f66e6c1c3",
				"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
				"name": "A State of Trance: Classics, Volume 6",
				"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
				"type": "albums",
				"tracks": 35,
				"year": 2011,
				"album_artist": "89ad4ac3-39f7-470e-963a-56509c546377"
			}
		]
	},
	{
		"color_palette": {
			"cover": {
				"dominant": "#E0F0F0FF",
				"primary": "#CEE1C4FF",
				"lightVibrant": "#3EFE00FF",
				"darkVibrant": "#2C7100FF",
				"lightMuted": "#C5C7C6FF",
				"darkMuted": "#7F7F81FF"
			}
		},
		"cover": "/34243807556-500.jpg",
		"date": "2011-10-31T00:00:00",
		"disc": 4,
		"duration": "08:10",
		"favorite": false,
		"filename": "/4-09 Need to Feel Loved (Thrillseekers mix) [Reflekt feat. Delline Bass].mp3",
		"folder": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6",
		"id": "66f571ed-1a62-3d33-b8cc-eeb8f138f70c",
		"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
		"folder_id": "01HQ5W84R600G31Q038AGNSKGT",
		"name": "Need to Feel Loved (Thrillseekers mix)",
		"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
		"path": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6//4-09 Need to Feel Loved (Thrillseekers mix) [Reflekt feat. Delline Bass].mp3",
		"quality": 321,
		"track": 9,
		"type": "tracks",
		"lyrics": null,
		"artist_track": [
			{
				"id": "3c60235d-d58f-47aa-97f9-7a1b3ed25671",
				"name": "Reflekt",
				"disambiguation": "English electronic duo",
				"description": null,
				"cover": null,
				"folder": "/R/Reflekt",
				"color_palette": null,
				"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
				"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
				"type": "artists"
			},
			{
				"id": "42e7062e-f074-412a-af2a-bfcbfe2db781",
				"name": "Delline Bass",
				"disambiguation": "UK model and singer",
				"description": null,
				"cover": null,
				"folder": "/D/Delline Bass",
				"color_palette": null,
				"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
				"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
				"type": "artists"
			}
		],
		"album_track": [
			{
				"color_palette": {
					"cover": {
						"dominant": "#E0F0F0FF",
						"primary": "#CEE1C4FF",
						"lightVibrant": "#3EFE00FF",
						"darkVibrant": "#2C7100FF",
						"lightMuted": "#C5C7C6FF",
						"darkMuted": "#7F7F81FF"
					}
				},
				"cover": "/34243807556-500.jpg",
				"disambiguation": null,
				"description": null,
				"folder": "/[Various Artists]/[2011] A State of Trance_ Classics, Volume 6",
				"id": "e22a0b68-0011-42d0-a78d-293f66e6c1c3",
				"library_id": "01HQ5W4JJ9ZAX7721AQJZFQ7E1",
				"name": "A State of Trance: Classics, Volume 6",
				"origin": "fcbb730a-a562-2ca5-d054-5d6acf2a1aaa",
				"type": "albums",
				"tracks": 35,
				"year": 2011,
				"album_artist": "89ad4ac3-39f7-470e-963a-56509c546377"
			}
		]
	}
]);
export const backlog = ref<Song[]>([]);
export const isPlaying = ref<boolean>(false);
export const isMuted = ref<boolean>(false);
export const isShuffling = ref<boolean>(false);
export const isRepeating = ref<RepeatState>('off');
export const volume = ref<number>(0);

export const setCurrentPlaylist = (value: string): void => {
	currentPlaylist.value = value;
};

watch(ap, (value) => {
	if (!value) return;

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
		queue.value = data;
	});

	value?.on('backlog', (data: Song[]) => {
		backlog.value = data;
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
};
export const toggleQueueMenuOpen = (): void => {
	queueMenuOpen.value = !queueMenuOpen.value;
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
