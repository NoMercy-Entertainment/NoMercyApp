<script setup lang="ts">
import {onMounted, ref, watch} from "vue";
import {IonPage, IonContent} from '@ionic/vue';

import useMounted from "@/hooks/useMounted";
import {connection, castSocketIsConnected, startCastSocket, stopCastSocket} from "@/lib/clients/castSocket";
import SliderBar from "@/components/MusicPlayer/components/SliderBar.vue";
import MoooomIcon from "@/components/Images/icons/MoooomIcon.vue";
import MusicButton from "@/components/MusicPlayer/components/MusicButton.vue";
import PlayerIcon from "@/components/Images/icons/PlayerIcon.vue";
import {TimeData, PlaylistItem, Track} from "@nomercy-entertainment/nomercy-video-player/src/types";
import {pad} from "@/lib/stringArray";
import type {MediaPlaylist} from "hls.js";

const receivers = ref<string[]>([]);
const currentReceiver = ref<string>('');
const chromeCastStatus = ref<string>('');
const mediaStatus = ref<string>('');
const volume = ref<number>(0);
const isMuted = ref<boolean>(false);
const isStandby = ref<boolean>(false);
const isPlaying = ref<boolean>(false);
const input = ref<string>('tv/117933');

const timeState = ref<TimeData>({
  currentTime: 0,
  duration: 0,
  percentage: 0,
  remaining: 0,
  playbackRate: 1,
  currentTimeHuman: '00:00',
  durationHuman: '00:00',
  remainingHuman: '00:00',
});

const currentTime = ref<number>(timeState.value.currentTime);
const duration = ref<number>(timeState.value.duration);
const remainingTime = ref<number>(timeState.value.remaining);
const currentTimeHuman = ref<string>(timeState.value.currentTimeHuman);
const durationHuman = ref<string>(timeState.value.durationHuman);
const remainingTimeHuman = ref<string>(timeState.value.remainingHuman);
const percentage = ref<number>(0);

watch(timeState, (value) => {
  currentTime.value = value.currentTime;
  duration.value = value.duration;
  remainingTime.value = value.remaining;
  currentTimeHuman.value = value.currentTimeHuman;
  durationHuman.value = value.durationHuman;
  remainingTimeHuman.value = value.remainingHuman;
  percentage.value = value.percentage;
});

const playlist = ref<PlaylistItem[]>([]);
const playlistItem = ref<PlaylistItem>(<PlaylistItem>{});

const subtitleTracks = ref<Array<Track>>([]);
const currentSubtitleTrack = ref<Track|null>(null);
const audioTracks = ref<MediaPlaylist[]>([]);
const currentAudioTrack = ref<MediaPlaylist | null>(null);

useMounted(startCastSocket, stopCastSocket);

watch(castSocketIsConnected, (value) => {
  if (value) {
    connection.value?.invoke('GetChromeCasts')
        .then((data: string[]) => {
          receivers.value = data;
        });

    connection.value?.invoke('GetChromeCastStatus')
        .then((data) => {
          chromeCastStatus.value = data;
        });

    connection.value?.invoke('GetMediaStatus')
        .then((data) => {
          mediaStatus.value = data;
        });

    connection.value?.invoke('GetPlayerState');

    connection.value?.on('Time', (data) => {
      timeState.value = data;
    });

    connection.value?.on('Item', (data) => {
      playlistItem.value = data;
    });
    connection.value?.on('Play', () => {
      isPlaying.value = true;
    });
    connection.value?.on('Pause', () => {
      isPlaying.value = false;
    });

    connection.value?.on('Playlist', (data) => {
      playlist.value = data;
    });

    connection.value?.on('AudioTracks', (data) => {
      audioTracks.value = data;
    });

    connection.value?.on('CurrentAudioTrack', (data) => {
      currentAudioTrack.value = audioTracks.value.find(item => item.id == data)!;
    });

    connection.value?.on('SubtitleTracks', (data) => {
      subtitleTracks.value = data;
    });

    connection.value?.on('CurrentSubtitleTrack', (data) => {
      currentSubtitleTrack.value = data;
    });

    connection.value?.on('PlayerState', (state: {
      time: TimeData,
      volume: number,
      muted: boolean,
      playlist: PlaylistItem[],
      isPlaying: boolean,
      subtitles: Track[],
      currentSubtitleTrack: Track,
      audioTracks: MediaPlaylist[],
      currentAudioTrack: number,
    }) => {
      console.log(state);
      timeState.value = state.time;
      volume.value = state.volume;
      isMuted.value = state.muted;
      playlist.value = state.playlist;
      isPlaying.value = state.isPlaying;
      subtitleTracks.value = state.subtitles;
      currentSubtitleTrack.value = state.currentSubtitleTrack;
      audioTracks.value = state.audioTracks;
      currentAudioTrack.value = state.audioTracks.find(item => item.id == state.currentAudioTrack)!;
      playlistItem.value = state.playlist.find(item => item.tracks?.some(track => track.file == state.currentSubtitleTrack.file))!;
    });

    // connection.value?.on('StatusChanged', (data: string) => {
    //     console.log('StatusChanged', data);
    // });
    // connection.value?.on('ReceiverStatusChanged', (data: string) => {
    //     console.log('ReceiverStatusChanged', data);
    // });
    // connection.value?.on('LaunchStatusChanged', (data: string) => {
    //     console.log('LaunchStatusChanged', data);
    // });
  }
});

