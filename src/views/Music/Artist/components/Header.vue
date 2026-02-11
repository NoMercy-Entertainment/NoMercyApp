<script lang="ts" setup>
import type { PropType } from 'vue';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import type { ArtistResponse } from '@/types/api/music/artist';

import { calculateDuration } from '@/lib/dateTime';

import { currentServer } from '@/store/currentServer';
import audioPlayer, {
	currentMusicDeviceId,
	currentPlaylist,
	currentSong,
	isPlaying,
	setCurrentPlaylist,
} from '@/store/audioPlayer';
import { isSongRoute } from '@/store/routeState';

import BannerButton from '@/components/Buttons/BannerButton.vue';
import MediaLikeButton from '@/components/Buttons/MediaLikeButton.vue';
import { musicSocketConnection } from '@/store/musicSocket';
import ShareButton from '@/components/Buttons/ShareButton.vue';
import type { ShareOptions } from '@capacitor/share';
import { user } from '@/store/user';
import { deviceId } from '@/store/deviceInfo.ts';
import { pickPaletteColor, tooLight } from '@/lib/colorHelper.ts';
import { colorPalette } from '@/store/ui.ts';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';
import { stringFormat } from '@/lib/utils/string';
import { sortByType } from '@/lib/utils/array';
import { setSortOrder, sortOrder, sortType } from '@/store/ui';

const props = defineProps({
	data: {
		type: Object as PropType<ArtistResponse>,
		required: true,
	},
});

const route = useRoute();

const duration = ref<string | undefined>('');

onMounted(() => {
	duration.value = calculateDuration(props.data);
});

const backdrop = computed(() => {
	let image = props.data?.images
		?.toSorted((a, b) => b.voteCount - a.voteCount)
		?.find(image => image.type === 'banner');
	if (!image) {
		image = props.data?.images
			?.toSorted((a, b) => b.voteCount - a.voteCount)
			?.find(image => image.type === 'background');
	}
	if (!image)
		return;
	return `${currentServer.value?.serverBaseUrl}${image?.src}`;
});

const playlistName = computed(
	() => `/music/${props.data?.type?.replace(/s$/u, '')}/${props.data?.id}`,
);

