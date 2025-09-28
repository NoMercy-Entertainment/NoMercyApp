<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import { IonContent, IonPage } from '@ionic/vue';

import type { BluRayPlaylist, DriveState, Episode, RipperResponse } from '@/types/api/dashboard/ripper';

import { pad } from '@/lib/stringArray';
import { discContents, discs, ripperPlaylist, ripperPlaylistLoading } from '@/store/ripper';
import serverClient from '@/lib/clients/serverClient';
import serverBaseClient from '@/lib/clients/serverBaseClient';

import DashboardLayout from '@/Layout/Desktop/DashboardLayout.vue';
import ScrollContainer from '@/Layout/Desktop/components/ScrollContainer.vue';
import RipperPlayer from '@/views/Dashboard/Content/Ripper/components/RipperPlayer.vue';
import Button from '@/components/Button.vue';
import { ripperSocketIsConnected } from '@/lib/clients/ripperSocket';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';

const form = ref<HTMLFormElement>();
const locked = ref(true);

const episodes = ref<RipperResponse['data']['Episodes']>([]);

function submit(e: Event) {
	e.preventDefault();

	if (!e.currentTarget)
		return;

	const data = new FormData(e.currentTarget as HTMLFormElement);
	const json = Array.from(data).reduce(
		(obj, [k, v]) => ({ ...obj, [k]: v }),
		{},
	);
	console.log(json);

	return;
	serverClient()
		.post(`/dashboard/optical/${discContents.value?.path}/process`, {
			playlists: discContents.value?.metadata.bluRay_playlists,
		})
		.then(() => {
			console.log('Rip:', discContents.value?.path);
		})
		.catch((error) => {
			console.error('Rip:', error);
		});
}

function handleSelect(playlist: BluRayPlaylist) {
	if (!discContents.value)
		return;

	if (
		playlist.video_tracks.some(p => p.checked)
		|| playlist.audio_tracks.some(p => p.checked)
		|| playlist.subtitle_tracks.some(p => p.checked)
	) {
		playlist.video_tracks.forEach(p => (p.checked = false));
		playlist.audio_tracks.forEach(p => (p.checked = false));
		playlist.subtitle_tracks.forEach(p => (p.checked = false));
	}
	else {
		playlist.video_tracks.forEach(p => (p.checked = true));
		playlist.audio_tracks.forEach(p => (p.checked = true));
		playlist.subtitle_tracks.forEach(p => (p.checked = true));
	}

	const playlists = [
		...(discContents.value.metadata.bluRay_playlists?.filter(
			p =>
				p.playlist_id !== playlist.playlist_id && p.video_tracks.length === 1,
		) ?? []),
		playlist,
		...(discContents.value.metadata.bluRay_playlists?.filter(
			p =>
				p.playlist_id !== playlist.playlist_id && p.video_tracks.length !== 1,
		) ?? []),
	].toSorted((a, b) => a.index - b.index);

	discContents.value = {
		...discContents.value,
		metadata: {
			...discContents.value.metadata,
			bluRay_playlists: playlists,
		},
	};

	const index = Array.from(
		discContents.value.metadata.bluRay_playlists,
	).findIndex(p => p.playlist_id === playlist.playlist_id);

	if (index === 0) {
		propagateSettings(playlist);
	}
}

function propagateSettings(playlist: BluRayPlaylist) {
	if (!discContents.value)
		return;

	const newContents = discContents.value.metadata.bluRay_playlists
		.filter(
			p =>
				p.playlist_id !== playlist.playlist_id && p.video_tracks.length === 1,
		)
		.map((p) => {
			if (p.playlist_id !== playlist.playlist_id) {
				p.video_tracks = playlist.video_tracks.map(v => ({ ...v }));
				p.audio_tracks = playlist.audio_tracks.map(a => ({ ...a }));
				p.subtitle_tracks = playlist.subtitle_tracks.map(s => ({ ...s }));
			}

			return p;
		});

	const playlists = [
		...(newContents?.filter(p => p.video_tracks.length === 1) ?? []),
		playlist,
		...(discContents.value.metadata.bluRay_playlists?.filter(
			p =>
				p.playlist_id !== playlist.playlist_id && p.video_tracks.length !== 1,
		) ?? []),
	].toSorted((a, b) => a.index - b.index);

	discContents.value = {
		...discContents.value,
		metadata: {
			...discContents.value.metadata,
			bluRay_playlists: playlists,
		},
	};
}

const playButtonLocked = ref(false);

