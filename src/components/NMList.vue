<script lang="ts" setup>
import type { PropType } from 'vue';

import type { Component } from '@/lib/routerHelper';
import type { PlaylistItem } from '@/types/musicPlayer';
import { nmComponentMap } from '@/components/nmComponentMap';

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
		v-if="items?.length > 0"
		class="mt-2 sm:mt-4 mb-2 flex flex-1 flex-col w-auto flex-shrink-0 flex-grow-1 items-start justify-start gap-2 self-stretch text-left"
	>
		<h3
			v-if="title"
			class="text-[20px] font-bold mr-2 ml-1 sm:ml-3 "
		>
			{{ title }}
		</h3>

		<div class="relative isolate w-full flex flex-col whitespace-pre gap-2 items-start justify-start p-1">
			<component
				:is="nmComponentMap[render.component]"
				v-for="(render, index) in items ?? []"
				:key="render.id"
				:index="index"
				v-bind="render.props"
			/>
		</div>
	</div>
	<div v-else
		class="mt-2 sm:mt-4 mb-2 flex flex-1 flex-col w-auto flex-shrink-0 flex-grow-1 items-start justify-start gap-2 self-stretch text-left"
	>
		<h3 class="text-[20px] font-bold mr-2 ml-1 sm:ml-3 ">
			{{ title }}
		</h3>
		<p class="text-slate-2 dark:text-slate-2">
			No items.
		</p>
	</div>
</template>

<style scoped></style>
