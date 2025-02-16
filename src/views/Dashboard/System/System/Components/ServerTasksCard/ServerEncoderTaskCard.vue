<script setup lang="ts">
import { computed, PropType, ref, watch } from 'vue';
import { IonItem } from '@ionic/vue';

import { ServerEncoderProgress } from '@/types/api/dashboard/server';

import serverClient from '@/lib/clients/serverClient';
import { currentServer } from '@/store/currentServer';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';
import { user } from '@/store/user';

const props = defineProps({
  data: {
    type: Object as PropType<ServerEncoderProgress>,
    required: true,
  }
});

const propStatus = ref(props.data?.status);

watch(props, (value) => {
  propStatus.value = value.data.status;
});

const status = computed(() => {
  if (propStatus.value === 'running') {
    return 'running';
  } else {
    return 'paused';
  }
});

const thumbnail = computed(() => {
  if (!props.data.thumbnails) return null;

  const baseUrl = currentServer.value?.serverBaseUrl + '\\' + props.data.thumbnails;
  return baseUrl.replace(/\\+/gu, '/')
    .replace(/\/\/images/u, '/images') + '?token=' + user.value.accessToken
});

const pauseJob = () => {
  serverClient()
    .post(`/dashboard/tasks/pause/${props.data.process_id}`)
    .then(({ data }) => {
      propStatus.value = data ? 'paused' : propStatus.value;
    })
    .catch(() => {
      // error
    });
};

const resumeJob = () => {
  serverClient()
    .post(`/dashboard/tasks/resume/${props.data.process_id}`)
    .then(({ data }) => {
      propStatus.value = data ? 'running' : propStatus.value;
    })
    .catch(() => {
      // error
    });
};

const toggleRunning = () => {
  if (propStatus.value === 'running') {
    pauseJob();
  } else {
    resumeJob();
  }
};

</script>

