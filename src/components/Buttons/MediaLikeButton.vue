<script lang="ts" setup>
import {PropType, ref} from 'vue';

import {useQueryClient} from '@tanstack/vue-query';

import type {InfoResponse} from '@/types/api/base/info';
import type {PlaylistItem} from "@/types/musicPlayer";
import type {Collection, CollectionResponse} from "@/types/api/base/collection";
import type {ContinueWatching, HomeItem} from "@/types/api/base/home";
import type {LibraryResponse, StatusResponse} from '@/types/api/base/library';
import type {ArtistResponse} from '@/types/api/music/artist';


import serverClient from '@/lib/clients/serverClient';

import {DisplayList} from '@/types/api/music/musicPlayer';
import {queryKey} from "@/lib/routerHelper";
import MusicButton from "@/components/MusicPlayer/components/MusicButton.vue";
import MoooomIcon from "@/components/Images/icons/MoooomIcon.vue";


const props = defineProps({
  data: {
    type: Object as PropType<LibraryResponse | InfoResponse | HomeItem | ContinueWatching | Collection | PlaylistItem | DisplayList | CollectionResponse | ArtistResponse | undefined>,
    required: true,
  },
  color: {
    type: String,
    required: false,
    default: 'var(--color-green-500)',
  },
  className: {
    type: String,
    required: false,
  },
});

const query = useQueryClient();

const liked = ref(props.data?.favorite);

const handleLike = (e?: MouseEvent) => {
  e?.stopPropagation();
  serverClient()
      .post<StatusResponse<string>>(`${props.data?.link}/like`, {
        value: !liked.value,
      })
      .then(({data}) => {
        liked.value = data.args?.[0] == 'liked' || data.args?.[1] == 'liked';
        // showNotification({
        // 	title: translate(data.message, ...data.args ?? []),
        // 	type: data.status == 'ok'
        // 		? TYPE.SUCCESS
        // 		: TYPE.ERROR,
        // 	visibleOnly: true,
        // 	duration: 2000,
        // });

        query.invalidateQueries({
          queryKey: queryKey(),
        });
      });
};

</script>

<template>
  <MusicButton :onclick="handleLike" label="Favorite">
    <MoooomIcon icon="heart"
                :class="{
                  'heart': liked,
                  'opacity-0 ': !liked,
                  className,
                }"
                class="ease-in-out transition-all duration-150"
                :style="`
        --fill-color: rgb(var(--color-focus, var(--color-red-8)));
        color: rgb(var(--color-focus, var(--color-red-8)));
			`"/>
    <MoooomIcon icon="heart"
                class="absolute inset-2 transition-all duration-150"
                :class="{
      className
		}" v-if="!liked"/>
  </MusicButton>
</template>

<style scoped lang="scss">
.heart {
  font-size: 150px;
  color: #e00;
  animation: beat .25s infinite alternate;
  animation-iteration-count: 4;
  animation-fill-mode: forwards;
  transform-origin: center;
}

/* Heart beat animation */
@keyframes beat{
  from { transform: scale(1.4); }
  50% { transform: scale(1.2); }
  to { transform: scale(1); }
}
</style>