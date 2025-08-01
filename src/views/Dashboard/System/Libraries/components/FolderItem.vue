<script setup lang="ts">
import type { PropType } from 'vue';
import { nextTick, ref, watch } from 'vue';

import type { Episode, FileItem } from '@/types/api/dashboard/newContent';

import { humanFileSize, pad } from '@/lib/stringArray';
import { tmdbImageBaseUrl } from '@/config/config';

import Checkbox from '@/components/Forms/Checkbox.vue';
import OptimizedIcon from '@/components/OptimizedIcon.vue';

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
		type: Array as PropType<{ id: number; path: string }[]>,
		required: true,
	},
});

const checked = ref(false);
const block = ref(false);

watch(checked, (value) => {
	if (block.value)
		return;
	if (value) {
		props.pushFile(props.data);
	}
	else {
		props.popFile(props.data);
	}
});

watch(props, (value) => {
	block.value = true;
	checked.value = value.files.some(file => file.id === props.data?.match?.id);
	nextTick(() => {
		block.value = false;
	});
});
</script>

<template>
	<div class="flex items-center justify-start gap-4 self-stretch text-left">
		<div
			class="flex flex-grow flex-col items-start justify-start gap-2 rounded-xl p-2 bg-slate-lightA-3 dark:bg-slate-darkA-3"
		>
			<div class="relative flex items-start justify-start gap-2 self-stretch">
				<div
					class="relative aspect-video h-auto w-60 min-w-60 select-none overflow-clip"
				>
					<Checkbox
						id="checked"
						v-model:model-value="checked"
						class="absolute top-2 left-2 z-10"
						name=""
					/>
					<img
						v-if="!!(data.match as Episode)?.still && (data.match as Episode)?.still.startsWith('http')"
						alt=""
						:src="(data.match as Episode)?.still"
						class="absolute inset-0 z-0 h-auto max-h-full w-full rounded-md object-scale-down p-0.5"
					>
					<img
						v-else-if="!!(data.match as Episode)?.still"
						alt=""
						:src="`${tmdbImageBaseUrl}/w500${(data.match as Episode)?.still}`"
						class="absolute inset-0 z-0 h-auto max-h-full w-full rounded-md object-scale-down p-0.5"
					>
				</div>
				<div
					class="flex flex-grow flex-col items-start justify-start gap-1 tet-left"
				>
					<span
						class="self-stretch text-base font-semibold line-clamp-1 monospace w-[697px]"
					>
						{{ data?.parsed?.title }}
						<template v-if="(data.match as Episode)?.episode_number">
							S{{ pad((data.match as Episode)?.season_number) }}E{{
								pad((data.match as Episode)?.episode_number)
							}}
							- {{ data?.match?.title }}
						</template>
						<template v-else-if="data?.parsed?.year">
							({{ data?.parsed?.year }})
						</template>
					</span>
					<div
						v-if="data.path"
						class="relative flex items-center justify-start self-stretch gap-0.5 text-slate-light-11 dark:text-slate-dark-11"
					>
						<OptimizedIcon icon="folder" class-name="w-3.5" />
						<p class="w-full flex-grow text-xs leading-none">
							{{ data.path }}
						</p>
					</div>
					<div
						v-if="data?.match?.id"
						class="relative flex items-center justify-start self-stretch gap-0.5 text-slate-light-11 dark:text-slate-dark-11"
					>
						<OptimizedIcon icon="infoCircle" class-name="w-3.5" />
						<p class="w-full flex-grow text-xs leading-none">
							{{ data?.match?.id }}
						</p>
					</div>
					<div
						v-if="data.size"
						class="relative flex items-center justify-start self-stretch gap-0.5 text-slate-light-11 dark:text-slate-dark-11"
					>
						<OptimizedIcon icon="server" class-name="w-3.5" />
						<p class="w-full flex-grow text-xs leading-none">
							{{ humanFileSize(data.size) }}
						</p>
					</div>
					<div
						v-if="data.tracks"
						class="relative flex items-center justify-start self-stretch gap-0.5 text-slate-light-11 dark:text-slate-dark-11"
					>
						<OptimizedIcon icon="audioFile" class-name="w-3.5" />
						<p class="w-full flex-grow text-xs leading-none">
							{{ data.tracks }}
						</p>
					</div>
					<div
						v-if="data.streams.video?.length > 0"
						class="relative flex items-center justify-start self-stretch gap-0.5 text-slate-light-11 dark:text-slate-dark-11"
					>
						<OptimizedIcon icon="film" class-name="w-3.5" />
						<p class="w-full flex-grow text-xs leading-none">
							<template v-for="(video, index) in data.streams.video">
								{{ video.width }}x{{ video.height
								}}{{ index < data.streams.video.length - 1 ? ", " : "" }}
							</template>
						</p>
					</div>
					<div
						v-if="data.streams.audio?.length > 0"
						class="relative flex items-center justify-start self-stretch gap-0.5 text-slate-light-11 dark:text-slate-dark-11"
					>
						<OptimizedIcon icon="audioFile" class-name="w-3.5" />
						<p class="w-full flex-grow text-xs leading-none">
							<template v-for="(audio, index) in data.streams.audio">
								{{ audio.language
								}}{{ index < data.streams.audio.length - 1 ? ", " : "" }}
							</template>
						</p>
					</div>
					<div
						v-if="data.streams.subtitle?.length > 0"
						class="relative flex items-center justify-start self-stretch gap-0.5 text-slate-light-11 dark:text-slate-dark-11"
					>
						<OptimizedIcon icon="chatBubble" class-name="w-3.5" />
						<p class="w-full flex-grow text-xs leading-none">
							<template v-for="(subtitle, index) in data.streams.subtitle">
								{{ subtitle.language
								}}{{ index < data.streams.subtitle.length - 1 ? ", " : "" }}
							</template>
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
