<script lang="ts" setup>
import {PropType} from 'vue';
import i18next from 'i18next';

import type {Song} from '@/types/api/music/musicPlayer';
import {audioPlayer, currentSong, isPlaying, musicSize, setCurrentPlaylist} from '@/store/audioPlayer';
import {useRoute} from 'vue-router';

import EqSpinner from '@/components/Images/EqSpinner.vue';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';
import CoverImage from '@/components/MusicPlayer/components/CoverImage.vue';
import TrackLinks from '@/views/Music/List/components/TrackLinks.vue';
import MediaLikeButton from '@/components/Buttons/MediaLikeButton.vue';
import DropdownMenu from '@/Layout/Desktop/components/Menus/DropdownMenu.vue';
import BannerButton from '@/components/Buttons/BannerButton.vue';
import {isAlbumRoute, isArtistRoute} from '@/store/routeState';

const props = defineProps({
  data: {
    type: Object as PropType<Song>,
    required: true,
  },
  index: {
    type: Number as PropType<number>,
    required: true,
  },
  displayList: {
    type: Array as PropType<Song[] | undefined>,
    required: true,
  },
});

const router = useRoute();

const setCurrentList = () => {
  setCurrentPlaylist(router.fullPath);
};

const handleClick = () => {
  if (!currentSong.value) {
    setCurrentList();
  }

  audioPlayer.value?.playTrack(props.data, props.displayList);
};

const handleKeyup = (e: KeyboardEvent) => {
  e.preventDefault();
  e.stopPropagation();

  const currentTarget = e.target as HTMLElement;
  const target = (document.activeElement as HTMLElement).closest('button')!;
  const links = Array.from(target.querySelectorAll('a'));
  const index = links.findIndex(link => link == currentTarget);


  if (e.key == 'ArrowUp') {
    const el = (target.previousElementSibling as HTMLElement);
    if (el && el.nodeName == 'A') {
      el.focus();
    } else if ((e.currentTarget as HTMLElement).nodeName == 'BUTTON') {
      const el = ((e.currentTarget as HTMLElement)
          .previousElementSibling as HTMLElement)
          ?.querySelector<HTMLButtonElement>(`[data-target="${currentTarget?.dataset?.target}"]`);
      if (el) {
        el?.focus();
      } else {
        ((e.currentTarget as HTMLElement)
            .previousElementSibling as HTMLElement)?.focus();
      }
    } else {
      const el = ((currentTarget.closest('button') as HTMLElement)
          .previousElementSibling as HTMLElement)
          ?.querySelector<HTMLButtonElement>(`[data-target="${currentTarget?.dataset?.target}"]`);
      if (el) {
        el?.focus();
      } else {
        document.querySelector<HTMLButtonElement>('#sortIndex')?.focus();
      }
    }
  } else if (e.key == 'ArrowDown') {
    const el = (target.nextElementSibling as HTMLElement);
    if (el && el.nodeName == 'A') {
      el.focus();
    } else if ((e.currentTarget as HTMLElement).nodeName == 'BUTTON') {
      const el = ((e.currentTarget as HTMLElement)
          .nextElementSibling as HTMLElement)
          ?.querySelector<HTMLButtonElement>(`[data-target="${currentTarget?.dataset?.target}"]`);
      if (el) {
        el?.focus();
      } else {
        ((e.currentTarget as HTMLElement)
            .nextElementSibling as HTMLElement)?.focus();
      }
    } else {
      const el = ((currentTarget.closest('button') as HTMLElement)
          .nextElementSibling as HTMLElement)
          ?.querySelector<HTMLButtonElement>(`[data-target="${currentTarget?.dataset?.target}"]`);
      el?.focus();
    }
  } else if (e.key == 'ArrowLeft') {
    if (links.length == 0) {
      const els = [
        ...Array.from(((currentTarget.parentElement as HTMLElement).parentElement as HTMLElement)
            ?.querySelectorAll('a')),
      ];

      els.at(-1)?.focus();
    } else if (index == -1) {
      // TODO: go to sidebar
    }
    if (index == 0) {
      target.closest('button')?.focus();
    } else {
      links[index - 1]?.focus();
    }
  } else if (e.key == 'ArrowRight') {
    if (index == -1) {
      target.querySelector('a')?.focus();
    }
    if (index == links.length - 1) {
      target.querySelector<HTMLButtonElement>('[aria-label="Favorite"]')?.focus();
    } else {
      links[index + 1]?.focus();
    }
  }
};

