<script lang="ts" setup>
import type { PropType } from 'vue';
import { onMounted, watch } from 'vue';

import type { Album } from '@/types/api/music/album';
import type { Artist } from '@/types/api/music/artist';

import { shouldMarquee } from '@/lib/utils/dom';
import { closeFullPlayer, musicSize } from '@/store/audioPlayer';

const props = defineProps({
	data: {
		type: Array as PropType<Array<Artist | Album>>,
		required: true,
	},
	type: {
		type: String as PropType<'artists' | 'albums'>,
		required: true,
	},
	onclick: {
		type: Function as PropType<(e: MouseEvent) => void>,
		required: false,
	},
	onkeyup: {
		type: Function as PropType<(e: KeyboardEvent) => void>,
		required: false,
	},
	title: {
		type: String,
		required: false,
	},
	suffix: {
		type: String,
		required: false,
	},
});

watch(() => props.data, () => {
	const el = document.querySelector<HTMLElement>(
		`#trackLink-${props.type}-${props.suffix}`,
	);
	if (el) {
		shouldMarquee(el);
	}
});

onMounted(() => {
	const el = document.querySelector<HTMLElement>(
		`#trackLink-${props.type}-${props.suffix}`,
	);
	if (el) {
		shouldMarquee(el);
	}
});

function handleClick(e: Event) {
	e.stopPropagation();
	closeFullPlayer();
	props.onclick?.(e as MouseEvent);
}
</script>

<template>
	<button
		v-if="data"
		:id="`trackLink-${type}-${suffix}`"
		class="-ml-1 h-auto w-available"
		data-marquee="container"
		@click="(e) => e.stopPropagation()"
	>
		<div
			:data-size="musicSize"
			class="mb-1 ml-1 flex w-fit flex-nowrap items-center gap-1 overflow-clip text-surface-12/11 line-clamp-2 whitespace-break-spaces hover-animate-pause w-available sm:my-0.5"
			data-marquee="scroller"
		>
			<span
				v-if="title"
				class="flex flex-nowrap items-center gap-1 whitespace-nowrap line-clamp-2"
			>
				{{ title ? `${title} - ` : "" }}
			</span>

			<template v-for="(item, index) in data" :key="item.id">
				<RouterLink
					:onkeyup="onkeyup"
					:to="item.link"
					class="flex items-center gap-1 whitespace-nowrap font-semibold line-clamp-1 hover:underline focus:underline dark:font-medium pointer-events-auto px-2 -mx-2"
					data-target="album"
					tabindex="0"
					@click="handleClick($event)"
				>
					<span class="flex whitespace-nowrap leading-6">
						{{ item.name }}{{ index < data.length - 1 ? "," : "" }}
					</span>
				</RouterLink>
			</template>
		</div>
	</button>
</template>
