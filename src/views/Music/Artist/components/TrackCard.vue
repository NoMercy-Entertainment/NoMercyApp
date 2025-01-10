<script setup lang="ts">
import {type PropType} from "vue";

import type {PlaylistItem} from "@/types/musicPlayer";

import TrackRow from "./TrackRow.vue";

defineProps({
	data: {
		type: Array as PropType<PlaylistItem[] | null>,
		required: true,
	},
	title: {
		type: String,
		required: true,

	}
});

</script>

<template>
	<div v-if="data && data?.length > 0" class="flex w-full flex-col items-start justify-start gap-4 self-stretch">
		<div class="self-stretch text-xl font-bold leading-loose text-auto-12">
			{{ $t(title) }}
		</div>
		<div class="flex flex-col items-start justify-start gap-1 self-stretch">
			<div
				class="z-10 grid items-center justify-start gap-4 self-stretch py-2 pr-3 text-sm font-medium home-grid sm:px-3">
				<div class="w-10 text-center text-sm leading-tight text-auto-10">#</div>
				<div class="shrink grow basis-0 text-sm leading-tight text-auto-10">
					{{ $t('Title') }}
				</div>
				<div class="shrink grow basis-0 text-sm leading-tight text-auto-10">
					{{ $t('Album') }}
				</div>
				<div class="shrink grow basis-0 text-right text-sm leading-tight text-auto-10">
					{{ $t('Duration') }}
				</div>
			</div>
		</div>
		<div class="flex flex-col items-start justify-start gap-1 self-stretch">
			<template v-for="(track, index) in data ?? []" :key="track.id">
				<TrackRow :index="index" :data="track" :displayList="data"/>
			</template>
		</div>
	</div>
</template>
