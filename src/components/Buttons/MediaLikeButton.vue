<script lang="ts" setup>
import {PropType, ref, watch} from 'vue';

import type {InfoResponse} from '@/types/api/base/info';
import type {PlaylistItem} from "@/types/musicPlayer";
import type {Collection, CollectionResponse} from "@/types/api/base/collection";
import type {ContinueWatching, HomeItem} from "@/types/api/base/home";
import type {LibraryResponse, StatusResponse} from '@/types/api/base/library';
import type {ArtistResponse} from '@/types/api/music/artist';
import {DisplayList} from '@/types/api/music/musicPlayer';

import serverClient from '@/lib/clients/serverClient';

import MusicButton from "@/components/MusicPlayer/components/MusicButton.vue";
import OptimizedIcon from "@/components/OptimizedIcon.vue";


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

watch(props, (prop) => {
  liked.value = prop.data?.favorite;
});

const liked = ref(props.data?.favorite);

const handleLike = (e?: MouseEvent) => {
  e?.stopPropagation();
  serverClient()
      .post<StatusResponse<string>>(`${props.data?.link}/like`, {
        value: !liked.value,
      })
      .then(({data}) => {
        liked.value = data.args?.[0] == 'liked' || data.args?.[1] == 'liked';
      });
};

</script>

<template>
  <MusicButton :onclick="handleLike" label="Favorite">
    <OptimizedIcon icon="heart"
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
    <OptimizedIcon icon="heart"
                class="absolute inset-2 transition-all duration-150"
                :class="{className}"
                v-if="!liked"/>
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