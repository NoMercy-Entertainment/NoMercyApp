<script setup lang="ts">
import { themeColors } from '@/lib/colorHelper';

import ThemeButton from './ThemeButton.vue';
</script>

<template>
	<div class="flex select-none flex-col gap-3">
		<p class="font-bold">
			{{ $t("Theme") }}
		</p>
		<div class="flex flex-row gap-2">
			<div class="relative flex flex-wrap gap-2">
				<template v-for="theme in themeColors" :key="theme.title">
					<ThemeButton :theme="theme" />
				</template>
			</div>
		</div>
	</div>
</template>
