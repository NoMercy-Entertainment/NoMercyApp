<script lang="ts" setup>
import { PropType } from "vue";
import Button from '@/components/MusicPlayer/components/Button.vue';

defineProps({
	title: {
		type: String,
		required: true,
	},
	href: {
		type: String,
		required: false,
	},
	isActive: {
		type: Boolean,
		required: false,
		default: false,
	},
	onclick: {
		type: Function as PropType<(e: Event) => void>,
		required: false,
	}
});
</script>

<template>
	<RouterLink v-if="href" :to="href" title="watch" :id="$t(title)" :aria-label="$t(title)" :onclick="onclick"
		:class="`flex justify-center items-center relative gap-2 p-2 rounded-lg hover:bg-auto-5/6 transition-colors duration-300 ${isActive ? 'text-focus' : 'text-auto-12'}`">
		<slot />
	</RouterLink>
	<button v-else :id="$t(title)" :aria-label="$t(title)" :onclick="onclick"
		:class="`flex justify-center items-center relative gap-2 p-2 rounded-lg hover:bg-auto-5/6 transition-colors duration-300 ${isActive ? 'text-focus' : 'text-auto-12'}`">
		<slot />
	</button>
</template>