function handleClick() {
	if (!props.data?.tracks)
		return;

	if (!user.value.features?.nomercyConnect) {
		if (currentPlaylist.value === playlistName.value) {
			audioPlayer.togglePlayback();
			return;
		}
		const sorted = sortByType(props.data.tracks, sortType.value, sortOrder.value, setSortOrder);
		audioPlayer.playTrack(sorted.at(0)!, sorted);
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

	const sorted = sortByType(props.data.tracks, sortType.value, sortOrder.value, setSortOrder);
	const trackId = sorted.some(t => t.id === currentSong.value?.id)
		? currentSong.value?.id
		: sorted.at(0)?.id;

	musicSocketConnection.value?.invoke(
		'StartPlaybackCommand',
		props.data.type.replace(/s$/u, ''),
		props.data.id,
		trackId,
	);
}

const shareData = computed<ShareOptions>(() => ({
	title: props.data?.name ?? '',
	url: `https://app.nomercy.tv${route.fullPath}`,
}));

const light = computed(() => tooLight(pickPaletteColor(colorPalette.value), 150));
</script>

<template>
	<div
		:class="{
			'h-[425px]': backdrop,
			'h-[200px]': !backdrop,
			'text-black/12': light,
			'text-white/12': !light,
		}"
		:style="
			backdrop
				? `background-image: url('${backdrop}')`
				: `background-image: linear-gradient(180deg, var(--color-theme-8) 0%, var(--color-theme-8) 100%)`
		"
		class="relative -mx-2 flex flex-shrink-0 flex-grow-0 items-end justify-between self-stretch overflow-hidden bg-cover bg-start bg-no-repeat object-cover p-9 w-available !h-[306px]"
	>
		<div
			class="pointer-events-none absolute inset-0 z-0 mt-auto h-4/5 bg-gradient-to-t from-black via-black/60"
		/>
		<div
			class="flex flex-shrink-0 flex-grow-0 items-end justify-start gap-4 w-[710px]"
		>
			<div
				class="relative flex flex-grow flex-col items-start justify-start gap-4"
			>
				<!--                <div class="flex h-full h-screen max-h-40 w-full max-w-md flex-grow" v-if="logo"> -->
				<!--                    <img -->
				<!--                        v-if="logo" -->
				<!--                        alt="logo" -->
				<!--                        :src="logo" -->
				<!--                        class="relative mr-4 h-auto w-auto justify-start self-start bg-contain bg-center bg-no-repeat px-4 py-4 -translate-x-[0%] -translate-y-[5%]" -->
				<!--                        type="logo"/> -->
				<!--                </div> -->
				<!--                <p v-else class="flex-shrink-0 flex-grow-0 self-stretch text-5xl font-bold w-[710px]"> -->
				<!--                    {{ data.name }} -->
				<!--                </p> -->
				<p
					class="flex-shrink-0 flex-grow-0 self-stretch text-5xl font-bold w-[710px]"
				>
					{{ data.name }}
				</p>
				<div
					class="relative flex flex-shrink-0 flex-grow-0 items-center justify-start gap-2.5"
				>
					<p
						v-if="data.playlists?.length"
						class="flex-shrink-0 flex-grow-0 text-sm"
					>
						<span>{{
							stringFormat(
								"Appears in {0} Playlists",
								data.playlists?.length ?? 0,
							)
						}}</span>
						<svg
							class="flex-shrink-0 flex-grow-0"
							fill="none"
							height="4"
							preserveAspectRatio="xMidYMid meet"
							viewBox="0 0 3 4"
							width="3"
							xmlns="http://www.w3.org/2000/svg"
						>
							<circle cx="1.5" cy="2" fill="#9BA1A6" r="1.5" />
						</svg>
					</p>
					<p class="flex-shrink-0 flex-grow-0 text-sm">
						{{ data.tracks?.length }}
						{{ data.tracks?.length === 1 ? $t("song") : $t("songs") }}
					</p>
					<svg
						class="flex-shrink-0 flex-grow-0"
						fill="none"
						height="4"
						preserveAspectRatio="xMidYMid meet"
						viewBox="0 0 3 4"
						width="3"
						xmlns="http://www.w3.org/2000/svg"
					>
						<circle cx="1.5" cy="2" fill="#9BA1A6" r="1.5" />
					</svg>
					<p class="flex-shrink-0 flex-grow-0 text-sm">
						{{ duration }}
					</p>
				</div>
			</div>
		</div>
		<div
			class="flex flex-shrink-0 flex-grow-0 items-center justify-start gap-2"
		>
			<BannerButton
				:onclick="handleClick"
				:title="isPlaying && currentPlaylist === playlistName ? $t('Pause') : $t('Play')"
			>
				<MoooomIcon
					v-if="isPlaying && currentPlaylist === playlistName"
					class-name="relative h-6 w-6"
					icon="pause"
				/>
				<MoooomIcon
					v-else
					class-name="relative h-6 w-6"
					icon="play"
				/>
			</BannerButton>
			<!--			<BannerButton title=""> -->
			<!--				<MoooomIcon icon="shuffle" className="relative h-6 w-6"/> -->
			<!--			</BannerButton> -->
			<ShareButton :share-data="shareData" class="!p-1" />
			<MediaLikeButton
				v-if="data && !isSongRoute"
				:data="data"
				class-name="h-5 w-5"
				color="var(--color-theme-8)"
			/>
			<!--			<BannerButton title=""> -->
			<!--				<MoooomIcon icon="addCircle" className="relative h-5 w-5"/> -->
			<!--			</BannerButton> -->
			<!--			<BannerButton title=""> -->
			<!--				<MoooomIcon icon="download" className="relative h-5 w-5"/> -->
			<!--			</BannerButton> -->
			<!--			<BannerButton title=""> -->
			<!--				<MoooomIcon icon="shareSquare" className="relative h-5 w-5"/> -->
			<!--			</BannerButton> -->
			<!--			<BannerButton title=""> -->
			<!--				<MoooomIcon icon="currentPlaylist" className="relative h-5 w-5"/> -->
			<!--			</BannerButton> -->
			<!--			<BannerButton title=""> -->
			<!--				<MoooomIcon icon="searchMagnifyingGlass" className="relative h-5 w-5"/> -->
			<!--			</BannerButton> -->
			<BannerButton :title="$t('More')">
				<MoooomIcon
					class-name="relative h-5 w-5"
					icon="menuDotsHorizontal"
				/>
			</BannerButton>
		</div>
	</div>
</template>
