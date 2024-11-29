<script setup lang="ts">
import {nextTick, PropType, ref, watch} from 'vue';

import type {Episode, FileItem} from '@/types/api/dashboard/newContent';

import {humanFileSize, pad} from '@/lib/stringArray';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';
import {tmdbImageBaseUrl} from '@/config/config';

const props = defineProps({
  manage: {
    type: Boolean,
    required: false,
  },
  data: {
    type: Object as PropType<FileItem>,
    required: true,
  },
  pushFile: {
    type: Function,
    required: true,
  },
  popFile: {
    type: Function,
    required: true,
  },
  files: {
    type: Array as PropType<{ id: number, path: string }[]>,
    required: true,
  },
});

const checked = ref(false);
const block = ref(false);

watch(checked, (value) => {
  if (block.value) return;
  if (value) {
    props.pushFile(props.data);
  } else {
    props.popFile(props.data);
  }
});

watch(props, (value) => {
  block.value = true;
  checked.value = value.files.some(file => file.id == props.data?.match?.id);
  nextTick(() => {
    block.value = false;
  });
});

</script>

<template>
  <div class="flex items-center justify-start gap-4 self-stretch text-left">
    <div
        class="flex flex-grow flex-col items-start justify-start gap-2 rounded-xl p-2 bg-auto-2/6 dark:bg-auto-alpha-3"
    >
      <div
          class="relative flex items-start justify-start gap-2 self-stretch"
      >
        <div class="relative aspect-video h-auto w-52 select-none overflow-clip">
          <Checkbox
              id="checked"
              class="absolute top-2 left-2 z-10"
              name=""
              v-model:modelValue="checked">

          </Checkbox>
          <img alt="" :src="`${tmdbImageBaseUrl}/w500${(data.match as Episode)?.still}`"
               class="absolute inset-0 z-0 h-auto max-h-full w-full rounded-md object-scale-down p-0.5"/>
        </div>
        <div class="flex flex-grow flex-col items-start justify-start gap-1 tet-left">
          <div
              class="relative flex flex-col items-start justify-center self-stretch gap-0.5"
          >
						<span class="self-stretch text-base font-semibold line-clamp-1 monospace w-[697px]">
							{{ data?.parsed?.title }}
							<template
                  v-if="(data.match as Episode)?.season_number != null && (data.match as Episode)?.season_number != 0 && (data.match as Episode)?.episode_number != 0"
              >
								S{{ pad((data.match as Episode)?.season_number) }}E{{
                  pad((data.match as Episode)?.episode_number)
                }} - {{ data?.match?.title }}
							</template>
              <template v-else>
                ({{ data?.parsed?.year }})
              </template>
						</span>
            <p
                class="w-full self-stretch text-xs font-light leading-none text-auto-5"
            >
              {{ data.name }}
            </p>
          </div>
          <div
              class="relative flex items-center justify-start self-stretch gap-0.5 text-auto-5"
          >
            <MoooomIcon icon="server" className="w-3.5"/>
            <p class="w-full flex-grow text-xs leading-none">
              {{ humanFileSize(data.size) }}
            </p>
          </div>
          <div
              class="relative flex items-center justify-start self-stretch gap-0.5 text-auto-5"
          >
            <MoooomIcon icon="film" className="w-3.5"/>
            <p class="w-full flex-grow text-xs leading-none">
              <template v-for="(video, index) in data.streams.video">
                {{ video.width }}x{{ video.height }}{{ index < (data.streams.video.length - 1) ? ', ' : '' }}
              </template>
            </p>
          </div>
          <div
              class="relative flex items-center justify-start self-stretch gap-0.5 text-auto-5"
          >
            <MoooomIcon icon="audioFile" className="w-3.5"/>
            <p class="w-full flex-grow text-xs leading-none">
              <template v-for="(audio, index) in data.streams.audio">
                {{ audio.language }}{{ index < (data.streams.audio.length - 1) ? ', ' : '' }}
              </template>
            </p>
          </div>
          <div
              class="relative flex items-center justify-start self-stretch gap-0.5 text-auto-5"
          >
            <MoooomIcon icon="chatBubble" className="w-3.5"/>
            <p class="w-full flex-grow text-xs leading-none">
              <template v-for="(subtitle, index) in data.streams.subtitle">
                {{ subtitle.language }}{{ index < (data.streams.subtitle.length - 1) ? ', ' : '' }}
              </template>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