function handlePlay(playlist: BluRayPlaylist) {
	const url = `/dashboard/optical/${discContents.value?.path}/play/${playlist.playlist_id}`;
	const playlistUrl = `/transcode/ripper/master.m3u8`;

	ripperPlaylist.value = undefined;
	ripperPlaylistLoading.value = true;
	playButtonLocked.value = true;

	serverClient()
		.post(url)
		.then(() => {
			serverBaseClient()
				.get(playlistUrl)
				.then(() => {
					playButtonLocked.value = false;
					ripperPlaylist.value = playlist;
					ripperPlaylistLoading.value = false;
				})
				.catch((error) => {
					playButtonLocked.value = false;
					console.error('Play:', error);
				});
		})
		.catch((error) => {
			playButtonLocked.value = false;
			console.error('Play:', error);
		});
}

function handleStop() {
	const url = `/dashboard/optical/${discContents.value?.path}/stop`;

	ripperPlaylist.value = null;
	ripperPlaylistLoading.value = false;

	serverClient()
		.post(url)
		.catch((error) => {
			console.error('Stop:', error);
		});
}

function handleOpen(path: string) {
	const url = `/dashboard/optical/${path.replace(/\/+$/u, '')}/open`;

	serverClient()
		.post(url)
		.catch((error) => {
			console.error('Open:', error);
		});
}

function handleClose(path: string) {
	const url = `/dashboard/optical/${path.replace(/\/+$/u, '')}/close`;

	serverClient()
		.post(url)
		.catch((error) => {
			console.error('Close:', error);
		});
}

function handleChecked(playlist: BluRayPlaylist) {
	if (!discContents.value)
		return;

	const index = Array.from(
		discContents.value.metadata.bluRay_playlists,
	).findIndex(p => p.playlist_id === playlist.playlist_id);

	if (index === 0) {
		propagateSettings(playlist);
	}
}

onMounted(() => {
	ripperPlaylistLoading.value = false;
	ripperPlaylist.value = null;
	playButtonLocked.value = false;
});

watch(ripperSocketIsConnected, async (value) => {
	if (value) {
		ripperPlaylistLoading.value = false;
		playButtonLocked.value = false;
	}
	else {
		discContents.value = undefined;
	}
});

watch(discContents, async (value) => {
	console.log('Disc Contents:', value);
});
</script>

