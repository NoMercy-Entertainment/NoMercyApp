<script setup lang="ts">
import { IonToggle } from '@ionic/vue';

const modelValue = defineModel({
	type: Boolean,
	required: true,
});
</script>

<template>
	<IonToggle
		:checked="modelValue"
		mode="ios"
		@ion-change="modelValue = $event.target.checked"
	/>
</template>

<style scoped>
ion-toggle {
	--handle-width: 1.2rem;
	--track-background: rgb(var(--color-slate-11));
	--track-background-checked: linear-gradient(0deg, rgb(var(--color-focus) / 0.43), rgb(var(--color-focus) / 0.74));
}

ion-toggle::part(track) {
	border: 0.2px solid #0000000a;
	box-shadow: 0 0.5px 2px 0 rgba(0, 0, 0, 0.24) inset;
}

ion-toggle:focus::part(track) {
	border-radius: 1rem;
}
html.scheme-light ion-toggle:focus::part(track) {
	outline: 2px solid black;
}
html.scheme-dark ion-toggle:focus::part(track) {
	outline: 2px solid white;
}

ion-toggle::part(track),
ion-toggle.toggle-checked::part(track) {
	@apply flex justify-end items-center flex-grow-0 flex-shrink-0 w-9 h-5 relative overflow-hidden p-0.5 rounded-xl;
}

ion-toggle::part(handle) {
	@apply rounded-full w-4 h-4;
}

ion-toggle.toggle-checked::part(handle) {
	@apply translate-x-[];
}
</style>
