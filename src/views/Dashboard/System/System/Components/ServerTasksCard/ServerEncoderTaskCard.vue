<script lang="ts" setup>
import type { PropType } from 'vue';
import { computed, ref, watch } from 'vue';

import type { ServerEncoderProgress } from '@/types/api/dashboard/server';

import serverClient from '@/lib/clients/serverClient';
import { currentServer } from '@/store/currentServer';
import OptimizedIcon from '@/components/OptimizedIcon.vue';
import { user } from '@/store/user';
import { Card } from 'primevue';

const props = defineProps({
	data: {
		type: Object as PropType<ServerEncoderProgress>,
		required: true,
	},
});

const propStatus = ref(props.data?.status);

watch(props, (value) => {
	propStatus.value = value.data.status;
});

const status = computed(() => {
	if (propStatus.value === 'running') {
		return 'running';
	}
	else {
		return 'paused';
	}
});

const thumbnail = computed(() => {
	if (!props.data.thumbnails)
		return null;

	const baseUrl
		= `${currentServer.value?.serverBaseUrl}\\${props.data.thumbnails}`;
	return (
		`${baseUrl.replace(/\\+/gu, '/').replace(/\/\/images/u, '/images')
		}?token=${
			user.value.accessToken}`
	);
});

function pauseJob() {
	serverClient()
		.post(`/dashboard/tasks/pause/${props.data.process_id}`)
		.then(({ data }) => {
			propStatus.value = data ? 'paused' : propStatus.value;
		})
		.catch(() => {
			// error
		});
}

function resumeJob() {
	serverClient()
		.post(`/dashboard/tasks/resume/${props.data.process_id}`)
		.then(({ data }) => {
			propStatus.value = data ? 'running' : propStatus.value;
		})
		.catch(() => {
			// error
		});
}

function toggleRunning() {
	if (propStatus.value === 'running') {
		pauseJob();
	}
	else {
		resumeJob();
	}
}
</script>

