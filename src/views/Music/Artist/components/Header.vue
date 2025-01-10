<script setup lang="ts">
import {computed, onMounted, onUnmounted, PropType, ref} from "vue";
import {useRoute} from 'vue-router';

import type {ArtistResponse} from "@/types/api/music/artist";

import {calculateDuration} from "@/lib/dateTime";
import {stringFormat} from "@/lib/stringArray";
import {setColorPalette} from '@/store/ui';

import {currentServer} from '@/store/currentServer';
import {audioPlayer, currentPlaylist, currentSong, isPlaying, setCurrentPlaylist} from '@/store/audioPlayer';
import {isSongRoute} from '@/store/routeState';

import MoooomIcon from "@/components/Images/icons/MoooomIcon.vue";
import BannerButton from "@/components/Buttons/BannerButton.vue";
import MediaLikeButton from '@/components/Buttons/MediaLikeButton.vue';

const route = useRoute();

const props = defineProps({
	data: {
		type: Object as PropType<ArtistResponse>,
		required: true,
	}
});

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
  if (!image) return;
	return currentServer.value?.serverBaseUrl + '' + image?.src;
});

// const logo = computed(() => {
//     const image = props.data?.images?.find(image => image.type === 'hdLogo');
//     if (!image) return;
//     return serverLocation.value?.serverBaseUrl + '' + image?.src;
// });

const isCurrentPlaylist = computed(() => {
	return currentPlaylist.value === route.fullPath;
});

const setCurrentList = () => {
	setCurrentPlaylist(route.fullPath);
};

const handlePlay = () => {

	if (props.data?.tracks?.[0]) {
		if (isCurrentPlaylist.value) {
			if (isPlaying.value) {
				audioPlayer.pause();
			} else {
				audioPlayer.play();
			}
		} else {
			audioPlayer.setQueue([]);
			audioPlayer.setBackLog([]);

			const song = props.data.tracks.find(track => track.id == currentSong.value?.id);

			if (currentSong.value?.id && song) {
				audioPlayer.playTrack(song, props.data?.tracks ?? []);
			} else {
				audioPlayer.playTrack(props.data?.tracks?.[0], props.data?.tracks ?? []);
			}

			setCurrentList();
		}
	}
};


</script>

<template>

	<div
		class="relative -mx-2 flex flex-shrink-0 flex-grow-0 items-end justify-between self-stretch overflow-hidden bg-cover bg-start bg-no-repeat object-cover p-9 w-available !h-[306px]"
		:class="backdrop ? 'h-[425px]' : 'h-[200px]'"
		:style="backdrop
            ? `background-image: url('${backdrop}')`
            : `background-image: linear-gradient(180deg, rgb(var(--color-focus)) 0%, rgb(var(--color-focus)) 100%)`
        "
	>
		<div
			class="pointer-events-none absolute inset-0 z-0 mt-auto h-4/5 bg-gradient-to-t from-black via-black/60"></div>
		<div class="flex flex-shrink-0 flex-grow-0 items-end justify-start gap-4 w-[710px]">
			<div class="relative flex flex-grow flex-col items-start justify-start gap-4">
				<!--                <div class="flex h-full h-screen max-h-40 w-full max-w-md flex-grow" v-if="logo">-->
				<!--                    <img-->
				<!--                        v-if="logo"-->
				<!--                        alt="logo"-->
				<!--                        :src="logo"-->
				<!--                        class="relative mr-4 h-auto w-auto justify-start self-start bg-contain bg-center bg-no-repeat px-4 py-4 -translate-x-[0%] -translate-y-[5%]"-->
				<!--                        type="logo"/>-->
				<!--                </div>-->
				<!--                <p v-else class="flex-shrink-0 flex-grow-0 self-stretch text-5xl font-bold w-[710px]">-->
				<!--                    {{ data.name }}-->
				<!--                </p>-->
				<p class="flex-shrink-0 flex-grow-0 self-stretch text-5xl font-bold text-white w-[710px]">
					{{ data.name }}
				</p>
				<div class="relative flex flex-shrink-0 flex-grow-0 items-center justify-start gap-2.5">
					<p class="flex-shrink-0 flex-grow-0 text-sm text-white" v-if="data.playlists?.length">
						<span>{{ stringFormat('Appears in {0} Playlists', data.playlists?.length ?? 0) }}</span>
            <svg
                width="3"
                height="4"
                viewBox="0 0 3 4"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                class="flex-shrink-0 flex-grow-0"
                preserveAspectRatio="xMidYMid meet"
            >
              <circle cx="1.5" cy="2" r="1.5" fill="#9BA1A6"></circle>
            </svg>
					</p>
					<p class="flex-shrink-0 flex-grow-0 text-sm text-white">
						{{ data.tracks?.length }}
						{{ data.tracks?.length == 1 ? $t('song') : $t('songs') }}
					</p>
					<svg
						width="3"
						height="4"
						viewBox="0 0 3 4"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						class="flex-shrink-0 flex-grow-0"
						preserveAspectRatio="xMidYMid meet"
					>
						<circle cx="1.5" cy="2" r="1.5" fill="#9BA1A6"></circle>
					</svg>
					<p class="flex-shrink-0 flex-grow-0 text-sm text-white">
						{{ duration }}
					</p>
				</div>
			</div>
		</div>
		<div class="flex flex-shrink-0 flex-grow-0 items-center justify-start gap-2">
			<BannerButton title="" :onclick="handlePlay">
				<MoooomIcon v-if="isPlaying" icon="pause" className="relative h-5 w-5 text-white"/>
				<MoooomIcon v-else icon="play" className="relative h-5 w-5 text-white"/>
			</BannerButton>
<!--			<BannerButton title="">-->
<!--				<MoooomIcon icon="shuffle" className="relative h-5 w-5 text-white"/>-->
<!--			</BannerButton>-->
      <MediaLikeButton v-if="data && !isSongRoute"
                       :data="data"
                       color="var(--color-focus)"
                       :type="'music/' + data.type?.replace(/s$/, '')"
                       className="h-5 w-5"/>
<!--			<BannerButton title="">-->
<!--				<MoooomIcon icon="addCircle" className="relative h-5 w-5 text-white"/>-->
<!--			</BannerButton>-->
<!--			<BannerButton title="">-->
<!--				<MoooomIcon icon="download" className="relative h-5 w-5 text-white"/>-->
<!--			</BannerButton>-->
<!--			<BannerButton title="">-->
<!--				<MoooomIcon icon="shareSquare" className="relative h-5 w-5 text-white"/>-->
<!--			</BannerButton>-->
<!--			<BannerButton title="">-->
<!--				<MoooomIcon icon="currentPlaylist" className="relative h-5 w-5 text-white"/>-->
<!--			</BannerButton>-->
<!--			<BannerButton title="">-->
<!--				<MoooomIcon icon="searchMagnifyingGlass" className="relative h-5 w-5 text-white"/>-->
<!--			</BannerButton>-->
			<BannerButton title="">
				<MoooomIcon icon="menuDotsHorizontal" className="relative h-5 w-5 text-white"/>
			</BannerButton>
		</div>
	</div>
</template>
