<script setup lang='ts'>

import { backgroundColors } from '@/lib/colorHelper';

import BackgroundButton from "./BackgroundButton.vue";

</script>

<template>
	<div class="flex select-none flex-col gap-3">
		<p class="font-bold">{{ $t('Background colors') }}</p>
		<div class="flex flex-row gap-2">
			<div class="relative flex flex-wrap">
				<BackgroundButton :background="background" v-for="background in backgroundColors"
					:key="background.title" />
			</div>
		</div>
	</div>
</template>
