<script lang="ts" setup>
// import { surfaceColors } from '@/lib/colorHelper';

import SurfaceButton from './SurfaceButton.vue';

const surfaceColors = [
	{
		title: 'neutral',
		color: 0,
	},
	{
		title: 'surface-1',
		color: 1.6,
	},
	{
		title: 'surface-2',
		color: 1.6 * 2,
	},
	{
		title: 'surface-3',
		color: 1.6 * 3,
	},
	{
		title: 'surface-4',
		color: 1.6 * 4,
	},
	{
		title: 'surface-5',
		color: 1.6 * 5,
	},
	{
		title: 'surface-6',
		color: 1.6 * 6,
	},
];
</script>

<template>
	<div class="flex select-none flex-col gap-3">
		<p class="font-bold">
			{{ $t("Surface colors") }}
		</p>
		<div class="flex flex-row gap-2">
			<div class="relative flex flex-wrap gap-2">
				<SurfaceButton
					v-for="background in surfaceColors"
					:key="background.title"
					:background="background"
				/>
			</div>
		</div>
	</div>
</template>
