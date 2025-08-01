<script setup lang="ts">
import type { PropType } from 'vue';
import { onMounted, watch } from 'vue';

import type { Artist } from '@/types/api/music/artist';
import type { Album } from '@/types/api/music/album';
import { closeFullPlayer, musicSize } from '@/store/audioPlayer';
import { shouldMarquee } from '@/lib/utils';

const props = defineProps({
	data: {
		type: Array as PropType<Array<Artist | Album>>,
		required: true,
	},
	type: {
		type: String as PropType<'artists' | 'albums'>,
		required: true,
	},
	id: {
		type: String as PropType<string>,
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
	noLink: {
		type: Boolean,
		required: false,
		default: false,
	},
});

watch(props, () => {
	const el = document.querySelector<HTMLElement>(
		`#trackLink-${props.type}-${props.id}-${props.suffix}`,
	);
	if (el) {
		shouldMarquee(el);
	}
});

onMounted(() => {
	const el = document.querySelector<HTMLElement>(
		`#trackLink-${props.type}-${props.id}-${props.suffix}`,
	);
	if (el) {
		shouldMarquee(el);
	}
});

function handleClick(e: Event) {
	e.stopPropagation();
	closeFullPlayer();
}
</script>

<template>
	<div
		:id="`trackLink-${type}-${id}-${suffix}`"
		data-marquee="container"
		class="-ml-1 w-available"
	>
		<div
			:data-size="musicSize"
			data-marquee="scroller"
			class="mb-1 ml-1 flex w-fit flex-nowrap gap-1 overflow-clip text-xs line-clamp-2 whitespace-break-spaces hover-animate-pause w-available sm:my-0.5 pr-2"
		>
			<span
				v-if="title"
				class="flex-nowrap gap-1 whitespace-nowrap lex line-clamp-2 h-inherit"
			>
				{{ title ? `${title} - ` : "" }}
			</span>

			<span
				v-for="(item, index) in data"
				:key="item.id"
				class="flex w-fit flex-wrap gap-1 whitespace-wrap line-clamp-2 h-inherit"
			>
				<span
					v-if="noLink"
					data-target="album"
					class="pointer-events-auto flex gap-1 whitespace-nowrap text-xs font-semibold line-clamp-2 h-inherit hover:underline focus:underline dark:font-medium"
					@click="handleClick($event)"
				>
					<span class="flex whitespace-nowrap leading-5">
						{{ item.name }}{{ index < data.length - 1 ? "," : "" }}
					</span>
				</span>
				<RouterLink
					v-else
					:to="item.link"
					:onkeyup="onkeyup"
					tabindex="1"
					data-target="album"
					class="pointer-events-auto flex gap-1 whitespace-nowrap text-xs font-semibold line-clamp-2 h-inherit hover:underline focus:underline dark:font-medium"
					@click="handleClick($event)"
				>
					<span class="flex whitespace-nowrap leading-5">
						{{ item.name }}{{ index < data.length - 1 ? "," : "" }}
					</span>
				</RouterLink>
			</span>
		</div>
	</div>
</template>