onMounted(() => {
  connection.value?.on('ChromeCastConnected', (data: string) => {
    receivers.value.push(data);
  });

  connection.value?.on('ChromeCastDisconnected', (data: string) => {
    receivers.value = receivers.value.filter(item => item !== data);
  });

  // connection.value?.on('StatusChanged', (data: string) => {
  //     console.log('StatusChanged', data);
  // });
  // connection.value?.on('ReceiverStatusChanged', (data: string) => {
  //     console.log('ReceiverStatusChanged', data);
  // });
  // connection.value?.on('LaunchStatusChanged', (data: string) => {
  //     console.log('LaunchStatusChanged', data);
  // });

  if (castSocketIsConnected.value) {
    connection.value?.invoke('GetChromeCasts')
        .then((data: string[]) => {
          receivers.value = data;
        });

    connection.value?.invoke('GetChromeCastStatus')
        .then((data) => {
          chromeCastStatus.value = data;
        });

    connection.value?.invoke('GetMediaStatus')
        .then((data) => {
          mediaStatus.value = data;
        });

    connection.value?.invoke('GetPlayerState');

    connection.value?.on('Time', (data) => {
      timeState.value = data;
    });

    connection.value?.on('Item', (data) => {
      playlistItem.value = data;
    });
    connection.value?.on('Play', () => {
      isPlaying.value = true;
    });
    connection.value?.on('Pause', () => {
      isPlaying.value = false;
    });

    connection.value?.on('Playlist', (data) => {
      playlist.value = data;
    });

    connection.value?.on('AudioTracks', (data) => {
      audioTracks.value = data;
    });

    connection.value?.on('CurrentAudioTrack', (data) => {
      currentAudioTrack.value = audioTracks.value.find(item => item.id == data)!;
    });

    connection.value?.on('SubtitleTracks', (data) => {
      subtitleTracks.value = data;
    });

    connection.value?.on('CurrentSubtitleTrack', (data) => {
      currentSubtitleTrack.value = data;
    });

    connection.value?.on('PlayerState', (state: {
      time: TimeData,
      volume: number,
      muted: boolean,
      playlist: PlaylistItem[],
      isPlaying: boolean,
      subtitles: Track[],
      currentSubtitleTrack: Track,
      audioTracks: MediaPlaylist[],
      currentAudioTrack: number,
    }) => {
      timeState.value = state.time;
      volume.value = state.volume;
      isMuted.value = state.muted;
      playlist.value = state.playlist;
      isPlaying.value = state.isPlaying;
      subtitleTracks.value = state.subtitles;
      currentSubtitleTrack.value = state.currentSubtitleTrack;
      audioTracks.value = state.audioTracks;
      currentAudioTrack.value = state.audioTracks.find(item => item.id == state.currentAudioTrack)!;
      playlistItem.value = state.playlist.find(item => item.tracks?.some(track => track.file == state.currentSubtitleTrack.file))!;
    });
  }

});

watch(currentReceiver, (value) => {
  connection.value?.invoke('SelectChromecast', value);
});

