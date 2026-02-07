<script lang="ts" setup>
import type { PropType } from 'vue';
import { computed } from 'vue';

import { isNative } from '@/config/global';
import type { Component } from '@/lib/routerHelper';
import { showBackdrops } from '@/store/preferences';
import { currentSong } from '@/store/audioPlayer';
import router from '@/router';
import { nmComponentMap } from '@/components/nmComponentMap';

const props = defineProps({
	items: {
		type: Object as PropType<Component<any>[]> | undefined,
		required: true,
	},
});

const backdropStyle
	= 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 3xl:grid-cols-5 4xl:grid-cols-5 5xl:grid-cols-9 tv:grid-cols-6';

const posterStyle
	= 'grid-cols-2 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-7 3xl:grid-cols-9 5xl:grid-cols-[repeat(14,minmax(0,1fr))] tv:grid-cols-6';

const useBackdropStyle = computed(() => {
	const firstItem = props.items.at(0) as any;
	return (
		firstItem
		&& showBackdrops.value
		&& firstItem?.media_type !== 'person'
		&& firstItem?.media_type !== 'genres'
	);
});
</script>

<template>
	<div
		:key="router.currentRoute.value.params?.id as string"
		ref="containerRef"
		:class="{
			'pb-0': isNative && !currentSong,
			'pb-40': isNative && currentSong,
		}"
		class="border-0 p-4 w-available scrollbar-none"
	>
		<div
			:class="`grid w-full gap-4 scroll-smooth music-showing:pb-0 whitespace-pre ${
				useBackdropStyle ? backdropStyle : posterStyle
			}`"
		>
			<component
				:is="nmComponentMap[render.component]"
				v-for="(render, index) in items ?? []"
				:key="render.id"
				:index="index"
				v-bind="render.props"
			/>
		</div>
	</div>
</template>

<style scoped></style>
