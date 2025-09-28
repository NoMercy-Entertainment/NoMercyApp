<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { IonCol, IonContent, IonGrid, IonItem, IonLabel, IonList, IonPage, IonRow, onIonViewDidEnter } from '@ionic/vue';
import useServerClient from '@/lib/clients/useServerClient';

import type { DisplayList } from '@/types/api/music/musicPlayer';

import CoverImage from '@/components/MusicPlayer/components/CoverImage.vue';
import { breakTitle2 } from '@/lib/stringArray';
import BigPlayButton from '@/components/Buttons/BigPlayButton.vue';
import MusicButton from '@/components/MusicPlayer/components/MusicButton.vue';
import TrackLinks from '@/components/MusicPlayer/components/TrackLinks.vue';
import {
	audioPlayer,
	currentMusicDeviceId,
	currentPlaylist,
	currentSong,
	isPlaying,
	setCurrentPlaylist,
} from '@/store/audioPlayer';
import type { PlaylistItem } from '@/types/musicPlayer';
import { focusColor, setColorPalette } from '@/store/ui';
import { currentServer } from '@/store/currentServer';
import EqSpinner from '@/components/Images/EqSpinner.vue';
import MediaLikeButton from '@/components/Buttons/MediaLikeButton.vue';
import Marquee from '@/components/Marquee.vue';
import { user } from '@/store/user';
import { musicSocketConnection } from '@/store/musicSocket';
import { deviceId } from '@/store/deviceInfo';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';

const route = useRoute();

const { data } = useServerClient<DisplayList>({
	path: route.fullPath,
});

onMounted(() => {
	if (data.value?.color_palette?.cover) {
		setColorPalette(data.value?.color_palette?.cover);
	}
	setTimeout(() => {
		const firstTrack = document.querySelector<HTMLAnchorElement>('.focusable');
		if (firstTrack) {
			firstTrack.focus();
		}
	}, 100);
});

watch(data, (value) => {
	if (value?.color_palette?.cover) {
		setColorPalette(value?.color_palette?.cover);
	}
	setTimeout(() => {
		const firstTrack = document.querySelector<HTMLAnchorElement>('.focusable');
		if (firstTrack) {
			firstTrack.focus();
		}
	}, 100);
});

const lastFocused = ref<HTMLAnchorElement>();
const scrollContainer = ref<HTMLDivElement>();

onIonViewDidEnter(() => {
	setTimeout(() => {
		const firstTrack = document.querySelector<HTMLAnchorElement>('.focusable');
		if (firstTrack) {
			firstTrack.focus();
		}
	}, 100);
});

function handleListFocus(event: FocusEvent) {
	const target = event.target as HTMLAnchorElement;
	const focusIndex = lastFocused.value?.getAttribute('data-index') ?? 0;
	const firstTrack = target.querySelector<HTMLAnchorElement>(
		`[data-index="${focusIndex}"] .focusable`,
	);
	if (firstTrack) {
		firstTrack.focus();
	}
}

function handleListItemFocus(event: FocusEvent) {
	const target = event.target as HTMLAnchorElement;
	lastFocused.value = target;

	if (target) {
		target.scrollIntoView({
			behavior: 'smooth',
			block: 'center',
		});
	}

	const dataId = target.closest('[data-id]')?.getAttribute('data-id');
	const firstTrack = target.querySelector<HTMLAnchorElement>(
		`[data-index="${dataId}"] .focusable`,
	);
	if (firstTrack) {
		firstTrack.focus();
	}
}

function handleUp(event: KeyboardEvent) {
	const target = event.target as HTMLAnchorElement;

	if (event.key === 'ArrowUp') {
		const previousSibling = target.closest('ion-item')
			?.previousSibling as HTMLElement;
		const nextFocus
			= previousSibling.querySelector<HTMLAnchorElement>('.focusable');

		if (nextFocus) {
			nextFocus.focus();
			nextFocus.scrollIntoView({
				behavior: 'smooth',
				block: 'center',
			});
		}
	}
	else if (event.key === 'ArrowDown') {
		const nextSibling = target.closest('ion-item')?.nextSibling as HTMLElement;
		const nextFocus
			= nextSibling.querySelector<HTMLAnchorElement>('.focusable');
		if (nextFocus) {
			nextFocus.focus();
			nextFocus.scrollIntoView({
				behavior: 'smooth',
				block: 'center',
			});
		}
	}
}

