<script lang="ts" setup>
import type { PropType } from 'vue';
import { nextTick, ref, watch } from 'vue';

import type { Episode, FileItem } from '@/types/api/dashboard/newContent';
import { tmdbImageBaseUrl } from '@/config/config';

import Checkbox from '@/components/Forms/Checkbox.vue';
import { pad } from '@/lib/utils/string';
import { humanFileSize } from '@/lib/utils/format';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';

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
	<div
		class="flex flex-grow flex-col items-start justify-start gap-2 rounded-md p-2 text-left bg-surface-8/10"
	>
		<div class="relative flex items-start justify-start gap-2 self-stretch">
			<div
				class="relative aspect-video h-auto w-60 min-w-60 select-none overflow-clip self-center"
			>
				<Checkbox
					id="checked"
					v-model:model-value="checked"
					class="absolute top-2 left-2 z-10"
					name=""
				/>
				<img
					v-if="!!(data.match as Episode)?.still && (data.match as Episode)?.still.startsWith('http')"
					:src="(data.match as Episode)?.still"
					alt=""
					class="absolute inset-0 z-0 h-auto max-h-full w-full rounded-md object-scale-down p-0.5"
				>
				<img
					v-else-if="!!(data.match as Episode)?.still"
					:src="`${tmdbImageBaseUrl}/w500${(data.match as Episode)?.still}`"
					alt=""
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
						S{{ pad((data.match as Episode)?.season_number ?? 0) }}E{{ pad((data.match as Episode)?.episode_number ?? 0) }}
						- {{ data?.match?.title }}
					</template>
					<template v-else-if="data?.parsed?.year">
						({{ data?.parsed?.year }})
					</template>
				</span>
				<div
					v-if="data.path"
					class="relative flex items-center justify-start self-stretch gap-1"
				>
					<MoooomIcon class-name="w-5" icon="folder" />
					<p class="w-full flex-grow text-xs leading-snug text-balance">
						{{ data.path }}
					</p>
				</div>
				<div
					v-if="data?.match?.id"
					class="relative flex items-center justify-start self-stretch gap-1"
				>
					<MoooomIcon class-name="w-5" icon="infoCircle" />
					<p class="w-full flex-grow text-xs leading-snug text-balance">
						{{ data?.match?.id }}
					</p>
				</div>
				<div
					v-if="data.size"
					class="relative flex items-center justify-start self-stretch gap-1"
				>
					<MoooomIcon class-name="w-5" icon="server" />
					<p class="w-full flex-grow text-xs leading-snug text-balance">
						{{ humanFileSize(data.size) }}
					</p>
				</div>
				<div
					v-if="data.tracks"
					class="relative flex items-center justify-start self-stretch gap-1"
				>
					<MoooomIcon class-name="w-5" icon="audioFile" />
					<p class="w-full flex-grow text-xs leading-snug text-balance">
						{{ data.tracks }}
					</p>
				</div>
				<div
					v-if="data.streams.video?.length > 0"
					class="relative flex items-center justify-start self-stretch gap-1"
				>
					<MoooomIcon class-name="w-5" icon="film" />
					<p class="w-full flex-grow text-xs leading-snug text-balance">
						<template v-for="(video, index) in data.streams.video">
							{{ video.width }}x{{
								video.height
							}}{{ index < data.streams.video.length - 1 ? ", " : "" }}
						</template>
					</p>
				</div>
				<div
					v-if="data.streams.audio?.length > 0"
					class="relative flex items-center justify-start self-stretch gap-1"
				>
					<MoooomIcon class-name="w-5" icon="audioFile" />
					<p class="w-full flex-grow text-xs leading-snug text-balance">
						<template v-for="(audio, index) in data.streams.audio">
							{{
								audio.language
							}}{{ index < data.streams.audio.length - 1 ? ", " : "" }}
						</template>
					</p>
				</div>
				<div
					v-if="data.streams.subtitle?.length > 0"
					class="relative flex items-center justify-start self-stretch gap-1"
				>
					<MoooomIcon class-name="w-5" icon="chatBubble" />
					<p class="w-full flex-grow text-xs leading-snug text-balance">
						<template v-for="(subtitle, index) in data.streams.subtitle">
							{{
								subtitle.language
							}}{{ index < data.streams.subtitle.length - 1 ? ", " : "" }}
						</template>
					</p>
				</div>
			</div>
		</div>
	</div>
</template>
