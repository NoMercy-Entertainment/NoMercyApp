<script setup lang="ts">
import {computed} from 'vue';

import {SizeState} from '@/types/musicPlayer';

import {currentSong, musicSize, setMusicSize} from '@/store/audioPlayer';
import MusicButton from '@/components/Buttons/MusicButton.vue';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';
import DropdownMenu from '@/Layout/Desktop/components/Menus/DropdownMenu.vue';

const togglePlayerSize = () => {
  if (musicSize.value === SizeState.compact) {
    setMusicSize(SizeState.full);
  } else {
    setMusicSize(SizeState.compact);
  }
};

const playlistTitle = computed(() => {
  return 'Playing:\n' + currentSong.value?.album_track?.[0]?.name;
});

</script>

<template>
  <div class="mt-4 mb-4 flex h-16 w-full items-center justify-between"
       :data-size="musicSize">
    <MusicButton label="close"
                 :onclick="() => togglePlayerSize()">
      <MoooomIcon icon="arrowDown" class="h-6 w-6"/>
    </MusicButton>

    <div class="relative flex flex-col">
      <p class="whitespace-pre text-center text-pretty">
        {{ playlistTitle }}
      </p>
    </div>

    <DropdownMenu orientation="vertical">
      <template #button>
        <MoooomIcon icon="menuDotsVertical" class="h-6 w-6"/>
      </template>
      <template #default>
        <div class="flex flex-col gap-1 min-h-[85px]">
          <MusicButton label="close"
                       :onclick="() => togglePlayerSize()">
            <MoooomIcon icon="arrowDown" class="h-6 w-6"/>
          </MusicButton>
          <MusicButton label="close"
                       :onclick="() => togglePlayerSize()">
            <MoooomIcon icon="arrowDown" class="h-6 w-6"/>
          </MusicButton>
          <MusicButton label="close"
                       :onclick="() => togglePlayerSize()">
            <MoooomIcon icon="arrowDown" class="h-6 w-6"/>
          </MusicButton>
        </div>
      </template>
    </DropdownMenu>
  </div>
</template>
