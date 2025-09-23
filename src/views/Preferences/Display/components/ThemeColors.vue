<script lang="ts" setup>
import SchemePicker from './SchemePicker.vue';
import ThemePicker from './ThemePicker.vue';
import SurfacePicker from './SurfacePicker.vue';
</script>

<template>
	<div
		class="mb-4 flex flex-col gap-3 xl:col-start-3 xl:row-span-4 xl:row-start-2 2xl:row-span-9 2xl:col-span-2 2xl:col-start-3 2xl:row-start-2"
	>
		<SchemePicker />
		<ThemePicker />
		<SurfacePicker />
	</div>
</template>