watch(chromeCastStatus, (value) => {
  // @ts-ignore
  volume.value = value.Volume.Level * 100;
  // @ts-ignore
  isMuted.value = value.Volume.Muted;
  // @ts-ignore
  isStandby.value = value.IsStandBy;
});

watch(receivers, (value) => {
  if (value.length > 0) {
    currentReceiver.value = value[0];
  }
});

watch(volume, (value) => {
  connection.value?.invoke('SetVolume', value);
});

const launch = () => {
  connection.value?.invoke('Launch');
};

const castPlaylist = (value: string) => {
  connection.value?.invoke('CastPlaylist', value);
};

const toggleMute = () => {
  if (isMuted.value) {
    connection.value?.invoke('SetUnMute');
  } else {
    connection.value?.invoke('SetMute');
  }
};

const handlePlayback = () => {
  if (isPlaying.value) {
    connection.value?.invoke('SetPause');
  } else {
    connection.value?.invoke('SetPlay');
  }
};

const handleNext = () => {
  connection.value?.invoke('SetNext');
};

const handlePrevious = () => {
  connection.value?.invoke('SetPrevious');
};

const disconnect = () => {
  connection.value?.invoke('Disconnect');
};

const seek = (value: number) => {
  percentage.value = value;
  connection.value?.invoke('SetSeek', value);
};

const translations = {
  off: "Off",
  und: "Unknown",
  zxx: "None",
  contain: "Contain",
  cover: "Cover",
  fill: "Fill",
  aar: "Afar",
  abk: "Abkhaz",
  afr: "Afrikaans",
  aka: "Akan",
  alb: "Albanian",
  amh: "Amharic",
  ara: "Arabic",
  arg: "Aragonese",
  arm: "Armenian",
  asm: "Assamese",
  ava: "Avaric",
  ave: "Avestan",
  aym: "Aymara",
  aze: "Azerbaijani",
  bak: "Bashkir",
  bam: "Bambara",
  baq: "Basque",
  bel: "Belarusian",
  ben: "Bengali",
  bih: "Bihari",
  bis: "Bislama",
  bos: "Bosnian",
  bra: "Brazilian",
  bre: "Breton",
  bul: "Bulgarian",
  bur: "Burmese",
  cat: "Catalan",
  cha: "Chamorro",
  che: "Chechen",
  chi: "Chinese",
  chu: "Old Church Slavonic, Church Slavonic, Old Bulgarian",
  chv: "Chuvash",
  cor: "Cornish",
  cro: "Croatian",
  cos: "Corsican",
  cre: "Cree",
  cze: "Czech",
  dan: "Danish",
  div: "Divehi, Dhivehi, Maldivian",
  dut: "Dutch",
  dzo: "Dzongkha",
  eng: "English",
  epo: "Esperanto",
  est: "Estonian",
  ewe: "Ewe",
  fao: "Faroese",
  fij: "Fijian",
  fil: "Filipino",
  fin: "Finnish",
  fre: "French",
  fry: "Western Frisian",
  ful: "Fulah",
  geo: "Georgian",
  ger: "German",
  gla: "Scottish Gaelic, Gaelic",
  gle: "Irish",
  glg: "Galician",
  glv: "Manx",
  gre: "Greek",
  grn: "Guaraní",
  gsw: "Swiss German",
  guj: "Gujarati",
  hat: "Haitian, Haitian Creole",
  hau: "Hausa",
  haw: "Hawaiian",
  heb: "Hebrew",
  her: "Herero",
  hin: "Hindi",
  hmo: "Hiri Motu",
  hrv: "Croatian",
  hun: "Hungarian",
  ibo: "Igbo",
  ice: "Icelandic",
  ido: "Ido",
  iii: "Sichuan Yi",
  iku: "Inuktitut",
  ile: "Interlingue",
  ina: "Interlingua",
  ind: "Indonesian",
  ipk: "Inupiaq",
  ita: "Italian",
  jav: "Javanese",
  jpn: "Japanese",
  kan: "Kannada",
  kas: "Kashmiri",
  kau: "Kanuri",
  kaz: "Kazakh",
  khm: "Khmer",
  kik: "Kikuyu",
  kin: "Kinyarwanda",
  kir: "Kyrgyz",
  kom: "Komi",
  kon: "Kongo",
  kor: "Korean",
  kua: "Kwanyama, Kuanyama",
  kur: "Kurdish",
  lao: "Lao",
  lat: "Latin",
  lav: "Latvian",
  lim: "Limburgish, Limburgan, Limburger",
  lin: "Lingala",
  lit: "Lithuanian",
  ltz: "Luxembourgish, Letzeburgesch",
  lub: "Luba-Katanga",
  lug: "Ganda",
  mac: "Macedonian",
  mah: "Marshallese",
  mal: "Malayalam",
  mao: "Māori",
  mar: "Marathi",
  may: "Malay",
  mlg: "Malagasy",
  mlt: "Maltese",
  mon: "Mongolian",
  nau: "Nauru",
  nav: "Navajo, Navaho",
  nbl: "Southern Ndebele",
  nde: "Northern Ndebele",
  ndo: "Ndonga",
  nep: "Nepali",
  nno: "Norwegian Nynorsk",
  nob: "Norwegian Bokmål",
  nor: "Norwegian",
  nya: "Chichewa, Chewa, Nyanja",
  oci: "Occitan",
  oji: "Ojibwe, Ojibwa",
  ori: "Oriya",
  orm: "Oromo",
  oss: "Ossetian, Ossetic",
  pan: "Punjabi",
  per: "Persian",
  pli: "Pāli",
  pob: "Brazilian Portuguese",
  pol: "Polish",
  por: "Portuguese",
  pus: "Pashto",
  que: "Quechua",
  roh: "Romansh",
  rum: "Romanian",
  run: "Kirundi",
  rus: "Russian",
  sag: "Sango",
  san: "Sanskrit (Saṁskṛta)",
  sin: "Sinhala",
  slo: "Slovak",
  slv: "Slovenian",
  sme: "Northern Sami",
  smo: "Samoan",
  sna: "Shona",
  snd: "Sindhi",
  som: "Somali",
  sot: "Southern Sotho",
  spa: "Spanish",
  srd: "Sardinian",
  srp: "Serbian",
  ssw: "Swati",
  sun: "Sundanese",
  swa: "Swahili",
  swe: "Swedish",
  tah: "Tahitian",
  tam: "Tamil",
  tat: "Tatar",
  tel: "Telugu",
  tgk: "Tajik",
  tgl: "Tagalog",
  tha: "Thai",
  tib: "Tibetan",
  tir: "Tigrinya",
  ton: "Tonga",
  tsn: "Tswana",
  tso: "Tsonga",
  tuk: "Turkmen",
  tur: "Turkish",
  twi: "Twi",
  uig: "Uyghur, Uighur",
  ukr: "Ukrainian",
  urd: "Urdu",
  uzb: "Uzbek",
  ven: "Venda",
  vie: "Vietnamese",
  vol: "Volapük",
  wel: "Welsh",
  wln: "Walloon",
  wol: "Wolof",
  xho: "Xhosa",
  yid: "Yiddish",
  yor: "Yoruba",
  zha: "Zhuang, Chuang",
  zul: "Zulu"
}

