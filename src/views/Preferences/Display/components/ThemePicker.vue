<script setup lang='ts'>

import { themeColors } from '@/lib/colorHelper';

import ThemeButton from "./ThemeButton.vue";

</script>

<template>
	<div class="flex select-none flex-col gap-3">
		<p class="font-bold text-contrast">{{ $t('Accent colors') }}</p>
		<div class="flex flex-row gap-2">
			<div class="relative flex flex-wrap">
				<ThemeButton :theme="theme" v-for="theme in themeColors" :key="theme.title" />
			</div>
		</div>
	</div>
</template>