<template>
	<Card class="relative overflow-clip">
		<template #title>
			<div class="relative flex w-full items-center justify-center gap-0.5 text-surface-12">
				<p
					:title="data.title.replace(/NoMercy/giu, '')"
					class="w-full flex-grow text-sm font-semibold line-clamp-1 h-6"
				>
					{{ data.title.replace(/NoMercy/giu, "") }}
				</p>
				<p
					class="flex-shrink-0 flex-grow-0 text-right text-xs font-light text-surface-10"
				>
					{{ $t("Id") }}: {{ data?.process_id }}
				</p>
			</div>
		</template>
		<template #content>
			<div class="relative flex items-start justify-start gap-2 group/encoderCard">
				<div
					v-if="data?.message === 'Encoding video'"
					class="relative aspect-video h-auto w-1/3 flex-shrink-0 flex-grow-0 overflow-hidden rounded-sm min-w-36"
					style="
          background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0) 0%,
            rgba(0, 0, 0, 0) 25%,
            rgba(0, 0, 0, 0) 50%,
            #000 100%
          );
        "
				>
					<div class="absolute inset-0 z-0 h-full w-full bg-white/[0.01] flex flex-col justify-center">
						<div
							class="pointer-events-none absolute inset-0 z-10 mt-auto h-4/5 bg-gradient-to-t from-black via-black/60"
						/>
						<img
							v-if="thumbnail"
							:src="thumbnail"
							alt=""
							class="absolute z-0 h-full w-full"
						>
					</div>
					<button
						class="absolute top-1/2 left-1/2 z-10 group-hover/encoderCard:flex hidden h-11 w-11 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/60 p-0.5 group/progress text-white flex flex-col"
						@click="toggleRunning"
					>
						<div
							class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px]"
						>
							<OptimizedIcon
								v-if="status === 'running'"
								class="w-10"
								icon="pause"
							/>
							<OptimizedIcon v-else class="w-10" icon="play" />

						<!--                        <span class="group-hover/progress:hidden text-right font-bold monospace"> -->
						<!--                            {{ Math.floor(data?.progress ?? 0) }}% -->
						<!--                        </span> -->
						</div>
					</button>
					<div
						class="absolute z-10 flex items-end justify-start left-[3%] bottom-[3%] gap-[2%]"
					>
						<OptimizedIcon v-if="data?.has_gpu" class-name="w-[15%]" icon="gpu" />
						<OptimizedIcon v-else class-name="w-[15%]" icon="cpu" />

						<OptimizedIcon v-if="data?.is_hdr" class-name="w-[15%]" icon="hdr" />
						<OptimizedIcon v-else class-name="w-[15%]" icon="hdrOff" />
					</div>

					<div
						class="absolute z-10 flex items-end justify-end right-[3%] bottom-[3%] gap-[2%] text-[10px]"
					>
						<span
							class="group-hover/progress:hidden text-right font-bold monospace"
						>
							{{ Math.floor(data?.progress ?? 0) }}%
						</span>
					</div>
				</div>

				<div class="grid grid-cols-4 gap-2 flex-1">
					<div class="flex flex-col text-surface-12 col-span-4">
						<span class="flex flex-nowrap gap-2 flex-shrink-0 flex-grow-0 self-stretch text-sm">
							<OptimizedIcon
								class-name="relative w-4"
								icon="stickyNote"
							/>
							<span class="text-surface-12/11">
								{{ data?.message }}
							</span>
						</span>
						<span v-if="data?.message === 'Encoding video'" class="flex flex-nowrap gap-2 flex-shrink-0 flex-grow-0 self-stretch text-sm">
							<OptimizedIcon
								class-name="relative w-4"
								icon="dashboard"
							/>
							<span class="text-surface-12/11 text-2xs">
								{{ data?.speed }}X
							</span>
						</span>
						<span v-if="data?.message === 'Encoding video'" class="flex flex-nowrap gap-2 flex-shrink-0 flex-grow-0 self-stretch text-sm">
							<OptimizedIcon
								class-name="relative w-4"
								icon="hourglass"
							/>
							<span class="font-medium text-2xs text-surface-12/11">
								{{
									data?.remaining_split?.[0] && data?.remaining_split[0] > 0
										? ` ${data?.remaining_split?.[0] + $t("d")} `
										: ""
								}}
								{{
									data?.remaining_split?.[1]
										&& (data?.remaining_split[1] > 0 || data?.remaining_split[0] > 0)
										? ` ${data?.remaining_split?.[1] + $t("h")} `
										: ""
								}}
								{{
									data?.remaining_split?.[2]
										&& (data?.remaining_split[2] > 0
											|| data?.remaining_split[1] > 0
											|| data?.remaining_split[0] > 0)
										? ` ${data?.remaining_split?.[2] + $t("m")} `
										: ""
								}}
								{{
									data?.remaining_split?.[3]
										? ` ${data?.remaining_split?.[3] + $t("s")} `
										: ""
								}}
							</span>
						</span>

						<div class="flex flex-nowrap gap-4 flex-shrink-0 flex-grow-0 self-stretch text-sm">
							<span
								v-if="data?.video_streams && data?.message === 'Encoding video'"
								class="flex flex-nowrap gap-2 flex-shrink-0 flex-grow-0 self-stretch text-sm"
							>
								<OptimizedIcon class-name="w-4" icon="film" />
								<span class="w-full text-xs text-surface-10 line-clamp-1">
									{{ data?.video_streams.length }}
								</span>
							</span>
							<div
								v-if="data?.audio_streams && data?.message === 'Encoding video'"
								:title="data?.audio_streams?.join?.(', ') ?? ''"
								class="flex flex-nowrap gap-1 flex-shrink-0 flex-grow-0 self-stretch text-sm"
							>
								<OptimizedIcon class-name="w-4" icon="audioFile" />
								<span class="w-full text-xs text-surface-10 line-clamp-1">
									{{ data?.audio_streams.length }}
								</span>
							</div>
							<div
								v-if="data?.subtitle_streams && data?.message === 'Encoding video'"
								:title="data?.subtitle_streams?.join?.(', ') ?? ''"
								class="flex flex-nowrap gap-1 flex-shrink-0 flex-grow-0 self-stretch text-sm"
							>
								<OptimizedIcon class-name="w-4" icon="chatBubble" />
								<span class="w-full text-xs text-surface-10 line-clamp-1">
									{{ data?.subtitle_streams.length }}
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div
				v-if="data?.message === 'Encoding video'"
				class="absolute -bottom-0.5 left-0 h-1 w-full blur-[1px]"
			>
				<div
					class="absolute w-full h-1 left-[-1px] top-[-1px] bg-black/[0.22]"
				/>
				<div
					:style="`width: ${data.progress}%;`"
					class="w-0 h-1 absolute left-[-1px] top-[-1px] rounded-sm bg-gradient-to-r from-black/5 to-[var(--color-theme-8)] z-10"
				/>
				<div
					:style="`left: ${data.progress}%;`"
					class="w-1 h-0.5 absolute top-[-1px] rounded-sm bg-[#f1eefe] -translate-x-[2px] z-0"
				/>
			</div>
		</template>
	</Card>
</template>