const setSubtitle = (value: number) => {
  connection.value?.invoke('SetSubtitleTrack', value);
}

const setAudio = (value: number) => {
  connection.value?.invoke('SetAudioTrack', value);
}

const setPlaylistItem = (value: number) => {
  connection.value?.invoke('SetPlaylistItem', value);
}

</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="flex flex-col gap-4 items-center justify-center p-4">
        <Select v-model="currentReceiver" :options="receivers" optionLabel="" class="w-1/3 min-w-96"/>

        <div class="flex gap-4 w-1/3 min-w-96 items-center">
          <Button @click="launch" id="launch">
            {{ $t('Launch') }}
          </Button>
          <InputText v-model="input" class="w-full"/>
          <Button @click="castPlaylist(input)" id="cast">
            {{ $t('Cast') }}
          </Button>
        </div>

        <div v-if="playlistItem" class="flex flex-col gap-4 w-1/3 min-w-96 items-center justify-center">
          <div class="flex gap-1 items-center">
            <span>
                {{ playlistItem.show }}
            </span>
            <span v-if="playlistItem.season && playlistItem.episode">
                - S{{ pad(playlistItem.season, 2) }}E{{ pad(playlistItem.episode, 2) }} -
            </span>
            <span>
                {{ playlistItem.title }}
            </span>
          </div>

          <img v-if="playlistItem.image" :src="playlistItem.image" :alt="playlistItem.title"
               class="aspect-video w-full h-auto">
        </div>

        <div class="flex gap-4 w-1/3 min-w-96 items-center justify-center">

          <MusicButton label="Previous" :onclick="handlePrevious">
            <PlayerIcon icon="nmPreviousHalftone" class="absolute h-7 w-7 inset-1.5"/>
            <PlayerIcon icon="nmPrevious"
                        class="absolute h-7 w-7 opacity-0 group-hover/button:opacity-100 inset-1.5"/>
          </MusicButton>

          <MusicButton label="Toggle Playback" :onclick="handlePlayback">

            <PlayerIcon icon="nmPause" v-if="isPlaying"
                        className="h-9 w-9"/>
            <PlayerIcon icon="nmPlay" v-else
                        className="h-9 w-9"/>

          </MusicButton>

          <MusicButton label="Next" :onclick="handleNext">
            <PlayerIcon icon="nmNextHalftone" class="absolute h-7 w-7 inset-1.5"/>
            <PlayerIcon icon="nmNext"
                        class="absolute h-7 w-7 opacity-0 group-hover/button:opacity-100 inset-1.5"/>
          </MusicButton>

        </div>

        <div class="flex gap-4 w-1/3 min-w-96 items-center">
          <span class="font-mono">{{ currentTimeHuman }}</span>
          <SliderBar
              :percentage="percentage"
              :position="currentTime"
              :min="0"
              :max="duration"
              @input="seek(Number(($event.target as HTMLInputElement).value))"
          />
          <span class="font-mono">{{ remainingTimeHuman }}</span>
        </div>

        <div class="flex gap-4 w-1/3 min-w-96 items-center">
          <MusicButton label="Mute" :onclick="toggleMute">
            <MoooomIcon icon="volumeMuted" v-if="isMuted" class="h-6 w-6"/>
            <MoooomIcon icon="volumeOne" v-else-if="volume == 0" class="h-6 w-6"/>
            <MoooomIcon icon="volumeThree" v-else-if="volume > 50" class="h-6 w-6"/>
            <MoooomIcon icon="volumeTwo" v-else class="h-6 w-6"/>
          </MusicButton>

          <SliderBar
              :percentage="volume"
              :position="volume"
              @input="volume = Number(($event.target as HTMLInputElement).value)"
              :min="0"
              :step="1"
              :max="100"
          />
        </div>

        <div class="flex flex-col gap-4 w-1/3 min-w-96 items-center justify-center">

          <div class="flex gap-4 w-full items-center justify-center">
            <FloatLabel variant="on" class="w-full">
              <Select v-model="currentSubtitleTrack"
                      :options="subtitleTracks"
                      id="subtitleTracks"
                      :optionLabel="(track: Track) => `${track.language ? translations[track.language as 'off'] : ''} ${track.label?.toTitleCase()} ${track.file.endsWith('ass') ? ' - Styled' : ''}`"
                      class="w-full"
                      @change="setSubtitle($event.value.id)"
              />
              <label for="subtitleTracks">Subtitle</label>
            </FloatLabel>

            <FloatLabel variant="on" class="w-full">
              <Select v-model="currentAudioTrack"
                      :options="audioTracks"
                      id="audioTracks"
                      :optionLabel="(track: Track) => `${track.label}`"
                      class="w-full"
                      @change="setAudio($event.value.id)"
              />
              <label for="audioTracks">Audio</label>
            </FloatLabel>
          </div>

          <FloatLabel variant="on" class="w-full">
            <Select v-model="playlistItem"
                    id="playlist"
                    :options="playlist"
                    :optionLabel="(item: PlaylistItem) => `S${pad(item.season ?? 0,2) }E${pad(item.episode ?? 0,2) } - ${item.title}`"
                    class="w-full"
                    @change="setPlaylistItem(playlist.indexOf($event.value))"
            />
            <label for="playlist">Playlist Item</label>
          </FloatLabel>
        </div>
      </div>

      <!--            <pre>-->
      <!--            {{ currentReceiver }}-->

      <!--            {{ mediaStatus }}-->

      <!--            {{ audioTracks }}-->
      <!--            {{ subtitleTracks }}-->
      <!--        </pre>-->

    </ion-content>
  </ion-page>
</template>