<template>
	<IonPage>
		<IonContent :fullscreen="true">
			<DashboardLayout :grid-style="4" title="Ripper">
				<template #cta>
					<Select
						v-model="discContents"
						:option-label="(episode: DriveState) => `${episode.path}: ${episode.label}`"
						:options="discs"
						class="w-available min-w-96 mx-4"
						size="small"
						variant="filled"
					/>

					<template v-for="(disc, discIndex) in discs" :key="discIndex">
						<Button
							v-if="disc.open"
							id="open"
							color="theme"
							type="submit"
							variant="contained"
							@click="handleClose(disc.path)"
						>
							{{ $t("Close") }} {{ disc.path }}
						</Button>
						<Button
							v-else
							id="close"
							color="theme"
							type="submit"
							variant="contained"
							@click="handleOpen(disc.path)"
						>
							{{ $t("Eject") }} {{ disc.path }}
						</Button>
					</template>
				</template>

				<div
					v-if="discContents"
					class="flex justify-between w-inherit h-full overflow-clip gap-4"
				>
					<div class="flex flex-col w-3/5 max-w-3xl h-full overflow-clip">
						<form
							v-if="discContents"
							ref="form"
							class="flex flex-col h-inherit w-full overflow-clip relative"
							@submit="submit"
						>
							<div class="mb-6 flex w-full">
								<h1 class="text-lg font-bold">
									{{ discContents.label }}
								</h1>
								<Button
									id="rescan"
									class="ml-auto rounded-md px-1.5 text-sm"
									color="theme"
									type="submit"
									variant="contained"
								>
									{{ $t("Rip") }}
								</Button>
							</div>

							<div
								class="flex flex-col w-inherit flex-1 h-px overflow-clip relative"
							>
								<ScrollContainer :static="false" auto-hide>
									<div class="flex flex-col w-available h-auto pr-6">
										<template
											v-for="(playlist, playlistIndex) in discContents.metadata
												.bluRay_playlists"
											:key="playlistIndex"
										>
											<div
												:class="{
													'bg-surface-6 dark:bg-surface-5':
														playlistIndex > 0,
													'bg-gradient-to-t from-focus/50': playlistIndex === 0,
												}"
												class="mb-8 first:mb-0 last:mb-0 to-slate-6 dark:to-slate-5 w-full-h-full rounded-xl p-0.5 overflow-clip z-10"
												style="
                          --tw-gradient-from: hsl(
                              from rgb(var(--color-theme-8, var(--color-theme-9)))
                                h s calc(l / 2)
                            )
                            var(--tw-gradient-from-position);
                        "
											>
												<div
													class="rounded-[10px] w-full bg-surface-4 dark:bg-surface-10"
												>
													<div
														class="mb-1 w-full flex items-center overflow-clip p-4"
													>
														<h2 class="font-semibold whitespace-nowrap">
															{{ $t("Playlist") }}: {{ playlist.playlist_id }}
														</h2>
														<Select
															:id="`playlists[${playlist.playlist_id}].metaTracks[0]`"
															v-model="episodes[playlistIndex]"
															:name="`playlists[${playlist.playlist_id}].metaTracks[0]`"
															:option-label="(episode: Episode) =>
																`${discContents?.metadata.data.TvShow.name} S${pad(episode.season_number)}E${pad(episode.episode_number)} - ${episode.name}`"
															:options="discContents.metadata.data.Episodes"
															class="w-px flex-1 mx-4"
															size="small"
															variant="filled"
														/>
														<Button
															v-if="
																ripperPlaylist
																	&& ripperPlaylist?.playlist_id
																		== playlist.playlist_id
															"
															id="kill"
															:disabled="playButtonLocked"
															color="theme"
															start-icon="stop"
															type="button"
															variant="contained"
															@click="handleStop"
														>
															{{ $t("Playing") }}
														</Button>
														<Button
															v-else
															id="play"
															:disabled="playButtonLocked"
															color="theme"
															start-icon="play"
															type="button"
															variant="contained"
															@click="handlePlay(playlist)"
														>
															{{ $t("Play") }}
														</Button>
													</div>

													<div class="flex gap-2 w-full p-4 pt-0">
														<div class="flex flex-col gap-2 w-full">
															<div class="">
																<Button
																	id="rescan"
																	class="rounded-md px-1.5 text-sm"
																	color="theme"
																	type="button"
																	variant="contained"
																	@click="handleSelect(playlist)"
																>
																	{{
																		$t(
																			playlist.video_tracks?.some(
																				(p) => p.checked,
																			)
																				|| playlist.audio_tracks?.some(
																					(p) => p.checked,
																				)
																				|| playlist.subtitle_tracks?.some(
																					(p) => p.checked,
																				)
																				? "Deselect all"
																				: "Select all",
																		)
																	}}
																</Button>
															</div>
															<div class="">
																<h3 class="font-semibold text-md mt-2 mb-1">
																	<span>{{ $t("Video Tracks") }}:</span>
																</h3>
																<ul class="flex flex-col gap-1">
																	<li
																		v-for="(
																			video, videoIndex
																		) in playlist.video_tracks ?? []"
																		:key="videoIndex"
																		class="text-2xs flex items-center"
																	>
																		<Checkbox
																			:id="`playlists[${playlist.playlist_id}].video_tracks[${videoIndex}]`"
																			v-model="video.checked"
																			:input-id="`playlists[${playlist.playlist_id}].video_tracks[${videoIndex}]`"
																			:name="`playlists[${playlist.playlist_id}].video_tracks[${videoIndex}]`"
																			binary
																			class="mr-2 accent-focus size-4"
																			size="small"
																			@update:model-value="
																				() => handleChecked(playlist)
																			"
																		/>
																		<label
																			:for="`playlists[${playlist.playlist_id}].video_tracks[${videoIndex}]`"
																		>
																			{{ video.format }} - {{ video.width }}x{{
																				video.height
																			}}
																			- {{ video.display_aspect_ratio }} -
																			{{ video.frame_rate }} FPS
																		</label>
																	</li>
																</ul>
															</div>
															<div class="">
																<h3 class="font-semibold text-md mt-2 mb-1">
																	<span>{{ $t("Audio Tracks") }}:</span>
																</h3>
																<ul class="flex flex-col gap-1">
																	<li
																		v-for="(
																			audio, audioIndex
																		) in playlist.audio_tracks ?? []"
																		:key="audioIndex"
																		class="text-2xs flex items-center"
																	>
																		<Checkbox
																			:id="`playlists[${playlist.playlist_id}].audio_tracks[${audioIndex}]`"
																			v-model="audio.checked"
																			:input-id="`playlists[${playlist.playlist_id}].audio_tracks[${audioIndex}]`"
																			:name="`playlists[${playlist.playlist_id}].audio_tracks[${audioIndex}]`"
																			binary
																			class="mr-2 accent-focus size-4"
																			size="small"
																			@update:model-value="
																				() => handleChecked(playlist)
																			"
																		/>
																		<label
																			:for="`playlists[${playlist.playlist_id}].audio_tracks[${audioIndex}]`"
																		>
																			{{ audio.format }} -
																			{{ audio.language }} -
																			{{
																				audio.channels
																					? audio.channels
																					: "Unknown"
																			}}
																			Channels
																		</label>
																	</li>
																</ul>
															</div>
															<div class="">
																<h3 class="font-semibold text-md mt-2 mb-1">
																	<span>{{ $t("Subtitle Tracks") }}:</span>
																</h3>
																<ul class="flex flex-col gap-1">
																	<li
																		v-for="(
																			subtitle, subtitleIndex
																		) in playlist.subtitle_tracks ?? []"
																		:key="subtitleIndex"
																		class="text-2xs flex items-center"
																	>
																		<Checkbox
																			:id="`playlists[${playlist.playlist_id}].subtitle_tracks[${subtitleIndex}]`"
																			v-model="subtitle.checked"
																			:input-id="`playlists[${playlist.playlist_id}].subtitle_tracks[${subtitleIndex}]`"
																			:name="`playlists[${playlist.playlist_id}].subtitle_tracks[${subtitleIndex}]`"
																			binary
																			class="mr-2 accent-focus size-4"
																			size="small"
																			@update:model-value="
																				() => handleChecked(playlist)
																			"
																		/>
																		<label
																			:for="`playlists[${playlist.playlist_id}].subtitle_tracks[${subtitleIndex}]`"
																		>
																			{{ subtitle.format }} -
																			{{ subtitle.language }}
																		</label>
																	</li>
																</ul>
															</div>
														</div>
														<div class="flex flex-col gap-2 w-full mt-10">
															<div class="">
																<h3 class="font-semibold text-md mt-2 mb-1">
																	<span>{{ $t("Info") }}:</span>
																</h3>
																<div class="flex flex-col gap-1">
																	<h3 class="mb text-2xs">
																		{{ $t("Duration") }}:
																		{{ playlist.duration }}
																	</h3>
																</div>
															</div>
															<div class="">
																<h3 class="font-semibold text-md mt-2 mb-1">
																	<span>{{ $t("Chapters") }}:</span>
																</h3>
																<ul class="flex flex-col gap-1">
																	<li
																		v-for="(
																			chapter, chapterIndex
																		) in playlist.chapters"
																		:key="chapterIndex"
																		class="text-2xs"
																	>
																		{{ chapter.title }} ({{
																			chapter.timestamp
																		}})
																	</li>
																</ul>
															</div>
														</div>
													</div>
												</div>
											</div>
											<div
												:class="{
													hidden: playlistIndex > 0,
													flex: playlistIndex === 0,
												}"
												class="flex flex-nowrap mb-8 items-center w-available relative gap-1 px-4 pt-5 pb-1 rounded-b-xl -mt-4 z-0"
												style="
                          background-color: hsl(
                            from rgb(var(--color-theme-8, var(--color-theme-9))) h
                              s calc(l / 2)
                          );
                        "
											>
												<MoooomIcon
													class-name="w-6 h-6 text-gray-200 dark:text-gray-300 fill-focus"
													icon="infoCircle"
												/>

												<p
													class="flex-grow-0 flex-shrink-0 text-2xs font-medium text-left text-[#eeecec]"
												>
													{{
														$t(
															"These settings will propagate to the rest of the items below",
														)
													}}
												</p>
											</div>
										</template>
									</div>
								</ScrollContainer>
							</div>
						</form>

						<div v-else class="h-available w-full overflow-auto">
							<div class="flex items-center justify-center h-full">
								<svg
									aria-hidden="true"
									class="inline w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-focus"
									fill="none"
									viewBox="0 0 100 101"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
										fill="currentColor"
									/>
									<path
										d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
										fill="currentFill"
									/>
								</svg>
							</div>
						</div>
					</div>

					<div class="flex flex-col w-px flex-1 items-center justify-center">
						<div class="relative aspect-video w-full h-auto">
							<RipperPlayer />
						</div>
					</div>
				</div>
			</DashboardLayout>
		</IonContent>
	</IonPage>
</template>
