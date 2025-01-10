<script lang="ts" setup>
import {PropType} from 'vue';

import type {DisplayList} from '@/types/api/music/musicPlayer';

import audioPlayer from '@/store/audioPlayer';

import BigPlayButton from '@/components/Buttons/BigPlayButton.vue';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';
import MusicButton from '@/components/MusicPlayer/components/MusicButton.vue';
import MediaLikeButton from '@/components/Buttons/MediaLikeButton.vue';
import {isTrackRoute} from '@/store/routeState';

const props = defineProps({
    data: {
        type: Object as PropType<DisplayList | undefined> | undefined,
        required: false,
    },
    filter: {
        type: String as PropType<string>,
        required: true,
    },
});

defineEmits(['filter-change']);

const handleAdd = () => {
    audioPlayer.setQueue(props.data?.tracks ?? []);
};

</script>

<template>
    <div class="pointer-events-none absolute z-0 h-96 w-full bg-spotifyBottom bg-focus"></div>
    <div class="flex gap-4 items-center py-4 px-4 sm:px-8 w-full pl-2 pr-4 sm:pr-16 h-20 z-40"
         data-index="1">

        <BigPlayButton v-if="data?.tracks"
                       :data="data"
                       class="hidden sm:flex"/>

        <div
            class="relative hidden h-fit cursor-pointer items-center justify-center text-auto-12/11 focus-within:text-auto sm:flex mr-auto">
            <input id="search"
                   :value="filter"
                   class="bg-transparent border-auto-12/5 border-2 rounded-md focus-visible:!border-auto-12/9 focus-visible:text-current placeholder-current p-2"
                   placeholder="Filter…"
                   type="text"
                   v-on:input="$emit('filter-change', ($event.target as HTMLInputElement)?.value)"
                   name="search">

            <div class="absolute top-2 right-2 bottom-2 flex items-center justify-center">
                <MoooomIcon icon="searchMagnifyingGlass" class="!w-7"/>
            </div>

        </div>

        <MediaLikeButton
                         :data="data"
                         color="var(--color-focus)"
                         :type="'music/' + data?.type?.replace(/s$/u, '')"
                         class=" sm:ml-auto"
                         className="!w-8 !h-8"/>

      <MusicButton
          v-if="isTrackRoute"
          id="add"
          :onclick="handleAdd"
          class=" mr-8"
          label="add">
        <MoooomIcon icon="add" class="!w-7"/>
      </MusicButton>
<!--        <ListControlHeaderMoreMenuButton v-if="!isTrackRoute" :items="[]"/>-->
    </div>

    <div
        class="sm:hidden sticky left-full -mt-16 top-safe-offset-6 z-1199 flex justify-center items-center gap-2 mr-4 h-auto"
         style="box-shadow: 0 1px 2px 0 rgba(16,24,40,0.05);"
    >

        <BigPlayButton v-if="data?.tracks"
                       :data="data"
        />
    </div>
</template>
