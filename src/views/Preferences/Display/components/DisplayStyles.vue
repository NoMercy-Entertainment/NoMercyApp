<script setup lang="ts">
import CardStylePicker from './CardStylePicker.vue';
import ColorIndication from './ColorIndication.vue';
import AutoColorTheming from './AutoColorTheming.vue';
</script>

<template>
	<div
		class="mr-2 flex flex-col gap-1 xl:col-start-3 xl:row-span-4 xl:row-start-5 2xl:row-span-9 2xl:col-span-2 2xl:col-start-5 2xl:row-start-2"
	>
		<CardStylePicker />
		<ColorIndication />
		<AutoColorTheming />
	</div>
</template>