// onMounted(() => {
// 	// console.log(`[data-track-id="${props.data?.id}"]`);
// 	if (props.index == 0) {
// 		document.querySelector<HTMLButtonElement>(`[data-track-id="${props.data?.id}"]`)?.focus();
// 	}
// });

</script>

<template>
  <button
      :data-track-id="data?.id"
      :onclick="handleClick"
      class="grid justify-start items-center self-stretch  text-auto-12 pr-3 sm:px-3 rounded-lg hover:bg-[#e2f0fd]/20 group/track text-sm font-medium py-2 z-10"
      :class="{
          'album-grid': isAlbumRoute,
          'artist-grid': !isAlbumRoute
        }"
      data-target="track"
      tabindex="0"
  >

    <span class="flex justify-center text-center">
        <span v-if="currentSong?.id != data.id"
              class="group-focus-visible/track:sm:hidden group-hover/track:sm:hidden">
            {{ index + 1 }}
        </span>
        <EqSpinner v-if="currentSong?.id == data.id"
                   color="rgb(var(--color-focus))"
                   :playing="isPlaying"
                   class="hidden group-focus-visible/track:sm:!hidden group-hover/track:sm:!hidden"/>

        <MoooomIcon icon="pause" v-if="currentSong?.id == data.id && isPlaying"
                    class="hidden h-6 w-6 group-focus-visible/track:sm:block group-hover/track:sm:block"/>
        <MoooomIcon icon="play" v-else
                    class="hidden h-6 w-6 group-focus-visible/track:sm:block group-hover/track:sm:block"></MoooomIcon>

    </span>

    <span class="flex h-12 items-center gap-2 overflow-hidden w-available sm:gap-4">
<!--          v-if="!routeIs('app.music.album')"-->
            <CoverImage :data="data"

                        :size="100"
                        :style="{
                            display: isAlbumRoute
                                ? 'none'
                                : '',
                        }"
                        className="relative hidden h-12 w-12 overflow-hidden min-w-[3rem] sm:block"
                        loading="eager"
            />
            <span class="flex h-full flex-col justify-evenly overflow-clip w-inherit">
                <span class="flex h-5 flex-nowrap overflow-clip text-left font-bold line-clamp-1 w-inherit">
                    {{ data.name }}
                </span>
                <span :data-size="musicSize"
                      class="inline-flex w-available gap-1 overflow-hidden whitespace-nowrap text-auto-9 line-clamp-1 text-2xs hover:animate-pause ">

                    <TrackLinks v-if="data && !isArtistRoute"
                                :id="data.id"
                                :data="data.artist_track"
                                :onclick="(e: MouseEvent) => e.stopPropagation()"
                                data-target="artist"
                                type="artists"
                    />
                    <TrackLinks v-if="data && !isAlbumRoute"
                                :id="data.id"
                                :data="data.album_track"
                                :onclick="(e: MouseEvent) => e.stopPropagation()"
                                data-target="album"
                                type="albums"
                    />
                </span>
            </span>
        </span>

    <span class="hidden max-w-sm items-center overflow-clip pr-2 line-clamp-2 h-inherit w-inherit sm:flex"
          :class="{
              'opacity-0': !isAlbumRoute,
              'opacity-100': isAlbumRoute
          }"

          @click="e => e.stopPropagation()"
          v-for="item in data.album_track">
             <RouterLink
                 :to="`/music/albums/${item.id}`"
                 :key="item.id"
                 tabindex="0"
                 data-target="album"
                 class="flex items-center gap-1 whitespace-nowrap text-xs font-semibold line-clamp-1 hover:underline focus:underline dark:font-medium">
               <span class="flex whitespace-nowrap">
                   {{ item.name }}
               </span>
           </RouterLink>
       </span>
    <span class="hidden sm:flex invisible max-h-12 md:visible">
      {{
        new Date(data?.date).toLocaleDateString(i18next.language ?? 'en-US', {
          year: 'numeric',
          month: 'short',
          day: '2-digit',
        })
      }}
    </span>

    <span class="flex items-center justify-end gap-2 text-end">
            <MediaLikeButton :key="data.id"
                             :data="data"
                             type="music/tracks"
                             color="var(--color-focus)"
                             data-target="favorite"/>
            <span class="hidden sm:flex mr-4 monospace sm:mr-0">
                {{ data.duration }}
            </span>

          <DropdownMenu direction="down">
            <template v-slot:button>
              <BannerButton class="" title="">
                <MoooomIcon className="relative h-5 w-5" icon="menuDotsVertical"/>
              </BannerButton>
            </template>
            Hellooo
          </DropdownMenu>
        </span>
  </button>
</template>
