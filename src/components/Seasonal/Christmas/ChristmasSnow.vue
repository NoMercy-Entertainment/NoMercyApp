<script setup lang="ts">
import { isXmasTime } from '@/lib/dateTime';
import { disableScreensaver } from '@/store/imageModal';
</script>

<template>
	<div
		v-if="isXmasTime() && !disableScreensaver"
		class="z-[999999999999] absolute pointer-events-none opacity-6"
	>
		<template v-for="i in Array.from(Array(30).keys())" :key="i">
			<div class="snowflake" />
		</template>
		<template v-for="i in Array.from(Array(100).keys())" :key="i">
			<div class="snow" />
		</template>
	</div>
</template>

<style scoped></style>