<template>
  <div v-if="data"
    class="relative flex w-full flex-col items-start justify-start overflow-clip rounded-lg pt-2 group/encoderCard gap-1.5 px-2.5 pb-3.5 bg-slate-lightA-3 dark:bg-slate-darkA-3">
    <div class="relative flex w-full items-center justify-center gap-0.5">
      <p class="w-full flex-grow text-sm font-semibold text-auto-12 line-clamp-1 h-6">
        {{ data.title.replace(/NoMercy/giu, '') }}
      </p>
      <p class="flex-shrink-0 flex-grow-0 text-right text-xs font-light text-auto-alpha-10">
        {{ $t('Id') }}: {{ data?.process_id }}
      </p>
    </div>
    <div class="relative flex items-start justify-start gap-2">
      <div v-if="data?.message == 'Encoding video'"
        class="relative aspect-video h-auto w-1/3 flex-shrink-0 flex-grow-0 overflow-hidden rounded-sm min-w-36" style="
                    background: linear-gradient(
                      to bottom,
                      rgba(0, 0, 0, 0) 0%,
                      rgba(0, 0, 0, 0) 25%,
                      rgba(0, 0, 0, 0) 50%,
                      #000 100%
                    );
                ">
        <div class="absolute inset-0 z-0 h-full w-full bg-white/[0.01]">
          <div class="pointer-events-none absolute inset-0 z-10 mt-auto h-4/5 bg-gradient-to-t from-black via-black/60">
          </div>
          <img v-if="thumbnail" :src="thumbnail" class="absolute z-0 h-full w-full" alt="" />
        </div>

        <div @click="toggleRunning"
          class="absolute top-1/2 left-1/2 z-10 group-hover/encoderCard:flex hidden h-11 w-11 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/60 p-0.5 group/progress text-focus">
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px]">
            <MoooomIcon v-if="status == 'running'" icon="pause" class="w-10 text-white" />
            <MoooomIcon v-else icon="play" class="w-10 text-white" />

            <!--                        <span class="group-hover/progress:hidden text-right font-bold text-auto-12 monospace">-->
            <!--                            {{ Math.floor(data?.progress ?? 0) }}%-->
            <!--                        </span>-->
          </div>
        </div>

        <div class="absolute z-10 flex items-end justify-start left-[3%] bottom-[3%] gap-[2%]">
          <MoooomIcon v-if="data?.has_gpu" icon="gpu" className="w-[15%]" />
          <MoooomIcon v-else icon="cpu" className="w-[15%]" />

          <MoooomIcon v-if="data?.is_hdr" icon="hdr" className="w-[15%]" />
          <MoooomIcon v-else icon="hdrOff" className="w-[15%]" />
        </div>

        <div class="absolute z-10 flex items-end justify-end right-[3%] bottom-[3%] gap-[2%] text-[10px]">
          <span class="group-hover/progress:hidden text-right font-bold text-auto-12 monospace">
            {{ Math.floor(data?.progress ?? 0) }}%
          </span>
        </div>
      </div>


      <div class="flex h-full flex-grow flex-col items-start justify-evenly">
        <div class="relative flex h-4 items-center justify-center overflow-clip">
          <MoooomIcon icon="stickyNote" className="relative w-4 text-auto-12" />
          <p class="ml-2 w-full font-medium text-2xs text-auto-12">
            {{ data?.message }}
          </p>
        </div>
        <div v-if="data?.message == 'Encoding video'" class="relative flex h-4 w-full items-start justify-start gap-2">
          <div v-if="data?.speed" class="relative flex h-4 items-center justify-center overflow-clip">
            <MoooomIcon icon="dashboard" className="relative w-4 text-auto-12" />
            <p class="ml-2 w-full font-medium text-2xs text-auto-12">
              {{ data?.speed }}X
            </p>
          </div>
        </div>
        <div v-if="data?.message == 'Encoding video'" class="relative flex h-4 w-full items-start justify-start gap-2">
          <div v-if="data?.remaining_split" class="relative flex h-4 items-center justify-center overflow-clip">
            <MoooomIcon icon="hourglass" className="relative w-4 text-auto-12" />
            <p class="ml-1 font-medium text-2xs text-auto-12">
              {{
                data?.remaining_split?.[0] && data?.remaining_split[0] > 0
                  ? ` ${data?.remaining_split?.[0] + $t('d')} `
                  : ''
              }}
              {{
                data?.remaining_split?.[1] && (data?.remaining_split[1] > 0 || data?.remaining_split[0] > 0)
                  ? ` ${data?.remaining_split?.[1] + $t('h')} `
                  : ''
              }}
              {{
                data?.remaining_split?.[2] && (data?.remaining_split[2] > 0 || data?.remaining_split[1] > 0 ||
                  data?.remaining_split[0] > 0)
                  ? ` ${data?.remaining_split?.[2] + $t('m')} `
                  : ''
              }}
              {{
                data?.remaining_split?.[3]
                  ? ` ${data?.remaining_split?.[3] + $t('s')} `
                  : ''
              }}
            </p>
          </div>
        </div>
        <div v-if="data?.video_streams && data?.message == 'Encoding video'"
          class="relative flex h-4 items-center justify-center gap-2 overflow-clip">
          <div class="relative flex h-4 w-full cursor-pointer items-center justify-start gap-2"
            :title="data?.video_streams?.join?.(', ') ?? ''">
            <MoooomIcon icon="film" className="w-4" />
            <p class="w-full text-xs text-auto-alpha-10 line-clamp-1">
              {{ data?.video_streams.length }}
            </p>
          </div>
          <div v-if="data?.audio_streams"
            class="relative flex h-4 cursor-pointer items-center justify-center gap-2 overflow-clip"
            :title="data?.audio_streams?.join?.(', ') ?? ''">
            <MoooomIcon icon="audioFile" className="w-4" />
            <p class="w-full text-xs text-auto-alpha-10 line-clamp-1">
              {{ data?.audio_streams.length }}
            </p>
          </div>
          <div v-if="data?.subtitle_streams"
            class="relative flex h-4 cursor-pointer items-center justify-center gap-2 overflow-clip"
            :title="data?.subtitle_streams?.join?.(', ') ?? ''">
            <MoooomIcon icon="chatBubble" className="w-4" />
            <p class="w-full text-xs text-auto-alpha-10 line-clamp-1">
              {{ data?.subtitle_streams.length }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <div v-if="data?.message == 'Encoding video'" class="absolute -bottom-0.5 left-0 h-1 w-full blur-[1px]">
      <div class="absolute w-full h-1 left-[-1px] top-[-1px] bg-black/[0.22]"></div>
      <div
        class="w-0 h-1 absolute left-[-1px] top-[-1px] rounded-sm bg-gradient-to-r from-black/5 to-[rgb(var(--color-focus))] z-10"
        :style="`width: ${data.progress}%;`"></div>
      <div class="w-1 h-0.5 absolute top-[-1px] rounded-sm bg-[#f1eefe] -translate-x-[2px] z-0"
        :style="`left: ${data.progress}%;`"></div>
    </div>
  </div>
</template>