const playlistName = computed(
	() => `${data.value?.type?.replace(/s$/u, '')}/${data.value?.id}`,
);

function handleClick(song: PlaylistItem) {
	if (!data.value?.tracks)
		return;

	if (!user.value.features?.nomercyConnect) {
		if (currentPlaylist.value === playlistName.value) {
			audioPlayer.togglePlayback();
			return;
		}
		audioPlayer.playTrack(song!, data.value?.tracks);
		setCurrentPlaylist(playlistName.value);
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
	musicSocketConnection.value?.invoke(
		'StartPlaybackCommand',
		data.value?.type.replace(/s$/u, ''),
		data.value?.id,
		currentSong.value?.id ?? song?.id,
	);
	if (currentPlaylist.value === playlistName.value) {
		audioPlayer.togglePlayback();
		return;
	}
	audioPlayer.playTrack(song!, data.value?.tracks);
	setCurrentPlaylist(playlistName.value);
}
</script>

<template>
	<IonPage>
		<IonContent :fullscreen="true">
			<div
				:key="data?.id"
				:style="focusColor ? `--color-theme-8: ${focusColor}` : ''"
				class="w-full h-full absolute left-0 top-0 bg-[#131314] pointer-events-none -z-10"
			>
				<div
					class="w-available h-available absolute left-[202px] top-0 overflow-hidden bg-focus"
				>
					<img
						:src="`${currentServer?.serverBaseUrl}${
							data?.backdrop ?? data?.cover
						}`"
						alt=""
						class="w-available h-available absolute left-[-0.39px] top-[-0.39px] opacity-40 object-cover object-center"
					>
					<div
						class="w-[150vw] h-[150vw] absolute left-[-30%] bottom-[-50%]"
						style="
              background: radial-gradient(
                closest-side,
                rgba(19, 19, 20, 0.1) 0%,
                rgba(19, 19, 20, 1) 70.73974609375%
              );
            "
					/>
				</div>
			</div>

			<IonGrid>
				<IonRow class="ion-align-items-end">
					<IonCol size="3">
						<div
							class="flex justify-center w-available aspect-square my-8 ml-8 mr-16"
						>
							<CoverImage
								:alt="data?.name"
								:data="data"
								class="w-auto h-full aspect-square"
							/>
						</div>

						<div
							v-if="data?.name"
							class="relative mb-8 flex w-full flex-1 flex-shrink-0 flex-col items-start justify-start gap-4 flex-grow-1 text-left"
						>
							<div
								v-if="data.name.length > 50"
								class="w-full text-xl font-semibold line-clamp-2 leading-[130%] whitespace-pre-wrap"
								v-html="
									breakTitle2(
										data?.name ?? 'Songs you like',
										'text-xs line-clamp-1',
									)
								"
							/>

							<p
								v-else
								class="w-full text-xl font-semibold line-clamp-2 leading-[130%] whitespace-pre-wrap"
							>
								{{ data?.name }}
							</p>

							<div
								class="flex items-center h-8 gap-2 self-stretch w-full text-xs font-medium text-left"
							>
								<span v-if="data?.type" class="flex gap-2">
									<span>{{ data?.type.replace(/s$/u, "").toTitleCase() }}</span>
								</span>

								<span v-if="data?.tracks" class="flex gap-2">
									<span>•</span>
									<span>{{ data?.tracks.length }} {{ $t("tracks") }}</span>
								</span>
							</div>

							<div class="flex gap-2 items-center justify-between w-full">
								<MediaLikeButton :data="data" />

								<BigPlayButton :data="data" class="w-12 h-12 ml-auto" />
							</div>
						</div>
					</IonCol>

					<IonCol
						ref="scrollContainer"
						class="w-full h-available overflow-auto scroll-smooth"
						size="6"
						tabindex="0"
						@focus="handleListFocus($event)"
					>
						<IonList lines="none" mode="md">
							<template
								v-for="(song, index) in data?.tracks"
								:key="song.id + song?.favorite"
							>
								<IonItem
									class="group/track focus-within:bg-white/4 rounded-md overflow-clip"
									mode="md"
									tabindex="-1"
								>
									<IonGrid>
										<IonRow
											:data-id="song.id"
											:data-index="index"
											class="items-center !rounded-md !overflow-clip"
											tabindex="-1"
										>
											<IonCol size="2" tabindex="-1">
												<button
													:data-id="song.id"
													:data-index="index"
													class="focusable flex justify-center w-full aspect-video focus:outline outline-focus outline-2 outline-offset-2 mr-2 overflow-clip"
													tabindex="0"
													@click="handleClick(song)"
													@focus="handleListItemFocus($event)"
												>
													<CoverImage
														:alt="song.name"
														:data="song"
														class="w-auto h-full aspect-square"
													/>
												</button>
											</IonCol>

											<IonCol class="my-auto mt-2" size="8" tabindex="-1">
												<IonLabel tabindex="-1">
													<div class="flex w-available overflow-clip items-end">
														<div
															:class="{
																'w-0': currentSong?.id !== song.id,
																'w-6 mr-1': currentSong?.id === song.id,
															}"
															class="flex items-center justify-center h-full aspect-square overflow-clip transition-width duration-200"
														>
															<EqSpinner :playing="isPlaying" />
														</div>
														<Marquee
															:playing="!!currentSong?.id"
															:text="song.name"
															class="!w-[calc(100%-30px)] children:leading-none w-available overflow-clip"
														/>
													</div>

													<TrackLinks
														:id="song.id"
														:data="song.artist_track"
														suffix="track"
														type="artists"
														@keyup="handleUp($event)"
														@keydown.up.prevent
														@keydown.down.prevent
													/>
												</IonLabel>
											</IonCol>

											<IonCol
												class="opacity-0 group-focus-within/track:opacity-100 -ml-2"
												size="2"
												tabindex="-1"
											>
												<IonRow class="flex flex-nowrap" tabindex="-1">
													<MediaLikeButton :data="song" />
													<MusicButton
														:onclick="() => {}"
														class="!bg-transparent mr-2"
														label=""
														tabindex="0"
													>
														<MoooomIcon
															class="text-white"
															icon="menuDotsHorizontal"
														/>
													</MusicButton>
												</IonRow>
											</IonCol>
										</IonRow>
									</IonGrid>
								</IonItem>
							</template>
						</IonList>
					</IonCol>
				</IonRow>
			</IonGrid>
		</IonContent>
	</IonPage>
</template>

<style scoped>
ion-content > ion-grid {
	--ion-grid-padding: 4rem;
	--ion-grid-columns: 9;
	height: 100%;
	width: 100%;
	padding: 6rem 2rem 0 4rem !important;
}

ion-content > ion-grid > ion-row {
	height: 100%;
}

ion-content > ion-grid > ion-row > ion-col {
	height: 100%;
}

.p-scrollpanel {
	--p-scrollpanel-bar-size: 6px;
}

ion-item {
	--padding-start: 0;
}

ion-item::part(native) {
	--inner-padding-end: 0;
}

ion-item::part(native):after {
	@apply rounded-md;
	--background-focused: currentColor;
	--background-focused-opacity: 0.12;
}

ion-item > ion-grid {
	--ion-grid-columns: 12;
	--ion-grid-padding: 0;
}

ion-item > ion-grid > ion-row {
}

ion-list {
	@apply bg-transparent w-full;
}

ion-item {
	--background: transparent;
	--color: var(--color-text);
}

ion-item::part(detail-icon) {
	color: white;
	opacity: 1;
	font-size: 20px;
}
</style>
