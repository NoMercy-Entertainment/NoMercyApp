<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import {
	IonCol,
	IonContent,
	IonGrid,
	IonItem,
	IonLabel,
	IonList,
	IonPage,
	IonRow,
	onIonViewDidEnter,
} from '@ionic/vue';
import useServerClient from '@/lib/clients/useServerClient';

import type { DisplayList } from '@/types/api/music/musicPlayer';

import CoverImage from '@/components/MusicPlayer/components/CoverImage.vue';
import OptimizedIcon from '@/components/OptimizedIcon.vue';
import { breakTitle2 } from '@/lib/stringArray';
import BigPlayButton from '@/components/Buttons/BigPlayButton.vue';
import MusicButton from '@/components/MusicPlayer/components/MusicButton.vue';
import TrackLinks from '@/components/MusicPlayer/components/TrackLinks.vue';
import {
	audioPlayer,
	currentSong,
	isPlaying,
	openFullPlayer,
	setCurrentPlaylist,
} from '@/store/audioPlayer';
import type { PlaylistItem } from '@/types/musicPlayer';
import { focusColor, setColorPalette } from '@/store/ui';
import { currentServer } from '@/store/currentServer';
import EqSpinner from '@/components/Images/EqSpinner.vue';
import MediaLikeButton from '@/components/Buttons/MediaLikeButton.vue';
import Marquee from '@/components/Marquee.vue';

const route = useRoute();

const { data } = useServerClient<DisplayList>({
	path: route.fullPath,
	keepForever: true,
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

function setCurrentList() {
	setCurrentPlaylist(route.fullPath);
}

function handleClick(song: PlaylistItem) {
	if (!currentSong.value) {
		setCurrentList();
	}

	audioPlayer.playTrack(song, data.value?.tracks ?? []);
	openFullPlayer();
}
</script>

<template>
	<IonPage>
		<IonContent :fullscreen="true">
			<div
				:key="data?.id"
				class="w-full h-full absolute left-0 top-0 bg-[#131314] pointer-events-none -z-10"
				:style="focusColor ? `--color-focus: ${focusColor}` : ''"
			>
				<div
					class="w-available h-available absolute left-[202px] top-0 overflow-hidden bg-focus"
				>
					<img
						class="w-available h-available absolute left-[-0.39px] top-[-0.39px] opacity-40 object-cover object-center"
						:src="`${currentServer?.serverBaseUrl}${
							data?.backdrop ?? data?.cover
						}`"
						alt=""
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
								:data="data"
								:alt="data?.name"
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
						size="6"
						tabindex="0"
						class="w-full h-available overflow-auto scroll-smooth"
						@focus="handleListFocus($event)"
					>
						<!--            <ScrollPanel ref="scrollContainer" -->
						<!--                         class="w-full h-available overflow-clip scroll-smooth" -->
						<!--                         :pt="{ -->
						<!--                            barY: { -->
						<!--                              tabindex: -1, -->
						<!--                            }, -->
						<!--                            contentContainer: { -->
						<!--                              tabindex: -1, -->
						<!--                            }, -->
						<!--                            content: { -->
						<!--                              tabindex: -1, -->
						<!--                            }, -->
						<!--                            root: { -->
						<!--                              tabindex: -1, -->
						<!--                            } -->
						<!--                         }" -->
						<!--                         :dt="{ -->
						<!--                            bar: { -->
						<!--                              background: 'transparent' -->
						<!--                            } -->
						<!--                        }" -->
						<!--            > -->
						<IonList mode="md" lines="none">
							<template v-for="(song, index) in data?.tracks" :key="song.id">
								<IonItem
									tabindex="-1"
									mode="md"
									class="group/track focus-within:bg-white/4 rounded-md overflow-clip"
								>
									<IonGrid>
										<IonRow
											:data-index="index"
											:data-id="song.id"
											tabindex="-1"
											class="items-center !rounded-md !overflow-clip"
										>
											<IonCol size="2" tabindex="-1">
												<button
													tabindex="0"
													:data-index="index"
													:data-id="song.id"
													class="focusable flex justify-center w-full aspect-video focus:outline outline-focus outline-2 outline-offset-2 mr-2 overflow-clip"
													@focus="handleListItemFocus($event)"
													@click="handleClick(song)"
												>
													<CoverImage
														:data="song"
														:alt="song.name"
														class="w-auto h-full aspect-square"
													/>
												</button>
											</IonCol>

											<IonCol size="8" tabindex="-1" class="my-auto mt-2">
												<IonLabel tabindex="-1">
													<div class="flex w-available overflow-clip items-end">
														<div
															class="flex items-center justify-center h-full aspect-square overflow-clip transition-width duration-200"
															:class="{
																'w-0': currentSong?.id !== song.id,
																'w-6 mr-1': currentSong?.id === song.id,
															}"
														>
															<EqSpinner :playing="isPlaying" />
														</div>
														<Marquee
															:playing="!!currentSong?.id"
															:text="song.name"
															class="!w-[calc(100%-30px)] text-auto-12 children:leading-none w-available overflow-clip"
														/>
													</div>

													<TrackLinks
														:id="song.id"
														:data="song.artist_track"
														type="artists"
														suffix="track"
														@keydown.up.prevent
														@keydown.down.prevent
														@keyup="handleUp($event)"
													/>
												</IonLabel>
											</IonCol>

											<IonCol
												size="2"
												tabindex="-1"
												class="opacity-0 group-focus-within/track:opacity-100 -ml-2"
											>
												<IonRow tabindex="-1" class="flex flex-nowrap">
													<MediaLikeButton :data="song" />
													<MusicButton
														label=""
														tabindex="0"
														:onclick="() => {}"
														class="!bg-transparent mr-2"
													>
														<OptimizedIcon
															icon="menuDotsHorizontal"
															class="text-white"
														/>
													</MusicButton>
												</IonRow>
											</IonCol>
										</IonRow>
									</IonGrid>
								</IonItem>
							</template>
						</IonList>
						<!--            </ScrollPanel> -->
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
	--color: rgb(var(--color-text));
}

ion-item::part(detail-icon) {
	color: white;
	opacity: 1;
	font-size: 20px;
}
</style>
