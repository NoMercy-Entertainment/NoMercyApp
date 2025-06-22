<script setup lang="ts">
import { ref, watch } from 'vue';

import { screensaverDelay, setScreensaverDelay } from '@/store/preferences';

const delay = ref(screensaverDelay.value);
watch(delay, (value) => {
	setScreensaverDelay(value);
});
</script>

<template>
	<div class="flex flex-col gap-2">
		<label for="delay">{{ $t("Screensaver delay") }}</label>
		<div
			class="mr-2 lg:col-start-1 lg:row-start-3 xl:col-start-3 xl:row-start-1 2xl:col-span-2 2xl:col-start-5 2xl:row-start-1"
		>
			<InputNumber
				id="delay"
				v-model="delay"
				class="mb-4 w-full"
				placeholder="..."
				type="number"
			/>
		</div>
	</div>
</template>
