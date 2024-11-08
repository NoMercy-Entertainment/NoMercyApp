<script setup lang="ts">

import {SizeState} from '@/types/musicPlayer';

import {currentSong, musicSize, setMusicSize} from '@/store/audioPlayer';

import TrackLinks from '@/components/MusicPlayer/components/TrackLinks.vue';
import MediaLikeButton from '@/components/Buttons/MediaLikeButton.vue';

const togglePlayerSize = () => {
	if (musicSize.value === SizeState.compact) {
		setMusicSize(SizeState.full);
	} else {
		setMusicSize(SizeState.compact);
	}
};

</script>

<template>
    <div class="flex w-full flex-col justify-end gap-8" v-if="currentSong">
        <div class="my-1 flex w-full items-center">
            <div class="z-10 flex w-full flex-col gap-2 overflow-clip">
                <h6 class="w-full overflow-clip text-xl font-semibold line-clamp-1">
                    <span class="overflow-hidden leading-none w-inherit line-clamp-1">
                        {{ currentSong?.name }}
                    </span>
                </h6>
                <div
                    v-if="currentSong"
                     :data-size="musicSize"
                     class="mb-1 inline-flex w-fit gap-1 overflow-hidden whitespace-nowrap text-xs line-clamp-1 hover:animate-pause">
                    <TrackLinks v-if="currentSong"
                                :id="currentSong.id"
                                :data="currentSong.artist_track"
                                :onclick="togglePlayerSize"
                                type="artists" />
                </div>
            </div>

            <MediaLikeButton :key="currentSong?.id"
                             :data="currentSong"
                             type="music/tracks"
                             color="var(--color-focus)"
                             class="flex"
                             data-target="favorite" />
        </div>
    </div>
</template>
