<script setup lang="ts">
import type { PropType } from 'vue';

import type { Component } from '@/lib/routerHelper';
import type { PlaylistItem } from '@/types/musicPlayer';

defineProps({
	items: {
		type: Object as
		| PropType<Component<Component<PlaylistItem[]>>[]>
		| undefined,
		required: true,
	},
	title: {
		type: String,
		required: false,
		default: 'Card Title',
	},
});
</script>

<template>
	<div
		v-if="items"
		class="mt-2 sm:mt-4 mb-2 sm:mr-8 flex flex-1 flex-col w-auto flex-shrink-0 flex-grow-1 items-start justify-start gap-2 self-stretch text-left"
	>
		<h3
			v-if="title"
			class="text-[20px] font-bold text-auto-12 mr-2 ml-1 sm:ml-3 text-slate-dark-1 dark:text-slate-light-1"
		>
			{{ title }}
		</h3>

		<div class="relative isolate w-full flex flex-col whitespace-pre">
			<component
				:is="render.component"
				v-for="(render, index) in items ?? []"
				:key="render.id"
				:index="index"
				v-bind="render.props"
			/>
		</div>
	</div>
</template>

<style scoped></style>
