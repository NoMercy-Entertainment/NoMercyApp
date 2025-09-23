<script lang="ts" setup>
import ToggleSwitch from 'primevue/toggleswitch';

const modelValue = defineModel({
	type: Boolean,
	required: true,
});
</script>

<template>
	<ToggleSwitch v-model="modelValue" />
</template>
