<script lang="ts" setup>
import type { PropType } from 'vue';

import type { Component } from '@/lib/routerHelper';
import { nmComponentMap } from '@/components/nmComponentMap';

defineProps({
	items: {
		type: Object as PropType<Component<any>[]> | undefined,
		required: true,
	},
});
</script>

<template>
	<div class="flex flex-col sm:flex-row gap-4 m-4 w-available empty:hidden">
		<component
			:is="nmComponentMap[render.component]"
			v-for="(render, index) in items ?? []"
			:key="render.id"
			:index="index"
			v-bind="render.props"
		/>
	</div>
</template>

<style scoped></style>
